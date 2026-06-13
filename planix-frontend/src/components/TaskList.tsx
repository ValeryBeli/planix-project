import type { Task, TaskStatus } from "../types/task";
import type { Subject } from "../types/subject";

interface Props {
  filteredTasks: Task[];
  subjects: Subject[];
  loading: boolean;
  formatDate: (date?: string) => string;
  formatStatus: (s: TaskStatus) => string;
  openEditModal: (t: Task) => void;
  openDeleteModal: (t: Task) => void;
  handleComplete: (t: Task) => Promise<void>;
}

export default function TaskList({
  filteredTasks,
  subjects,
  loading,
  formatDate,
  formatStatus,
  openEditModal,
  openDeleteModal,
  handleComplete,
}: Props) {
  return (
    <div className="tasks-container">
      {loading && <p>Загрузка...</p>}

      {!loading && filteredTasks.length === 0 && (
        <div className="tasks-empty">
          <p>🎉 Задач нет!</p>
          <p className="muted">Добавь первую задачу</p>
        </div>
      )}

      {filteredTasks.map((task) => {
        const subject = subjects.find((s) => s.id === task.subjectId);

        return (
          <div key={task.id} className={`task-card ${task.status.toLowerCase()}`}>
            <div className="task-checkbox">
              <input
                type="checkbox"
                checked={task.status === "COMPLETED"}
                disabled={task.status === "COMPLETED"}
                onChange={() => handleComplete(task)}
              />
            </div>

            <div className="task-content">
              <div className="task-header">
                <strong>{task.title}</strong>
              </div>

              <p className="task-description">{task.description || "Без описания"}</p>

              <div className="task-meta">
                <span className="task-date">📅 {formatDate(task.deadline)}</span>

                {subject && <span className="task-tag subject">📚 {subject.name}</span>}

                <span className="task-tag">{formatStatus(task.status)}</span>
              </div>
            </div>

            <div className="task-actions">
              <button className="btn-icon" onClick={() => openEditModal(task)}>✏️</button>

              <button className="btn-icon delete" onClick={() => openDeleteModal(task)}>🗑️</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
