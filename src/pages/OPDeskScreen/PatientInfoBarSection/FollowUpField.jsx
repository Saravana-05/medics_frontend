import { useState } from "react";
import { localDateValue, prescriptionDuration, dateAfterDays, daysUntilDate } from "../followUpDate";

export default function FollowUpField({ drugs, fieldStyle }) {
  const [editable, setEditable] = useState(false);
  const [manualDays, setManualDays] = useState(0);
  const today = localDateValue();
  const defaultDays = prescriptionDuration(drugs);
  const days = editable ? manualDays : defaultDays;
  const date = dateAfterDays(today, days);
  const inputClass = "min-w-0 h-[34px] px-1 text-[11px] tabular-nums border shadow-sm focus:outline-2 focus:outline-offset-1";

  return <div className="grid grid-cols-[50px_38px_minmax(0,1fr)] items-center gap-1 min-w-0">
    <label className="flex min-w-0 flex-col items-start gap-0.5">
    <span className="whitespace-nowrap text-[10px]" style={{ color: "var(--color-text-muted)" }}>Follow Up</span>
    <input type="checkbox" aria-label="Edit follow up" checked={editable}
      onChange={event => { setManualDays(defaultDays); setEditable(event.target.checked); }}
      className="shrink-0" />
    </label>
    <input type="number" min="0" max="36500" step="1" aria-label="Follow up days" title="Follow up days"
      value={days} readOnly={!editable}
      onChange={event => {
        if (!editable) return;
        const next = Number(event.target.value);
        if (Number.isInteger(next) && next >= 0 && next <= 36500) setManualDays(next);
      }} className={`${inputClass} w-full`} style={fieldStyle} />
    <input type="date" aria-label="Follow up date" min={today} max={dateAfterDays(today, 36500)}
      value={date} readOnly={!editable}
      onChange={event => {
        if (!editable) return;
        const next = daysUntilDate(today, event.target.value);
        if (Number.isInteger(next) && next >= 0 && next <= 36500) setManualDays(next);
      }} className={`${inputClass} w-full`} style={fieldStyle} />
  </div>;
}
