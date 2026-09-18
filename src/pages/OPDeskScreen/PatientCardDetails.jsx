import { queueEntry } from "./patientQueueData";

const present = value => value !== undefined && value !== null && value !== "" && value !== "—";
const unit = (value, suffix) => present(value)
  ? `${String(value).replace(new RegExp(`\\s*${suffix}$`, "i"), "")} ${suffix}` : null;

// Doc: a parked patient's reason is Lab, Service, or unspecified/temporary ("***" —
// discussion with another doctor, rest for BP check, urgent drip, etc). Lab/Service
// patients are also placed in the  pending external department response.
const PARK_REASON_STYLES = {
  lab: { label: "Lab Report Pending", background: "#dbeafe", color: "#1d4ed8" },
  service: { label: "Service Report Pending", background: "#f3e8ff", color: "#7e22ce" },
  other: { label: "Parked · No Reason Specified", background: "#e5e7eb", color: "#4b5563" },
};

function resolveParkReason(patient) {
  const isParked = String(patient.status || patient.listSection || "").toLowerCase().includes("park");
  if (!isParked) return null;
  const raw = String(patient.parkReason || patient.whyParked || patient.parkType || "").trim().toLowerCase();
  if (raw === "lab") return PARK_REASON_STYLES.lab;
  if (raw === "service") return PARK_REASON_STYLES.service;
  return PARK_REASON_STYLES.other;
}

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
  const parkReason = resolveParkReason(patient);

  return <div className="mt-1 space-y-1 text-xs break-words" style={{ color: "var(--color-text-muted)" }}>
    {identity.length > 0 && <div>{identity.join(" | ")}</div>}
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {[patient.room || patient.ipInfo?.room, patient.attendedTime, patient.waitTime]
        .filter(value => present(value) && value !== "-")
        .map((value, index) => <span key={index}>{value}</span>)}
    </div>
    {parkReason && (
      <div>
        <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: parkReason.background, color: parkReason.color }}>
          {parkReason.label}
        </span>
      </div>
    )}
    <div aria-label="Vitals">{vitals.length ? vitals.join(" | ") : "Vitals: Not recorded"}</div>
    <div style={{ color: "var(--color-text-base)" }}>{patient.firstObservation || patient.complaint || patient.chiefComplaint || "Observation: Not recorded"}</div>
    {services.length > 0 && <div>{services.join(" / ")}</div>}
  </div>;
}