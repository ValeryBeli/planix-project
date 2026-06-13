package com.planix.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

/**
 * DTO для отправления ссылки для импорта расписания.
 */
@Data
public class ImportRequest {

    @NotBlank(message = "URL не может быть пустым")
    @URL(message = "Некорректный формат URL")
    private String url;
}