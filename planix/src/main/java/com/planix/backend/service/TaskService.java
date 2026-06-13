package com.planix.backend.service;

import com.planix.backend.dto.request.TaskRequest;
import com.planix.backend.dto.response.TaskResponse;
import com.planix.backend.entity.Task;
import com.planix.backend.entity.User;
import com.planix.backend.exception.ForbiddenException;
import com.planix.backend.exception.NotFoundException;
import com.planix.backend.exception.UnauthorizedException;
import com.planix.backend.repository.SubjectRepository;
import com.planix.backend.entity.Subject;
import com.planix.backend.repository.TaskRepository;
import com.planix.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Сервис для работы с задачами
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final SecurityUtils securityUtils;
    private final SubjectRepository subjectRepository;

    /**
     * Получить все задачи текущего пользователя
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getAll() {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Получение задач пользователя: userId={}", user.getId());

        List<TaskResponse> tasks = taskRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        log.info("Найдено {} задач для userId={}", tasks.size(), user.getId());
        return tasks;
    }

    /**
     * Получить задачу по ID
     */
    @Transactional(readOnly = true)
    public TaskResponse getById(Long id) {
        log.debug("Получение задачи: taskId={}", id);

        Task task = getTaskOrThrow(id);
        checkAccess(task);

        return toResponse(task);
    }

    /**
     * Создание задачи
     */
    @Transactional
    public TaskResponse create(TaskRequest request) {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        Subject subject = null;

        if (request.getSubjectId() != null) {

            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() ->
                            new NotFoundException("Предмет не найден"));
        }

        log.debug("Создание задачи: title={}, userId={}", request.getTitle(), user.getId());

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .subject(subject)
                .status(request.getStatus())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        taskRepository.save(task);

        log.info("Задача создана: taskId={}, userId={}", task.getId(), user.getId());
        return toResponse(task);
    }

    /**
     * Обновление задачи
     */
    @Transactional
    public TaskResponse update(Long id, TaskRequest request) {

        log.debug("Обновление задачи: taskId={}", id);

        Task task = getTaskOrThrow(id);

        checkAccess(task);

        Subject subject = null;

        if (request.getSubjectId() != null) {

            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Предмет с id "
                                            + request.getSubjectId()
                                            + " не найден"
                            )
                    );
            log.debug("Для задачи найден предмет: subjectId={}",
                    subject.getId());
        }
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());

        task.setSubject(subject);

        task.setStatus(request.getStatus());

        taskRepository.save(task);

        log.info("Задача обновлена: taskId={}", id);
        return toResponse(task);
    }

    /**
     * Отметить задачу выполненной
     */
    @Transactional
    public void markAsCompleted(Long id) {
        log.debug("Отметка задачи как выполненной: taskId={}", id);

        Task task = getTaskOrThrow(id);
        checkAccess(task);

        if ("COMPLETED".equals(task.getStatus())) {
            log.warn("Задача уже выполнена: taskId={}", id);
            return;
        }

        task.setStatus("COMPLETED");
        task.setCompletedAt(LocalDateTime.now());

        taskRepository.save(task);

        log.info("Задача выполнена: taskId={}", id);
    }

    /**
     * Получить задачи пользователя по статусу
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStatus(String status) {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Получение задач по статусу: userId={}, status={}", user.getId(), status);

        List<TaskResponse> tasks = taskRepository.findByUserIdAndStatus(user.getId(), status)
                .stream()
                .map(this::toResponse)
                .toList();

        log.info("Найдено {} задач со статусом {} для userId={}",
                tasks.size(), status, user.getId());

        return tasks;
    }

    /**
     * Удаление задачи
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Удаление задачи: taskId={}", id);

        Task task = getTaskOrThrow(id);
        checkAccess(task);

        taskRepository.delete(task);

        log.info("Задача удалена: taskId={}", id);
    }

    private Task getTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Задача с id " + id + " не найдена"));
    }

    /**
     * Проверка доступа
     */
    private void checkAccess(Task task) {
        User currentUser = securityUtils.getCurrentUser();

        if (currentUser == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        if (!task.getUser().getId().equals(currentUser.getId())) {
            log.warn("Попытка доступа к чужой задаче: taskId={}, userId={}",
                    task.getId(), currentUser.getId());
            throw new ForbiddenException("Нет доступа к этой задаче");
        }
    }

    /**
     * Получение информации о задаче
     */
    private TaskResponse toResponse(Task task) {

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDeadline(),

                task.getSubject() != null
                        ? task.getSubject().getId()
                        : null,

                task.getStatus(),
                task.getCompletedAt()
        );
    }
}