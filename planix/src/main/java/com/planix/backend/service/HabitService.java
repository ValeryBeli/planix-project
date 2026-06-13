package com.planix.backend.service;

import com.planix.backend.dto.request.HabitRequest;
import com.planix.backend.dto.response.HabitLogResponse;
import com.planix.backend.dto.response.HabitResponse;
import com.planix.backend.entity.Habit;
import com.planix.backend.entity.HabitLog;
import com.planix.backend.entity.User;
import com.planix.backend.exception.ForbiddenException;
import com.planix.backend.exception.NotFoundException;
import com.planix.backend.exception.UnauthorizedException;
import com.planix.backend.repository.HabitLogRepository;
import com.planix.backend.repository.HabitRepository;
import com.planix.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Сервис для работы с привычками
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final SecurityUtils securityUtils;

    /**
     * Получить все привычки пользователя
     */
    @Transactional(readOnly = true)
    public List<HabitResponse> getAll() {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Получение привычек пользователя: userId={}", user.getId());

        List<HabitResponse> habits = habitRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        log.info("Найдено {} привычек для userId={}", habits.size(), user.getId());

        return habits;
    }

    /**
     * Создание привычки
     */
    @Transactional
    public HabitResponse create(HabitRequest request) {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Создание привычки: name={}, userId={}", request.getName(), user.getId());

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Название привычки не может быть пустым");
        }

        Habit habit = Habit.builder()
                .name(request.getName())
                .description(request.getDescription())
                .user(user)
                .build();

        habitRepository.save(habit);

        log.info("Привычка создана: id={}, userId={}", habit.getId(), user.getId());

        return toResponse(habit);
    }

    /**
     * Обновление привычки
     */
    @Transactional
    public HabitResponse update(Long id, HabitRequest request) {
        log.debug("Обновление привычки: id={}", id);

        Habit habit = getHabitOrThrow(id);
        checkAccess(habit);

        habit.setName(request.getName());
        habit.setDescription(request.getDescription());

        habitRepository.save(habit);

        log.info("Привычка обновлена: id={}", id);

        return toResponse(habit);
    }

    /**
     * Удаление привычки
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Удаление привычки: id={}", id);

        Habit habit = getHabitOrThrow(id);
        checkAccess(habit);

        habitRepository.delete(habit);

        log.info("Привычка удалена: id={}", id);
    }

    /**
     * Добавить отметку выполнения
     */
    @Transactional
    public void addLog(Long habitId, LocalDate date) {
        log.debug("Добавление отметки: habitId={}, date={}", habitId, date);

        if (date == null) {
            throw new IllegalArgumentException("Дата не может быть пустой");
        }

        Habit habit = getHabitOrThrow(habitId);
        checkAccess(habit);

        boolean exists = habitLogRepository.existsByHabitAndDate(habit, date);
        if (exists) {
            log.warn("Отметка уже существует: habitId={}, date={}", habitId, date);
            return;
        }

        HabitLog logEntity = new HabitLog();
        logEntity.setHabit(habit);
        logEntity.setDate(date);

        habitLogRepository.save(logEntity);

        log.info("Отметка добавлена: habitId={}, date={}", habitId, date);
    }

    /**
     * Удалить отметку выполнения
     */
    @Transactional
    public void deleteLog(Long habitId, LocalDate date) {
        log.debug("Удаление отметки: habitId={}, date={}", habitId, date);

        if (date == null) {
            throw new IllegalArgumentException("Дата не может быть пустой");
        }

        Habit habit = getHabitOrThrow(habitId);
        checkAccess(habit);

        habitLogRepository.deleteByHabitAndDate(habit, date);

        log.info("Отметка удалена: habitId={}, date={}", habitId, date);
    }

    /**
     * Получение привычки или ошибка
     */
    private Habit getHabitOrThrow(Long id) {
        return habitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Привычка с id " + id + " не найдена"));
    }

    /**
     * Проверка доступа
     */
    private void checkAccess(Habit habit) {
        User currentUser = securityUtils.getCurrentUser();

        if (currentUser == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        if (!habit.getUser().getId().equals(currentUser.getId())) {
            log.warn("Попытка доступа к чужой привычке: habitId={}, userId={}",
                    habit.getId(), currentUser.getId());
            throw new ForbiddenException("Нет доступа к этой привычке");
        }
    }

    /**
     * Маппинг в DTO
     */
    private HabitResponse toResponse(Habit habit) {
        return new HabitResponse(
                habit.getId(),
                habit.getName(),
                habit.getDescription()
        );
    }

    /**
     * Получение всех отметок привычки
     */
    @Transactional(readOnly = true)
    public List<HabitLogResponse> getLogs(Long habitId) {
        log.debug("Получение отметок привычки: habitId={}", habitId);

        Habit habit = getHabitOrThrow(habitId);
        checkAccess(habit);

        List<HabitLogResponse> logs = habitLogRepository.findByHabit(habit)
                .stream()
                .map(log -> new HabitLogResponse(log.getId(), log.getHabit().getId(), log.getDate()))
                .toList();

        log.info("Найдено {} отметок для привычки: habitId={}", logs.size(), habitId);
        return logs;
    }
}