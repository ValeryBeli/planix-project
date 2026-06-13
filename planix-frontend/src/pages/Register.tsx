import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import { authApi } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      await authApi.register(name, email, password);
      navigate("/login");

    } catch (err: any) {
      setError("Ошибка регистрации");
    }
  }

  return (
    <>
      <AuthHeader />

      <div className="auth-wrapper">
        <div className="card">
          <div className="logo-local">
            <h1>Planix</h1>
            <p className="muted">
              Создай аккаунт и получи доступ ко всем функциям
            </p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label>Имя</label>
            <input
              type="text"
              placeholder="Иван Иванов"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

            <label>Повтор пароля</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Зарегистрироваться</button>
          </form>

          <div className="footer">
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}