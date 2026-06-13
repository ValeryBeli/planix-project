import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="badge">🎓 Специально для студентов КНИТУ</span>

        <h1>
          Учись эффективно с <span className="gradient">Planix</span>
        </h1>

        <p className="hero-subtitle">
          Планируй расписание, отслеживай дедлайны и формируй полезные привычки — всё в одном месте. Бесплатно, без рекламы и сложностей.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">🚀 Начать бесплатно</Link>
          <a href="#features" className="btn btn-outline btn-lg">Узнать больше</a>
        </div>

        <div className="hero-stats">
          <div className="stat-item"><strong>500+</strong><span>студентов уже с нами</span></div>
          <div className="stat-item"><strong>100%</strong><span>бесплатно</span></div>
          <div className="stat-item"><strong>0</strong><span>рекламы</span></div>
        </div>
      </div>

      <div className="hero-image">
        <div className="mockup">
          <div className="mockup-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="mockup-body">
            <div className="mockup-sidebar" />
            <div className="mockup-main">
              <div className="mockup-stat" />
              <div className="mockup-stat" />
              <div className="mockup-stat" />
              <div className="mockup-item" />
              <div className="mockup-item" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
