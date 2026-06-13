import { Link } from "react-router-dom";

export default function KnituSection() {
  return (
    <section className="knitu-section">
      <div className="knitu-content">
        <span className="badge badge-secondary">🎯 Для студентов КНИТУ</span>

        <h2>Твой учебный год под контролем</h2>

        <p className="muted">Planix создан, чтобы облегчить учёбу и планирование повседневных задач.</p>

        <Link to="/register" className="btn btn-primary btn-lg">Присоединиться</Link>
      </div>
    </section>
  );
}
