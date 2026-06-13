package com.planix.backend.repository;

import com.planix.backend.entity.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий для работы с привычками.
 * Предоставляет стандартные методы CRUD и поиск привычек по пользователю.
 */
@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {

    /**
     * Получить все привычки конкретного пользователя
     *
     * @param userId id пользователя
     * @return список привычек пользователя
     */
    List<Habit> findByUserId(Long userId);
}