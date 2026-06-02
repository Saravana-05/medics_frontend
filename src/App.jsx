// App.jsx
import { useState } from "react";
import AppRouter from "./routes/Router";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => setUser(null);

  return <AppRouter user={user} onLogin={handleLogin} onLogout={handleLogout} />;
}