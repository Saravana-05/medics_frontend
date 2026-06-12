import { useState, useRef, useCallback } from "react";
import { 
  ParkingCircle, AlertTriangle, FileText, CalendarClock,
  Plus, X, Calendar, Clock, User, Check, Briefcase, Coffee, Video, Users as UsersIcon,
  MapPin
} from "lucide-react";

const RIGHT_TABS = [
  { 
    key: "parked", 
    label: "Patients Parked", 
    icon: ParkingCircle,
    color: "var(--color-warning)",
    lightColor: "#fef3e2",
    defaultBg: "#fef3e2",
    defaultIconColor: "#d97706",
    badge: "3"
  },
  { 
    key: "emergency", 
    label: "Patient Emergency", 
    icon: AlertTriangle,
    color: "var(--color-danger)",
    lightColor: "#fee2e2",
    defaultBg: "#fee2e2",
    defaultIconColor: "#dc2626",
    badge: "2"
  },
  { 
    key: "reports", 
    label: "Patient Reports", 
    icon: FileText,
    color: "var(--color-primary)",
    lightColor: "var(--color-primary-muted)",
    defaultBg: "var(--color-primary-muted)",
    defaultIconColor: "var(--color-primary)",
    badge: "5"
  },
  { 
    key: "schedule", 
    label: "Doctor's Schedule", 
    icon: CalendarClock,
    color: "var(--color-drugs)",
    lightColor: "var(--color-drugs-light)",
    defaultBg: "var(--color-drugs-light)",
    defaultIconColor: "var(--color-drugs)",
    badge: "8"
  },
];

// ── Shared dimensions (mirrors LeftSidebar) ───────────────────────────────
const PANEL_WIDTH   = 360;
const SIDEBAR_WIDTH = 48;
const GAP           = 8;
const BOTTOM_MARGIN = 16;

// Mock data for reports with lab/service badge
const MOCK_REPORTS = [
  { patientName: "Raveendran. K", report: "Complete Blood Count", type: "Lab", status: "Pending", date: "03/03/2024" },
  { patientName: "Nandhini. A", report: "Lipid Profile", type: "Lab", status: "Pending", date: "03/03/2024" },
  { patientName: "Anjali (Baby). L", report: "Liver Function Test", type: "Lab", status: "Ready", date: "02/03/2024" },
  { patientName: "Vignesh (Infant). R", report: "X-Ray Chest", type: "Service", status: "Ready", date: "02/03/2024" },
  { patientName: "Ramakrishnan. K.R", report: "ECG", type: "Service", status: "Ready", date: "01/03/2024" },
];

// Mock data for doctor's personal schedule (meetings, breaks, etc.)
const MOCK_SCHEDULES = [
  { id: 1, time: "09:00 AM - 10:00 AM", title: "Morning Rounds", type: "Rounds", location: "Ward A" },
  { id: 2, time: "10:00 AM - 11:00 AM", title: "Department Meeting", type: "Meeting", location: "Conference Room" },
  { id: 3, time: "11:00 AM - 12:00 PM", title: "Coffee Break", type: "Break", location: "Doctors Lounge" },
  { id: 4, time: "12:00 PM - 01:00 PM", title: "Lunch Break", type: "Break", location: "Cafeteria" },
  { id: 5, time: "01:00 PM - 02:00 PM", title: "Research Discussion", type: "Meeting", location: "Library" },
  { id: 6, time: "02:00 PM - 03:00 PM", title: "Telemedicine Session", type: "Virtual", location: "Online" },
  { id: 7, time: "03:00 PM - 04:00 PM", title: "Patient Review", type: "Work", location: "Office" },
  { id: 8, time: "04:00 PM - 05:00 PM", title: "Training Session", type: "Training", location: "Seminar Hall" },
];

// ── Panel components ──────────────────────────────────────────────────────

function ParkedPatientsPanel({ panelHeight }) {
  const headerH = 36;
  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: PANEL_WIDTH, height: panelHeight }}>
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#fef3e2", borderColor: "#fde68a", height: headerH }}>
        <ParkingCircle size={16} style={{ color: "#d97706" }} />
        <span className="text-xs font-bold" style={{ color: "#7a3a00" }}>Parked Patients (3)</span>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {["Rajesh Kumar (OP-1234)", "Priya Sharma (OP-1235)", "Anand Venkat (OP-1236)"].map((name, i) => (
          <div key={i} className="p-2 rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
            <div className="font-medium text-sm">{name}</div>
            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Waiting since 15 min</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmergencyPatientsPanel({ panelHeight }) {
  const headerH = 36;
  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: PANEL_WIDTH, height: panelHeight }}>
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#fee2e2", borderColor: "#fecaca", height: headerH }}>
        <AlertTriangle size={16} style={{ color: "#dc2626" }} />
        <span className="text-xs font-bold" style={{ color: "#7a0000" }}>Emergency Cases (2)</span>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        <div className="p-2 rounded-lg border-l-4"
          style={{ borderLeftColor: "#dc2626", borderColor: "var(--color-border)" }}>
          <div className="font-medium text-sm">Meena Iyer</div>
          <div className="text-xs text-red-600">High fever (104°F) - Critical</div>
        </div>
        <div className="p-2 rounded-lg border-l-4"
          style={{ borderLeftColor: "#f59e0b", borderColor: "var(--color-border)" }}>
          <div className="font-medium text-sm">Ramesh Gupta</div>
          <div className="text-xs text-orange-600">Chest pain - Under observation</div>
        </div>
      </div>
    </div>
  );
}

function ReportsPanel({ panelHeight }) {
  const headerH = 48;
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredReports, setFilteredReports] = useState(MOCK_REPORTS);

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    if (date) {
      setFilteredReports(MOCK_REPORTS.filter(r => r.date === date));
    } else {
      setFilteredReports(MOCK_REPORTS);
    }
  };

  const getTypeBadgeStyle = (type) => {
    if (type === "Lab") {
      return { bg: "var(--color-lab-light)", color: "var(--color-lab)" };
    }
    return { bg: "#e3f0fc", color: "var(--color-services)" };
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: PANEL_WIDTH, height: panelHeight }}>
      <div className="px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: headerH }}>
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: "var(--color-primary)" }} />
          <span className="text-xs font-bold" style={{ color: "var(--color-primary-dark)" }}>Patient Reports</span>
        </div>
        <div className="relative">
          <Calendar size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="pl-7 pr-2 py-1 text-xs rounded border"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
            placeholder="Filter by date"
          />
        </div>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {filteredReports.length === 0 ? (
          <div className="text-center py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>No reports found</div>
        ) : (
          filteredReports.map((item, i) => {
            const badgeStyle = getTypeBadgeStyle(item.type);
            return (
              <div key={i} className="flex justify-between items-center p-2 rounded-lg border"
                style={{ borderColor: "var(--color-border)" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{item.patientName}</span>
                    <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                      {item.type}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.report}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: item.status === "Pending" ? "#fef3e2" : "#e6f5f0", color: item.status === "Pending" ? "#b45309" : "#1a7f5a" }}>
                  {item.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Updated SchedulePanel for Doctor's personal schedule
function SchedulePanel({ panelHeight }) {
  const headerH = 80;
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    timeFrom: "",
    timeTo: "",
    type: "Meeting",
    location: "",
    date: selectedDate
  });

  const filteredSchedules = schedules;

  const handleAddSchedule = () => {
    if (newSchedule.title && newSchedule.timeFrom && newSchedule.timeTo) {
      setSchedules([
        ...schedules,
        { 
          id: Date.now(), 
          time: `${newSchedule.timeFrom} - ${newSchedule.timeTo}`,
          title: newSchedule.title, 
          type: newSchedule.type,
          location: newSchedule.location || "—"
        }
      ]);
      setNewSchedule({ title: "", timeFrom: "", timeTo: "", type: "Meeting", location: "", date: selectedDate });
      setShowAddForm(false);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "Meeting": return <UsersIcon size={12} />;
      case "Break": return <Coffee size={12} />;
      case "Virtual": return <Video size={12} />;
      default: return <Briefcase size={12} />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "Meeting": return "#1d4ed8";
      case "Break": return "#d97706";
      case "Virtual": return "#0891b2";
      case "Training": return "#7c3aed";
      default: return "var(--color-primary)";
    }
  };

  const getTypeBg = (type) => {
    switch(type) {
      case "Meeting": return "#dbeafe";
      case "Break": return "#fef3c7";
      case "Virtual": return "#cffafe";
      case "Training": return "#ede9fe";
      default: return "var(--color-primary-muted)";
    }
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: PANEL_WIDTH, height: panelHeight }}>
      <div className="px-3 py-2 border-b"
        style={{ background: "var(--color-drugs-light)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} style={{ color: "var(--color-drugs)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--color-drugs)" }}>
              Doctor's Schedule
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 rounded transition-all hover:bg-white/50"
            style={{ background: "var(--color-surface)" }}
          >
            <Plus size={14} style={{ color: "var(--color-drugs)" }} />
          </button>
        </div>
        <div className="relative">
          <Calendar size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-7 pr-2 py-1 text-xs rounded border"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
          />
        </div>
      </div>
      
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {/* Add Form */}
        {showAddForm && (
          <div className="p-3 rounded-lg border mb-3" style={{ borderColor: "var(--color-drugs)", background: "var(--color-drugs-light)" }}>
            <div className="space-y-2">
              <div className="relative">
                <Briefcase size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="text"
                  placeholder="Schedule Title"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                  className="w-full pl-7 pr-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Clock size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
                  <input
                    type="time"
                    placeholder="From"
                    value={newSchedule.timeFrom}
                    onChange={(e) => setNewSchedule({ ...newSchedule, timeFrom: e.target.value })}
                    className="w-full pl-7 pr-2 py-1.5 text-xs rounded border"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                  />
                </div>
                <div className="flex-1 relative">
                  <Clock size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
                  <input
                    type="time"
                    placeholder="To"
                    value={newSchedule.timeTo}
                    onChange={(e) => setNewSchedule({ ...newSchedule, timeTo: e.target.value })}
                    className="w-full pl-7 pr-2 py-1.5 text-xs rounded border"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                  />
                </div>
              </div>
              <select
                value={newSchedule.type}
                onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="Meeting">Meeting</option>
                <option value="Work">Work</option>
                <option value="Break">Break</option>
                <option value="Virtual">Virtual</option>
                <option value="Training">Training</option>
              </select>
              <div className="relative">
                <MapPin size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={newSchedule.location}
                  onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                  className="w-full pl-7 pr-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "var(--color-drugs)", color: "white" }}
                >
                  <Check size={12} /> Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "#fee2e2", color: "var(--color-danger)" }}
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Schedule List - Doctor's personal schedule */}
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
            No schedules for this date
          </div>
        ) : (
          filteredSchedules.map((item, i) => {
            const typeColor = getTypeColor(item.type);
            const typeBg = getTypeBg(item.type);
            const TypeIcon = getTypeIcon(item.type);
            
            return (
              <div key={item.id} className="p-2 rounded-lg border hover:shadow-sm transition-all"
                style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: typeBg }}>
                    {TypeIcon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold" style={{ color: "var(--color-text-base)" }}>{item.title}</div>
                      <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: typeBg, color: typeColor }}>
                        {item.type}
                      </span>
                    </div>
                    <div className="text-xs mt-1 flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                      <Clock size={10} />
                      <span className="font-mono">{item.time}</span>
                    </div>
                    {item.location && item.location !== "—" && (
                      <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                        <MapPin size={10} />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function RightSidebar({ activePanel, onPanelChange }) {
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
    if (!hoveredKey) return null;

    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const panelLeft   = sidebarRect
      ? sidebarRect.left - PANEL_WIDTH - GAP
      : window.innerWidth - SIDEBAR_WIDTH - PANEL_WIDTH - GAP;

    const wrapperStyle = {
      position: "fixed",
      zIndex:   50,
      top:      panelTop,
      left:     panelLeft,
      width:    PANEL_WIDTH,
      height:   panelHeight,
    };

    let content = null;
    switch (hoveredKey) {
      case "parked":    content = <ParkedPatientsPanel    panelHeight={panelHeight} />; break;
      case "emergency": content = <EmergencyPatientsPanel panelHeight={panelHeight} />; break;
      case "reports":   content = <ReportsPanel           panelHeight={panelHeight} />; break;
      case "schedule":  content = <SchedulePanel          panelHeight={panelHeight} />; break;
      default: return null;
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
          borderLeft: "1px solid var(--color-border)",
        }}
      >
        {RIGHT_TABS.map(tab => {
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
                background: tab.defaultBg, // Always show default background color
                borderRight: highlight ? `3px solid ${tab.color}` : "3px solid transparent",
              }}
            >
              <div className="flex items-center justify-center py-3">
                <div
                  className="p-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: highlight ? tab.color : "transparent",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <IconComponent
                    size={18}
                    style={{ color: highlight ? "white" : tab.defaultIconColor }}
                  />
                </div>
              </div>

              {tab.badge && !highlight && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: tab.color }} />
              )}

              {!isHovered && (
                <div
                  className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40"
                  style={{
                    background:  "var(--color-surface)",
                    border:      "1px solid var(--color-border)",
                    boxShadow:   "var(--shadow-md)",
                    fontSize:    "0.7rem",
                    fontWeight:  "600",
                    color:       tab.color,
                  }}
                >
                  {tab.label} ({tab.badge})
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