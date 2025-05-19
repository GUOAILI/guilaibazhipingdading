package com.guoaili.zackback.config;

import com.guoaili.zackback.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(3) // 确保这个过滤器在解密过滤器之后执行
public class ResponseEncryptionFilter extends OncePerRequestFilter {

    @Autowired
    private CryptoUtil cryptoUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 创建响应包装器
        EncryptedResponseWrapper responseWrapper = new EncryptedResponseWrapper(response, cryptoUtil);
        
        try {
            // 继续过滤器链，使用包装的响应
            filterChain.doFilter(request, responseWrapper);
        } finally {
            // 确保响应被复制到原始响应
            responseWrapper.copyBodyToResponse();
        }
    }
}