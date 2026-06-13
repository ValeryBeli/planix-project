package com.planix.backend.service;

import com.planix.backend.dto.request.SubjectRequest;
import com.planix.backend.dto.response.ImportResponse;
import com.planix.backend.dto.response.SubjectResponse;
import com.planix.backend.entity.Subject;
import com.planix.backend.entity.User;
import com.planix.backend.exception.ForbiddenException;
import com.planix.backend.exception.NotFoundException;
import com.planix.backend.exception.UnauthorizedException;
import com.planix.backend.repository.SubjectRepository;
import com.planix.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Сервис для работы с предметами
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final SecurityUtils securityUtils;
    private final ParserService parserService;

    /**
     * Получить все предметы пользователя
     */
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAll() {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Получение предметов пользователя: userId={}", user.getId());

        List<SubjectResponse> subjects = subjectRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        log.info("Найдено {} предметов для userId={}", subjects.size(), user.getId());

        return subjects;
    }

    /**
     * Импорт расписания
     */
    @Transactional
    public ImportResponse importFromUrl(String url) {
        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Импорт расписания для userId={}, url={}", user.getId(), url);

        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("Ссылка не может быть пустой");
        }

        List<Subject> parsedSubjects = parserService.parse(url);

        if (parsedSubjects.isEmpty()) {
            throw new IllegalArgumentException("Не удалось распарсить расписание");
        }

        String weekType = parsedSubjects.get(0).getWeekType();

        log.debug("Определён тип недели: {}", weekType);

        subjectRepository.deleteByUserIdAndWeekType(user.getId(), weekType);

        log.debug("Старое расписание удалено для userId={}, weekType={}", user.getId(), weekType);

        parsedSubjects.forEach(subject -> subject.setUser(user));

        List<Subject> saved = subjectRepository.saveAll(parsedSubjects);

        log.info("Импорт завершён для userId={}, импортировано {} предметов",
                user.getId(), saved.size());

        return new ImportResponse(saved.size());
    }

    /**
     * Создание предмета
     */
    @Transactional
    public SubjectResponse create(SubjectRequest request) {

        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        log.debug("Создание предмета: name={}, userId={}", request.getName(), user.getId());

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Название предмета не может быть пустым");
        }

        Subject subject = Subject.builder()
                .name(request.getName())
                .user(user)
                .dayOfWeek(request.getDayOfWeek())
                .weekType(request.getWeekType())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation())
                .teacher(request.getTeacher())
                .build();

        subjectRepository.save(subject);

        log.info("Предмет создан: id={}, userId={}", subject.getId(), user.getId());

        return toResponse(subject);
    }

    /**
     * Обновление предмета
     */
    @Transactional
    public SubjectResponse update(Long id, SubjectRequest request) {
        log.debug("Обновление предмета: id={}", id);

        Subject subject = getSubjectOrThrow(id);
        checkAccess(subject);

        subject.setName(request.getName());
        subject.setDayOfWeek(request.getDayOfWeek());
        subject.setWeekType(request.getWeekType());
        subject.setStartTime(request.getStartTime());
        subject.setEndTime(request.getEndTime());
        subject.setLocation(request.getLocation());
        subject.setTeacher(request.getTeacher());
        subjectRepository.save(subject);

        log.info("Предмет обновлён: id={}", id);

        return toResponse(subject);
    }

    /**
     * Удаление предмета
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Удаление предмета: id={}", id);

        Subject subject = getSubjectOrThrow(id);
        checkAccess(subject);

        subjectRepository.delete(subject);

        log.info("Предмет удалён: id={}", id);
    }

    /**
     * Получение предмета или ошибка
     */
    private Subject getSubjectOrThrow(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Предмет с id " + id + " не найден"));
    }

    /**
     * Проверка доступа
     */
    private void checkAccess(Subject subject) {
        User currentUser = securityUtils.getCurrentUser();

        if (currentUser == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        if (!subject.getUser().getId().equals(currentUser.getId())) {
            log.warn("Попытка доступа к чужому предмету: subjectId={}, userId={}",
                    subject.getId(), currentUser.getId());
            throw new ForbiddenException("Нет доступа к этому предмету");
        }
    }

    /**
     * Маппинг в DTO
     */
    private SubjectResponse toResponse(Subject subject) {

        return new SubjectResponse(
                subject.getId(),
                subject.getName(),
                subject.getDayOfWeek(),
                subject.getWeekType(),
                subject.getStartTime(),
                subject.getEndTime(),
                subject.getLocation(),
                subject.getTeacher()
        );
    }

    /**
     * Очистка расписания
     */
    @Transactional
    public void clearAll() {

        User user = securityUtils.getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        subjectRepository.deleteAllByUserId(user.getId());
    }
}