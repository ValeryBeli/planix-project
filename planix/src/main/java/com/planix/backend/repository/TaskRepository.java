package com.planix.backend.repository;

import com.planix.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий для работы с задачами.
 * Предоставляет стандартные методы CRUD и поиск задач по пользователю и статусу.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Получить все задачи конкретного пользователя
     *
     * @param userId id пользователя
     * @return список задач пользователя
     */
    List<Task> findByUserId(Long userId);

    /**
     * Получить задачи пользователя по статусу
     *
     * @param userId id пользователя
     * @param status статус задачи
     * @return список задач пользователя с указанным статусом
     */
    List<Task> findByUserIdAndStatus(Long userId, String status);
}