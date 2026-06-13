import { useMemo } from "react";
import type { Subject } from "../types/subject";
import { getLessonWord } from "../utils/week";

const DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

type Props = {
  activeDay: number;
  setActiveDay: (n: number) => void;
  filteredSubjects: Subject[];
  loading: boolean;
  openEditModal: (s: Subject) => void;
  handleDelete: (id: number) => Promise<void>;
};

export default function WeekSchedule({
  activeDay,
  setActiveDay,
  filteredSubjects,
  loading,
  openEditModal,
  handleDelete,
}: Props) {
  const lessonsCount = filteredSubjects.length;

  const header = useMemo(() => ({
    title: DAYS[activeDay - 1],
    count: lessonsCount,
  }), [activeDay, lessonsCount]);

  return (
    <>
      <div className="day-tabs">
        {DAYS.map((day, index) => (
          <button
            key={day}
            className={activeDay === index + 1 ? "tab active" : "tab"}
            onClick={() => setActiveDay(index + 1)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="panel">
        <div className="schedule-header">
          <h3>{header.title}</h3>
          <span className="lessons-count">{header.count} {getLessonWord(header.count)}</span>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : filteredSubjects.length === 0 ? (
          <div className="empty-day">
            <p>В этот день пар нет</p>
          </div>
        ) : (
          filteredSubjects.map((subject) => (
            <div className="lesson-card" key={subject.id}>
              <div className="lesson-time">
                {subject.startTime}
                <span className="end">{subject.endTime}</span>
              </div>

              <div className="lesson-info">
                <strong>{subject.name}</strong>
                <span className="teacher">👨‍🏫 {subject.teacher || "Не указан"}</span>
                <span className="room">📍 {subject.location || "Не указана"}</span>
              </div>

              <div className="lesson-actions">
                <button className="btn-icon edit" onClick={() => openEditModal(subject)}>✏️</button>
                <button className="btn-icon delete" onClick={() => handleDelete(subject.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
