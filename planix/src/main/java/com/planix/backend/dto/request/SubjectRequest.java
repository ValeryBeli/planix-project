package com.planix.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalTime;

/**
 * DTO для отправления информации о предмете.
 */
@Data
public class SubjectRequest {

    @NotBlank(message = "Название предмета обязательно")
    @Size(min = 1, max = 100)
    private String name;

    @NotNull(message = "День недели обязателен")
    @Min(1)
    @Max(7)
    private Short dayOfWeek;

    @NotBlank(message = "Тип недели обязателен")
    @Pattern(regexp = "ODD|EVEN", message = "Тип недели должен быть ODD или EVEN")
    private String weekType;

    @NotNull(message = "Время начала обязательно")
    private LocalTime startTime;

    @NotNull(message = "Время окончания обязательно")
    private LocalTime endTime;

    private String location;

    private String teacher;
}