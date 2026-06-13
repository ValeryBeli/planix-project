interface Props {
  calendarDays: (number | null)[];
  currentMonth: string;
  currentYear: number;
  todayDate: Date;
}

export default function CalendarPanel({ calendarDays, currentMonth, currentYear, todayDate }: Props) {
  return (
    <div className="panel">
      <h3>🗓 Календарь</h3>

      <div className="calendar">
        <div className="month">{currentMonth} {currentYear}</div>

        <div className="days">
          <div className="day weekday">Пн</div>
          <div className="day weekday">Вт</div>
          <div className="day weekday">Ср</div>
          <div className="day weekday">Чт</div>
          <div className="day weekday">Пт</div>
          <div className="day weekday">Сб</div>
          <div className="day weekday">Вс</div>

          {calendarDays.map((day, index) => (
            <div key={index} className={`day ${day === todayDate.getDate() ? "today" : ""} ${!day ? "empty" : ""}`}>
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
