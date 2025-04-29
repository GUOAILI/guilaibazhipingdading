package com.guoaili.zackback.enumT;

public enum RoleType {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN"),
    DING("ROLE_DING");

    private String value;

    RoleType(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
    
}
