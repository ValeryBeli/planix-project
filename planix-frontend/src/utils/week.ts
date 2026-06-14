/**
 * Создаёт дату в локальном часовом поясе без UTC сдвига
 */
function getLocalDate(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day);
  // Обнуляем время для чистоты сравнений
  date.setHours(0, 0, 0, 0);
  return date;
}

// Исправленная дата начала учебного года (1 сентября 2025)
export const STUDY_YEAR_START = getLocalDate(2025, 8, 1); // 8 = сентябрь (0-индексация)

/**
 * Получить номер учебной недели
 */
export function getStudyWeekNumber(date: Date = new Date()): number {
  // Создаём локальную копию с обнулённым временем
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(STUDY_YEAR_START);
  startDate.setHours(0, 0, 0, 0);
  
  const diffMs = targetDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Если дата раньше начала учебного года, вернуть 0 или 1
  if (diffDays < 0) return 1;
  
  const weekNumber = Math.floor(diffDays / 7) + 1;
  
  // Проверка: если воскресенье, возможно нужно отнести к следующей неделе?
  // В зависимости от вашей логики
  
  return weekNumber;
}

/**
 * Тип недели (чётная/нечётная)
 */
export function getWeekType(date: Date = new Date()): "ODD" | "EVEN" {
  const week = getStudyWeekNumber(date);
  // Чётная неделя = EVEN, нечётная = ODD
  return week % 2 === 0 ? "EVEN" : "ODD";
}

/**
 * Форматирует дату для отладки (показывает локальную дату)
 */
export function getLocalTodayInfo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekType = getWeekType(now);
  const weekNumber = getStudyWeekNumber(now);
  
  return `${year}-${month}-${day} - ${weekNumber} неделя (${weekType === "ODD" ? "нечётная" : "чётная"})`;
}

/**
 * склонение слова "пара" в зависимости от количества занятий
 */
export function getLessonWord(count: number): string {
  const last = count % 10;
  const lastTwo = count % 100;

  if (last === 1 && lastTwo !== 11) return 'пара';
  if (last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20)) return 'пары';
  return 'пар';
}