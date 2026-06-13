import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import {
  taskApi,
  subjectApi,
  habitApi,
  userApi,
  markOverdueTasksCancelled,
} from "../services/api";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import TodaySchedule from "../components/TodaySchedule";
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import CalendarPanel from "../components/CalendarPanel";
import TipCard from "../components/TipCard";

const START_DATE = new Date(2025, 8, 1);

function getWeekNumber(date: Date) {
  const diff =
    date.getTime() - START_DATE.getTime();

  return (
    Math.floor(
      diff / (1000 * 60 * 60 * 24 * 7)
    ) + 1
  );
}

function isEvenWeek(date: Date) {
  const week = getWeekNumber(date);
  return week % 2 === 0;
}

function getNormalizedDayOfWeek(
  date: Date
) {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function generateCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  );

  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 7 : startDay;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = [];

  for (let i = 1; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  return calendarDays;
}

export default function Dashboard() {
  const todayDate = new Date();

  const today =
    todayDate.toLocaleDateString(
      "ru-RU",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  const [userName, setUserName] = useState("Студент");

  const [tasks, setTasks] = useState<any[]>(
    []
  );

  const [subjects, setSubjects] =
    useState<any[]>([]);

  const [habits, setHabits] = useState<
    any[]
  >([]);

  const [habitLogs, setHabitLogs] =
    useState<
      Record<number, string[]>
    >({});

  const [loading, setLoading] =
    useState(true);

  async function loadData() {
    setLoading(true);

    try {
      const [tasksData, subjectsData, habitsData] = await Promise.all([
        taskApi.getAll(),
        subjectApi.getAll(),
        habitApi.getAll(),
      ]);

      try {
        await markOverdueTasksCancelled(tasksData || []);
        const refreshedTasks = await taskApi.getAll();
        const filteredTasks = refreshedTasks.filter(
          (task: any) =>
            task.status !== "CANCELLED" &&
            task.status !== "CANCELED"
        );

        setTasks(filteredTasks);
      } catch (e) {
        console.error("Auto-cancel overdue tasks failed:", e);
        const filteredTasks = tasksData.filter(
          (task: any) =>
            task.status !== "CANCELLED" &&
            task.status !== "CANCELED"
        );

        setTasks(filteredTasks);
      }
      setSubjects(subjectsData);
      setHabits(habitsData);

      const logsMap: Record<
        number,
        string[]
      > = {};

      await Promise.all(
        habitsData.map(
          async (habit: any) => {
            try {
              const logs =
                await habitApi.getLogs(
                  habit.id
                );

              logsMap[habit.id] =
                logs?.map(
                  (log: any) =>
                    typeof log ===
                    "string"
                      ? log
                      : log.date
                ) || [];
            } catch (e) {
              console.error(
                `Habit logs error ${habit.id}`,
                e
              );

              logsMap[habit.id] = [];
            }
          }
        )
      );

      setHabitLogs(logsMap);
    } catch (e) {
      console.error(
        "Dashboard load error:",
        e
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadUser() {
    try {
      const me = await userApi.getMe();
      setUserName(me?.name || "Студент");
    } catch (e) {
      console.error("User load error:", e);
    }
  }

  useEffect(() => {
    loadData();
    loadUser();
  }, []);

  const completedTasks = tasks.filter(
    (t) => t.status === "DONE"
  ).length;

  const cancelledTasks = tasks.filter(
    (t) =>
      t.status === "CANCELLED" ||
      t.status === "CANCELED"
  ).length;

  const overdueTasks = tasks.filter(
    (t) => t.status === "OVERDUE"
  ).length;

  const activeTasks = tasks.filter(
    (t) => t.status !== "DONE"
  ).length;

  const totalTasks = tasks.length;

  const totalHabits = habits.length;

  const todayString = todayDate
    .toISOString()
    .split("T")[0];

  const completedHabitsToday =
    habits.filter((habit) => {
      const logs =
        habitLogs[habit.id] || [];

      return logs.some((logDate) =>
        logDate.startsWith(todayString)
      );
    }).length;


  const noData =
    totalTasks === 0 &&
    totalHabits === 0;

  const habitsScore =
    totalHabits === 0
      ? 50
      : Math.round(
          (completedHabitsToday /
            totalHabits) *
            50
        );

  let tasksScore = 0;

  if (totalTasks === 0) {
    tasksScore = 50;
  } else {
    const doneWeight =
      completedTasks * 1;

    const activeWeight =
      (totalTasks -
        completedTasks -
        overdueTasks -
        cancelledTasks) *
      0.5;

    const overduePenalty =
      overdueTasks * 0.4;

    const cancelledPenalty =
      cancelledTasks * 0.7;

    const rawScore =
      doneWeight +
      activeWeight -
      overduePenalty -
      cancelledPenalty;

    const normalized =
      rawScore / totalTasks;

    tasksScore = Math.max(
      0,
      Math.min(
        50,
        Math.round(normalized * 50)
      )
    );
  }

  const productivity = noData
    ? null
    : Math.max(
        0,
        Math.min(
          100,
          habitsScore + tasksScore
        )
      );

  const dayOfWeek =
    getNormalizedDayOfWeek(
      todayDate
    );

  const evenWeek =
    isEvenWeek(todayDate);

  const todaySubjects =
    subjects.filter((s) => {
      if (s.dayOfWeek !== dayOfWeek)
        return false;

      if (s.weekType) {
        const isEven =
          s.weekType === "EVEN";

        if (isEven !== evenWeek)
          return false;
      }

      return true;
    });

  const upcomingTasks = tasks
    .filter((t) => t.deadline)
    .sort(
      (a, b) =>
        new Date(
          a.deadline
        ).getTime() -
        new Date(
          b.deadline
        ).getTime()
    )
    .slice(0, 4);

  const currentMonth =
    MONTHS[todayDate.getMonth()];

  const currentYear =
    todayDate.getFullYear();

  const calendarDays =
    generateCalendar(todayDate);

  if (loading) {
    return (
      <Layout>
        <div className="muted">
          Загрузка главного меню...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardHeader userName={userName} today={today} evenWeek={evenWeek} />

      <DashboardStats
        activeTasks={activeTasks}
        completedHabitsToday={completedHabitsToday}
        totalHabits={totalHabits}
        productivity={productivity}
      />

      <div className="grid">
        <div className="dashboard-col">
          <TodaySchedule todaySubjects={todaySubjects} todayDate={todayDate} />

          <UpcomingDeadlines upcomingTasks={upcomingTasks} />
        </div>

        <div className="dashboard-col">
          <CalendarPanel
            calendarDays={calendarDays}
            currentMonth={currentMonth}
            currentYear={currentYear}
            todayDate={todayDate}
          />

          <TipCard />
        </div>
      </div>
    </Layout>
  );
}