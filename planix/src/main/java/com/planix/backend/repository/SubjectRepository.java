package com.planix.backend.repository;

import com.planix.backend.entity.Subject;
import com.planix.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий для работы с предметами.
 * Предоставляет стандартные методы CRUD и поиск предметов по пользователю.
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    /**
     * Получить все предметы конкретного пользователя
     *
     * @param userId id пользователя
     * @return список предметов пользователя
     */
    List<Subject> findByUserId(Long userId);

    void deleteByUserIdAndWeekType(Long userId, String weekType);

    void deleteAllByUserId(Long userId);
}