package com.planix.backend.exception;

/**
 * Исключение, выбрасываемое при некорректной смене пароля.
 */

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}