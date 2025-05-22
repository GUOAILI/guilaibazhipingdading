package com.guoaili.zackback.model;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Integer code;
    
    // 常量定义
    public static final int CODE_SUCCESS = 200;
    public static final int CODE_TOKEN_EXPIRED = 4001; // 自定义token过期码
    public static final int CODE_INVALID_TOKEN = 4002; // 自定义token无效码
    public static final int CODE_UNAUTHORIZED = 4003; // 自定义spring security未授权码
    public static final int CODE_INVALID_USERNAME = 4011; // 自定义login失败码
    public static final int CODE_INVALID_PASSWORD = 4012; // 自定义login失败码
    public static final int CODE_SERVER_ERROR = 500;

    private ApiResponse() {
    }

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setCode(CODE_SUCCESS);
        response.setMessage("操作成功");
        response.setData(data);
        return response;
    }

    public static <T> ApiResponse<T> tokenExpired() {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setCode(CODE_TOKEN_EXPIRED);
        response.setMessage("安全凭证过期，请重新登录");
        return response;
    }

    public static <T> ApiResponse<T> invalidToken(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setCode(CODE_INVALID_TOKEN);
        response.setMessage("安全凭证验证失败: "+message);
        return response;
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setCode(CODE_SERVER_ERROR);
        response.setMessage(message);
        return response;
    }

    // Getters and setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
}