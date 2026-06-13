interface Props {
  activeTasks: number;
  completedHabitsToday: number;
  totalHabits: number;
  productivity: number | null;
}

export default function DashboardStats({ activeTasks, completedHabitsToday, totalHabits, productivity }: Props) {
  return (
    <div className="stats">
      <div className="stat">
        <p>📌 Активные задачи</p>
        <h2>{activeTasks}</h2>
      </div>

      <div className="stat">
        <p>🔁 Привычек выполнено</p>
        <h2>
          {completedHabitsToday} / {totalHabits}
        </h2>
      </div>

      <div className="stat">
        <p>🎯 Продуктивность</p>
        <h2>{productivity === null ? "Нет данных" : `${productivity}%`}</h2>
      </div>
    </div>
  );
}
