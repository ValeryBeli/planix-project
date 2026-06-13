interface Props {
  todaySubjects: any[];
  todayDate: Date;
}

export default function TodaySchedule({ todaySubjects }: Props) {
  return (
    <>
      <div className="panel">
        <h3>📅 Расписание на сегодня</h3>

        {todaySubjects.length === 0 ? (
          <p className="muted">Нет пар сегодня</p>
        ) : (
          todaySubjects
            .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""))
            .map((s, i) => (
              <div className="item" key={i}>
                <span className="title">{s.name}</span>

                <div className="right-block">
                  <span className="room-block">{s.location || "Без аудитории"}</span>

                  <span className="time-block">
                    {s.startTime?.slice(0, 5)} – {s.endTime?.slice(0, 5)}
                  </span>
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}
