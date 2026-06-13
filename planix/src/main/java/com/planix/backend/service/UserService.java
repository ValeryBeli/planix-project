package com.planix.backend.service;

import com.planix.backend.dto.request.ChangePasswordRequest;
import com.planix.backend.dto.response.UserResponse;
import com.planix.backend.entity.User;
import com.planix.backend.exception.BadRequestException;
import com.planix.backend.exception.UnauthorizedException;
import com.planix.backend.repository.UserRepository;
import com.planix.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Сервис для работы с пользователем
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;

    /**
     * Получить текущего пользователя
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Получение данных текущего пользователя: userId={}", user.getId());

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCreatedAt()
        );
    }

    /**
     * Смена пароля
     */
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Смена пароля: userId={}", user.getId());

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            log.warn("Попытка смены пароля с неверным старым паролем: userId={}", user.getId());
            throw new UnauthorizedException("Неверный текущий пароль");
        }

        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new BadRequestException("Новый пароль не должен совпадать со старым");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Пароль успешно изменён: userId={}", user.getId());
    }

    /**
     * Удаление текущего пользователя
     */
    @Transactional
    public void deleteCurrentUser() {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Удаление пользователя: userId={}", user.getId());

        userRepository.delete(user);

        log.info("Пользователь удалён: userId={}", user.getId());
    }
}