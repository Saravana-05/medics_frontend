export default function ParkedPatientsPanel({ panelHeight, patients = [], onSelectPatient }) {
  const parked = patients.filter(patient => patient.listSection === "parked");
  return <div className="flex flex-col overflow-hidden rounded-lg shadow-xl" style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
    <div className="shrink-0 border-b px-3 py-3 text-md font-bold text-white" style={{ background: "#eb6367" }}>Parked Patients ({parked.length})</div>
    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
      {parked.map(patient => <button key={patient.id} onClick={() => onSelectPatient?.(patient)} className="w-full rounded-lg border p-3 text-left hover:bg-blue-50" style={{ borderColor: "var(--color-border)" }}>
        <div className="text-sm font-semibold">{patient.name}</div>
        <div className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{patient.id} · {patient.status}{patient.room ? ` · Room ${patient.room}` : ""}</div>
        <div className="mt-1 text-xs">{patient.complaint}</div>
      </button>)}
      {!parked.length && <p className="py-6 text-center text-sm">No parked patients</p>}
    </div>
  </div>;
}
