package com.planix.backend.dto.response;

import lombok.Getter;
import lombok.ToString;

/**
 * DTO для результата импорта.
 */
@Getter
@ToString
public class ImportResponse {
    private final int subjectsImported;

    public ImportResponse(int subjectsImported) {
        this.subjectsImported = subjectsImported;
    }
}