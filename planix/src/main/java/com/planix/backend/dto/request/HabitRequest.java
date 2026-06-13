package com.planix.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO для отправления информации о привычке.
 */
@Data
public class HabitRequest {
    @NotBlank(message = "Название привычки обязательно")
    @Size(min = 1, max = 255, message = "Название привычки должно содержать от 1 до 255 символов")
    private String name;
    @Size(max = 255, message = "Название привычки должно содержать до 2000 символов")
    private String description;
}