import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import { authApi } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await authApi.login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      navigate("/dashboard");

    } catch (err: any) {
      setError("Неверный логин или пароль");
    }
  }

  return (
    <>
      <AuthHeader />

      <div className="auth-wrapper">
        <div className="card">
          <div className="logo-local">
            <h1>Planix</h1>
            <p className="muted">Твой учебный тайм-менеджер</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Войти в аккаунт</button>

            <div className="forgot-password">
              <Link to="/recover">Забыли пароль?</Link>
            </div>
          </form>

          <div className="footer">
            <p>
              Нет аккаунта? <Link to="/register">Регистрация</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}