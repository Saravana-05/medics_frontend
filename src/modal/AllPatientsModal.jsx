import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { Users, UserRound, Search } from "lucide-react";
import useWorkspaceModalLayout from "../hooks/useWorkspaceModalLayout";

const rowValues = p => ({
  patientId: p.patientId || p.id,
  name: p.name,
  city: p.city || p.address?.city,
  phone: p.phone || p.address?.phone,
  careOfPhone: p.careOfPhone || p.attendant?.phone,
  careOfName: p.careOfName || p.attendant?.name,
});

const sidebarFields = p => [
  ["Patient ID", p.patientId || p.id],
  ["DOB", p.dob],
  ["Blood Group", p.bloodGroup],
  ["Care-of Name", [p.careOfName || p.attendant?.name, p.attendant?.relationship ? `(${p.attendant.relationship})` : ""].filter(Boolean).join(" ")],
  ["Marital Status", p.maritalStatus || "Married"],
  ["Gender", p.gender],
];
const displayValue = value => value === undefined || value === null || value === "" ? "—" : value;

const COLUMN_DEFS = [
  { key: "patientId", label: "Patient ID", width: "90px" },
  { key: "name", label: "Patient Name", width: "150px" },
  { key: "city", label: "City", width: "90px" },
  { key: "phone", label: "Phone", width: "100px" },
  { key: "careOfPhone", label: "Care-of Phone", width: "110px" },
  { key: "careOfName", label: "Care-of Name", width: "120px" },
];

const customStyles = {
  headRow: { style: { background: "var(--color-primary-dark)", minHeight: "32px", borderBottom: "none" } },
  headCells: { style: { paddingLeft: "6px", paddingRight: "6px", paddingTop: "4px", paddingBottom: "4px", background: "var(--color-primary-dark)", color: "#ffffff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.02em" } },
  rows: {
    style: { minHeight: "28px", fontSize: "11.5px", cursor: "pointer", borderBottom: "1px solid var(--color-border)" },
    stripedStyle: { background: "var(--color-surface-alt)" },
  },
  cells: { style: { paddingLeft: "6px", paddingRight: "6px", paddingTop: "2px", paddingBottom: "2px" } },
};

export default function AllPatientsModal({ patients = [], verticalAnchorRef, onClose, onSelectPatient }) {
  const { modalRef, verticalBounds, dragOffset, dragHandlers } = useWorkspaceModalLayout(verticalAnchorRef, 118);
  const [query, setQuery] = useState("");
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
  const footerViewRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  const filtered = useMemo(() => patients.filter(p =>
    [p.name, p.attendant?.name, p.attender?.name, p.careOfName,
      p.doctor, p.ipInfo?.consultant, p.phone, p.address?.phone,
      p.attendant?.phone, p.attender?.phone, p.careOfPhone,
      p.id, p.patientId, p.city, p.address?.city,
      p.address?.line1, p.address?.line2, p.address?.line3, p.address?.line4,
    ].some(value => String(value ?? "").toLowerCase().includes(query.trim().toLowerCase()))
  ), [patients, query]);

  const select = patient => { onSelectPatient({ ...patient, listSource: "all" }); onClose(); };
  const openView = event => {
    const patient = filtered.find(p => p.id === selectedId);
    if (!patient) return;
    footerViewRef.current = event.currentTarget;
    setViewedPatient(patient);
  };

  const columns = useMemo(() => COLUMN_DEFS.map(col => ({
    name: col.label,
    selector: row => displayValue(rowValues(row)[col.key]),
    sortable: false,
    wrap: false,
    grow: col.key === "name" || col.key === "careOfName" ? 2 : 1,
    minWidth: col.width,
    style: { color: "var(--color-text-base)" },
  })), []);

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();
    const onKey = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (profileRef.current) { setViewedPatient(null); (footerViewRef.current || viewButtonRef.current)?.focus(); }
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
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="All Patients" className={`flex max-w-[96vw] gap-3 ${viewedPatient ? "w-[1080px]" : "w-[720px]"}`} style={{ height: verticalBounds.height, color: "var(--color-text-base)", transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}>
    <div className="list-modal-flat flex min-w-0 flex-1 flex-col overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)" }}>
      <div className="flex items-center justify-between gap-3 px-5 py-3" style={{ background: "#E5E7EB", color: "#1f2937", cursor: "grab", touchAction: "none" }} {...dragHandlers}>
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Users size={20} />All Patients</h2>
          <span className="text-xs font-bold" style={{ color: "#4b5563" }}>({patients.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative max-w-full" onPointerDown={event => event.stopPropagation()}>
            <Search className="absolute left-2 top-2.5" size={14} />
            <input ref={searchRef} aria-label="Search by name, attender, doctor, phone, ID, or city" value={query}
              onChange={e => { setQuery(e.target.value); setSelectedId(null); }}
              placeholder="Name, attender, doctor, phone, ID, city…"
              className="w-72 max-w-full border bg-white py-2 pl-7 pr-2 text-xs text-slate-800" />
          </label>
          <button onClick={onClose} className="bg-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/20">Close</button>
        </div>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto patient-list-scrollbar">
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          customStyles={customStyles}
          striped
          highlightOnHover
          pointerOnHover
          fixedHeader
          fixedHeaderScrollHeight="100%"
          noDataComponent={<p className="p-8 text-center text-sm">No matching patients</p>}
          onRowClicked={row => setSelectedId(row.id)}
          onRowDoubleClicked={row => select(row)}
          conditionalRowStyles={[{
            when: row => row.id === selectedId,
            style: { background: "#dbeafe", outline: "2px solid #2563eb", outlineOffset: "-2px" },
          }]}
        />
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
        <span>{filtered.length} of {patients.length} patients · Click a row, then View or Load · Double-click to load</span>
        <div className="flex gap-2">
          <button type="button" disabled={!filtered.some(p => p.id === selectedId)} onClick={openView}
            className="border px-4 py-2 font-semibold disabled:opacity-40"
            style={{ borderColor: "var(--color-primary-dark)", color: "var(--color-primary-dark)", background: "var(--color-surface)" }}>View</button>
          <button type="button" disabled={!filtered.some(p => p.id === selectedId)} onClick={() => select(filtered.find(p => p.id === selectedId))}
            className="px-4 py-2 font-semibold text-white disabled:opacity-40" style={{ background: "var(--color-primary-dark)" }}>Load Patient</button>
        </div>
      </div>
    </div>
      {viewedPatient && <aside aria-label="Patient profile" className="list-modal-flat flex w-[340px] max-w-[45vw] shrink-0 flex-col overflow-hidden border shadow-xl" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
  <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "var(--color-primary-dark)" }}>
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
  <div className="border-t p-3" style={{ borderColor: "var(--color-border)" }}><button type="button" onClick={() => select(viewedPatient)} className="w-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--color-primary-dark)" }}>Load Patient</button></div>
</aside>}
    </div>
  </div>;
}