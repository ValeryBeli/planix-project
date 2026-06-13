import { Link } from "react-router-dom";

export default function AuthHeader() {
  return (
    <header className="header-global">
      <Link to="/" className="logo">
        ✨ Planix
      </Link>

      <nav className="auth-links">
        <Link to="/register" className="btn btn-outline">
          Регистрация
        </Link>
        <Link to="/login" className="btn btn-primary">
          Войти
        </Link>
      </nav>
    </header>
  );
}