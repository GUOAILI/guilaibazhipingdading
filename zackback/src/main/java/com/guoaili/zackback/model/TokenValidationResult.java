package com.guoaili.zackback.model;

public class TokenValidationResult {
    private boolean valid;
    private boolean expired;
    private String username;
    private String errorMessage;

    public TokenValidationResult() {
    }

    public static TokenValidationResult valid(String username) {
        TokenValidationResult result = new TokenValidationResult();
        result.setValid(true);
        result.setExpired(false);
        result.setUsername(username);
        return result;
    }

    public static TokenValidationResult expired() {
        TokenValidationResult result = new TokenValidationResult();
        result.setValid(false);
        result.setExpired(true);
        result.setErrorMessage("Token has expired");
        return result;
    }

    public static TokenValidationResult invalid(String errorMessage) {
        TokenValidationResult result = new TokenValidationResult();
        result.setValid(false);
        result.setExpired(false);
        result.setErrorMessage(errorMessage);
        return result;
    }

    // Getters and setters
    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public boolean isExpired() {
        return expired;
    }

    public void setExpired(boolean expired) {
        this.expired = expired;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}