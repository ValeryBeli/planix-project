package com.planix.backend.exception;

/**
 * Исключение, выбрасываемое при некорректном JWT токене.
 */
public class InvalidJwtTokenException extends RuntimeException {
    public InvalidJwtTokenException(String message) {
        super(message);
    }
}