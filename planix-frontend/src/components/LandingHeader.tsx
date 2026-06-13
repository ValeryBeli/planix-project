import { Link, useNavigate } from "react-router-dom";

export default function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className="header-global">
      <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>✨ Planix</div>

      <nav className="auth-links">
        <Link to="/login" className="btn btn-outline">Войти</Link>
        <Link to="/register" className="btn btn-primary">Начать бесплатно</Link>
      </nav>
    </header>
  );
}
