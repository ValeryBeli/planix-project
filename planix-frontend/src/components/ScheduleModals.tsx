import React from "react";

type Props = {
  isClearModalOpen: boolean;
  setIsClearModalOpen: (v: boolean) => void;
  handleClearSchedule: () => Promise<void>;

  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
  name: string;
  setName: (s: string) => void;
  dayOfWeek: number;
  setDayOfWeek: (n: number) => void;
  weekType: "ODD" | "EVEN";
  setWeekType: (w: "ODD" | "EVEN") => void;
  startTime: string;
  setStartTime: (s: string) => void;
  endTime: string;
  setEndTime: (s: string) => void;
  location: string;
  setLocation: (s: string) => void;
  teacher: string;
  setTeacher: (s: string) => void;
  handleCreate: (e: React.FormEvent) => Promise<void>;

  isEditModalOpen: boolean;
  setIsEditModalOpen: (v: boolean) => void;
  handleUpdate: (e: React.FormEvent) => Promise<void>;

  isImportModalOpen: boolean;
  setIsImportModalOpen: (v: boolean) => void;
  importUrl: string;
  setImportUrl: (s: string) => void;
  handleImport: () => Promise<void>;
};

const DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export default function ScheduleModals({
  isClearModalOpen,
  setIsClearModalOpen,
  handleClearSchedule,
  isCreateModalOpen,
  setIsCreateModalOpen,
  name,
  setName,
  dayOfWeek,
  setDayOfWeek,
  weekType,
  setWeekType,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  location,
  setLocation,
  teacher,
  setTeacher,
  handleCreate,
  isEditModalOpen,
  setIsEditModalOpen,
  handleUpdate,
  isImportModalOpen,
  setIsImportModalOpen,
  importUrl,
  setImportUrl,
  handleImport,
}: Props) {
  return (
    <>
      {isClearModalOpen && (
        <div className="modal modal-clear" style={{ display: "flex" }}>
          <div className="modal-overlay" onClick={() => setIsClearModalOpen(false)} />

          <div className="modal-content modal-sm">
            <div className="modal-header">
              <div className="modal-icon">🗑️</div>
              <h3>Очистить расписание?</h3>
              <button className="modal-close" onClick={() => setIsClearModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p>Это действие нельзя отменить. Все пары будут удалены безвозвратно.</p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setIsClearModalOpen(false)}>Отмена</button>
              <button className="btn btn-danger" onClick={handleClearSchedule}>Да, удалить</button>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)} />

          <div className="modal-content">
            <div className="modal-header">
              <h3>Добавление предмета</h3>
              <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleCreate}>
              <input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} required />

              <select value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))}>
                {DAYS.map((d, index) => (
                  <option key={index} value={index + 1}>{d}</option>
                ))}
              </select>

              <select value={weekType} onChange={(e) => setWeekType(e.target.value as "ODD" | "EVEN")}>
                <option value="ODD">Нечётная</option>
                <option value="EVEN">Чётная</option>
              </select>

              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

              <input placeholder="Аудитория" value={location} onChange={(e) => setLocation(e.target.value)} />
              <input placeholder="Преподаватель" value={teacher} onChange={(e) => setTeacher(e.target.value)} />

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsCreateModalOpen(false)}>Отмена</button>
                <button type="submit" className="btn btn-primary">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)} />

          <div className="modal-content">
            <div className="modal-header">
              <h3>Редактировать предмет</h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleUpdate}>
              <input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} required />

              <select value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))}>
                {DAYS.map((d, index) => (
                  <option key={index} value={index + 1}>{d}</option>
                ))}
              </select>

              <select value={weekType} onChange={(e) => setWeekType(e.target.value as "ODD" | "EVEN")}>
                <option value="ODD">Нечётная</option>
                <option value="EVEN">Чётная</option>
              </select>

              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

              <input placeholder="Аудитория" value={location} onChange={(e) => setLocation(e.target.value)} />
              <input placeholder="Преподаватель" value={teacher} onChange={(e) => setTeacher(e.target.value)} />

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>Отмена</button>
                <button type="submit" className="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-overlay" onClick={() => setIsImportModalOpen(false)} />

          <div className="modal-content">
            <div className="modal-header">
              <h3>Импорт расписания с сайта КНИТУ</h3>
              <button className="modal-close" onClick={() => setIsImportModalOpen(false)}>✕</button>
            </div>

            <div className="modal-form">
              <input type="text" placeholder="Вставьте ссылку на ваше расписание" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />

              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setIsImportModalOpen(false)}>Отмена</button>
                <button className="btn btn-primary" onClick={handleImport}>Импортировать</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
