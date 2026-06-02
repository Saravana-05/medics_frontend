import { useState, useRef, useCallback } from "react";
import { 
  User, AlertCircle, Users, Calendar, 
  Heart, ChevronDown
} from "lucide-react";
import PatientInfoPanel from "./PatientInfoPanel";

const LEFT_TABS = [
  { 
    key: "patientInfo", 
    label: "Patient Information", 
    icon: User,
    color: "var(--color-primary)",
    lightColor: "var(--color-primary-muted)",
  },
  { 
    key: "chronicAllergy", 
    label: "Chronic & Allergy", 
    icon: AlertCircle,
    color: "var(--color-danger)",
    lightColor: "#fee2e2",
  },
  { 
    key: "patientFamily", 
    label: "Patient Family", 
    icon: Users,
    color: "var(--color-drugs)",
    lightColor: "var(--color-drugs-light)",
  },
  { 
    key: "period", 
    label: "Visit Period", 
    icon: Calendar,
    color: "var(--color-warning)",
    lightColor: "#fef3e2",
  },
];

const PANEL_WIDTH   = 320;
const SIDEBAR_WIDTH = 48;
const GAP           = 8;
const BOTTOM_MARGIN = 16;

function ChronicAllergyPanel({ patient, panelHeight }) {
  const items = patient?.chronicAllergy || [];
  const headerH = 36;
  return (
    <div
      className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: PANEL_WIDTH, height: panelHeight }}
    >
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#fee2e2", borderColor: "#fecaca", height: headerH, flexShrink: 0 }}>
        <AlertCircle size={16} style={{ color: "#dc2626" }} />
        <span className="text-xs font-bold" style={{ color: "#7a0000" }}>Chronic &amp; Allergy</span>
        <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full ml-auto"
          style={{ background: "#dc2626", color: "white" }}>{items.length}</span>
      </div>
      <div className="overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <Heart size={32} style={{ color: "var(--color-text-subtle)" }} />
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No chronic conditions or allergies recorded</p>
          </div>
        ) : items.map((item, i) => (
          <div key={i} className="p-3 border-b"
            style={{ borderColor: "#f8d8d8", background: i % 2 === 0 ? "white" : "#fff5f5" }}>
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                background: item.type === "Allergy" ? "#fee2e2" : "#fef3e2",
                color: item.type === "Allergy" ? "#dc2626" : "#b45309",
              }}>{item.type}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                background: item.severity === "High" ? "#fee2e2" : item.severity === "Medium" ? "#fef3e2" : "#e6f5f0",
                color: item.severity === "High" ? "#dc2626" : item.severity === "Medium" ? "#b45309" : "#1a7f5a",
              }}>{item.severity}</span>
            </div>
            <div className="font-bold text-sm mt-1" style={{ color: "#5a0000" }}>{item.name}</div>
            <div className="text-[0.65rem] mt-1" style={{ color: "#8a5a5a" }}>Since {item.since}</div>
            {item.reaction && (
              <div className="text-[0.6rem] mt-1 italic" style={{ color: "#a05a5a" }}>Reaction: {item.reaction}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientFamilyPanel({ patient, panelHeight }) {
  const items = patient?.family || [];
  const headerH = 36;
  return (
    <div
      className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: PANEL_WIDTH, height: panelHeight }}
    >
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#c8e8c8", borderColor: "#b0d8b0", height: headerH, flexShrink: 0 }}>
        <Users size={16} style={{ color: "#004d00" }} />
        <span className="text-xs font-bold" style={{ color: "#004d00" }}>Patient Family History</span>
        <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full ml-auto"
          style={{ background: "#004d00", color: "white" }}>{items.length}</span>
      </div>
      <div className="overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <Users size={32} style={{ color: "var(--color-text-subtle)" }} />
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No family history records</p>
          </div>
        ) : items.map((member, i) => (
          <div key={i} className="p-3 border-b"
            style={{ borderColor: "#d8f0d8", background: i % 2 === 0 ? "white" : "#f5fff5" }}>
            <div className="font-bold text-sm" style={{ color: "#004d00" }}>{member.name}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-[0.65rem]" style={{ color: "#5a8a5a" }}>Age {member.age}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: member.condition === "Nil" ? "#1a7f5a" : "#b45309" }} />
              <span className="text-[0.7rem]"
                style={{ color: member.condition === "Nil" ? "#1a7f5a" : "#b45309" }}>{member.condition}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Updated PeriodPanel with date range filter
function PeriodPanel({ patient, panelHeight }) {
  const [selectedRange, setSelectedRange] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const headerH = 36;
  
  const handleQuickSelect = (range) => {
    setSelectedRange(range);
    const today = new Date();
    let from = new Date();
    
    switch(range) {
      case "15days":
        from.setDate(today.getDate() - 15);
        break;
      case "1month":
        from.setMonth(today.getMonth() - 1);
        break;
      case "6months":
        from.setMonth(today.getMonth() - 6);
        break;
      default:
        setFromDate("");
        setToDate("");
        return;
    }
    
    setFromDate(from.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  };
  
  const handleFromDateChange = (date) => {
    setFromDate(date);
    setSelectedRange("custom");
  };
  
  const handleToDateChange = (date) => {
    setToDate(date);
    setSelectedRange("custom");
  };
  
  return (
    <div
      className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: PANEL_WIDTH, height: panelHeight }}
    >
      <div className="px-3 py-2 border-b" style={{ background: "#f0d8b0", borderColor: "#d8c080", height: headerH, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          <Calendar size={16} style={{ color: "#5a3a00" }} />
          <span className="text-xs font-bold" style={{ color: "#5a3a00" }}>Visit Period</span>
        </div>
      </div>
      <div className="overflow-y-auto p-3" style={{ height: panelHeight - headerH }}>
        {/* Quick Select Buttons */}
        <div className="mb-4">
          <div className="text-[0.6rem] font-bold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Quick Select</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickSelect("15days")}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedRange === "15days" ? "bg-primary text-white" : "bg-surface-alt text-text-muted hover:bg-primary-muted"
              }`}
              style={{
                background: selectedRange === "15days" ? "var(--color-primary)" : "var(--color-surface-alt)",
                color: selectedRange === "15days" ? "white" : "var(--color-text-muted)",
                border: "1px solid var(--color-border)"
              }}
            >
              Last 15 Days
            </button>
            <button
              onClick={() => handleQuickSelect("1month")}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedRange === "1month" ? "bg-primary text-white" : "bg-surface-alt text-text-muted hover:bg-primary-muted"
              }`}
              style={{
                background: selectedRange === "1month" ? "var(--color-primary)" : "var(--color-surface-alt)",
                color: selectedRange === "1month" ? "white" : "var(--color-text-muted)",
                border: "1px solid var(--color-border)"
              }}
            >
              Last 1 Month
            </button>
            <button
              onClick={() => handleQuickSelect("6months")}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedRange === "6months" ? "bg-primary text-white" : "bg-surface-alt text-text-muted hover:bg-primary-muted"
              }`}
              style={{
                background: selectedRange === "6months" ? "var(--color-primary)" : "var(--color-surface-alt)",
                color: selectedRange === "6months" ? "white" : "var(--color-text-muted)",
                border: "1px solid var(--color-border)"
              }}
            >
              Last 6 Months
            </button>
          </div>
        </div>
        
        {/* Custom Date Range */}
        <div>
          <div className="text-[0.6rem] font-bold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Custom Range</div>
          <div className="space-y-2">
            <div>
              <label className="text-[0.55rem] font-medium mb-1 block" style={{ color: "var(--color-text-muted)" }}>From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
                className="w-full px-2 py-1.5 rounded-md text-xs border outline-none"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-base)"
                }}
              />
            </div>
            <div>
              <label className="text-[0.55rem] font-medium mb-1 block" style={{ color: "var(--color-text-muted)" }}>To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => handleToDateChange(e.target.value)}
                className="w-full px-2 py-1.5 rounded-md text-xs border outline-none"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-base)"
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Placeholder for filtered results */}
        <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
            {fromDate && toDate ? (
              <span>Showing visits from {fromDate} to {toDate}</span>
            ) : (
              <span>Select a date range to filter visits</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeftSidebar({ activePanel, onPanelChange, patient }) {
  const [hoveredKey,  setHoveredKey]  = useState(null);
  const [panelTop,    setPanelTop]    = useState(0);
  const [panelHeight, setPanelHeight] = useState(480);

  const sidebarRef = useRef(null);
  const hideTimer  = useRef(null);

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

  const renderPopup = () => {
    if (!hoveredKey || !patient) return null;

    const wrapperStyle = {
      position: "fixed",
      zIndex:   50,
      top:      panelTop,
      left:     SIDEBAR_WIDTH + GAP,
      width:    PANEL_WIDTH,
      height:   panelHeight,
    };

    let content = null;
    switch (hoveredKey) {
      case "patientInfo":
        content = (
          <PatientInfoPanel
            patient={patient}
            isPopup
            popupWidth={PANEL_WIDTH}
            popupHeight={panelHeight}
          />
        );
        break;
      case "chronicAllergy":
        content = <ChronicAllergyPanel patient={patient} panelHeight={panelHeight} />;
        break;
      case "patientFamily":
        content = <PatientFamilyPanel patient={patient} panelHeight={panelHeight} />;
        break;
      case "period":
        content = <PeriodPanel patient={patient} panelHeight={panelHeight} />;
        break;
      default:
        return null;
    }

    return (
      <div
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
          borderRight: "1px solid var(--color-border)",
        }}
      >
        {LEFT_TABS.map(tab => {
          const IconComponent = tab.icon;
          const isActive  = activePanel === tab.key;
          const isHovered = hoveredKey  === tab.key;
          const highlight = isActive || isHovered;

          return (
            <div
              key={tab.key}
              onClick={() => onPanelChange(tab.key === activePanel ? null : tab.key)}
              onMouseEnter={(e) => handleIconMouseEnter(e, tab.key)}
              onMouseLeave={handleIconMouseLeave}
              className="relative cursor-pointer transition-all duration-200 group"
              style={{
                background:  highlight ? tab.lightColor : "transparent",
                borderLeft:  highlight ? `3px solid ${tab.color}` : "3px solid transparent",
              }}
            >
              <div className="flex items-center justify-center py-3">
                <div
                  className="p-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: highlight ? tab.color : "transparent",
                    transform:  isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <IconComponent
                    size={18}
                    style={{ color: highlight ? "white" : "var(--color-text-muted)" }}
                  />
                </div>
              </div>

              {!isHovered && (
                <div
                  className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40"
                  style={{
                    background:  "var(--color-surface)",
                    border:      "1px solid var(--color-border)",
                    boxShadow:   "var(--shadow-md)",
                    fontSize:    "0.7rem",
                    fontWeight:  "600",
                    color:       tab.color,
                  }}
                >
                  {tab.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {renderPopup()}
    </>
  );
}