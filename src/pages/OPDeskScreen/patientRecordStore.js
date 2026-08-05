// In-memory, session-only store of each patient's saved prescription data —
// same pattern as PreviousVisitsTable's globalPrescriptionHistory. No backend
// yet, so this resets on page refresh; it exists purely so switching patients
// and back preserves what was saved via the Save button.
let store = {};

export function savePatientRecord(patientId, data) {
  if (!patientId) return;
  store[patientId] = { ...store[patientId], ...data };
}

export function getPatientRecord(patientId) {
  if (!patientId) return null;
  return store[patientId] || null;
}
