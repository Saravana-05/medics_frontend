import { useState } from "react";
import { 
  CalendarClock, Plus, X, Calendar, Clock, Check, 
  Briefcase, Coffee, Video, Users as UsersIcon, MapPin 
} from "lucide-react";

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

function SchedulePanel({ panelHeight }) {
  const headerH = 50;
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
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="px-3 py-2 border-b"
        style={{ background: "#0c324a", borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* <CalendarClock size={16} style={{ color: "var(--color-drugs)" }} /> */}
            <span className="text-md font-bold text-white" >
              Doctor's Schedule
            </span>
          </div>

        </div>

      </div>

      {/* Date filter row — right-aligned with light-grey divider + drop shadow (matches ReportsPanel) */}
      <div
        className="px-3 py-2 flex items-center justify-end gap-2"
        style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
      >
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-black/5 flex-shrink-0"
          style={{ width: 40, height: 40, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          title="Add schedule"
        >
          <Plus size={24} style={{ color: "var(--color-drugs)", fontWeight: "bold" }} />
        </button>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-9 pr-3 text-sm rounded-lg border"
            style={{ height: 40, borderColor: "var(--color-border)", background: "var(--color-surface)" }}
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
        
        {/* Schedule List */}
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
            No schedules for this date
          </div>
        ) : (
          filteredSchedules.map((item) => {
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

export default SchedulePanel;