import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import { authApi } from "../services/api";

export default function Recover() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

    async function handleRecover(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await authApi.recoverPassword(email);

      setMessage(res.message || "Письмо отправлено!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (e) {
      setError("Ошибка при отправке письма");
      setMessage("");
    }
  }

 return (
    <>
      <AuthHeader />

      <div className="auth-wrapper">
        <div className="card auth-card">
          <div className="auth-top">
            <div className="auth-icon">🔐</div>

            <h2>Восстановление пароля</h2>

            <p className="muted auth-subtitle">
              Введите email, привязанный к аккаунту.
              Мы отправим вам новый пароль.
            </p>
          </div>

          <form className="form" onSubmit={handleRecover}>
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit">
              Отправить письмо
            </button>

            {message && (
              <div className="success-box">
                {message}
              </div>
            )}

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}
          </form>

          <div className="auth-footer">
            <button
              className="back-link"
              onClick={() => navigate("/login")}
              type="button"
            >
              ← Вернуться ко входу
            </button>
          </div>
        </div>
      </div>
    </>
  );
}