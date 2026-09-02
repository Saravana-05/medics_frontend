import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import DesktopMenuBar from "./components/DesktopMenuBar";
import DoctorDeskTagline from "./components/DoctorDeskTagline";
import EMedicBrandMark from "./components/EMedicBrandMark";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const quickActions = [
  { id: "appointments", label: "Out-patient appointments", route: "/op-appointments", position: "em-quick-action-1" },
  { id: "doctor-desk", label: "Doctor's desk", route: "/opdesk", position: "em-quick-action-2" },
  { id: "new-book", label: "Create a new book", route: "/register", position: "em-quick-action-3" },
  { id: "patients", label: "Patient management", position: "em-quick-action-4" },
  { id: "reports", label: "Reports", position: "em-quick-action-5" },
  { id: "settings", label: "Settings", position: "em-quick-action-6" },
  { id: "main-menu-2", label: "Main Menu 2", route: "/main-menu-2", position: "em-quick-action-7" },
];

function QuickActionTiles({ onAction }) {
  return (
    <div className="em-quick-actions" aria-label="Dashboard quick actions">
      {quickActions.map(action => (
        <button
          key={action.id}
          type="button"
          className={`em-quick-action ${action.position}`}
          aria-label={action.label}
          title={action.label}
          onClick={() => onAction(action)}
        >
          <span className="em-quick-action-label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Dashboard({ onLogout, hospitalImage = "/hospital-team.png" }) {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  // Keeps the icon accurate when fullscreen is exited via Esc or the
  // browser's own UI, not just this button.
  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const handleQuickAction = action => {
    if (action.route) {
      navigate(action.route);
      return;
    }

    window.dispatchEvent(new CustomEvent("em-dashboard-quick-action", {
      detail: { id: action.id, label: action.label },
    }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <main className="em-main-menu">
      <header className="em-title-bar">
        <span className="em-title">Trident Skiode</span>
        <button
          type="button"
          className="em-fullscreen-toggle"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </header>

      <DesktopMenuBar onLogout={onLogout} />

      <section className="em-workspace" aria-label="E-Medics main menu workspace">
        <span className="em-hospital-label">HOSPITAL</span>
        <img className="em-hospital-illustration" src={hospitalImage} alt="Hospital and medical team" />
        <EMedicBrandMark />
        <DoctorDeskTagline />
        <QuickActionTiles onAction={handleQuickAction} />
      </section>
    </main>
  );
}
