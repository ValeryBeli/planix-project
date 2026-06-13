import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/authentication.css";
import "./styles/components.css";
import "./styles/dashboard.css";
import "./styles/habits.css";
import "./styles/landing.css";
import "./styles/layout.css";
import "./styles/modals.css";
import "./styles/reset.css";
import "./styles/schedule.css";
import "./styles/settings.css";
import "./styles/tasks.css";
import "./styles/utilities-responsive.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
