package com.guoaili.zackback.config;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guoaili.zackback.model.ApiResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 设置401状态码
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        ApiResponse<?> apiResponse = ApiResponse.error("未授权访问：" + authException.getMessage());
        apiResponse.setCode(ApiResponse.CODE_UNAUTHORIZED);
        
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}