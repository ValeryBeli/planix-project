package com.planix.backend.dto.response;

import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;

/**
 * DTO для ответа с информацией об отметках привычки.
 */
@Getter
@ToString
public class HabitLogResponse {
    private final Long id;
    private final Long habitId;
    private final LocalDate date;

    public HabitLogResponse(Long id, Long habitId, LocalDate date) {
        this.id = id;
        this.habitId = habitId;
        this.date = date;
    }
}