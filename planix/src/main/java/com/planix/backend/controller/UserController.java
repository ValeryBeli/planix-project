package com.planix.backend.controller;

import com.planix.backend.dto.request.ChangePasswordRequest;
import com.planix.backend.dto.response.UserResponse;
import com.planix.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Контроллер для работы с пользователем
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Получить данные текущего пользователя
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {

        log.debug("Запрос текущего пользователя");

        UserResponse user = userService.getCurrentUser();

        log.info("Данные пользователя получены: id={}", user.getId());

        return ResponseEntity.ok(user);
    }

    /**
     * Смена пароля
     */
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        log.debug("Запрос на смену пароля");

        userService.changePassword(request);

        log.info("Пароль успешно изменён");

        return ResponseEntity.ok().build();
    }

    /**
     * Удаление текущего пользователя
     */
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser() {

        log.debug("Запрос на удаление пользователя");

        userService.deleteCurrentUser();

        log.info("Пользователь удалён");

        return ResponseEntity.noContent().build();
    }
}