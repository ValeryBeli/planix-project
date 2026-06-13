import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <aside className="sidebar">
      <nav className="menu">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          📊 Главная
        </Link>
        <Link to="/schedule" className={linkClass("/schedule")}>
          📅 Расписание
        </Link>
        <Link to="/tasks" className={linkClass("/tasks")}>
          ✅ Задачи
        </Link>
        <Link to="/habits" className={linkClass("/habits")}>
          🔁 Привычки
        </Link>
        <Link to="/settings" className={linkClass("/settings")}>
          ⚙️ Настройки
        </Link>
      </nav>

    </aside>
  );
}