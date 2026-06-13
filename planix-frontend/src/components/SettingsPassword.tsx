import React from "react";

type Props = {
  form: { oldPassword: string; newPassword: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => Promise<void> | void;
  message: string;
  error: string;
};

export default function SettingsPassword({ form, onChange, onSave, message, error }: Props) {
  return (
    <div className="setting-card wide-card">
      <div className="setting-icon">🔐</div>

      <div className="setting-text">
        <strong>Сменить пароль</strong>

        <span className="muted" style={{ display: "block", marginTop: "4px" }}>
          Обновите пароль для безопасности
        </span>

        <div className="settings-form">
          <input name="oldPassword" type="password" placeholder="Старый пароль" value={form.oldPassword} onChange={onChange} />
          <input name="newPassword" type="password" placeholder="Новый пароль" value={form.newPassword} onChange={onChange} />

          <button className="btn btn-primary" onClick={onSave} disabled={!form.oldPassword || !form.newPassword}>
            Сохранить
          </button>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    </div>
  );
}
