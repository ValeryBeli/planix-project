import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { habitApi } from "../services/api";
import type { Habit } from "../types/habit";
import HabitList from "../components/HabitList";
import HabitsModals from "../components/HabitsModals";


function getCurrentStreak(
  habitId: number,
  logs: Record<number, string[]>
) {
  const habitLogs = new Set(logs[habitId] || []);

  const days: string[] = [];

  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);

    d.setDate(today.getDate() - i);

    days.push(d.toISOString().split("T")[0]);
  }

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

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const [logs, setLogs] = useState<Record<number, string[]>>({});

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [showStatsModal, setShowStatsModal] =
    useState(false);

  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("asc");

  const [editingHabit, setEditingHabit] =
    useState<Habit | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [habitToDelete, setHabitToDelete] =
    useState<Habit | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  async function refresh() {
    try {
      const data = await habitApi.getAll();

      setHabits(data);

      await loadLogs(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadLogs(habitsList: Habit[]) {
    try {
      const result: Record<number, string[]> = {};

      await Promise.all(
        habitsList.map(async (habit) => {
          const data = await habitApi.getLogs(habit.id);

          result[habit.id] = (data || []).map((l: any) =>
            (typeof l === "string" ? l : l.date).split("T")[0]
          );
        })
      );

      setLogs(result);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadHabits() {
    setLoading(true);

    try {
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHabits();
  }, []);

  const sortedHabits = [...habits].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name, "ru");
    }

    return b.name.localeCompare(a.name, "ru");
  });

  const weekChartData = useMemo(() => {
    return getWeekDays().map((date) => {
      const doneCount = habits.filter((habit) =>
        (logs[habit.id] || []).includes(date)
      ).length;

      return {
        date,
        doneCount,
      };
    });
  }, [habits, logs]);

  const chartMax = Math.max(
    1,
    ...weekChartData.map((d) => d.doneCount)
  );

  function openEditModal(habit: Habit) {
    setEditingHabit(habit);

    setForm({
      name: habit.name,
      description: habit.description || "",
    });

    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingHabit) {
        await habitApi.update(editingHabit.id, form);
      } else {
        await habitApi.create(form);
      }

      setShowModal(false);

      setEditingHabit(null);

      setForm({
        name: "",
        description: "",
      });

      await refresh();
    } catch (e) {
      console.error(e);
    }
  }

  function openDeleteModal(habit: Habit) {
    setHabitToDelete(habit);

    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!habitToDelete) return;

    try {
      await habitApi.delete(habitToDelete.id);

      setIsDeleteModalOpen(false);

      setHabitToDelete(null);

      await refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleLog(
    habitId: number,
    date: string
  ) {
    try {
      const habitLogs = logs[habitId] || [];

      const exists = habitLogs.includes(date);

      if (exists) {
        await habitApi.deleteLog(habitId, date);
      } else {
        await habitApi.addLog(habitId, date);
      }

      await refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async function markAllToday() {
    try {
      const today = new Date()
        .toISOString()
        .split("T")[0];

      if (habits.length === 0) return;

      const allMarked = habits.every((h) => {
        const habitLogs = logs[h.id] || [];

        return habitLogs.includes(today);
      });

      if (allMarked) {
        await Promise.all(
          habits.map(async (habit) => {
            await habitApi.deleteLog(habit.id, today);
          })
        );
      } else {
        await Promise.all(
          habits.map(async (habit) => {
            const habitLogs = logs[habit.id] || [];

            if (!habitLogs.includes(today)) {
              await habitApi.addLog(habit.id, today);
            }
          })
        );
      }

      await refresh();
    } catch (e) {
      console.error(e);
    }
  }

  function getStats() {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    let doneToday = 0;

    let maxStreak = 0;

    habits.forEach((h) => {
      const habitLogs = logs[h.id] || [];

      if (habitLogs.includes(today)) {
        doneToday++;
      }

      const streak = getCurrentStreak(h.id, logs);

      if (streak > maxStreak) {
        maxStreak = streak;
      }
    });

    return {
      total: habits.length,
      doneToday,
      maxStreak,
    };
  }

  const stats = getStats();

  return (
    <Layout>
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>🔁 Привычки</h1>

          <p className="muted">
            Формируй полезные ритуалы
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn btn-outline"
            onClick={markAllToday}
          >
            Отметить все как выполненное
          </button>

          <button
            className="btn btn-outline"
            onClick={() => setShowStatsModal(true)}
          >
            Показать статистику
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingHabit(null);

              setForm({
                name: "",
                description: "",
              });

              setShowModal(true);
            }}
          >
            Добавить привычку
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="habits-stats">

        <div className="stat-card">
          <span className="stat-icon">✅</span>

          <div>
            <strong>{stats.doneToday}</strong>

            <span className="muted">
              Выполнено сегодня
            </span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔥</span>

          <div>
            <strong>{stats.maxStreak}</strong>

            <span className="muted">
              Лучшая серия 
            </span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📌</span>

          <div>
            <strong>{stats.total}</strong>

            <span className="muted">
              Всего привычек
            </span>
          </div>
        </div>

        
      </div>

      {/* LIST HEADER */}
      <div className="habits-list-header">
        <h3 className="section-title">
          Список привычек
        </h3>

        <button
          className="btn btn-outline btn-sm"
          onClick={() =>
            setSortOrder((p) =>
              p === "asc" ? "desc" : "asc"
            )
          }
        >
          {sortOrder === "asc"
            ? "🔽 А-Я"
            : "🔽 Я-А"}
        </button>
      </div>

      {/* LIST */}
      
      <HabitList
        habits={sortedHabits}
        logs={logs}
        toggleLog={toggleLog}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        loading={loading}
      />

      <HabitsModals
        showStatsModal={showStatsModal}
        setShowStatsModal={setShowStatsModal}
        weekChartData={weekChartData}
        chartMax={chartMax}
        habits={habits}
        logs={logs}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        habitToDelete={habitToDelete}
        confirmDelete={confirmDelete}
        showModal={showModal}
        setShowModal={setShowModal}
        editingHabit={editingHabit}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
      />
    </Layout>
  );
}