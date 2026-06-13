package com.planix.backend.exception;

/**
 * Исключение, выбрасываемое при попытке создать дублирующую сущность.
 */
public class DuplicateEntityException extends RuntimeException {
    public DuplicateEntityException(String message) {
        super(message);
    }
}