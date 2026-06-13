package com.planix.backend.exception;

/**
 * Исключение, выбрасываемое при попытке неавторизованного действия.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}