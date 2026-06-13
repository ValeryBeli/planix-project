package com.planix.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;

/**
 * DTO для возврата информации об ошибке клиенту.
 */
@Getter
@AllArgsConstructor
@ToString
public class ErrorResponse {
    private final String message;
}