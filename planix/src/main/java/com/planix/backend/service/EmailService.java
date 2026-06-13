package com.planix.backend.service;

import com.planix.backend.exception.EmailSendException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Сервис для отправки email
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Отправка письма с новым паролем
     */
    public void sendPasswordRecovery(String email, String newPassword) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email не может быть пустым");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Восстановление пароля Planix");
        message.setText(
                "Ваш новый пароль: " + newPassword +
                        "\nРекомендуем сменить его после входа."
        );

        log.info("Отправка письма с {}", fromEmail);

        try {
            mailSender.send(message);
            log.info("Письмо успешно отправлено: email={}", email);

        } catch (Exception e) {
            log.error("Ошибка отправки письма на {}: {}", email, e.getMessage(), e);
            throw new EmailSendException("Не удалось отправить письмо");
        }
    }
}