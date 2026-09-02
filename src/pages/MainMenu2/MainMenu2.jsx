import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import "./mainMenu2.css";

const shortcuts = [
  { number: "01", label: "Appointment", color: "#35649d", route: "/op-appointments" },
  { number: "02", label: "Doctor's Desk", color: "#86c93a", route: "/opdesk" },
  { number: "03", label: "IP Management", color: "#df582f" },
  { number: "04", label: "IP Nurse Desk", color: "#ef1829" },
  { number: "05", label: "Lab Service", color: "#7158a6" },
  { number: "06", label: "Medical Service", color: "#09a8aa" },
  { number: "07", label: "Daily Schedule", color: "#3f8f79" },
  { number: "08", label: "House-keeping", color: "#b9722a" },
  { number: "09", label: "Referrals", color: "#547795" },
];

export default function MainMenu2({ onLogout }) {
  const navigate = useNavigate();

  const openShortcut = shortcut => {
    if (shortcut.route) {
      navigate(shortcut.route);
      return;
    }
    window.dispatchEvent(new CustomEvent("em-main-menu-2-action", { detail: shortcut }));
  };

  return (
    <main className="mm2-screen">
      <div className="mm2-body">
        <aside className="mm2-shortcut-rail" aria-label="Daily Functionality">
          <h1>Daily Functionality</h1>
          <nav className="mm2-shortcuts">
            {shortcuts.map((shortcut, index) => {
              const numberFirst = index % 2 === 0;
              return (
                <button
                  type="button"
                  className={`mm2-shortcut ${numberFirst ? "number-first" : "label-first"}`}
                  style={{ "--shortcut-color": shortcut.color }}
                  key={shortcut.number}
                  onClick={() => openShortcut(shortcut)}
                  title={shortcut.label}
                >
                  <span className="mm2-number">{shortcut.number}</span>
                  <span className="mm2-label">{shortcut.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>
        <section className="mm2-workspace" aria-label="Main Menu 2 workspace">
          <Dashboard onLogout={onLogout} hospitalImage="/Team2-enhanced.png" />
        </section>
      </div>
    </main>
  );
}
