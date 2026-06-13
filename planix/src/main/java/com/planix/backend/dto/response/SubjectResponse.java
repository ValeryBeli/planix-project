package com.planix.backend.dto.response;

import lombok.Getter;

import java.time.LocalTime;

/**
 * DTO ответа с информацией о предмете.
 */
@Getter
public class SubjectResponse {

    private final Long id;
    private final String name;
    private final Short dayOfWeek;
    private final String weekType;
    private final LocalTime startTime;
    private final LocalTime endTime;
    private final String location;
    private final String teacher;

    public SubjectResponse(Long id, String name, Short dayOfWeek, String weekType, LocalTime startTime, LocalTime endTime, String location, String teacher) {
        this.id = id;
        this.name = name;
        this.dayOfWeek = dayOfWeek;
        this.weekType = weekType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.teacher = teacher;
    }
}