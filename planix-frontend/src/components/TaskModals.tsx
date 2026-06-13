import React from "react";
import type { Task, TaskStatus } from "../types/task";
import type { Subject } from "../types/subject";

interface Props {
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  editingTask: Task | null;
  form: any;
  setForm: (f: any) => void;
  subjects: Subject[];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (v: boolean) => void;
  taskToDelete: Task | null;
  confirmDelete: () => Promise<void>;
}

export default function TaskModals({
  showModal,
  setShowModal,
  editingTask,
  form,
  setForm,
  subjects,
  handleSubmit,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  taskToDelete,
  confirmDelete,
}: Props) {
  return (
    <>
      {showModal && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />

          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingTask ? "Редактирование задачи" : "Добавление задачи"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label>Название задачи</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

              <label>Описание</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

              <label>Дедлайн</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />

              <label>Предмет</label>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">Без предмета</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={String(subject.id)}>
                    {subject.name}
                  </option>
                ))}
              </select>

              <label>Статус</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
                <option value="PENDING">⏳ Ожидает</option>
                <option value="IN_PROGRESS">🔄 В процессе</option>
                <option value="COMPLETED">✅ Завершено</option>
                <option value="CANCELLED">❌ Отменено</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Отмена</button>
                <button type="submit" className="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal modal-clear" style={{ display: "flex" }}>
          <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)} />

          <div className="modal-content modal-sm">
            <div className="modal-header">
              <div className="modal-icon">🗑️</div>
              <h3>Удалить задачу?</h3>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p>Задача <b>{taskToDelete?.title}</b> будет удалена без возможности восстановления.</p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>Отмена</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Да, удалить</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
