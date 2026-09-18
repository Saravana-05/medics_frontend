import PatientCardDetails from "./PatientCardDetails";
import { useState } from "react";
import PatientCardFilter from "./PatientCardFilter";
import { matchesPatientFilter } from "./patientFilterUtils";
import { EMERGENCY_CASES, queueEntry } from "./patientQueueData";

const URGENT_BADGE = { label: "Urgent", background: "#fee2e2", color: "#b91c1c" };

function EmergencyPatientsPanel({ panelHeight, patients = [], removedIds = [], onRemove }) {
  const [query, setQuery] = useState("");
  const headerH = 50;
  const cases = [...patients.filter(patient => queueEntry(patient).posted.includes("Emergency")), ...EMERGENCY_CASES]
    .filter(patient => !removedIds.includes(patient.id) && matchesPatientFilter(patient, query, ["Urgent", ...queueEntry(patient).types]));
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
          <div key={c.id} className="p-2 border" style={{ borderColor: "var(--color-border)" }}>
            <PatientCardDetails patient={c} status={URGENT_BADGE} />
            <div className="mt-2 flex justify-center"><button type="button" onClick={() => onRemove?.(c.id)}
              aria-label={`Remove ${c.name} from Emergency`} className="rounded-none border px-3 py-1 text-xs font-medium"
              style={{ color: "#b91c1c", background: "#fee2e2", borderColor: "#fca5a5" }}>Remove</button></div>
          </div>
        ))}
        {!cases.length && <p className="py-6 text-center text-sm">{query ? "No patients match this filter" : "No emergency patients"}</p>}
      </div>
    </div>
  );
}

export default EmergencyPatientsPanel;