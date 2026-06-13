package com.planix.backend.dto.response;

import lombok.Getter;
import lombok.ToString;

/**
 * DTO для ответа при восстановлении пароля.
 */
@Getter
@ToString
public class RecoverPasswordResponse {
    private final String message;

    public RecoverPasswordResponse(String message) {
        this.message = message;
    }
}