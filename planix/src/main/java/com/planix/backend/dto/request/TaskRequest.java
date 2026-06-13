package com.planix.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO для отправления информации о задаче.
 */
@Data
public class TaskRequest {

    @NotBlank(message = "Название задачи обязательно")
    @Size(min = 1, max = 255, message = "Название задачи должно содержать от 1 до 255 символов")
    private String title;

    @Size(max = 2000, message = "Описание не может превышать 2000 символов")
    private String description;

    private LocalDate deadline;

    private Long subjectId;

    @NotBlank(message = "Статус задачи обязателен")
    @Pattern(regexp = "PENDING|IN_PROGRESS|COMPLETED|CANCELLED",
            message = "Статус должен быть: PENDING, IN_PROGRESS, COMPLETED или CANCELLED")
    private String status;
}