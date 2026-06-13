package com.planix.backend.service;

import com.planix.backend.dto.request.LoginRequest;
import com.planix.backend.dto.request.RecoverPasswordRequest;
import com.planix.backend.dto.request.RegisterRequest;
import com.planix.backend.dto.response.AuthResponse;
import com.planix.backend.dto.response.RecoverPasswordResponse;
import com.planix.backend.entity.User;
import com.planix.backend.exception.DuplicateEntityException;
import com.planix.backend.exception.EmailSendException;
import com.planix.backend.exception.UnauthorizedException;
import com.planix.backend.repository.UserRepository;
import com.planix.backend.security.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

/**
 * Сервис для аутентификации и восстановления пароля
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int PASSWORD_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Регистрация пользователя
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        log.debug("Регистрация пользователя: email={}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEntityException("Email уже зарегистрирован");
        }

        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        log.info("Пользователь зарегистрирован: id={}", user.getId());

        return new AuthResponse(token);
    }

    /**
     * Авторизация пользователя
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {

        log.debug("Попытка логина: email={}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Неверный логин или пароль"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Неверный логин или пароль");
        }

        String token = jwtService.generateToken(user);

        log.info("Успешный логин: userId={}", user.getId());

        return new AuthResponse(token);
    }

    /**
     * Восстановление пароля
     */
    @Transactional
    public RecoverPasswordResponse recoverPassword(RecoverPasswordRequest request) {

        log.debug("Восстановление пароля: email={}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        String message = "Если пользователь существует, новый пароль отправлен на почту";

        if (user != null) {
            try {
                String newPassword = generateRandomPassword();

                user.setPasswordHash(passwordEncoder.encode(newPassword));
                userRepository.save(user);

                emailService.sendPasswordRecovery(user.getEmail(), newPassword);

                log.info("Пароль восстановлен: userId={}", user.getId());

            } catch (Exception ex) {
                log.error("Ошибка при отправке email: {}", ex.getMessage(), ex);
                throw new EmailSendException("Ошибка при отправке письма");
            }
        } else {
            log.warn("Попытка восстановления несуществующего email: {}", request.getEmail());
        }

        return new RecoverPasswordResponse(message);
    }

    /**
     * Генерация случайного пароля
     */
    private String generateRandomPassword() {

        StringBuilder sb = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int index = RANDOM.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }

        return sb.toString();
    }
}