import { useState } from "react";
import { ClipboardList, ListFilter } from "lucide-react";
import "./PatientQueuePanel.css";

const muted = { color: "var(--color-text-muted)" };
const border = { borderColor: "var(--color-border)" };
const present = value => value !== undefined && value !== null && value !== "" && value !== "—";

function VitalLine({ patient: p }) {
  const withUnit = (value, unit) => present(value) ? `${String(value).replace(new RegExp(`\\s*${unit}$`, "i"), "")} ${unit}` : null;
  const main = [
    [p.bpSystolic && p.bpDiastolic ? `${p.bpSystolic}/${p.bpDiastolic} mmHg` : null, "BP", "Blood pressure"],
    [present(p.temp) ? `${String(p.temp).replace(/°?F$/i, "")} °F` : null, "Temp", "Temperature"],
    [withUnit(p.pulse, "bpm"), "Pulse", "Pulse rate"],
    [present(p.oxygenLevel) ? `${String(p.oxygenLevel).replace(/%$/, "")}%` : null, "SpO₂", "Oxygen saturation"],
  ].filter(([value]) => present(value));
  const more = [
    [p.bloodGroup, "Blood", "Blood group"],
    [present(p.height) && /^\d+(\.\d+)?$/.test(String(p.height)) ? `${p.height} cm` : p.height, "Height", "Height"],
    [withUnit(p.weight, "kg"), "Weight", "Weight"],
    [present(p.bmi) ? `${p.bmi} kg/m²` : null, "BMI", "Body mass index"],
  ].filter(([value]) => present(value));
  const readings = values => <dl className="patient-queue__vitals">{values.map(([value, label, description]) => <div key={label}><dt title={description}>{label}</dt><dd>{value}</dd></div>)}</dl>;
  if (!main.length && !more.length) return <span className="patient-queue__missing">Not recorded</span>;
  return <div aria-label="Vitals">
    {readings(main)}
    {more.length > 0 && <details className="patient-queue__more-vitals"><summary>More vitals</summary>{readings(more)}</details>}
  </div>;
}

export default function PatientQueuePanel({ title, variant = "parked", entries, panelHeight, onSelectPatient, onRemove, removedEntry, onUndo, showReportDate = false }) {
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const filtered = entries.filter(({ patient, reports, types, posted }) => {
    const searchable = [patient.name, patient.id, patient.patientId, patient.room, patient.firstObservation, patient.complaint, ...types, ...posted, ...reports.map(report => report.report)].filter(Boolean).join(" ").toLowerCase();
    return searchable.includes(query.trim().toLowerCase()) && (!type || types.includes(type)) && (!date || reports.some(report => report.date === date));
  });
  const hasFilters = Boolean(query || type || date);
  return <section aria-label={title} className={`patient-queue patient-queue--${variant}`} style={{ height: panelHeight }}>
    <header className="patient-queue__header">
      <h2 className="patient-queue__title"><ClipboardList size={17} />{title} <span className="patient-queue__count">{filtered.length}</span></h2>
      <button type="button" aria-expanded={showFilters} onClick={() => setShowFilters(value => !value)} className="patient-queue__filter-button">
        <ListFilter size={14} /> Filter{hasFilters ? " •" : ""}
      </button>
    </header>
    {showFilters && <div className="flex shrink-0 flex-wrap items-end gap-2 border-b p-2 text-xs" style={{ ...border, background: "var(--color-surface-alt)" }}>
      <label className="min-w-[140px] flex-1"><span className="mb-1 block" style={muted}>Find patient</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, ID, room or observation" className="h-8 w-full border bg-transparent px-2" style={border} /></label>
      <label><span className="mb-1 block" style={muted}>Lab/Service</span><select value={type} onChange={event => setType(event.target.value)} className="h-8 border bg-transparent px-2" style={border}><option value="">All</option><option>Lab</option><option>Service</option></select></label>
      {showReportDate && <label><span className="mb-1 block" style={muted}>Report date</span><input type="date" value={date} onChange={event => setDate(event.target.value)} className="h-8 border bg-transparent px-2" style={border} /></label>}
      <button type="button" onClick={() => { setQuery(""); setType(""); setDate(""); }} className="h-8 px-2 underline">Clear</button>
    </div>}
    {removedEntry && <div role="status" className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2 text-xs" style={border}>
      <span>{removedEntry.name} removed from Emergency.</span><button type="button" onClick={onUndo} className="font-semibold underline">Undo</button>
    </div>}
    <div className="patient-queue__scroll" role="region" aria-label={`${title} table`} tabIndex={0}>
      <table className="patient-queue__table">
        <colgroup>
          <col style={{ width: 110 }} /><col style={{ width: 70 }} /><col style={{ width: 75 }} />
          <col style={{ width: 50 }} /><col style={{ width: 65 }} /><col style={{ width: 60 }} />
          <col style={{ width: 160 }} /><col style={{ width: 115 }} /><col style={{ width: 100 }} />
          {onRemove && <col style={{ width: 65 }} />}
        </colgroup>
        <thead>
          <tr>
            {["Patient name", "Patient ID", "Slot / Time", "Room", "Attd. time", "Wait time", "Vitals", "Observation", "Lab / Service", ...(onRemove ? ["Action"] : [])].map(label => <th key={label} scope="col">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {filtered.map(({ patient, reports, types, posted }) => <tr key={patient.id}>
            <td>
              {onSelectPatient && !patient.id?.startsWith("emergency-") ? <button type="button" onClick={() => onSelectPatient(patient)} className="patient-queue__patient">{patient.name}</button> : <span className="patient-queue__patient">{patient.name}</span>}
            </td>
            <td className="patient-queue__numeric">{!patient.id?.startsWith("emergency-") ? patient.patientId || patient.id : ""}</td>
            <td className="patient-queue__numeric"><span className="block">{patient.token || patient.appt}</span><span className="block" style={muted}>{patient.slot || patient.sched}</span></td>
            <td>{patient.room || patient.ipInfo?.room || ""}</td>
            <td className="patient-queue__numeric">{patient.attendedTime || ""}</td>
            <td className="patient-queue__numeric">{patient.waitTime || ""}</td>
            <td><VitalLine patient={patient} /></td>
            <td className="patient-queue__observation">{patient.firstObservation || patient.complaint || patient.chiefComplaint}</td>
            <td>
              <div className="font-semibold">{types.join(" / ") || (posted.includes("Emergency") ? "Urgent" : "")}</div>
              {reports.map(report => <div key={report.report} className="patient-queue__report"><span>{report.report}</span><span className={`patient-queue__status patient-queue__status--${report.status.toLowerCase()}`}>{report.status}</span><time dateTime={report.date} style={muted}>{report.date.split("-").reverse().join("/")}</time></div>)}
            </td>
            {onRemove && <td><button type="button" aria-label={`Remove ${patient.name} from Emergency`} onClick={() => onRemove(patient)} className="patient-queue__remove">Remove</button></td>}
          </tr>)}
          {!filtered.length && <tr><td colSpan={onRemove ? 10 : 9} className="patient-queue__empty">{hasFilters ? "No patients match these filters." : "No patients in this list."}</td></tr>}
        </tbody>
      </table>
    </div>
    <footer className="patient-queue__footer"><span>{filtered.length} of {entries.length} patients</span><span>Scroll to view all columns</span></footer>
  </section>;
}
