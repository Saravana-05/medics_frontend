import PatientCardDetails from "./PatientCardDetails";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import PatientCardFilter from "./PatientCardFilter";
import { matchesPatientFilter } from "./patientFilterUtils";
import { EMERGENCY_CASES, queueEntry } from "./patientQueueData";

// Backgrounds are transparent in this panel; only the text color is kept.
const STATUS_BADGES = {
  Pending: { label: "Pending", background: "transparent", color: "#78350f", position: "left" },
  Ready: { label: "Ready", background: "transparent", color: "#14532d", position: "left" },
};

const URGENT_BADGE = { label: "Urgent", background: "transparent", color: "#b91c1c", position: "right" };

const TYPE_BADGES = {
  Lab: { label: "Lab", background: "transparent", color: "#1e3a8a", position: "right" },
  Service: { label: "Service", background: "transparent", color: "#581c87", position: "right" },
};

function emergencyBadges(patient) {
  const entry = queueEntry(patient);
  const reportStatus = entry.reports.find(report => /^(pending|ready)$/i.test(report.status || ""))?.status;
  const statusBadge = STATUS_BADGES[/^ready$/i.test(reportStatus || "") ? "Ready" : "Pending"];
  const typeBadges = entry.types
    .filter(type => TYPE_BADGES[type])
    .map(type => TYPE_BADGES[type]);
  return [statusBadge, ...typeBadges, URGENT_BADGE];
}

function EmergencyPatientsPanel({ panelHeight, patients = [], removedIds = [], onSelectPatient, onRemove }) {
  const [query, setQuery] = useState("");
  const headerH = 50;
  const cases = [...patients.filter(patient => queueEntry(patient).posted.includes("Emergency")), ...EMERGENCY_CASES]
    .filter(patient => !removedIds.includes(patient.id) && matchesPatientFilter(patient, query, ["Pending", "Ready", "Urgent", ...queueEntry(patient).types]));
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="shrink-0 px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#73bfb8", borderColor: "#73bfb8", height: headerH }}>
        <span className="text-md font-bold text-white">Emergency Cases ({cases.length})</span>
      </div>
      <PatientCardFilter query={query} onChange={setQuery} />
      <div className="patient-card-scrollbar min-h-0 flex-1 p-3 space-y-2 overflow-y-auto">
        {cases.map(c => (
          <div key={c.id} className="relative">
            <button type="button" onClick={() => onSelectPatient?.(c)} className="w-full p-2 border text-left hover:bg-blue-50" style={{ borderColor: "var(--color-border)" }}>
              <PatientCardDetails patient={c} status={emergencyBadges(c)} hideAppointment hideServices compact />
            </button>
            <button
  type="button"
  onClick={(event) => { event.stopPropagation(); onRemove?.(c.id); }}
  aria-label={`Remove ${c.name} from Emergency`}
  title="Remove"
  className="absolute bottom-1 right-3 flex h-6 w-6 items-center justify-center bg-transparent border-0 p-0"
  style={{ color: "#b91c1c" }}
>
  <Trash2 size={13} />
</button>
          </div>
        ))}
        {!cases.length && <p className="py-6 text-center text-sm">{query ? "No patients match this filter" : "No emergency patients"}</p>}
      </div>
    </div>
  );
}

export default EmergencyPatientsPanel;