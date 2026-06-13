import { useMemo } from "react";
import type { Habit } from "../types/habit";

function getDayWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "дней";
  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дня";

  return "дней";
}

function getDayName(dateStr: string): string {
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const date = new Date(dateStr);

  return days[date.getDay()];
}

function getWeekDays() {
  const days: string[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  return days;
}

function getCurrentStreak(
  habitId: number,
  logs: Record<number, string[]>
) {
  const habitLogs = new Set(logs[habitId] || []);
  const days = getWeekDays();

  let maxRun = 0;
  let currentRun = 0;

  for (const dateStr of days) {
    if (habitLogs.has(dateStr)) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else {
      currentRun = 0;
    }
  }

  return maxRun;
}

type Props = {
  habits: Habit[];
  logs: Record<number, string[]>;
  toggleLog: (habitId: number, date: string) => void;
  openEditModal: (habit: Habit) => void;
  openDeleteModal: (habit: Habit) => void;
loading: boolean;
};

export default function HabitList({
  habits,
  logs,
  toggleLog,
  openEditModal,
  openDeleteModal,
  loading
}: Props) {
  const weekDays = useMemo(() => getWeekDays(), []);

return (
  <div className="habits-container">

    {loading && (
      <p className="muted">Загрузка...</p>
    )}

    {habits.length === 0 && !loading && (
      <div className="habits-empty">
        <p>🌱 Привычек пока нет</p>
        <p className="muted">
          Добавь первую привычку
        </p>
      </div>
    )}

    {habits.map((habit) => {
        const habitLogs = logs[habit.id] || [];
        const streak = getCurrentStreak(habit.id, logs);

        return (
          <div key={habit.id} className="habit-card">
            <div className="habit-info">
              <strong>{habit.name}</strong>

              <p className="muted">
                {habit.description || "Без описания"}
              </p>

              <div className="habit-streak">
                🔥 {streak} {getDayWord(streak)}
              </div>

              <div className="habit-week">
                {weekDays.map((date) => {
                  const done = habitLogs.includes(date);

                  return (
                    <div
                      key={date}
                      className={`habit-day ${done ? "done" : ""}`}
                      onClick={() => toggleLog(habit.id, date)}
                    >
                      <div className="day-label">
                        <div className="day-name">
                          {getDayName(date)}
                        </div>
                        <div className="day-num">
                          {date.slice(8)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="habit-actions">
              <button
                className="btn btn-outline btn-sm"
                onClick={() =>
                  toggleLog(
                    habit.id,
                    new Date().toISOString().split("T")[0]
                  )
                }
              >
                Отметить как выполненное
              </button>

              <button
                className="btn-icon"
                onClick={() => openEditModal(habit)}
              >
                ✏️
              </button>

              <button
                className="btn-icon"
                onClick={() => openDeleteModal(habit)}
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}