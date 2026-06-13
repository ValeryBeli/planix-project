import { useState } from "react";
import Layout from "../components/layout/Layout";
import { authApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import SettingsPassword from "../components/SettingsPassword";
import SettingsActionCard from "../components/SettingsActionCard";

type ChangePasswordState = {
  oldPassword: string;
  newPassword: string;
};

export default function Settings() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ChangePasswordState>({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleChangePassword() {
    try {
      await authApi.changePassword(form);

      setMessage("Пароль успешно изменён");
      setError("");
      setForm({ oldPassword: "", newPassword: "" });
    } catch {
      setError("Ошибка: проверьте старый пароль");
      setMessage("");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleSwitchAccount() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <Layout>
      <div className="settings-page">
        <div className="header">
          <div>
            <h1>⚙️ Настройки</h1>
            <p className="muted">Управление аккаунтом и безопасностью</p>
          </div>
        </div>

        <div className="settings-list">
          <SettingsPassword form={form} onChange={handleInputChange} onSave={handleChangePassword} message={message} error={error} />

          <SettingsActionCard icon={"🔄"} title={"Сменить аккаунт"} subtitle={"Войти в другой аккаунт"} onClick={handleSwitchAccount} />

          <SettingsActionCard icon={"🚪"} title={"Выйти"} subtitle={"Завершить текущую сессию"} onClick={handleLogout} danger />
        </div>
      </div>
    </Layout>
  );
}