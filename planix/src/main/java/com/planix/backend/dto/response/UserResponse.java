package com.planix.backend.dto.response;

import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * DTO ответа с информацией о пользователе.
 */
@Getter
@ToString
public class UserResponse {
    private final Long id;
    private final String email;
    private final String name;
    private final LocalDateTime createdAt;

    public UserResponse(Long id, String email, String name, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
    }
}