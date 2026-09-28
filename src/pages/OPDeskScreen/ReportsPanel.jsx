import { useState, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import PatientCardDetails from "./PatientCardDetails";
import { REPORTS } from "./patientQueueData";
import PatientCardFilter from "./PatientCardFilter";
import { matchesPatientFilter } from "./patientFilterUtils";

// Builds the reported Date from a report entry. Tries several field names and
// accepts either a full timestamp or a separate date + time.
const parseReported = (item) => {
  const raw = item.reportedAt ?? item.reportedTime ?? item.reportTime ?? item.time ?? item.timestamp;
  if (!raw) return null;
  if (raw instanceof Date) return raw;

  // full timestamp, e.g. "2026-09-28T14:30:00"
  if (/^\d{4}-\d{2}-\d{2}[T ]/.test(String(raw))) {
    const d = new Date(raw);
    return isNaN(d) ? null : d;
  }

  // separate date + time, e.g. "14:30", "14:30:00", "2:30 PM"
  const m = String(raw).trim().match(/^(\d{1,2})[:.](\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!m || !item.date) return null;
  let h = +m[1];
  if (m[3]) h = (h % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
  const d = new Date(`${item.date}T00:00:00`);
  d.setHours(h, +m[2], 0, 0);
  return isNaN(d) ? null : d;
};

const formatWait = (from, now) => {
  if (!from) return null;
  const mins = Math.max(0, Math.floor((now - from) / 60000));
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`; // e.g. 01:20
};

const toDateKey = (date) => {
  const pad = value => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
};

const formatDateLabel = (dateKey) => {
  const parsed = parseDateKey(dateKey);
  if (!parsed) return "Filter by date";
  return parsed.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

function ReportsPanel({ panelHeight, patients = [], onSelectPatient }) {
  const headerH = 50;
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => parseDateKey(REPORTS[0]?.date) || new Date());
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000); // refresh every minute
    return () => clearInterval(id);
  }, []);

  // Patient name comes from the real patients list (by patientId), not a
  // positional match against a separate array — REPORTS can grow independently.
  const patientFor = (patientId) => patients.find(patient => patient.id === patientId) || { id: patientId, name: patientId };
  const filteredReports = REPORTS.filter(report => (!selectedDate || report.date === selectedDate)
    && matchesPatientFilter(patientFor(report.patientId), query, [report.report, report.type, report.status]));

  const reportDateCounts = useMemo(() => REPORTS.reduce((map, report) => {
    if (!report.date) return map;
    map.set(report.date, (map.get(report.date) || 0) + 1);
    return map;
  }, new Map()), []);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: first.getDay() }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [calendarMonth]);

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    const parsed = parseDateKey(date);
    if (parsed) setCalendarMonth(parsed);
  };

  const getTypeBadgeStyle = (type) => {
    if (type === "Lab") {
      return { bg: "#93c5fd", color: "#1e3a8a" };
    }
    return { bg: "#d8b4fe", color: "#581c87" };
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="shrink-0 px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#679cbc", borderColor: "var(--color-border)", height: headerH }}>
        <div className="flex items-center gap-2">
          <span className="text-md font-bold text-white">Patient Reports</span>
        </div>
      </div>
      <PatientCardFilter query={query} onChange={setQuery}>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
          <button
            type="button"
            aria-label="Filter by report date"
            onClick={() => setShowCalendar(value => !value)}
            className="h-[34px] min-w-[150px] rounded-none border pl-9 pr-3 text-left text-xs"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
          >
            {formatDateLabel(selectedDate)}
          </button>
          {selectedDate && (
            <button type="button" onClick={() => handleDateFilter("")} className="ml-1 text-xs underline">Clear</button>
          )}
          {showCalendar && (
            <div
              className="absolute right-0 top-full z-[100] mt-1 w-64 border p-2 shadow-xl"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  className="px-2 text-sm"
                  onClick={() => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                >
                  ‹
                </button>
                <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>
                  {calendarMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                </div>
                <button
                  type="button"
                  className="px-2 text-sm"
                  onClick={() => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) return <div key={`empty-${index}`} />;
                  const dateKey = toDateKey(date);
                  const count = reportDateCounts.get(dateKey) || 0;
                  const isSelected = selectedDate === dateKey;
                  const isEarlier = date < new Date(new Date().setHours(0, 0, 0, 0));
                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => { handleDateFilter(dateKey); setShowCalendar(false); }}
                      className="relative h-8 rounded-none border text-[11px]"
                      style={{
                        borderColor: isSelected ? "#679cbc" : "var(--color-border)",
                        background: count ? (isEarlier ? "#e0f2fe" : "#ecfdf5") : "var(--color-surface)",
                        color: count ? "var(--color-text-base)" : "var(--color-text-muted)",
                        boxShadow: isSelected ? "inset 0 0 0 1px #679cbc" : "none",
                      }}
                      title={count ? `${count} report${count === 1 ? "" : "s"}` : "No reports"}
                    >
                      {date.getDate()}
                      {count > 0 && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" style={{ background: "#679cbc" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PatientCardFilter>
      <div className="patient-card-scrollbar min-h-0 flex-1 p-3 space-y-2 overflow-y-auto">
        {filteredReports.length === 0 ? (
          <div className="text-center py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>No reports found</div>
        ) : (
          filteredReports.map((item, i) => {
            const badgeStyle = getTypeBadgeStyle(item.type);
            const patient = patientFor(item.patientId);
            const waitTime = formatWait(parseReported(item), now);
            const statusBadge = item.status === "Pending"
              ? { label: item.status, background: "#fcd34d", color: "#78350f", position: "left" }
              : { label: item.status, background: "#86efac", color: "#14532d", position: "left" };
            const typeBadge = { label: item.type, background: badgeStyle.bg, color: badgeStyle.color, position: "right" };
            return (
              <button key={i} type="button" onClick={() => onSelectPatient?.(patient)} className="w-full p-2 border text-left hover:bg-blue-50" style={{ borderColor: "var(--color-border)" }}>
                <PatientCardDetails patient={patient} status={[typeBadge, statusBadge]} hideAppointment waitTime={waitTime} compact />
                <div className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{item.report}</div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ReportsPanel;
