import { useState, useRef, useCallback, useEffect } from "react";
import { 
  ParkingCircle, AlertTriangle, FileText, CalendarClock
} from "lucide-react";
import ParkedPatientsPanel from "./ParkedPatientsPanel";
import EmergencyPatientsPanel from "./EmergencyPatientsPanel";
import ReportsPanel from "./ReportsPanel";
import SchedulePanel from "./SchedulePanel";

const RIGHT_TABS = [
  { 
    key: "parked", 
    label: "Parked", 
    icon: ParkingCircle,
    color: "var(--color-warning)",
    lightColor: "#fef3e2",
    defaultBg: "#d97706",
    defaultIconColor: "white",
    badge: "3"
  },
  { 
    key: "emergency", 
    label: "Emergency", 
    icon: AlertTriangle,
    color: "var(--color-danger)",
    lightColor: "#fee2e2",
    defaultBg: "#dc2626",
    defaultIconColor: "white",
    badge: "2"
  },
  { 
    key: "reports", 
    label: "Reports", 
    icon: FileText,
    color: "var(--color-primary)",
    lightColor: "var(--color-primary-muted)",
    defaultBg: "var(--color-primary)",
    defaultIconColor: "white",
    badge: "5"
  },
  { 
    key: "schedule", 
    label: "Schedule", 
    icon: CalendarClock,
    color: "var(--color-drugs)",
    lightColor: "var(--color-drugs-light)",
    defaultBg: "var(--color-drugs)",
    defaultIconColor: "white",
    badge: "8"
  },
];

// ── Shared dimensions ───────────────────────────────────────────────
const PANEL_WIDTH   = 360;
const SIDEBAR_WIDTH = 48;
const GAP           = 8;
const BOTTOM_MARGIN = 16;

export default function RightSidebar({ activePanel, onPanelChange }) {
  const [hoveredKey,  setHoveredKey]  = useState(null);
  const [panelTop,    setPanelTop]    = useState(0);
  const [panelHeight, setPanelHeight] = useState(480);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  const sidebarRef = useRef(null);
  const popupRef   = useRef(null);
  const hideTimer  = useRef(null);

  const isTabletView = viewportWidth < 1024;
  const effectivePanelWidth = Math.min(PANEL_WIDTH, viewportWidth - SIDEBAR_WIDTH - GAP * 2);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleKey = isTabletView ? activePanel : hoveredKey;

  // Tap outside to close on tablet
  useEffect(() => {
    if (!isTabletView || !activePanel) return;
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
  }, [isTabletView, activePanel, onPanelChange]);

  const clearHideTimer = () => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  };

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimer.current = setTimeout(() => setHoveredKey(null), 150);
  }, []);

  const handleIconMouseEnter = (e, key) => {
    clearHideTimer();
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const anchorTop   = sidebarRect ? sidebarRect.top : e.currentTarget.getBoundingClientRect().top;
    const viewportH   = window.innerHeight || 800;
    const available   = viewportH - anchorTop - BOTTOM_MARGIN;

    setPanelTop(anchorTop);
    setPanelHeight(Math.max(200, available));
    setHoveredKey(key);
  };

  const handleIconMouseLeave  = () => scheduleHide();
  const handlePanelMouseEnter = () => clearHideTimer();
  const handlePanelMouseLeave = () => scheduleHide();

  // Tap handler: computes panel geometry AND toggles activePanel (used on tablet)
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
      zIndex:   50,
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
      <div
        ref={popupRef}
        style={wrapperStyle}
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handlePanelMouseLeave}
      >
        {content}
      </div>
    );
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className="flex flex-col flex-shrink-0"
        style={{
          width: `${SIDEBAR_WIDTH}px`,
          background: "linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-alt) 100%)",
          borderLeft: "1px solid var(--color-border)",
        }}
      >
        {RIGHT_TABS.map(tab => {
          const IconComponent = tab.icon;
          const isActive  = activePanel === tab.key;
          const isHovered = hoveredKey  === tab.key;

          return (
            <div
              key={tab.key}
              onClick={(e) => handleTabActivate(e, tab)}
              onMouseEnter={(e) => handleIconMouseEnter(e, tab.key)}
              onMouseLeave={handleIconMouseLeave}
              className="relative cursor-pointer transition-all duration-200 group"
              style={{
                background: "transparent",
                borderRight: isActive || isHovered ? `3px solid ${tab.color}` : "3px solid transparent",
              }}
            >
              <div className="flex flex-col items-center justify-center py-2 px-1 gap-0.5">
                <div
                  className="p-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: tab.defaultBg || "transparent",
                    transform: isHovered && !isActive ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <IconComponent
                    size={18}
                    style={{ color: tab.defaultIconColor || "var(--color-text-muted)" }}
                  />
                </div>
                <span 
                  className="text-[0.55rem] font-semibold text-center leading-tight"
                  style={{ 
                    color: isActive || isHovered ? tab.color : "var(--color-text-muted)",
                  }}
                >
                  {tab.label}
                </span>
              </div>

              {tab.badge && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: tab.color }} />
              )}
            </div>
          );
        })}
      </div>

      {renderPopup()}
    </>
  );
}