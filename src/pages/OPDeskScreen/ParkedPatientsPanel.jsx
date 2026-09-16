import PatientCardDetails from "./PatientCardDetails";
import { useState } from "react";
import PatientCardFilter from "./PatientCardFilter";
import { matchesPatientFilter } from "./patientFilterUtils";
import { queueEntry } from "./patientQueueData";

export default function ParkedPatientsPanel({ panelHeight, patients = [], onSelectPatient }) {
  const [query, setQuery] = useState("");
  const parked = patients.filter(patient => (patient.listSection === "parked" || patient.appointmentStatus === "parked")
    && matchesPatientFilter(patient, query, queueEntry(patient).types));
  return <div className="flex flex-col overflow-hidden rounded-lg shadow-xl" style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
    <div className="shrink-0 border-b px-3 py-3 text-md font-bold text-white" style={{ background: "#eb6367" }}>Parked Patients ({parked.length})</div>
    <PatientCardFilter query={query} onChange={setQuery} />
    <div className="patient-card-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
      {parked.map(patient => <button key={patient.id} onClick={() => onSelectPatient?.(patient)} className="w-full rounded-lg border p-3 text-left hover:bg-blue-50" style={{ borderColor: "var(--color-border)" }}>
        <div className="text-sm font-semibold">{patient.name}</div>
        <PatientCardDetails patient={patient} />
      </button>)}
      {!parked.length && <p className="py-6 text-center text-sm">{query ? "No patients match this filter" : "No parked patients"}</p>}
    </div>
  </div>;
}
