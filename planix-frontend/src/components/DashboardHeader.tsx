interface Props {
  userName: string;
  today: string;
  evenWeek: boolean;
}

export default function DashboardHeader({ userName, today, evenWeek }: Props) {
  return (
    <div className="header">
      <div>
        <h1>Привет, {userName}! 👋</h1>

        <p className="muted">
          Сегодня, {today} • {evenWeek ? "Чётная неделя" : "Нечётная неделя"}
        </p>
      </div>
    </div>
  );
}
