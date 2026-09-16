import PatientQueuePanel from "./PatientQueuePanel";
import { queueEntry } from "./patientQueueData";

export default function ReportsPanel({ panelHeight, patients = [], onSelectPatient }) {
  const entries = patients.map(queueEntry).filter(entry => entry.reports.length);
  return <PatientQueuePanel variant="reports" title="Patient Reports" entries={entries} panelHeight={panelHeight} onSelectPatient={onSelectPatient} showReportDate />;
}
