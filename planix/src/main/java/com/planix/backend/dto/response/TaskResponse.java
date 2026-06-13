package com.planix.backend.dto.response;

import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO ответа с информацией о задаче.
 */
@Getter
@ToString
public class TaskResponse {
    private final Long id;
    private final String title;
    private final String description;
    private final LocalDate deadline;
    private final String status;
    private final Long subjectId;
    private final LocalDateTime completedAt;

    public TaskResponse(Long id, String title, String description, LocalDate deadline, Long subjectId, String status, LocalDateTime completedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.subjectId = subjectId;
        this.status = status;
        this.completedAt = completedAt;
    }
}