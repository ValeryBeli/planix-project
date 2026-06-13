package com.planix.backend.controller;

import com.planix.backend.dto.request.ImportRequest;
import com.planix.backend.dto.request.SubjectRequest;
import com.planix.backend.dto.response.ImportResponse;
import com.planix.backend.dto.response.SubjectResponse;
import com.planix.backend.service.SubjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер для работы с расписанием (предметами)
 */
@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
@Slf4j
public class SubjectController {

    private final SubjectService subjectService;

    /**
     * Получить список предметов пользователя
     */
    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getSubjects() {

        log.debug("Запрос на получение предметов");

        List<SubjectResponse> subjects = subjectService.getAll();

        log.info("Получено {} предметов", subjects.size());

        return ResponseEntity.ok(subjects);
    }

    /**
     * Импорт расписания по ссылке
     */
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importSubjects(
            @Valid @RequestBody ImportRequest request
    ) {

        log.debug("Импорт расписания по ссылке: url={}", request.getUrl());

        ImportResponse response = subjectService.importFromUrl(request.getUrl());

        log.info("Импорт расписания завершён.");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Создать предмет
     */
    @PostMapping
    public ResponseEntity<SubjectResponse> create(
            @Valid @RequestBody SubjectRequest request
    ) {

        log.debug("Создание предмета: name={}", request.getName());

        SubjectResponse response = subjectService.create(request);

        log.info("Предмет создан: id={}, name={}",
                response.getId(), response.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Обновить предмет
     */
    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request
    ) {

        log.debug("Обновление предмета: id={}", id);

        SubjectResponse response = subjectService.update(id, request);

        log.info("Предмет обновлён: id={}", id);

        return ResponseEntity.ok(response);
    }

    /**
     * Удалить предмет
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        log.debug("Удаление предмета: id={}", id);

        subjectService.delete(id);

        log.info("Предмет удалён: id={}", id);

        return ResponseEntity.noContent().build(); // 204
    }

    /**
     * Очистить расписание
     */
    @DeleteMapping
    public ResponseEntity<Void> clearAll() {

        log.debug("Очистка расписания");

        subjectService.clearAll();

        log.info("Расписание очищено");

        return ResponseEntity.noContent().build();
    }
}