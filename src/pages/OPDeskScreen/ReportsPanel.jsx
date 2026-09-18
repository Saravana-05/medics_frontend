import { useState } from "react";
import { Calendar } from "lucide-react";
import PatientCardDetails from "./PatientCardDetails";
import { REPORTS } from "./patientQueueData";
import PatientCardFilter from "./PatientCardFilter";
import { matchesPatientFilter } from "./patientFilterUtils";

function ReportsPanel({ panelHeight, patients = [] }) {
  const headerH = 50;
  const [selectedDate, setSelectedDate] = useState("");
  const [query, setQuery] = useState("");
  // Patient name comes from the real patients list (by patientId), not a
  // positional match against a separate array — REPORTS can grow independently.
  const patientFor = (patientId) => patients.find(patient => patient.id === patientId) || { id: patientId, name: patientId };
  const filteredReports = REPORTS.filter(report => (!selectedDate || report.date === selectedDate)
    && matchesPatientFilter(patientFor(report.patientId), query, [report.report, report.type, report.status]));

  const handleDateFilter = (date) => {
    setSelectedDate(date);
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
          {/* <FileText size={16} style={{ color: "var(--color-primary)" }} /> */}
          <span className="text-md font-bold text-white" >Patient Reports</span>
        </div>

      </div>
      <PatientCardFilter query={query} onChange={setQuery}>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="date"
            aria-label="Filter by report date"
            value={selectedDate}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="pl-9 pr-3 text-sm rounded-none border"
            style={{ height: 40, borderColor: "var(--color-border)", background: "var(--color-surface)" }}
            placeholder="Filter by date"
          />
        </div>
      </PatientCardFilter>
      <div className="patient-card-scrollbar min-h-0 flex-1 p-3 space-y-2 overflow-y-auto">
        {filteredReports.length === 0 ? (
          <div className="text-center py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>No reports found</div>
        ) : (
          filteredReports.map((item, i) => {
            const badgeStyle = getTypeBadgeStyle(item.type);
            const patient = patientFor(item.patientId);
            const statusBadge = item.status === "Pending"
              ? { label: item.status, background: "#fcd34d", color: "#78350f", position: "right" }
              : { label: item.status, background: "#86efac", color: "#14532d", position: "right" };
            const typeBadge = { label: item.type, background: badgeStyle.bg, color: badgeStyle.color, position: "left" };
            return (
              <div key={i} className="p-2 border" style={{ borderColor: "var(--color-border)" }}>
                <PatientCardDetails patient={patient} status={[typeBadge, statusBadge]} />
                <div className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{item.report}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ReportsPanel;