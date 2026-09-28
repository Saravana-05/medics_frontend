import PatientCardDetails from "./PatientCardDetails";
import { useState } from "react";
import PatientCardFilter from "./PatientCardFilter";
import { matchesPatientFilter } from "./patientFilterUtils";
import { queueEntry } from "./patientQueueData";

const EMPTY_REASON_BADGE = { label: "***", background: "#9ca3af", color: "#111827", position: "right" };
const explicitParkReason = patient => patient?.parkReason || patient?.parkedReason || patient?.parkingReason || patient?.reason || "";
const parkedStatusFor = patient => {
  if (explicitParkReason(patient)) return [];
  return queueEntry(patient).types.length ? [] : [EMPTY_REASON_BADGE];
};

export default function ParkedPatientsPanel({ panelHeight, patients = [], onSelectPatient }) {
  const [query, setQuery] = useState("");
  const parked = patients.filter(patient => {
    if (!patient || (patient.listSection !== "parked" && patient.appointmentStatus !== "parked")) return false;
    const reasonSearch = parkedStatusFor(patient).length ? ["***"] : [explicitParkReason(patient)];
    return matchesPatientFilter(patient, query, [...reasonSearch, patient.status, patient.appointmentStatus, patient.listSection]);
  });
  return <div className="flex flex-col overflow-hidden shadow-xl" style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
    <div className="shrink-0 border-b px-3 py-3 text-md font-bold text-white" style={{ background: "#eb6367" }}>Parked Patients ({parked.length})</div>
    <PatientCardFilter query={query} onChange={setQuery} />
    <div className="patient-card-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
      {parked.map(patient => <button key={patient.id} onClick={() => onSelectPatient?.(patient)} className="w-full border p-3 text-left hover:bg-blue-50" style={{ borderColor: "var(--color-border)" }}>
        <PatientCardDetails patient={patient} status={parkedStatusFor(patient)} hideAppointment hideServices compact />
      </button>)}
      {!parked.length && <p className="py-6 text-center text-sm">{query ? "No patients match this filter" : "No parked patients"}</p>}
    </div>
  </div>;
}
