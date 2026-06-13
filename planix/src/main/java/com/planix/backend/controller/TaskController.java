package com.planix.backend.controller;

import com.planix.backend.dto.request.TaskRequest;
import com.planix.backend.dto.response.TaskResponse;
import com.planix.backend.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер для работы с задачами
 */
@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    /**
     * Получить список задач
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll() {

        log.debug("Запрос на получение всех задач");

        List<TaskResponse> tasks = taskService.getAll();

        log.info("Получено {} задач", tasks.size());

        return ResponseEntity.ok(tasks);
    }

    /**
     * Получить задачу по ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {

        log.debug("Запрос на получение задачи: id={}", id);

        TaskResponse task = taskService.getById(id);

        log.info("Задача получена: id={}", id);

        return ResponseEntity.ok(task);
    }

    /**
     * Создать задачу
     */
    @PostMapping
    public ResponseEntity<TaskResponse> create(
            @Valid @RequestBody TaskRequest request
    ) {

        log.debug("Создание задачи: title={}", request.getTitle());

        TaskResponse response = taskService.create(request);

        log.info("Задача создана: id={}, title={}",
                response.getId(), response.getTitle());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Обновить задачу
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request
    ) {

        log.debug("Обновление задачи: id={}", id);

        TaskResponse response = taskService.update(id, request);

        log.info("Задача обновлена: id={}", id);

        return ResponseEntity.ok(response);
    }

    /**
     * Отметить задачу выполненной
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable Long id) {

        log.debug("Завершение задачи: id={}", id);

        taskService.markAsCompleted(id);

        log.info("Задача завершена: id={}", id);

        return ResponseEntity.ok().build();
    }

    /**
     * Получить задачи по статусу
     */
    @GetMapping("/status")
    public ResponseEntity<List<TaskResponse>> getByStatus(@RequestParam String status) {
        log.debug("Запрос на получение задач по статусу: status={}", status);
        List<TaskResponse> tasks = taskService.getTasksByStatus(status);
        log.info("Получено {} задач со статусом {}", tasks.size(), status);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Удалить задачу
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        log.debug("Удаление задачи: id={}", id);

        taskService.delete(id);

        log.info("Задача удалена: id={}", id);

        return ResponseEntity.noContent().build();
    }
}