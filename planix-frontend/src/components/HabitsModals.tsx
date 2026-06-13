import React from "react";
import type { Habit } from "../types/habit";

type WeekItem = { date: string; doneCount: number };

interface Props {
  showStatsModal: boolean;
  setShowStatsModal: (v: boolean) => void;
  weekChartData: WeekItem[];
  chartMax: number;
  habits: Habit[];
  logs: Record<number, string[]>;

  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (v: boolean) => void;
  habitToDelete: Habit | null;
  confirmDelete: () => Promise<void>;

  showModal: boolean;
  setShowModal: (v: boolean) => void;
  editingHabit: Habit | null;
  form: { name: string; description: string };
  setForm: (f: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function HabitsModals({
  showStatsModal,
  setShowStatsModal,
  weekChartData,
  chartMax,
  habits,
  logs,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  habitToDelete,
  confirmDelete,
  showModal,
  setShowModal,
  editingHabit,
  form,
  setForm,
  handleSubmit,
}: Props) {
  return (
    <>
      {showStatsModal && (
        <div className="modal" style={{ display: "flex" }} role="dialog" aria-modal="true">
          <div className="modal-overlay" onClick={() => setShowStatsModal(false)} />

          <div className="modal-content modal-stats" style={{ maxWidth: "640px", width: "100%" }}>
            <div className="modal-header">
              <div>
                <h3>📊 Статистика привычек</h3>

                <p className="muted" style={{ marginTop: "4px" }}>
                  Активность за последние 7 дней
                </p>
              </div>

              <button className="modal-close" onClick={() => setShowStatsModal(false)} aria-label="Закрыть">
                ✕
              </button>
            </div>

            {habits.length > 0 && Object.keys(logs).length > 0 ? (
              <div className="modern-chart-grid">
                {weekChartData.map((item) => {
                  const height = (item.doneCount / chartMax) * 180;

                  return (
                    <div key={item.date} className="modern-bar-wrapper">
                      <div className="modern-bar-top">{item.doneCount}</div>

                      <div className="modern-bar-bg">
                        <div className="modern-bar-fill" style={{ height: `${height}px` }} />
                      </div>

                      <div className="modern-bar-label">
                        <span className="day-dm">{`${item.date.slice(8)}-${item.date.slice(5, 7)}`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="muted" style={{ textAlign: "center", padding: "40px 0" }}>
                📭 Недостаточно данных для отображения статистики
              </p>
            )}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal modal-clear" style={{ display: "flex" }} role="dialog" aria-modal="true">
          <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)} />

          <div className="modal-content modal-sm">
            <div className="modal-header">
              <div className="modal-icon">🗑️</div>

              <h3>Удалить привычку?</h3>

              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)} aria-label="Закрыть">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>
                Привычка <b>{habitToDelete?.name}</b> будет удалена без возможности восстановления.
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>
                Отмена
              </button>

              <button className="btn btn-danger" onClick={confirmDelete}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal" style={{ display: "flex" }} role="dialog" aria-modal="true">
          <div className="modal-overlay" onClick={() => setShowModal(false)} />

          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingHabit ? "Редактирование привычки" : "Добавление привычки"}</h3>

              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Закрыть">
                ✕
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label>Название</label>

              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} maxLength={100} />

              <label>Описание</label>

              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={200} />

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Отмена
                </button>

                <button className="btn btn-primary" type="submit">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
