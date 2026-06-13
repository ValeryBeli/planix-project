export default function LandingFeatures() {
  return (
    <section id="features" className="features">
      <div className="section-header">
        <h2>Почему студенты выбирают Planix?</h2>
        <p className="muted">Инструменты, которые реально помогают в учёбе</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Умное расписание</h3>
          <p>Добавляй пары, аудитории и преподавателей.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Задачи и дедлайны</h3>
          <p>Не пропусти важные сроки и контрольные.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔁</div>
          <h3>Привычки</h3>
          <p>Формируй полезные учебные привычки.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Статистика</h3>
          <p>Отслеживай выполненные задачи, время подготовки и продуктивность в удобных графиках.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔔</div>
          <h3>Импорт расписания</h3>
          <p>Загрузи расписание в один клик.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Безопасность</h3>
          <p>Твоё расписание и задачи хранятся только у тебя.</p>
        </div>
      </div>
    </section>
  );
}
