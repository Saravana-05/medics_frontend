import { queueEntry } from "./patientQueueData";

const present = value => value !== undefined && value !== null && value !== "" && value !== "—";
const unit = (value, suffix) => present(value)
  ? `${String(value).replace(new RegExp(`\\s*${suffix}$`, "i"), "")} ${suffix}` : null;

// Doc: a parked patient's reason is Lab, Service, or unspecified/temporary ("***" —
// discussion with another doctor, rest for BP check, urgent drip, etc). Lab/Service
// patients are also placed in the pending external department response.
const PARK_REASON_STYLES = {
  lab: { label: "Lab", background: "#93c5fd", color: "#1e3a8a" },
  service: { label: "Service", background: "#d8b4fe", color: "#581c87" },
  other: { label: "****", background: "#9ca3af", color: "#111827" },
};

// A parked patient's reason (Lab/Service pending, or unspecified/temporary — "****")
// comes from queueEntry(patient).types, the same Lab/Service tags the services row
// uses — derived from matching REPORTS entries and record.labs/record.services in
// patientQueueData.js. There's no separate "reason" field on the patient record.
function resolveParkReason(patient, entryTypes = []) {
  const isParked = String(patient.status || patient.listSection || patient.appointmentStatus || "").toLowerCase().includes("park");
  if (!isParked) return null;
  const typesLower = entryTypes.map(type => String(type).toLowerCase());
  if (typesLower.includes("lab")) return PARK_REASON_STYLES.lab;
  if (typesLower.includes("service")) return PARK_REASON_STYLES.service;
  return PARK_REASON_STYLES.other;
}

// A thin horizontal rule between sections of the card.
function Divider() {
  return <div style={{ borderTop: "1px solid var(--color-border)" }} className="my-1.5" />;
}

// Additional reference fields stay inside the existing compact sidebar cards.
// `status` is an optional badge, or array of badges (e.g. Urgent, or a report's
// type + Pending/Ready), rendered next to the patient name — each with an
// optional `position: "left" | "right"` (default "right"). The auto-derived
// parked-reason badge (Lab/Service/**** Report Pending) only applies when the
// caller does NOT pass `status` explicitly — a caller that supplies its own
// badges (e.g. ReportsPanel) takes full control, so a patient who happens to
// be both parked and have a report doesn't get the reason shown twice. Every
// badge's label is excluded from the services row below so nothing repeats there.
export default function PatientCardDetails({ patient, types = [], status }) {
  const entry = queueEntry(patient);
  const parkBadge = status ? null : resolveParkReason(patient, entry.types);
  const badges = [parkBadge, ...(Array.isArray(status) ? status : status ? [status] : [])].filter(Boolean);
  const leftBadges = badges.filter(badge => badge.position === "left");
  const rightBadges = badges.filter(badge => badge.position !== "left");
  const badgeLabels = new Set(badges.map(badge => badge.label));
  const services = [...new Set([...entry.types, ...types])].filter(type => !badgeLabels.has(type));
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
    ...[patient.room || patient.ipInfo?.room, patient.attendedTime, patient.waitTime].filter(value => present(value) && value !== "-"),
  ].filter(present);
  const observation = patient.firstObservation || patient.complaint || patient.chiefComplaint || "Observation: Not recorded";

  return <div className="mt-1 text-xs break-words" style={{ color: "var(--color-text-muted)" }}>
    <div className="flex items-center gap-2">
      {leftBadges.map((badge, index) => (
        <span key={index} className="shrink-0 inline-block px-1.5 py-0.5 text-[10px] font-bold" style={{ background: badge.background, color: badge.color }}>
          {badge.label}
        </span>
      ))}
      <span className="min-w-0 flex-1 truncate text-sm font-semibold" style={{ color: "var(--color-text-base)" }}>{patient.name}</span>
      {rightBadges.length > 0 && (
        <span className="shrink-0 flex items-center gap-1">
          {rightBadges.map((badge, index) => (
            <span key={index} className="inline-block px-1.5 py-0.5 text-[10px] font-bold" style={{ background: badge.background, color: badge.color }}>
              {badge.label}
            </span>
          ))}
        </span>
      )}
    </div>
    <Divider />

    {identity.length > 0 && <>
      <div>{identity.join(" | ")}</div>
      <Divider />
    </>}

    <div aria-label="Vitals" className="truncate text-[10px]">
      {vitals.length ? vitals.join(" | ") : "Vitals: Not recorded"}
    </div>
    <Divider />

    <div style={{ color: "var(--color-text-base)" }}>{observation}</div>

    {services.length > 0 && <>
      <Divider />
      <div>{services.join(" / ")}</div>
    </>}
  </div>;
}