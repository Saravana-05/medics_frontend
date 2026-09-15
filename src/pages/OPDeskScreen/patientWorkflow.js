// Pure state transitions for the mock desk. Finalising IP care marks readiness;
// actual discharge and room release belong to the admission/discharge workflow.
export function transitionPatient(patient, action) {
  if (!patient) return { error: "Select a patient first." };
  if (!["op", "ip"].includes(patient.listType)) return { error: "This patient has no active OP or IP visit." };
  if (["treated", "ready", "discharged"].includes(patient.listSection)) return { error: "This visit is already finalised." };
  if (!["park", "finalise"].includes(action)) return { error: "Unknown patient action." };
  const isOp = patient.listType === "op";
  const parked = action === "park";
  return { patient: {
    ...patient,
    listSection: parked ? "parked" : isOp ? "treated" : "ready",
    appointmentStatus: parked ? "parked" : "completed",
    status: parked ? (isOp ? "OP-Parked" : "IP-Parked") : isOp ? "OP-Treated" : "IP-To Discharge",
  } };
}
