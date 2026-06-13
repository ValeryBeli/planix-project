package com.planix.backend.dto.response;

import lombok.Getter;
import lombok.ToString;

/**
 * DTO ответа с информацией о привычке.
 */
@Getter
@ToString
public class HabitResponse {
    private final Long id;
    private final String name;
    private final String description;

    public HabitResponse(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}