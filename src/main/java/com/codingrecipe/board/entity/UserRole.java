package com.codingrecipe.board.entity;

import lombok.Getter;

@Getter
public enum UserRole  {
    USER("일반 사용자"),
    ADMIN("관리자");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }


}