import { useRef } from "react";
import { Info, X } from "lucide-react";

// Reference values for the demo desk; a supplied visit timing record takes precedence.
const DEMO_TIMING = {
  appointmentRequest: "16/09/26  01:20 pm  Phone",
  appointmentDateTime: "17/09/26  10:45 am",
  reportedTime: "10:30 am",
  checkupTime: "10:40 am",
  treatmentTime: "10:42 am",
  finalizedTime: "10:45 am",
  duration: "00:15",
};
const TIMING_FIELDS = [
  ["Appointment Request", "appointmentRequest"],
  ["Appointment Dt-Time", "appointmentDateTime"],
  ["Reported Time", "reportedTime"],
  ["Check-up Time", "checkupTime"],
  ["Treatment Time", "treatmentTime"],
  ["Finalized Time", "finalizedTime"],
];

export default function OPTimeField({ patient, fieldStyle }) {
  const dialogRef = useRef(null);
  const timing = patient?.opTiming || DEMO_TIMING;
  return <>
    <div className="grid h-7 grid-cols-[48px_minmax(0,1fr)] items-center text-xs">
      <span style={{ color: "var(--color-text-muted)" }}>OP Time</span>
      <div className="flex min-w-0 items-center justify-between px-1">
        <span className="flex-1 font-semibold tabular-nums text-center pr-1">{timing.duration || "—"}</span>
        <button type="button" aria-label="View OP time breakdown" onClick={() => dialogRef.current?.showModal()} className="shrink-0 p-1 text-green-600"><Info size={15} /></button>
      </div>
    </div>
    <dialog ref={dialogRef} aria-labelledby="op-time-title" className="m-auto w-[390px] max-w-[calc(100vw-32px)] border p-4 shadow-xl backdrop:bg-black/40" style={fieldStyle}
      onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="op-time-title" className="text-sm font-semibold">OP Time</h2>
        <button type="button" aria-label="Close OP time breakdown" onClick={() => dialogRef.current.close()}><X size={18} /></button>
      </div>
      {!patient?.opTiming && <p className="mb-2 text-[11px]" style={{ color: "var(--color-text-muted)" }}>Sample visit timings</p>}
      <dl className="space-y-1 text-xs">
        {TIMING_FIELDS.map(([label, key]) => <div key={key} className="grid grid-cols-[140px_minmax(0,1fr)] gap-2"><dt>{label}</dt><dd className="tabular-nums">{timing[key] || "—"}</dd></div>)}
      </dl>
      <div className="mt-3 flex justify-end border-t pt-2 text-sm font-semibold tabular-nums" style={{ borderColor: "var(--color-border)" }}>{timing.duration || "—"}</div>
    </dialog>
  </>;
}
