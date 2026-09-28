export function matchesPatientFilter(patient, query, extra = []) {
  return [patient.name, patient.id, patient.patientId, patient.room, patient.ipInfo?.room,
    patient.token, patient.appt, patient.slot, patient.firstObservation, patient.complaint,
    patient.chiefComplaint, patient.status, patient.appointmentStatus, patient.listSection,
    patient.ipInfo?.ward, patient.ipInfo?.bed, patient.ipInfo?.consultant, ...extra]
    .filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase());
}
