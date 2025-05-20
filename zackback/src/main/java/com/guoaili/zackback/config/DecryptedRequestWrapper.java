// package com.guoaili.zackback.config;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.guoaili.zackback.util.CryptoUtil;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.util.StreamUtils;

// import jakarta.servlet.ReadListener;
// import jakarta.servlet.ServletInputStream;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletRequestWrapper;

// import java.io.BufferedReader;
// import java.io.ByteArrayInputStream;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.nio.charset.StandardCharsets;
// import java.util.Map;

// public class DecryptedRequestWrapper extends HttpServletRequestWrapper {
//     private static final Logger logger = LoggerFactory.getLogger(DecryptedRequestWrapper.class);
//     private byte[] decryptedBody;
//     private final String contentType;

//     public DecryptedRequestWrapper(HttpServletRequest request, CryptoUtil cryptoUtil, ObjectMapper objectMapper) throws IOException {
//         super(request);
        
//         // 保存原始内容类型
//         this.contentType = request.getContentType();
        
//         // 读取原始请求体
//         String body = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
//         logger.debug("Original request body: {}", body);
        
//         try {
//             // 解析请求体为JSON
//             Map<String, Object> requestMap = objectMapper.readValue(body, Map.class);
            
//             // 检查是否包含加密数据
//             if (requestMap.containsKey("minhuizpd")) {
//                 String iv = (String) requestMap.get("iv");
//                 String minhuizpd = (String) requestMap.get("minhuizpd");
//                 logger.debug("Found encrypted data: {}", minhuizpd);
                
//                 // 解密数据
//                 String decryptedJson = cryptoUtil.decrypt(iv,minhuizpd);
//                 logger.debug("Decrypted JSON: {}", decryptedJson);
                
//                 // 使用解密后的JSON作为新的请求体
//                 this.decryptedBody = decryptedJson.getBytes(StandardCharsets.UTF_8);
//             } else {
//                 logger.debug("No encrypted data found, using original body");
//                 // 如果没有加密数据，保持原样
//                 this.decryptedBody = body.getBytes(StandardCharsets.UTF_8);
//             }
//         } catch (Exception e) {
//             logger.error("Error processing request body", e);
//             // 如果解密失败，保持原始请求体不变
//             this.decryptedBody = body.getBytes(StandardCharsets.UTF_8);
//         }
//     }

//     public DecryptedRequestWrapper(CachedBodyHttpServletRequest cachedRequest, String decryptedJson) {
//         super(cachedRequest); // Explicitly call the parent constructor
//         this.decryptedBody = decryptedJson.getBytes(StandardCharsets.UTF_8);
//         this.contentType = cachedRequest.getContentType();
// }

//     @Override
//     public ServletInputStream getInputStream() {
//         final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(decryptedBody);
        
//         return new ServletInputStream() {
//             @Override
//             public boolean isFinished() {
//                 return byteArrayInputStream.available() == 0;
//             }

//             @Override
//             public boolean isReady() {
//                 return true;
//             }

//             @Override
//             public void setReadListener(ReadListener readListener) {
//                 throw new UnsupportedOperationException();
//             }

//             @Override
//             public int read() {
//                 return byteArrayInputStream.read();
//             }
//         };
//     }

//     @Override
//     public BufferedReader getReader() throws IOException {
//         return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
//     }

//     @Override
//     public String getContentType() {
//         // 确保内容类型保持为 application/json
//         return "application/json";
//     }

//     @Override
//     public int getContentLength() {
//         return decryptedBody.length;
//     }

//     @Override
//     public long getContentLengthLong() {
//         return decryptedBody.length;
//     }
// }
package com.guoaili.zackback.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guoaili.zackback.util.CryptoUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StreamUtils;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class DecryptedRequestWrapper extends HttpServletRequestWrapper {
    private static final Logger logger = LoggerFactory.getLogger(DecryptedRequestWrapper.class);
    private byte[] decryptedBody;
    private final String contentType;
    private final Map<String, String[]> paramMap = new HashMap<>();

    public DecryptedRequestWrapper(HttpServletRequest request, CryptoUtil cryptoUtil, ObjectMapper objectMapper) throws IOException {
        super(request);

        this.contentType = request.getContentType();
        String body = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
        logger.debug("Original request body: {}", body);

        try {
            Map<String, Object> requestMap = objectMapper.readValue(body, Map.class);

            if (requestMap.containsKey("minhuizpd")) {
                String iv = (String) requestMap.get("iv");
                String minhuizpd = (String) requestMap.get("minhuizpd");
                logger.debug("Found encrypted data: {}", minhuizpd);

                String decryptedJson = cryptoUtil.decrypt(iv, minhuizpd);
                logger.debug("Decrypted JSON: {}", decryptedJson);

                this.decryptedBody = decryptedJson.getBytes(StandardCharsets.UTF_8);

                // 解析解密后的JSON为参数map
                Map<String, Object> decryptedMap = objectMapper.readValue(decryptedJson, Map.class);
                for (Map.Entry<String, Object> entry : decryptedMap.entrySet()) {
                    if (entry.getValue() instanceof List) {
                        List<?> list = (List<?>) entry.getValue();
                        String[] arr = list.stream().map(String::valueOf).toArray(String[]::new);
                        paramMap.put(entry.getKey(), arr);
                    } else {
                        paramMap.put(entry.getKey(), new String[]{String.valueOf(entry.getValue())});
                    }
                }
            } else {
                logger.debug("No encrypted data found, using original body");
                this.decryptedBody = body.getBytes(StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            logger.error("Error processing request body", e);
            this.decryptedBody = body.getBytes(StandardCharsets.UTF_8);
        }
    }

    public DecryptedRequestWrapper(CachedBodyHttpServletRequest cachedRequest, String decryptedJson) throws IOException {
        super(cachedRequest);
        this.decryptedBody = decryptedJson.getBytes(StandardCharsets.UTF_8);
        this.contentType = cachedRequest.getContentType();

        // 解析解密后的JSON为参数map
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> decryptedMap = objectMapper.readValue(decryptedJson, Map.class);
        for (Map.Entry<String, Object> entry : decryptedMap.entrySet()) {
            if (entry.getValue() instanceof List) {
                List<?> list = (List<?>) entry.getValue();
                String[] arr = list.stream().map(String::valueOf).toArray(String[]::new);
                paramMap.put(entry.getKey(), arr);
            } else {
                paramMap.put(entry.getKey(), new String[]{String.valueOf(entry.getValue())});
            }
        }
    }

    @Override
    public ServletInputStream getInputStream() {
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(decryptedBody);

        return new ServletInputStream() {
            @Override
            public boolean isFinished() {
                return byteArrayInputStream.available() == 0;
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setReadListener(ReadListener readListener) {
                throw new UnsupportedOperationException();
            }

            @Override
            public int read() {
                return byteArrayInputStream.read();
            }
        };
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
    }

    @Override
    public String getContentType() {
        return "application/json";
    }

    @Override
    public int getContentLength() {
        return decryptedBody.length;
    }

    @Override
    public long getContentLengthLong() {
        return decryptedBody.length;
    }

    // 关键：重写参数相关方法
    @Override
    public String getParameter(String name) {
        String[] values = paramMap.get(name);
        return (values != null && values.length > 0) ? values[0] : null;
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        return paramMap;
    }

    @Override
    public Enumeration<String> getParameterNames() {
        return Collections.enumeration(paramMap.keySet());
    }

    @Override
    public String[] getParameterValues(String name) {
        return paramMap.get(name);
    }
}