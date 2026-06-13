package com.planix.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

/**
 * DTO для ответа при аутентификации пользователя.
 */
@Getter
@AllArgsConstructor
public class AuthResponse {

    private final String token;

}