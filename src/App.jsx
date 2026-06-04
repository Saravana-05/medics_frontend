// App.jsx
import { useState } from "react";
import AppRouter from "./routes/Router";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved =
        localStorage.getItem("medix_user") ||
        sessionStorage.getItem("medix_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (u, rememberMe = false) => {
    setUser(u);
    if (rememberMe) {
      localStorage.setItem("medix_user", JSON.stringify(u));
    } else {
      sessionStorage.setItem("medix_user", JSON.stringify(u));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("medix_user");
    sessionStorage.removeItem("medix_user");
  };

  return <AppRouter user={user} onLogin={handleLogin} onLogout={handleLogout} />;
}