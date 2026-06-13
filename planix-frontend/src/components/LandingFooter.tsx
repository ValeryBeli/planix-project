import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">✨ Planix</div>
          <p className="muted">Умный тайм-менеджер для студентов КНИТУ</p>
        </div>

        <div className="footer-links">
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="muted">© 2026 Planix</p>
      </div>
    </footer>
  );
}
