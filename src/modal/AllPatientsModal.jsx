import { useEffect, useRef, useState } from "react";
import { Users, Search, X, UserRound } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import useWorkspaceModalLayout from "../hooks/useWorkspaceModalLayout";

const columns = ["Patient ID", "Patient Name", "Initial", "City", "Phone", "Care-of Phone", "Age", "Age Group"];
const ageGroup = patient => {
  if (patient.ageGroup) return patient.ageGroup;
  if (patient.age === null || patient.age === undefined || patient.age === "") return "";
  const age = Number(patient.age);
  if (!Number.isFinite(age) || age < 0) return "";
  return age < 18 ? "Child" : age < 60 ? "Adult" : "Senior";
};

const patientValues = p => [
  p.patientId || p.id,
  p.name,
  p.initial || p.name?.match(/\.\s*([A-Za-z]{1,3})\.?$/)?.[1],
  p.city || p.address?.city,
  p.phone || p.address?.phone,
  p.careOfPhone || p.attendant?.phone,
  p.age,
  ageGroup(p),
];

const sidebarFields = p => [
  ["Patient ID", p.patientId || p.id],
  ["DOB", p.dob],
  ["Blood Group", p.bloodGroup],
  ["Care-of Name", [p.careOfName || p.attendant?.name, p.attendant?.relationship ? `(${p.attendant.relationship})` : ""].filter(Boolean).join(" ")],
  ["Marital Status", p.maritalStatus || "Married"],
  ["Gender", p.gender],
];
const displayValue = value => value === undefined || value === null || value === "" ? "—" : value;

export default function AllPatientsModal({ patients = [], verticalAnchorRef, onClose, onSelectPatient }) {
  const { modalRef, verticalBounds, dragOffset, dragHandlers } = useWorkspaceModalLayout(verticalAnchorRef, 118);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [viewedPatient, setViewedPatient] = useState(null);
  const profileRef = useRef(null);
  const viewButtonRef = useRef(null);
  const profileCloseRef = useRef(null);
  const closeProfile = () => { setViewedPatient(null); viewButtonRef.current?.focus(); };
  useEffect(() => {
    profileRef.current = viewedPatient;
    if (viewedPatient) profileCloseRef.current?.focus();
  }, [viewedPatient]);
  const searchRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const filtered = patients.filter(p => (!status || p.status === status) &&
    [p.name, p.attendant?.name, p.attender?.name, p.careOfName,
      p.doctor, p.ipInfo?.consultant, p.phone, p.address?.phone,
      p.attendant?.phone, p.attender?.phone, p.careOfPhone,
      p.id, p.patientId, p.city, p.address?.city,
      p.address?.line1, p.address?.line2, p.address?.line3, p.address?.line4,
    ].some(value => String(value ?? "").toLowerCase().includes(query.trim().toLowerCase())));
  const select = patient => { onSelectPatient({ ...patient, listSource: "all" }); onClose(); };
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();
    const onKey = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (profileRef.current) { setViewedPatient(null); viewButtonRef.current?.focus(); }
        else closeRef.current();
      }
      if (event.key !== "Tab") return;
      const elements = [...modalRef.current.querySelectorAll('button:not([disabled]), input, select, [tabindex="0"]')];
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey); previous?.focus?.(); };
  }, [modalRef]);
  return <div className="fixed inset-0 z-[100] flex items-start justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.5)", paddingTop: verticalBounds.top }}>
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="All Patients" className={`flex max-w-[96vw] gap-3 ${viewedPatient ? "w-[1403px]" : "w-[1051px]"}`} style={{ height: verticalBounds.height, color: "var(--color-text-base)", transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`, "--all-patients-accent": "#656D78" }}>
    <div className="list-modal-flat flex min-w-0 flex-1 flex-col overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)" }}>
      <div className="flex items-center justify-between px-5 py-3 text-white" style={{ background: "var(--all-patients-accent)", cursor: "grab", touchAction: "none" }} {...dragHandlers}>
        <h2 className="flex items-center gap-2 text-lg font-bold"><Users size={20} />All Patients</h2>
        <button onClick={onClose} className="bg-black/40 px-3 py-1.5 text-xs font-semibold">Close</button>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
        <span className="px-3 py-2 text-xs font-bold">All ({patients.length})</span>
        <label className="relative ml-auto max-w-full"><Search className="absolute left-2 top-2.5" size={14}/><input ref={searchRef} aria-label="Search by name, attender, doctor, phone, ID, or city" value={query} onChange={e => { setQuery(e.target.value); setSelectedId(null); }} placeholder="Name, attender, doctor, phone, ID, city…" className="w-80 max-w-full border bg-white py-2 pl-7 pr-2 text-xs text-slate-800" /></label>
        <select aria-label="Filter patient status" value={status} onChange={e => { setStatus(e.target.value); setSelectedId(null); }} className="border bg-white p-2 text-xs text-slate-800"><option value="">All statuses</option>{[...new Set(patients.map(p => p.status).filter(Boolean))].map(value => <option key={value}>{value}</option>)}</select>
      </div>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <div className="min-h-0 min-w-0 flex-1 overflow-auto patient-list-scrollbar" tabIndex={0} aria-label="Patient register" onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (!["ArrowDown", "ArrowUp", "Enter"].includes(event.key) || !filtered.length) return;
        event.preventDefault();
        const index = filtered.findIndex(p => p.id === selectedId);
        if (event.key === "Enter") { if (index >= 0) select(filtered[index]); return; }
        const next = index < 0 ? 0 : Math.max(0, Math.min(filtered.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)));
        setSelectedId(filtered[next].id);
        [...modalRef.current.querySelectorAll("[data-patient-id]")].find(row => row.dataset.patientId === String(filtered[next].id))?.scrollIntoView({ block: "nearest" });
      }}>
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-left text-xs">
          <colgroup>{[10, 20, 6, 10, 12, 12, 8, 10, 12].map((width, index) => <col key={index} style={{ width: `${width}%` }} />)}</colgroup>
          <thead className="sticky top-0 z-10 text-white" style={{ background: "var(--all-patients-accent)" }}><tr>{columns.map(column => <th key={column} scope="col" className="px-2 py-3">{column}</th>)}<th scope="col" className="sticky right-0 px-2 py-3" style={{ background: "var(--all-patients-accent)" }}>Actions</th></tr></thead>
          <tbody>{filtered.map((p,index) => <tr key={p.id} data-patient-id={p.id} aria-selected={selectedId === p.id} onClick={() => setSelectedId(p.id)} onDoubleClick={() => select(p)} className="cursor-pointer" style={{ background: selectedId === p.id ? "#e5e7eb" : index % 2 ? "var(--color-surface-alt)" : "var(--color-surface)" }}>
            {patientValues(p).map((value,i) => <td key={i} className="break-words border-b px-2 py-2.5" style={{ borderColor: "var(--color-border)" }}>{displayValue(value)}</td>)}
            <td className="sticky right-0 border-b px-2 py-2.5" style={{ borderColor: "var(--color-border)", background: "inherit" }} onDoubleClick={event => event.stopPropagation()}>
              <div className="flex gap-1">
                <button type="button" aria-label={`View ${p.name}`} className="border px-2 py-1.5 font-semibold" style={{ borderColor: "var(--all-patients-accent)", color: "var(--all-patients-accent)", background: "var(--color-surface)" }} onClick={event => { viewButtonRef.current = event.currentTarget; setViewedPatient(p); }}>View</button>
                <button type="button" aria-label={`Load ${p.name}`} className="px-2 py-1.5 font-semibold text-white" style={{ background: "var(--all-patients-accent)" }} onClick={() => select(p)}>Load</button>
              </div>
            </td>
          </tr>)}</tbody>
        </table>
        {!filtered.length && <p className="p-8 text-center text-sm">No matching patients</p>}
      </div>
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}><span>{filtered.length} of {patients.length} patients · Double-click a row or press Enter to load</span><button disabled={!filtered.some(p => p.id === selectedId)} onClick={() => select(filtered.find(p => p.id === selectedId))} className="px-4 py-2 font-semibold text-white disabled:opacity-40" style={{ background: "var(--all-patients-accent)" }}>Load Patient</button></div>
    </div>
      {viewedPatient && <aside aria-label="Patient profile" className="list-modal-flat flex w-[340px] max-w-[45vw] shrink-0 flex-col overflow-hidden border shadow-xl" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
  <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "var(--all-patients-accent)" }}>
    <h3 className="flex items-center gap-2 font-bold"><UserRound size={18} />Patient Information</h3>
    <button ref={profileCloseRef} type="button" onClick={closeProfile} className="bg-black/40 px-3 py-1.5 text-xs font-semibold">Close</button>
  </div>
  <div className="min-h-0 flex-1 overflow-y-auto px-4 patient-list-scrollbar">
    <div className="flex flex-col items-center gap-2 border-b py-5" style={{ borderColor: "var(--color-border)" }}>
      {viewedPatient.photo || viewedPatient.profileImage || viewedPatient.avatar ? (
        <img
          src={viewedPatient.photo || viewedPatient.profileImage || viewedPatient.avatar}
          alt={`${viewedPatient.name || "Patient"} photo`}
          className="h-20 w-20 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "var(--color-surface-alt)" }}>
          <UserRound size={36} style={{ color: "var(--color-text-muted)" }} />
        </div>
      )}
      <span className="text-sm font-semibold">{displayValue(viewedPatient.name)}</span>
    </div>
    <dl>{sidebarFields(viewedPatient).map(([label, value]) => <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 border-b py-3 text-xs" style={{ borderColor: "var(--color-border)" }}>
      <dt className="font-semibold" style={{ color: "var(--color-text-muted)" }}>{label}</dt>
      <dd className="break-words font-medium">{displayValue(value)}</dd>
    </div>)}</dl>
  </div>
  <div className="border-t p-3" style={{ borderColor: "var(--color-border)" }}><button type="button" onClick={() => select(viewedPatient)} className="w-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--all-patients-accent)" }}>Load Patient</button></div>
</aside>}
    </div>
  </div>;
}
