import PatientQueuePanel from "./PatientQueuePanel";
import { queueEntry } from "./patientQueueData";

export default function ParkedPatientsPanel({ panelHeight, patients = [], onSelectPatient }) {
  const entries = patients.filter(patient => patient.listSection === "parked" || patient.appointmentStatus === "parked").map(queueEntry);
  return <PatientQueuePanel variant="parked" title="Parked Patients" entries={entries} panelHeight={panelHeight} onSelectPatient={onSelectPatient} />;
}
