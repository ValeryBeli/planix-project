interface Props {
  upcomingTasks: any[];
}

export default function UpcomingDeadlines({ upcomingTasks }: Props) {
  return (
    <div className="panel">
      <h3>⏰ Ближайшие дедлайны</h3>

      {upcomingTasks.length === 0 ? (
        <p className="muted">Нет дедлайнов</p>
      ) : (
        upcomingTasks.map((t) => {
          const daysLeft = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div key={t.id} className={`deadline ${daysLeft <= 2 ? "urgent" : daysLeft <= 7 ? "soon" : "ok"}`}>
              <span className="date">
                {new Date(t.deadline).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
              </span>

              <div className="info">
                <strong>{t.title}</strong>

                <span>Осталось {daysLeft} дн.</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
