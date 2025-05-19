package com.guoaili.zackback.config;

import com.guoaili.zackback.util.CryptoUtil;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class EncryptedResponseWrapper extends ContentCachingResponseWrapper {
    
    private final CryptoUtil cryptoUtil;

    public EncryptedResponseWrapper(HttpServletResponse response, CryptoUtil cryptoUtil) {
        super(response);
        this.cryptoUtil = cryptoUtil;
    }

    @Override
    public void copyBodyToResponse() throws IOException {
        if (getContentType() != null && getContentType().contains("application/json")) {
            // 获取原始响应内容
            byte[] content = getContentAsByteArray();
            if (content.length > 0) {
                String responseBody = new String(content, StandardCharsets.UTF_8);
                
                try {
                    // 加密响应内容
                    String encryptedResponse = "{\"encryptedData\":\"" + 
                                              cryptoUtil.encrypt(responseBody) + 
                                              "\"}";
                    
                    // 重置响应
                    resetBuffer();
                    
                    // 写入加密后的响应
                    getResponse().setContentLength(encryptedResponse.length());
                    getResponse().getOutputStream().write(encryptedResponse.getBytes(StandardCharsets.UTF_8));
                    
                    // 不调用super.copyBodyToResponse()，因为我们已经手动写入了响应
                    return;
                } catch (Exception e) {
                    // 如果加密失败，回退到原始响应
                }
            }
        }
        
        // 对于非JSON响应或加密失败的情况，使用原始响应
        super.copyBodyToResponse();
    }
}