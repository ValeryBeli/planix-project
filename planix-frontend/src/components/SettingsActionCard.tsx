import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  danger?: boolean;
};

export default function SettingsActionCard({ icon, title, subtitle, onClick, danger }: Props) {
  return (
    <div className={`setting-card ${danger ? "danger" : ""}`} onClick={onClick}>
      <div className="setting-icon">{icon}</div>

      <div className="setting-text">
        <strong>{title}</strong>
        {subtitle && (
          <span className="muted" style={{ display: "block", marginTop: "4px" }}>
            {subtitle}
          </span>
        )}
      </div>

      <div className="setting-arrow">›</div>
    </div>
  );
}
