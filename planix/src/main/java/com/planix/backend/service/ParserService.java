package com.planix.backend.service;

import com.planix.backend.entity.Subject;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Сервис парсинга расписания КНИТУ
 */
@Slf4j
@Service
public class ParserService {

    private static final Pattern TIME_PATTERN =
            Pattern.compile("(\\d{2}:\\d{2})\\s*-\\s*(\\d{2}:\\d{2})");

    private static final int TIMEOUT_MS = 15000;
    private static final int MAX_RETRIES = 3;

    /**
     * Основной метод парсинга расписания по URL
     */
    public List<Subject> parse(String url) {

        String cleanUrl = cleanUrl(url);
        Document doc = fetchWithRetry(cleanUrl);

        String weekType = extractWeekType(doc).toUpperCase();
        log.debug("Тип недели: {}", weekType);

        Element table = doc.selectFirst("table.brstu-table");

        if (table == null) {
            throw new IllegalStateException("Таблица расписания не найдена");
        }

        Elements rows = table.select("tr");

        List<Subject> result = new ArrayList<>();

        for (int i = 1; i < rows.size(); i++) {

            Element row = rows.get(i);
            Elements cells = row.select("td");

            if (cells.size() < 2) continue;

            String timeText = cells.get(0).text();

            LocalTime startTime = parseStartTime(timeText);
            LocalTime endTime = parseEndTime(timeText);

            for (int dayIndex = 1; dayIndex < cells.size(); dayIndex++) {

                Element cell = cells.get(dayIndex);

                if (isEmpty(cell)) continue;

                Subject subject = parseCell(cell);

                subject.setDayOfWeek((short) dayIndex);
                subject.setWeekType(weekType);
                subject.setStartTime(startTime);
                subject.setEndTime(endTime);

                result.add(subject);
            }
        }

        log.info("Распарсено {} предметов", result.size());
        return result;
    }

    /**
     * Загрузка HTML страницы с повторными попытками при ошибке
     */
    private Document fetchWithRetry(String url) {

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                return Jsoup.connect(url)
                        .userAgent("Mozilla/5.0")
                        .timeout(TIMEOUT_MS)
                        .maxBodySize(0)
                        .get();

            } catch (IOException e) {

                log.warn("Попытка {} не удалась: {}", attempt, e.getMessage());

                if (attempt == MAX_RETRIES) {
                    log.error("Сайт недоступен после {} попыток", MAX_RETRIES);
                    throw new RuntimeException("Сайт расписания временно недоступен");
                }

                try {
                    Thread.sleep(1000L * attempt);
                } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt();
                }
            }
        }

        throw new RuntimeException("Ошибка загрузки страницы");
    }

    /**
     * Очистка URL от якорей (#...)
     */
    private String cleanUrl(String url) {
        return url.split("#")[0];
    }

    /**
     * Определение типа недели (четная / нечетная)
     */
    private String extractWeekType(Document doc) {

        String text = doc.text().toLowerCase();

        if (text.contains("нечетная неделя")) {
            return "ODD";
        } else if (text.contains("четная неделя")) {
            return "EVEN";
        }

        throw new IllegalStateException("Не удалось определить тип недели");
    }

    /**
     * Парсинг одной ячейки таблицы в объект Subject
     */
    private Subject parseCell(Element cell) {

        // Собираем все локации из <b> тегов (может быть несколько аудиторий для подгрупп)
        Elements locationElements = cell.select("b");
        List<String> locations = new ArrayList<>();
        for (Element loc : locationElements) {
            String locText = loc.text().trim();
            if (!locText.isEmpty() && !locations.contains(locText)) {
                locations.add(locText);
            }
        }
        String location = String.join(", ", locations);

        // Полный текст ячейки
        String fullText = cell.text();

        // Убираем все найденные локации из текста, чтобы осталось только название предмета
        String cleaned = fullText;
        for (String loc : locations) {
            cleaned = cleaned.replace(loc, " ");
        }

        // Убираем даты в формате "2 фев - 7 июн"
        cleaned = cleaned.replaceAll("\\d+\\s+\\S+\\s*-\\s*\\d+\\s+\\S+", " ");

        // Собираем преподавателей из <a> тегов
        List<String> teachers = cell.select("a").eachText();
        String teacher = teachers.stream()
                .distinct()
                .reduce((a, b) -> a + ", " + b)
                .orElse(null);

        // Убираем имена преподавателей из текста (после сбора в переменную)
        if (teacher != null) {
            cleaned = cleaned.replace(teacher, " ");
        }

        // Удаляем дублирующиеся фрагменты и чистим пробелы
        cleaned = removeDuplicateFragments(cleaned);
        cleaned = cleaned.replaceAll("\\s+", " ").trim();

        return Subject.builder()
                .name(cleaned)
                .location(location)
                .teacher(teacher)
                .build();
    }

    /**
     * Удаление дублирующихся фрагментов текста
     */
    private String removeDuplicateFragments(String text) {

        if (text == null || text.isBlank()) return text;

        String[] parts = text.split("\\s{2,}");

        List<String> unique = new ArrayList<>();

        for (String part : parts) {

            String p = part.trim();

            if (p.isEmpty()) continue;

            if (!unique.contains(p)) {
                unique.add(p);
            }
        }

        return String.join(" ", unique);
    }

    /**
     * Проверка, является ли ячейка пустой
     */
    private boolean isEmpty(Element cell) {
        return cell.text().trim().isEmpty();
    }

    /**
     * Парсинг времени начала занятия
     */
    private LocalTime parseStartTime(String text) {
        Matcher matcher = TIME_PATTERN.matcher(text);

        if (matcher.find()) {
            return LocalTime.parse(matcher.group(1));
        }

        throw new IllegalArgumentException("Не удалось распарсить start time: " + text);
    }

    /**
     * Парсинг времени окончания занятия
     */
    private LocalTime parseEndTime(String text) {
        Matcher matcher = TIME_PATTERN.matcher(text);

        if (matcher.find()) {
            return LocalTime.parse(matcher.group(2));
        }

        throw new IllegalArgumentException("Не удалось распарсить end time: " + text);
    }
}