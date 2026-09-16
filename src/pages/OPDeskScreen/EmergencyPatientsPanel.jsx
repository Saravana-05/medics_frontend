import PatientQueuePanel from "./PatientQueuePanel";
import { EMERGENCY_CASES, queueEntry } from "./patientQueueData";

export default function EmergencyPatientsPanel({ panelHeight, patients = [], removedIds = [], onRemove, removedEntry, onUndo, onSelectPatient }) {
  const cases = patients.filter(patient => queueEntry(patient).posted.includes("Emergency"));
  const entries = [...cases, ...EMERGENCY_CASES].filter(patient => !removedIds.includes(patient.id)).map(queueEntry);
  return <PatientQueuePanel variant="emergency" title="Emergency Patients" entries={entries} panelHeight={panelHeight} onRemove={onRemove} removedEntry={removedEntry} onUndo={onUndo} onSelectPatient={patient => { if (!patient.id.startsWith("emergency-")) onSelectPatient?.(patient); }} />;
}
