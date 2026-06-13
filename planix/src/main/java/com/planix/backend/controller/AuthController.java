package com.planix.backend.controller;

import com.planix.backend.dto.request.LoginRequest;
import com.planix.backend.dto.request.RecoverPasswordRequest;
import com.planix.backend.dto.request.RegisterRequest;
import com.planix.backend.dto.response.AuthResponse;
import com.planix.backend.dto.response.RecoverPasswordResponse;
import com.planix.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Контроллер для аутентификации пользователей
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Регистрация пользователя
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        log.debug("Регистрация пользователя: email={}", request.getEmail());

        AuthResponse response = authService.register(request);

        log.info("Пользователь успешно зарегистрирован: email={}", request.getEmail());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Авторизация пользователя
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        log.debug("Попытка входа: email={}", request.getEmail());

        AuthResponse response = authService.login(request);

        log.info("Успешный вход: email={}", request.getEmail());

        return ResponseEntity.ok(response);
    }

    /**
     * Восстановление пароля
     */
    @PostMapping("/recover-password")
    public ResponseEntity<RecoverPasswordResponse> recoverPassword(
            @Valid @RequestBody RecoverPasswordRequest request
    ) {

        log.debug("Запрос на восстановление пароля: email={}", request.getEmail());

        RecoverPasswordResponse response = authService.recoverPassword(request);

        log.info("Инструкция по восстановлению отправлена: email={}", request.getEmail());

        return ResponseEntity.ok(response);
    }

}