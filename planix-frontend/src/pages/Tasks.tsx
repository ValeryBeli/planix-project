import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { subjectApi, taskApi, markOverdueTasksCancelled } from "../services/api";

import type { Task, TaskStatus } from "../types/task";
import type { Subject } from "../types/subject";
import TaskList from "../components/TaskList";
import TaskModals from "../components/TaskModals";

const filters = [
  { key: "ALL", label: "Все" },
  { key: "PENDING", label: "Ожидает" },
  { key: "IN_PROGRESS", label: "В процессе" },
  { key: "COMPLETED", label: "Завершено" },
  { key: "CANCELLED", label: "Отменено" }
];

export default function Tasks() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [filter, setFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    subjectId: "",
    status: "PENDING"
  });


  async function loadTasks() {
    try {
      setLoading(true);

      const data = await taskApi.getAll();

      try {
        await markOverdueTasksCancelled(data || []);
        const refreshed = await taskApi.getAll();
        setTasks(refreshed);
      } catch (e) {
        console.error("Auto-cancel overdue tasks failed:", e);
        setTasks(data);
      }

    } catch (err) {

      console.error(err);

      alert("Ошибка загрузки задач");

    } finally {

      setLoading(false);

    }
  }


  async function loadSubjects() {

    try {

      const data = (await subjectApi.getAll()) || [];
      const items = Array.isArray(data) ? (data as Subject[]) : ([] as Subject[]);
      const seen = new Set<string>();
      const uniqueByName: Subject[] = [];

      for (const s of items) {
        const nameKey = (s.name || "").trim().toLowerCase();

        if (!seen.has(nameKey)) {
          seen.add(nameKey);
          uniqueByName.push(s);
        }
      }

      const sorted = uniqueByName.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "ru", { sensitivity: "base" })
      );

      setSubjects(sorted);

    } catch (err) {

      console.error(err);

    }
  }

  useEffect(() => {

    loadTasks();
    loadSubjects();

  }, []);


const filteredTasks = useMemo(() => {

  const statusOrder: Record<TaskStatus, number> = {
    PENDING: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    CANCELLED: 3
  };

  const withIndex = tasks.map((t, i) => ({ t, i }));

  let filtered = withIndex;

  if (filter !== "ALL") {
    filtered = withIndex.filter(({ t }) => t.status === filter);
  }

  filtered.sort((a, b) => {
    const s = statusOrder[a.t.status] - statusOrder[b.t.status];

    if (s !== 0) return s;

    const titleCompare = (a.t.title || "").localeCompare(
      b.t.title || "",
      "ru",
      { sensitivity: "base" }
    );

    if (titleCompare !== 0) return titleCompare;

    return a.i - b.i;
  });

  return filtered.map(({ t }) => t);

}, [tasks, filter]);


  const counts = {
    ALL: tasks.length,
    PENDING: tasks.filter(
      t => t.status === "PENDING"
    ).length,

    IN_PROGRESS: tasks.filter(
      t => t.status === "IN_PROGRESS"
    ).length,

    COMPLETED: tasks.filter(
      t => t.status === "COMPLETED"
    ).length,

    CANCELLED: tasks.filter(
      t => t.status === "CANCELLED"
    ).length
  };


  function formatStatus(status: TaskStatus) {

    switch (status) {

      case "PENDING":
        return "⏳ Ожидает";

      case "IN_PROGRESS":
        return "🔄 В процессе";

      case "COMPLETED":
        return "✅ Завершено";

      case "CANCELLED":
        return "❌ Отменено";

      default:
        return status;
    }
  }


  function openCreateModal() {

    setEditingTask(null);

    setForm({
      title: "",
      description: "",
      deadline: "",
      subjectId: "",
      status: "PENDING"
    });

    setShowModal(true);
  }


  function openEditModal(task: Task) {

    setEditingTask(task);

    setForm({
      title: task.title,
      description: task.description || "",
      deadline: task.deadline || "",
      subjectId: task.subjectId
        ? String(task.subjectId)
        : "",
      status: task.status
    });

    setShowModal(true);
  }


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      const payload = {
        ...form,
        subjectId: form.subjectId || null
      };

      if (editingTask) {

        await taskApi.update(
          editingTask.id,
          payload
        );

      } else {

        await taskApi.create(payload);

      }

      setShowModal(false);

      loadTasks();

    } catch (err) {

      console.error(err);

      alert("Ошибка сохранения задачи");
    }
  }


  function openDeleteModal(task: Task) {

    setTaskToDelete(task);

    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {

    if (!taskToDelete) {
      return;
    }

    try {

      await taskApi.delete(taskToDelete.id);

      setIsDeleteModalOpen(false);

      setTaskToDelete(null);

      loadTasks();

    } catch (err) {

      console.error(err);

      alert("Ошибка удаления");
    }
  }


  async function handleComplete(task: Task) {

    try {

      await taskApi.complete(task.id);

      loadTasks();

    } catch (err) {

      console.error(err);

      alert("Ошибка обновления");
    }
  }


  function formatDate(date?: string) {

    if (!date) {
      return "Без даты";
    }

    return new Date(date)
      .toLocaleDateString("ru-RU");
  }


  return (
    <Layout>

      {/* HEADER */}

      <div className="header">

        <div>

          <h1>
            ✅ Задачи
          </h1>

          <p className="muted">
            Управляй учебными и личными задачами
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          Добавить задачу
        </button>

      </div>

      {/* FILTERS */}

      <div className="filter-tabs">

        {filters.map(item => (

          <button
            key={item.key}
            className={
              filter === item.key
                ? "filter-tab active"
                : "filter-tab"
            }
            onClick={() =>
              setFilter(item.key)
            }
          >

            {item.label}

            <span className="count">
              {
                counts[
                  item.key as keyof typeof counts
                ]
              }
            </span>

          </button>

        ))}

      </div>

      <TaskList
        filteredTasks={filteredTasks}
        subjects={subjects}
        loading={loading}
        formatDate={formatDate}
        formatStatus={formatStatus}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        handleComplete={handleComplete}
      />

      <TaskModals
        showModal={showModal}
        setShowModal={setShowModal}
        editingTask={editingTask}
        form={form}
        setForm={setForm}
        subjects={subjects}
        handleSubmit={handleSubmit}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        taskToDelete={taskToDelete}
        confirmDelete={confirmDelete}
      />

    </Layout>
  );
}