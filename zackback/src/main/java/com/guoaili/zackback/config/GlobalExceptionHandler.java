package com.guoaili.zackback.config;

import com.guoaili.zackback.DTO.ResponseMessage;
import com.guoaili.zackback.exception.BusinessException;
import com.guoaili.zackback.model.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // old exception toczpd
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ResponseMessage> handleMaxSizeException(MaxUploadSizeExceededException exc){
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                            .body(new ResponseMessage("文件尺寸过大,请缩小尺寸重新传送"));
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleBadCredentials(BadCredentialsException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        response.setCode(ApiResponse.CODE_INVALID_PASSWORD);
        return response;
    }
    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleUsernameNotFound(UsernameNotFoundException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        response.setCode(ApiResponse.CODE_INVALID_USERNAME);
        return response;
    }

    // 2025/5/20 add 
    // 参数缺失
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleMissingServletRequestParameter(MissingServletRequestParameterException ex) {
        return ApiResponse.error("参数缺失: " + ex.getParameterName());
    }

    // 参数格式错误
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return ApiResponse.error("请求体格式错误: " + ex.getMessage());
    }

    // JSR-303参数校验异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldError() != null
                ? ex.getBindingResult().getFieldError().getDefaultMessage()
                : "参数校验失败";
        return ApiResponse.error("参数校验失败: " + msg);
    }

    // Hibernate Validator 单参数校验异常
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleConstraintViolation(ConstraintViolationException ex) {
        return ApiResponse.error("参数校验失败: " + ex.getMessage());
    }

    // 业务异常（自定义异常）
    @ExceptionHandler(BusinessException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleBusinessException(BusinessException ex) {
        return ApiResponse.error("业务异常: " + ex.getMessage());
    }

    // 兜底异常
    @ExceptionHandler(Exception.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<?> handleException(Exception ex) {
        // System.out.println("兜底异常: " + ex.getClass().getName());
        return ApiResponse.error("后端服务器异常: " + ex.getMessage());
    }
}