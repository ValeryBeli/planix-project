import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userApi } from "../../services/api";

export default function Header() {
  const [userName, setUserName] = useState("Студент");

  async function loadUser() {
    try {
      const me = await userApi.getMe();
      setUserName(me?.name || "Студент");
    } catch (e) {
      console.error("User load error:", e);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  const firstLetter = userName?.[0]?.toUpperCase() || "С";

  return (
    <header className="header-global">
      <Link to="/" className="logo">
        ✨ Planix
      </Link>

      <nav className="auth-links">
        <span className="muted">
          Привет, {userName}!
        </span>

        <div className="avatar">
          {firstLetter}
        </div>
      </nav>
    </header>
  );
}