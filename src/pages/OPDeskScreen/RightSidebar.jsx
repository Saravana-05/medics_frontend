import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
const PANEL_WIDTH   = 900;
const SIDEBAR_WIDTH = 78;
const GAP           = 8;
const BOTTOM_MARGIN = 16;


export default function RightSidebar({ activePanel, onPanelChange, onHoverChange, patients, onSelectPatient }) {
  const [hoveredKey,  setHoveredKey]  = useState(null);
  const [sidebarLeft, setSidebarLeft] = useState(null);
  const [panelTop,    setPanelTop]    = useState(0);
  const [panelHeight, setPanelHeight] = useState(480);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  const sidebarRef = useRef(null);
  const popupRef   = useRef(null);

  const [removedEmergencyIds, setRemovedEmergencyIds] = useState([]);
  const [lastRemovedEmergency, setLastRemovedEmergency] = useState(null);
  const effectivePanelWidth = Math.min(activePanel === "schedule" ? 360 : PANEL_WIDTH, viewportWidth - SIDEBAR_WIDTH - GAP * 2);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      const rect = sidebarRef.current?.getBoundingClientRect();
      if (rect) {
        const top = Math.max(GAP, Math.min(rect.top, window.innerHeight - 200 - BOTTOM_MARGIN));
        setSidebarLeft(rect.left);
        setPanelTop(top);
        setPanelHeight(Math.max(120, window.innerHeight - top - BOTTOM_MARGIN));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleKey = activePanel;
  const isQueueModal = Boolean(activePanel && activePanel !== "schedule");

  useEffect(() => {
    if (!isQueueModal) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    popupRef.current?.focus();
    const handleKey = event => {
      if (event.key === "Escape") { event.preventDefault(); onPanelChange(null); }
      if (event.key !== "Tab") return;
      const controls = [...(popupRef.current?.querySelectorAll('button, input, select, summary, [tabindex="0"]') || [])];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) return;
      if (!controls.includes(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isQueueModal, onPanelChange]);

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
    const top = Math.max(GAP, Math.min(anchorTop, viewportH - 200 - BOTTOM_MARGIN));
    const available = viewportH - top - BOTTOM_MARGIN;

    setSidebarLeft(sidebarRect?.left ?? null);
    setPanelTop(top);
    setPanelHeight(Math.max(120, available));
    onPanelChange(tab.key === activePanel ? null : tab.key);
  };

  const renderPopup = () => {
    if (!visibleKey) return null;

    const rawLeft = sidebarLeft !== null
      ? sidebarLeft - effectivePanelWidth - GAP
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

    const contentHeight = isQueueModal ? Math.min(620, window.innerHeight - 32) : panelHeight;
    let content;
    switch (visibleKey) {
      case "parked":
        content = <ParkedPatientsPanel panelHeight={contentHeight} patients={patients} onSelectPatient={patient => { onSelectPatient?.(patient); onPanelChange(null); }} />;
        break;
      case "emergency":
        content = <EmergencyPatientsPanel panelHeight={contentHeight} patients={patients}
          removedIds={removedEmergencyIds} removedEntry={lastRemovedEmergency}
          onRemove={patient => { setRemovedEmergencyIds(ids => [...ids, patient.id]); setLastRemovedEmergency(patient); }}
          onUndo={() => { setRemovedEmergencyIds(ids => ids.filter(id => id !== lastRemovedEmergency.id)); setLastRemovedEmergency(null); }}
          onSelectPatient={patient => { onSelectPatient?.(patient); onPanelChange(null); }} />;
        break;
      case "reports":
        content = <ReportsPanel panelHeight={contentHeight} patients={patients} onSelectPatient={patient => { onSelectPatient?.(patient); onPanelChange(null); }} />;
        break;
      case "schedule":
        content = <SchedulePanel panelHeight={contentHeight} />;
        break;
      default:
        return null;
    }

    if (isQueueModal) return createPortal(
      <div className="patient-queue-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onPanelChange(null); }}>
        <div ref={popupRef} role="dialog" aria-modal="true" aria-label={`${RIGHT_TABS.find(tab => tab.key === visibleKey)?.label} patients`} tabIndex={-1} className="patient-queue-modal" style={{ width: Math.min(PANEL_WIDTH, viewportWidth - 24), height: contentHeight }}>
          {content}
          <button type="button" onClick={() => onPanelChange(null)} aria-label="Close panel" className="patient-queue-modal__close">Close</button>
        </div>
      </div>, document.body
    );

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
