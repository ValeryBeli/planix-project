package com.planix.backend.exception;

/**
 * Исключение, выбрасываемое при отсутствии сущности в базе данных.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}