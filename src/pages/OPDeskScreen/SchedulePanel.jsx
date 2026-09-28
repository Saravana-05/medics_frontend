import { useMemo, useState } from "react";
import { Archive, Calendar, ListFilter, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const SCHEDULE_TYPES = ["Visits", "Rounds", "Break", "Meeting", "Virtual", "Training"];
const SCHEDULE_STATUSES = ["Important", "Planned", "Completed"];
const BASE_SCHEDULE_TITLES = [
  "OP Review Visits",
  "Morning Ward Rounds",
  "Case Review Meetings",
  "Tea Break",
  "Virtual Follow-up",
  "Nurse Training Review",
  "Post-op Visits",
  "Evening Ward Rounds",
  "Other",
];
const blankSchedule = {
  title: "",
  otherTitle: "",
  timeFrom: "",
  timeTo: "",
  type: "",
  status: "",
  location: "",
};

// Text color only, no backgrounds.
const STATUS_STYLES = {
  Important: { color: "#b45309" },
  Planned: { color: "#1d4ed8" },
  Completed: { color: "#15803d" },
};

const TYPE_STYLES = {
  Visits: { color: "#166534" },
  Rounds: { color: "#1e3a8a" },
  Break: { color: "#92400e" },
  Meeting: { color: "#3730a3" },
  Virtual: { color: "#155e75" },
  Training: { color: "#5b21b6" },
};

const MOCK_SCHEDULES = [
  { id: 1, date: "2024-03-03", timeFrom: "08:30", timeTo: "09:00", title: "OP Review Visits", type: "Visits", status: "Important", location: "OP Room 1" },
  { id: 2, date: "2024-03-03", timeFrom: "09:00", timeTo: "09:45", title: "Morning Ward Rounds", type: "Rounds", status: "Important", location: "Ward A" },
  { id: 3, date: "2024-03-03", timeFrom: "10:00", timeTo: "10:30", title: "Case Review Meetings", type: "Meeting", status: "Planned", location: "Conference Room" },
  { id: 4, date: "2024-03-03", timeFrom: "10:45", timeTo: "11:00", title: "Tea Break", type: "Break", status: "Completed", location: "Doctors Lounge" },
  { id: 5, date: "2024-03-03", timeFrom: "11:30", timeTo: "12:00", title: "Virtual Follow-up", type: "Virtual", status: "Planned", location: "Online" },
  { id: 6, date: "2024-03-03", timeFrom: "12:15", timeTo: "13:00", title: "Nurse Training Review", type: "Training", status: "Planned", location: "Seminar Hall" },
  { id: 7, date: "2024-03-03", timeFrom: "14:00", timeTo: "14:45", title: "Post-op Visits", type: "Visits", status: "Important", location: "Surgery Block" },
  { id: 8, date: "2024-03-03", timeFrom: "16:00", timeTo: "16:30", title: "Evening Ward Rounds", type: "Rounds", status: "Planned", location: "Ward B" },
];

const todayString = () => new Date().toISOString().split("T")[0];

const formatDisplayTime = (time) => {
  if (!time) return "";
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minute} ${suffix}`;
};

const scheduleTime = (item) => `${formatDisplayTime(item.timeFrom)} - ${formatDisplayTime(item.timeTo)}`;

function SchedulePanel({ panelHeight }) {
  const headerH = 50;
  const filterH = 51;
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-03-03");
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [scheduleTitles, setScheduleTitles] = useState(BASE_SCHEDULE_TITLES);
  const [newSchedule, setNewSchedule] = useState(blankSchedule);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const filteredSchedules = useMemo(() => (
    schedules
      .filter(item => Boolean(item.archived) === showArchive)
      .filter(item => !selectedDate || item.date === selectedDate)
      .filter(item => {
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return [item.title, item.location, item.status, item.type, scheduleTime(item)]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(search));
      })
      .sort((a, b) => `${a.timeFrom}-${a.timeTo}`.localeCompare(`${b.timeFrom}-${b.timeTo}`))
  ), [schedules, selectedDate, showArchive, query]);

  const scheduleTitle = () => newSchedule.title === "Other" ? newSchedule.otherTitle.trim() : newSchedule.title;

  const resetScheduleForm = () => {
    setNewSchedule(blankSchedule);
    setEditingScheduleId(null);
    setShowAddForm(false);
  };

  const handleSaveSchedule = () => {
    const title = scheduleTitle();
    if (!title || !newSchedule.timeFrom || !newSchedule.timeTo || !newSchedule.type || !newSchedule.status) return;
    const payload = {
      date: selectedDate || todayString(),
      timeFrom: newSchedule.timeFrom,
      timeTo: newSchedule.timeTo,
      title,
      type: newSchedule.type,
      status: newSchedule.status,
      location: newSchedule.location || "-",
    };
    setSchedules(prev => editingScheduleId
      ? prev.map(item => item.id === editingScheduleId ? { ...item, ...payload } : item)
      : [...prev, { id: Date.now(), ...payload }]);
    resetScheduleForm();
  };

  const openAddSchedule = () => {
    setNewSchedule(blankSchedule);
    setEditingScheduleId(null);
    setShowAddForm(true);
  };

  const openEditSchedule = (item) => {
    const title = scheduleTitles.includes(item.title) ? item.title : "Other";
    setNewSchedule({
      title,
      otherTitle: title === "Other" ? item.title : "",
      timeFrom: item.timeFrom || "",
      timeTo: item.timeTo || "",
      type: item.type || "",
      status: item.status || "",
      location: item.location === "-" ? "" : item.location || "",
    });
    setEditingScheduleId(item.id);
    setShowAddForm(true);
  };

  const archiveSchedule = (id) => {
    setSchedules(prev => prev.map(item => item.id === id ? { ...item, archived: true } : item));
  };

  const restoreSchedule = (id) => {
    setSchedules(prev => prev.map(item => item.id === id ? { ...item, archived: false } : item));
  };

  const deleteSchedule = (id) => {
    setSchedules(prev => prev.filter(item => item.id !== id));
    setDeleteCandidate(null);
  };

  const clearFilters = () => {
    setQuery("");
  };

  const addOtherScheduleTitle = () => {
    const title = newSchedule.otherTitle.trim();
    if (!title) return;
    setScheduleTitles(prev => prev.includes(title) ? prev : [...prev.filter(item => item !== "Other"), title, "Other"]);
    setNewSchedule(current => ({ ...current, title, otherTitle: "" }));
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="shrink-0 px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#0c324a", borderColor: "var(--color-border)", height: headerH }}>
        <span className="text-md font-bold text-white">Doctor's Schedule</span>
      </div>

      <div
        className="shrink-0 px-3 py-2"
        style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)", minHeight: filterH }}
      >
        <div className="flex flex-nowrap items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label="Add schedule"
            onClick={openAddSchedule}
            className="flex h-[34px] shrink-0 items-center justify-center rounded-none border"
            style={{ width: 42, minWidth: 42, background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-base)" }}
            title="Add schedule"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            aria-expanded={showFilters}
            onClick={() => setShowFilters(value => !value)}
            className="flex h-[34px] items-center gap-1 rounded-none border px-2 text-xs"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-base)" }}
          >
            <ListFilter size={14} /> Filter{query ? " •" : ""}
          </button>
          <button
            type="button"
            aria-pressed={showArchive}
            onClick={() => setShowArchive(value => !value)}
            className="flex h-[34px] items-center gap-1 rounded-none border px-2 text-xs"
            style={{
              background: showArchive ? "#e5e7eb" : "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-base)",
            }}
            title="View archived schedules"
          >
            <Archive size={14} /> {showArchive ? "Unarchive" : "Archive"}
          </button>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-[34px] w-[148px] rounded-none border pl-8 pr-1 text-xs"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
            />
          </div>
        </div>
        {showFilters && (
          <div className="mt-2 flex gap-2">
            <input
              type="search"
              aria-label="Filter schedules"
              placeholder="<Title, location, status or time>"
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-none border p-2 text-xs"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
            />
            <button type="button" onClick={clearFilters} className="text-xs underline">Clear</button>
          </div>
        )}
      </div>

      <div className="patient-card-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {showAddForm && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={resetScheduleForm}
          >
            <div
              className="w-full max-w-sm overflow-hidden rounded-lg shadow-2xl"
              style={{ background: "var(--color-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0c324a" }}>
                <span className="text-base font-bold text-white">{editingScheduleId ? "Edit Schedule" : "Add Schedule"}</span>
                <button type="button" onClick={resetScheduleForm} className="p-1 transition-all hover:bg-white/20" title="Close">
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <select
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                  className="w-full rounded-none border px-3 py-2 text-base outline-none"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                >
                  <option value="" disabled>Select Schedule Title</option>
                  {scheduleTitles.map(title => <option key={title} value={title}>{title}</option>)}
                </select>
                {newSchedule.title === "Other" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="<Schedule Title>"
                      value={newSchedule.otherTitle}
                      onChange={(e) => setNewSchedule({ ...newSchedule, otherTitle: e.target.value })}
                      className="min-w-0 flex-1 rounded-none border px-3 py-2 text-base outline-none"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                    />
                    <button
                      type="button"
                      onClick={addOtherScheduleTitle}
                      className="rounded-none px-3 py-2 text-sm font-semibold"
                      style={{ background: "#0c324a", color: "white" }}
                    >
                      Add
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    type="time"
                    value={newSchedule.timeFrom}
                    onChange={(e) => setNewSchedule({ ...newSchedule, timeFrom: e.target.value })}
                    className="min-w-0 flex-1 rounded-none border px-3 py-2 text-base outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  />
                  <input
                    type="time"
                    value={newSchedule.timeTo}
                    onChange={(e) => setNewSchedule({ ...newSchedule, timeTo: e.target.value })}
                    className="min-w-0 flex-1 rounded-none border px-3 py-2 text-base outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  />
                </div>
                <select
                  value={newSchedule.type}
                  onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}
                  className="w-full rounded-none border px-3 py-2 text-base outline-none"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                >
                  <option value="" disabled>Select Schedule Label</option>
                  {SCHEDULE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <select
                  value={newSchedule.status}
                  onChange={(e) => setNewSchedule({ ...newSchedule, status: e.target.value })}
                  className="w-full rounded-none border px-3 py-2 text-base outline-none"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                >
                  <option value="" disabled>Select Schedule Status</option>
                  {SCHEDULE_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="<Location (optional)>"
                  value={newSchedule.location}
                  onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                  className="w-full rounded-none border px-3 py-2 text-base outline-none"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                />
              </div>

              <div className="flex gap-3 px-4 pb-4">
                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-none px-3 py-2 text-base font-semibold"
                  style={{ background: "var(--color-success)", color: "white" }}
                >
                  {editingScheduleId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={resetScheduleForm}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-none px-3 py-2 text-base font-semibold"
                  style={{ background: "var(--color-danger)", color: "white" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredSchedules.length === 0 ? (
          <div className="py-4 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
            {showArchive ? "No archived schedules for this date" : "No schedules for this date"}
          </div>
        ) : (
          filteredSchedules.map((item) => {
            const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.Planned;
            const typeStyle = TYPE_STYLES[item.type] || TYPE_STYLES.Visits;

            return (
              <div key={item.id} className="border p-2 transition-all hover:shadow-sm"
                style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-start gap-2">
                  {/* Status: text color only */}
                  <span className="shrink-0 text-[10px] font-bold"
                    style={{ color: statusStyle.color }}>
                    {item.status}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium" style={{ color: "var(--color-text-base)" }}>{item.title}</div>
                    {item.location && item.location !== "-" && (
                      <div className="mt-1 truncate text-xs" style={{ color: "var(--color-text-muted)" }}>{item.location}</div>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="flex items-start justify-end gap-1">
                      {/* Type: text color only */}
                      <div className="inline-block text-[10px] font-bold leading-6"
                        style={{ color: typeStyle.color }}>
                        {item.type}
                      </div>
                      {!showArchive && (
                        <button
                          type="button"
                          aria-label="Edit schedule"
                          onClick={() => openEditSchedule(item)}
                          className="flex h-6 w-6 items-center justify-center rounded-none border"
                          style={{ borderColor: "var(--color-border)", color: "#0c324a" }}
                          title="Edit schedule"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                      {showArchive ? (
                        <button
                          type="button"
                          aria-label="Restore schedule"
                          onClick={() => restoreSchedule(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-none border"
                          style={{ borderColor: "var(--color-border)", color: "var(--color-success)" }}
                          title="Restore schedule"
                        >
                          <RotateCcw size={13} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          aria-label="Archive schedule"
                          onClick={() => archiveSchedule(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-none border"
                          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                          title="Archive schedule"
                        >
                          <Archive size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Delete schedule"
                        onClick={() => setDeleteCandidate(item)}
                        className="flex h-6 w-6 items-center justify-center rounded-none border"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-danger)" }}
                        title="Delete schedule"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="mt-1 whitespace-nowrap text-[11px] font-medium tabular-nums" style={{ color: "var(--color-text-base)" }}>
                      {scheduleTime(item)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <DeleteConfirmationModal
        open={Boolean(deleteCandidate)}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule?"
        itemName={deleteCandidate?.title}
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={() => deleteSchedule(deleteCandidate?.id)}
      />
    </div>
  );
}

export default SchedulePanel;