import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import ParkedPatientsPanel from "./ParkedPatientsPanel";
import EmergencyPatientsPanel from "./EmergencyPatientsPanel";
import ReportsPanel from "./ReportsPanel";
import SchedulePanel from "./SchedulePanel";

const RIGHT_TABS = [
  {
    key: "parked",
    label: "Parked",
    shortcut: "d",
    color: "#eb6367",
  },
  {
    key: "emergency",
    label: "Emergency",
    shortcut: "g",
    color: "#73bfb8",
  },
  {
    key: "reports",
    label: "Reports",
    shortcut: "t",
    color: "#679cbc",
  },
  {
    key: "schedule",
    label: "Schedule",
    shortcut: "h",
    color: "#0c324a",
  },
];

function ShortcutLabel({ label, shortcut }) {
  const index = label.toLowerCase().lastIndexOf(shortcut);
  return <>{label.slice(0, index)}<span style={{ textDecorationLine: "underline", textDecorationThickness: "1px", textUnderlineOffset: "2px" }}>{label[index]}</span>{label.slice(index + 1)}</>;
}

// ── Shared dimensions ───────────────────────────────────────────────
const PANEL_WIDTH   = 360;
const SIDEBAR_WIDTH = 78;
const GAP           = 8;
const BOTTOM_MARGIN = 16;

// Translucent tint of a token color (works with CSS variables). pct like "14%".
const tint = (color, pct) => `color-mix(in srgb, ${color} ${pct}, transparent)`;

export default function RightSidebar({ activePanel, onPanelChange, onHoverChange }) {
  const [hoveredKey,  setHoveredKey]  = useState(null);
  const [panelTop,    setPanelTop]    = useState(0);
  const [panelHeight, setPanelHeight] = useState(480);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  const sidebarRef = useRef(null);
  const popupRef   = useRef(null);

  const isTabletView = viewportWidth < 1024;
  const effectivePanelWidth = Math.min(PANEL_WIDTH, viewportWidth - SIDEBAR_WIDTH - GAP * 2);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleKey = activePanel;

  // Notify parent of the HOVERED tab only, so TopBarSection's accent bar
  // shows solely on hover (panels themselves still open on click).
  useEffect(() => {
    onHoverChange && onHoverChange(hoveredKey);
  }, [hoveredKey, onHoverChange]);

  // Click outside to close (panels are click-to-open now)
  useEffect(() => {
    if (!activePanel) return;
    const handleOutside = (e) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target) &&
        sidebarRef.current && !sidebarRef.current.contains(e.target)
      ) {
        onPanelChange(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [activePanel, onPanelChange]);

  // Click handler: computes panel geometry AND toggles activePanel
  const handleTabActivate = (e, tab) => {
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const anchorTop   = sidebarRect ? sidebarRect.top : e.currentTarget.getBoundingClientRect().top;
    const viewportH   = window.innerHeight || 800;
    const available   = viewportH - anchorTop - BOTTOM_MARGIN;

    setPanelTop(anchorTop);
    setPanelHeight(Math.max(200, available));
    onPanelChange(tab.key === activePanel ? null : tab.key);
  };

  const renderPopup = () => {
    if (!visibleKey) return null;

    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const rawLeft = sidebarRect
      ? sidebarRect.left - effectivePanelWidth - GAP
      : viewportWidth - SIDEBAR_WIDTH - effectivePanelWidth - GAP;
    const panelLeft = Math.max(GAP, rawLeft);

    const wrapperStyle = {
      position: "fixed",
      zIndex:   80,
      top:      panelTop,
      left:     panelLeft,
      width:    effectivePanelWidth,
      height:   panelHeight,
    };

    let content = null;
    switch (visibleKey) {
      case "parked":
        content = <ParkedPatientsPanel panelHeight={panelHeight} />;
        break;
      case "emergency":
        content = <EmergencyPatientsPanel panelHeight={panelHeight} />;
        break;
      case "reports":
        content = <ReportsPanel panelHeight={panelHeight} />;
        break;
      case "schedule":
        content = <SchedulePanel panelHeight={panelHeight} />;
        break;
      default:
        return null;
    }

    return (
      <div ref={popupRef} className="opdesk-drawer-shell" style={wrapperStyle}>
        {content}
        <button
          onClick={() => onPanelChange(null)}
          aria-label="Close panel"
          className="absolute flex items-center justify-center rounded-full active:scale-90 transition-transform"
          style={{
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            background: "rgba(255,255,255,0.92)",
            color: "var(--color-text-base)",
            boxShadow: "0 1px 5px rgba(0,0,0,0.25)",
          }}
        >
          <X size={17} />
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className="flex flex-col flex-shrink-0 items-center h-full"
        style={{
          width: `${SIDEBAR_WIDTH}px`,
          background: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border)",
        }}
      >
        {RIGHT_TABS.map((tab) => {
          const isActive  = activePanel === tab.key;
          const isLit     = isActive;

          return (
            <button
              type="button"
              key={tab.key}
              data-page-shortcut={tab.shortcut}
              aria-label={`${tab.label} (Alt+${tab.shortcut.toUpperCase()})`}
              onClick={(e) => handleTabActivate(e, tab)}
              onMouseEnter={() => setHoveredKey(tab.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="relative cursor-pointer flex-1 flex items-center justify-center w-full active:scale-95 transition-transform"
              style={{
                minHeight: "52px",
                background: tab.color,
                border: "none",
                padding: 0,
                opacity: isLit ? 1 : 0.92,
                borderBottom: "2px solid var(--color-surface)",
                boxShadow: isActive ? "inset 0 0 0 2px rgba(255,255,255,0.85)" : "none",
              }}
            >
              <span
  className="text-center leading-tight px-1"
  style={{
    fontSize: "0.78rem",
    fontWeight: isLit ? 700 : 600,
    color: "#ffffff",
    letterSpacing: "0.05em",
    textShadow: isLit
      ? "0 3px 3px rgba(0, 0, 0, 0.45), 0 1px 1px rgba(0, 0, 0, 0.3)"
      : "0 3px 2px rgba(0, 0, 0, 0.35)",
  }}
>
  <ShortcutLabel label={tab.label} shortcut={tab.shortcut} />
</span>
            </button>
          );
        })}
      </div>

      {renderPopup()}
    </>
  );
}
