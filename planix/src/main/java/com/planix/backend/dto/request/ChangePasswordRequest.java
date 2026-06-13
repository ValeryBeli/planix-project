package com.planix.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO для смены пароля.
 */
@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Старый пароль обязателен")
    @Size(min = 6, max = 100, message = "Пароль должен содержать минимум 6 символов")
    private String oldPassword;

    @NotBlank(message = "Новый пароль обязателен")
    @Size(min = 6, max = 100, message = "Новый пароль должен содержать минимум 6 символов")
    private String newPassword;
}