package com.planix.backend.controller;

import com.planix.backend.dto.request.HabitRequest;
import com.planix.backend.dto.response.HabitLogResponse;
import com.planix.backend.dto.response.HabitResponse;
import com.planix.backend.service.HabitService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Контроллер для работы с привычками
 */
@RestController
@RequestMapping("/habits")
@RequiredArgsConstructor
@Slf4j
public class HabitController {

    private final HabitService habitService;

    /**
     * Получить список привычек
     */
    @GetMapping
    public ResponseEntity<List<HabitResponse>> getAll() {

        log.debug("Запрос на получение списка привычек");

        List<HabitResponse> habits = habitService.getAll();

        log.info("Получено {} привычек", habits.size());

        return ResponseEntity.ok(habits);
    }

    /**
     * Создать привычку
     */
    @PostMapping
    public ResponseEntity<HabitResponse> create(
            @Valid @RequestBody HabitRequest request
    ) {

        log.debug("Создание привычки: name={}", request.getName());

        HabitResponse response = habitService.create(request);

        log.info("Привычка создана: id={}, name={}",
                response.getId(), response.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Обновить привычку
     */
    @PutMapping("/{id}")
    public ResponseEntity<HabitResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody HabitRequest request
    ) {

        log.debug("Обновление привычки: id={}", id);

        HabitResponse response = habitService.update(id, request);

        log.info("Привычка обновлена: id={}", id);

        return ResponseEntity.ok(response);
    }

    /**
     * Удалить привычку
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        log.debug("Удаление привычки: id={}", id);

        habitService.delete(id);

        log.info("Привычка удалена: id={}", id);

        return ResponseEntity.noContent().build();
    }

    /**
     * Отметить выполнение привычки за день
     */
    @PostMapping("/{id}/log")
    public ResponseEntity<Void> addLog(
            @PathVariable Long id,
            @RequestParam LocalDate date
    ) {

        log.debug("Добавление отметки: habitId={}, date={}", id, date);

        habitService.addLog(id, date);

        log.info("Отметка добавлена: habitId={}, date={}", id, date);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Получить все отметки привычки
     */
    @GetMapping("/{id}/logs")
    public ResponseEntity<List<HabitLogResponse>> getLogs(@PathVariable Long id) {
        log.debug("Запрос на получение отметок привычки: habitId={}", id);

        List<HabitLogResponse> logs = habitService.getLogs(id);

        log.info("Получено {} отметок для привычки: habitId={}", logs.size(), id);
        return ResponseEntity.ok(logs);
    }

    /**
     * Удалить отметку выполнения
     */
    @DeleteMapping("/{id}/log")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long id,
            @RequestParam LocalDate date
    ) {

        log.debug("Удаление отметки: habitId={}, date={}", id, date);

        habitService.deleteLog(id, date);

        log.info("Отметка удалена: habitId={}, date={}", id, date);

        return ResponseEntity.noContent().build();
    }
}