import { getPatientRecord } from "./patientRecordStore";

// Existing demo reports, now grouped by patient in the sidebar lists.
export const REPORTS = [
  { patientId: "OPL-001", report: "Complete Blood Count", type: "Lab", status: "Pending", date: "2024-03-03" },
  { patientId: "OPL-002", report: "Lipid Profile", type: "Lab", status: "Pending", date: "2024-03-03" },
  { patientId: "OPL-003", report: "Liver Function Test", type: "Lab", status: "Ready", date: "2024-03-02" },
  { patientId: "OPL-004", report: "X-Ray Chest", type: "Service", status: "Ready", date: "2024-03-02" },
  { patientId: "OPL-005", report: "ECG", type: "Service", status: "Ready", date: "2024-03-01" },
];

// Preserve the existing emergency demo cases without inventing clinical values.
export const EMERGENCY_CASES = [
  { id: "emergency-meena", name: "Meena Iyer", firstObservation: "High fever (104°F) - Critical", priority: "Emergency" },
  { id: "emergency-ramesh", name: "Ramesh Gupta", firstObservation: "Chest pain - Under observation", priority: "Emergency" },
];

export function queueEntry(patient) {
  const record = getPatientRecord(patient.id);
  const reports = REPORTS.filter(report => report.patientId === patient.id);
  const types = new Set(reports.map(report => report.type));
  if (record?.labs?.length) types.add("Lab");
  if (record?.services?.length) types.add("Service");
  const posted = [];
  if (patient.listSection === "parked" || patient.appointmentStatus === "parked") posted.push("Parked");
  if (reports.length) posted.push("Reports");
  if ([patient.priority, patient.appointment?.priority].some(value => /^(emergency|urgent)$/i.test(value || ""))) posted.push("Emergency");
  return { patient, reports, types: [...types], posted };
}
