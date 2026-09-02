import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import DesktopMenuBar from "./components/DesktopMenuBar";
import DoctorDeskTagline from "./components/DoctorDeskTagline";
import EMedicBrandMark from "./components/EMedicBrandMark";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

// Same grid, same 7 tiles, same positions as before. Only tiles 1-6 (the
// plain color squares) take part in the swap — colorSlot indexes into
// SWAP_COLORS below, copied verbatim from their old fixed backgrounds
// (tiles 1/2/3 started on the same default slot, 4/5/6 each had their own).
// Tile 7 ("Main Menu 2") is the one labeled button, not a plain square — its
// dark-navy color was never one of the 6 squares, so it's excluded from the
// swap entirely and keeps its own fixed color via CSS.
const quickActions = [
  { id: "appointments", label: "Out-patient appointments", route: "/op-appointments", position: "em-quick-action-1", colorSlot: 0 },
  { id: "doctor-desk", label: "Doctor's desk", route: "/opdesk", position: "em-quick-action-2", colorSlot: 0 },
  { id: "new-book", label: "Create a new book", route: "/register", position: "em-quick-action-3", colorSlot: 0 },
  { id: "patients", label: "Patient management", position: "em-quick-action-4", colorSlot: 1 },
  { id: "reports", label: "Reports", position: "em-quick-action-5", colorSlot: 2 },
  { id: "settings", label: "Settings", position: "em-quick-action-6", colorSlot: 3 },
  { id: "main-menu-2", label: "Main Menu 2", route: "/main-menu-2", position: "em-quick-action-7" },
];

// The 4 colors the 6 plain squares have always used — swapping only ever
// cycles through these, never introduces a new one and never touches navy.
const SWAP_COLORS = [
  { background: "linear-gradient(135deg,#d9f4f4 0%,#b8e4e4 70%,#a5d6d6 100%)", text: "#173f72" },
  { background: "linear-gradient(135deg,#72c7c7,#48b0b2)", text: "#fff" },
  { background: "linear-gradient(135deg,#70c8c7,#44afb0)", text: "#fff" },
  { background: "linear-gradient(135deg,#16a7ab,#008d91)", text: "#fff" },
];

function QuickActionTiles({ onAction }) {
  // Advancing the slider shifts every square's color by one step through
  // SWAP_COLORS — the grid layout and tile positions never change, only
  // which of the 4 existing colors each square currently shows.
  const [offset, setOffset] = useState(0);

  return (
    <div className="em-quick-actions-carousel">
      <div className="em-quick-actions" aria-label="Dashboard quick actions">
        {quickActions.map(action => {
          const colorStyle = action.colorSlot === undefined
            ? {}
            : (() => {
                const { background, text } = SWAP_COLORS[(action.colorSlot + offset) % SWAP_COLORS.length];
                return { background, color: text };
              })();
          return (
            <button
              key={action.id}
              type="button"
              className={`em-quick-action ${action.position}`}
              style={colorStyle}
              aria-label={action.label}
              title={action.label}
              onClick={() => onAction(action)}
            >
              <span className="em-quick-action-label">{action.label}</span>
            </button>
          );
        })}
      </div>

      <div className="em-quick-carousel-dots" role="tablist" aria-label="Color slides">
        {SWAP_COLORS.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`em-quick-carousel-dot ${i === offset ? "is-active" : ""}`}
            style={{ "--dot-color": c.background }}
            onClick={() => setOffset(i)}
            role="tab"
            aria-selected={i === offset}
            aria-label={`Swap to color slide ${i + 1}`}
          />
        ))}
      </div>
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
        <span className="em-border-frame" aria-hidden="true" />
        <span className="em-border-frame-shadow" aria-hidden="true" />
        <span className="em-hospital-label">HOSPITAL</span>
        <img className="em-hospital-illustration" src={hospitalImage} alt="Hospital and medical team" />
        <EMedicBrandMark />
        <DoctorDeskTagline />
        <QuickActionTiles onAction={handleQuickAction} />
      </section>
    </main>
  );
}
