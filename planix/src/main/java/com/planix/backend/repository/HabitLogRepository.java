package com.planix.backend.repository;

import com.planix.backend.entity.Habit;
import com.planix.backend.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Репозиторий для работы с логами привычек.
 * Предоставляет стандартные методы CRUD и поиск/удаление по Habit и дате.
 */
@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {

    /**
     * Проверка существования записи для привычки на конкретную дату
     *
     * @param habit объект привычки
     * @param date дата выполнения
     * @return true, если запись существует
     */
    boolean existsByHabitAndDate(Habit habit, LocalDate date);

    /**
     * Удаление записи привычки по объекту привычки и дате
     *
     * @param habit объект привычки
     * @param date дата выполнения
     */
    void deleteByHabitAndDate(Habit habit, LocalDate date);

    /**
     * Получить все отметки для конкретной привычки
     *
     * @param habit объект привычки
     * @return список HabitLog
     */
    List<HabitLog> findByHabit(Habit habit);


}