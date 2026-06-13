export const STUDY_YEAR_START = new Date("2025-09-01");

/**
 * Получить номер учебной недели
 */
export function getStudyWeekNumber(date = new Date()) {

  const diffMs =
    date.getTime() - STUDY_YEAR_START.getTime();

  const diffDays = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  return Math.floor(diffDays / 7) + 1;
}

/**
 * Тип недели
 */
export function getWeekType(
  date = new Date()
): "ODD" | "EVEN" {

  const week = getStudyWeekNumber(date);

  return week % 2 === 0
    ? "EVEN"
    : "ODD";
}

/**
 * склонение слова "пара" в зависимости от количества занятий
 */
export function getLessonWord(count: number) {
  const last = count % 10;
  const lastTwo = count % 100;

  if (last === 1 && lastTwo !== 11) return 'пара';
  if (last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20)) return 'пары';
  return 'пар';
}