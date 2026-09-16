import { queueEntry } from "./patientQueueData";

const present = value => value !== undefined && value !== null && value !== "" && value !== "—";
const unit = (value, suffix) => present(value)
  ? `${String(value).replace(new RegExp(`\\s*${suffix}$`, "i"), "")} ${suffix}` : null;

// Additional reference fields stay inside the existing compact sidebar cards.
export default function PatientCardDetails({ patient, types = [] }) {
  const entry = queueEntry(patient);
  const services = [...new Set([...entry.types, ...types])];
  const vitals = [
    present(patient.bpSystolic) && present(patient.bpDiastolic) ? `BP ${patient.bpSystolic}/${patient.bpDiastolic}` : null,
    present(patient.temp) ? `${String(patient.temp).replace(/\s*°?F$/i, "")} °F` : null,
    unit(patient.pulse, "bpm"),
    present(patient.oxygenLevel) ? `SpO₂ ${String(patient.oxygenLevel).replace(/%$/, "")}%` : null,
    patient.bloodGroup,
    present(patient.height) && /^\d+(\.\d+)?$/.test(String(patient.height)) ? unit(patient.height, "cm") : patient.height,
    unit(patient.weight, "kg"),
    present(patient.bmi) ? `BMI ${patient.bmi}` : null,
  ].filter(present);
  const identity = [
    patient.patientId || (!patient.id?.startsWith("emergency-") ? patient.id : null),
    [patient.token || patient.appt, patient.slot || patient.sched].filter(present).join(" · "),
  ].filter(present);

  return <div className="mt-1 space-y-1 text-xs break-words" style={{ color: "var(--color-text-muted)" }}>
    {identity.length > 0 && <div>{identity.join(" | ")}</div>}
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {[patient.room || patient.ipInfo?.room, patient.attendedTime, patient.waitTime]
        .filter(value => present(value) && value !== "-")
        .map((value, index) => <span key={index}>{value}</span>)}
    </div>
    <div aria-label="Vitals">{vitals.length ? vitals.join(" | ") : "Vitals: Not recorded"}</div>
    <div style={{ color: "var(--color-text-base)" }}>{patient.firstObservation || patient.complaint || patient.chiefComplaint || "Observation: Not recorded"}</div>
    {services.length > 0 && <div>{services.join(" / ")}</div>}
  </div>;
}
