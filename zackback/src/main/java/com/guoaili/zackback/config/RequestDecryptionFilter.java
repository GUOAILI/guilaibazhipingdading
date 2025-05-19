package com.guoaili.zackback.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guoaili.zackback.util.CryptoUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@Order(2) // 确保这个过滤器在JWT过滤器之后执行
public class RequestDecryptionFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestDecryptionFilter.class);

    @Autowired
    private CryptoUtil cryptoUtil;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        if (isRequestWithBody(request) ) {
            try {
                // 缓存请求体
                CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(request);
                
                // 读取请求体
                String body = StreamUtils.copyToString(cachedRequest.getInputStream(), StandardCharsets.UTF_8);
                
                // 解析JSON
                Map<String, Object> requestMap = objectMapper.readValue(body, Map.class);
                
                // 检查是否包含加密数据
                if (requestMap.containsKey("encryptedData") && requestMap.containsKey("iv")) {
                    String iv = (String) requestMap.get("iv");
                    String encryptedData = (String) requestMap.get("encryptedData");
                    
                    // 解密
                    String decryptedJson = cryptoUtil.decrypt(iv, encryptedData);
                    
                    // 创建解密后的请求包装器
                    DecryptedRequestWrapper decryptedRequest = new DecryptedRequestWrapper(
                            cachedRequest, decryptedJson);
                    
                    // 继续过滤器链
                    filterChain.doFilter(decryptedRequest, response);
                    return;
                }
            } catch (Exception e) {
                logger.error("Error processing encrypted request", e);
            }
            
            // 如果没有加密数据或解密失败，使用原始请求
            filterChain.doFilter(request, response);
        } else {
            // 对于其他请求，不做处理
            filterChain.doFilter(request, response);
        }
            }
    private boolean isRequestWithBody(HttpServletRequest request) {
        String method = request.getMethod();
        return "POST".equals(method) || "PUT".equals(method) || "PATCH".equals(method);
    }
}