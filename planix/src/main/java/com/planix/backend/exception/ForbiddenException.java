package com.planix.backend.exception;

/**
 * Исключение, выбрасываемое при отсутствии прав доступа.
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}