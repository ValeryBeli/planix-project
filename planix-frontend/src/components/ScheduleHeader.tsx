type Props = {
  currentWeekType: "ODD" | "EVEN";
  weekOffset: number;
  setWeekOffset: (n: number) => void;
  setIsImportModalOpen: (v: boolean) => void;
  setIsClearModalOpen: (v: boolean) => void;
  setIsCreateModalOpen: (v: boolean) => void;
};

export default function ScheduleHeader({
  currentWeekType,
  setWeekOffset,
  setIsImportModalOpen,
  setIsClearModalOpen,
  setIsCreateModalOpen,
}: Props) {
  return (
    <div className="header">
      <div>
        <h1>📅 Расписание</h1>

        <p className="muted">
          Сейчас {currentWeekType === "ODD" ? "нечётная" : "чётная"} неделя
        </p>
      </div>

      <div className="header-actions">
        <button className="btn btn-outline" onClick={() => setWeekOffset(-1)}>←</button>
        <button className="btn btn-outline" onClick={() => setWeekOffset(0)}>Текущая неделя</button>
        <button className="btn btn-outline" onClick={() => setWeekOffset(1)}>→</button>

        <button className="btn btn-outline" onClick={() => setIsImportModalOpen(true)}>
          Импорт расписания
        </button>

        <button className="btn btn-outline" onClick={() => setIsClearModalOpen(true)}>
          Очистить все
        </button>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          Добавить предмет
        </button>
      </div>
    </div>
  );
}
