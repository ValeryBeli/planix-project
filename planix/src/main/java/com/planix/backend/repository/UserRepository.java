package com.planix.backend.repository;

import com.planix.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Репозиторий для работы с пользователями.
 * Предоставляет стандартные методы CRUD и поиск по email.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Найти пользователя по email
     *
     * @param email почта пользователя
     * @return Optional<User>
     */
    Optional<User> findByEmail(String email);


    /**
     * Проверка существования пользователя с указанным email
     *
     * @param email почта пользователя
     * @return true, если email существует
     */
    boolean existsByEmail(String email);


}