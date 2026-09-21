import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { Users, UserRound, Search, ArrowUpDown } from "lucide-react";
import useWorkspaceModalLayout from "../hooks/useWorkspaceModalLayout";

const normalizeSearchText = value => String(value ?? "").trim().toLocaleLowerCase();

const rowValues = p => ({
  patientId: p.patientId || p.id,
  name: p.name,
  city: p.city || p.address?.city,
  phone: p.phone || p.address?.phone,
  careOfPhone: p.careOfPhone || p.attendant?.phone,
  careOfName: p.careOfName || p.attendant?.name,
});

// Builds a single readable address line out of whatever shape the patient
// record uses (a flat string, or line1..line4/city/state/pincode parts).
const addressLine = p => {
  if (typeof p.address === "string" && p.address.trim()) return p.address;
  const addr = p.address || {};
  const parts = [addr.line1, addr.line2, addr.line3, addr.line4, addr.city, addr.state, addr.pincode]
    .filter(Boolean);
  return parts.length ? parts.join(", ") : (p.addressLine || null);
};

// Age/age-group are derived from DOB when the record doesn't carry them
// directly; derived values get a trailing "*" like the reference layout.
const calcAge = dob => {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
  return age >= 0 ? age : null;
};
const ageGroupFor = age => age === null || age === undefined ? null
  : age < 13 ? "Child" : age < 18 ? "Teen" : age < 60 ? "Adult" : "Senior";

// Rows of pipe-separated fields for the sidebar, grouped the way the
// reference "Patient Information" card groups them.
const profileRows = p => {
  const age = p.age ?? calcAge(p.dob);
  const isDerived = p.age === undefined || p.age === null;
  const careOf = [p.careOfName || p.attendant?.name, p.attendant?.relationship ? `(${p.attendant.relationship})` : ""].filter(Boolean).join(" ");
  return [
    [
      { label: "Age", value: age !== null ? `${age} yrs${isDerived ? "*" : ""}` : null },
      { label: "Gender", value: p.gender },
      { label: "Blood", value: p.bloodGroup },
    ],
    [
      { label: "DOB", value: p.dob ? `${p.dob}${isDerived ? "*" : ""}` : null, hideLabel: true },
      { label: "Age Group", value: p.ageGroup || ageGroupFor(age), hideLabel: true },
      { label: "Marital Status", value: p.maritalStatus || "Married", hideLabel: true },
    ],
    [
      { label: "Care-of Name", value: careOf, hideLabel: true },
      { label: "Care-of Phone", value: p.careOfPhone || p.attendant?.phone, hideLabel: true },
    ],
    [{ label: "Address", value: addressLine(p) }],
  ];
};

function ProfilePipeRow({ items }) {
  const visible = items.filter(item => item.value);
  if (!visible.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b px-5 py-2.5 text-xs" style={{ borderColor: "var(--color-border)" }}>
      {visible.map((item, idx) => (
        <span key={item.label} className="flex items-center gap-2">
          {idx > 0 && <span aria-hidden="true" style={{ color: "var(--color-border)" }}>|</span>}
          <span>
            {!item.hideLabel && <span style={{ color: "var(--color-text-muted)" }}>{item.label}:</span>}{!item.hideLabel && " "}
            <span className="font-bold">{item.value}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

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
  const [searchMode, setSearchMode] = useState("alpha");
  const [selectedId, setSelectedId] = useState(null);
  const [viewedPatient, setViewedPatient] = useState(null);
  const searchRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return patients;
    const fieldValues = p => [
      p.name, p.attendant?.name, p.attender?.name, p.careOfName,
      p.doctor, p.ipInfo?.consultant, p.phone, p.address?.phone,
      p.attendant?.phone, p.attender?.phone, p.careOfPhone,
      p.id, p.patientId, p.city, p.address?.city,
      p.address?.line1, p.address?.line2, p.address?.line3, p.address?.line4,
    ].map(normalizeSearchText);
    // Embedded: substring match anywhere in any field. Alphabet: field must
    // start with the query — same distinction as the prescription entry search.
    return patients.filter(p => searchMode === "embedded"
      ? fieldValues(p).some(value => value.includes(normalizedQuery))
      : fieldValues(p).some(value => value.startsWith(normalizedQuery)));
  }, [patients, query, searchMode]);

  // Keep refs of the latest filtered list / selection so the single
  // document-level keydown listener never closes over stale values.
  const filteredRef = useRef(filtered);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { filteredRef.current = filtered; }, [filtered]);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  const view = patient => { setSelectedId(patient.id); setViewedPatient(patient); };
  const select = patient => { onSelectPatient({ ...patient, listSource: "all" }); onClose(); };
  const closeSidebar = () => { setViewedPatient(null); setSelectedId(null); };

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
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); return; }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const list = filteredRef.current;
        if (!list.length) return;
        event.preventDefault();
        const currentIndex = list.findIndex(p => p.id === selectedIdRef.current);
        let nextIndex;
        if (currentIndex === -1) nextIndex = 0;
        else if (event.key === "ArrowDown") nextIndex = Math.min(currentIndex + 1, list.length - 1);
        else nextIndex = Math.max(currentIndex - 1, 0);
        view(list[nextIndex]);
        return;
      }

      if (event.key === "Enter") {
        const current = filteredRef.current.find(p => p.id === selectedIdRef.current);
        if (current) { event.preventDefault(); select(current); }
        return;
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
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="All Patients" className="flex w-[1040px] max-w-[96vw] gap-3" style={{ height: verticalBounds.height, color: "var(--color-text-base)", transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}>
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
              onChange={e => { setQuery(e.target.value); setSelectedId(null); setViewedPatient(null); }}
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
          onRowClicked={view}
          onRowDoubleClicked={row => select(row)}
          conditionalRowStyles={[{
            when: row => row.id === selectedId,
            style: { background: "#dbeafe", outline: "2px solid #2563eb", outlineOffset: "-2px" },
          }]}
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t px-5 py-3 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
        <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden whitespace-nowrap text-[11px]" style={{ color: "var(--color-text-muted)" }} title={`${filtered.length} of ${patients.length} patients · Use ↑ / ↓ or click a row to view details · Double-click to load`}>
          <ArrowUpDown size={11} className="shrink-0" />
          <span className="overflow-hidden text-ellipsis">{filtered.length}/{patients.length} · ↑/↓ or click to view · Dbl-click to load</span>
        </span>
        <div className="flex flex-shrink-0 items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>Search By:</span>
            <select value={searchMode} onChange={e => { setSearchMode(e.target.value); setSelectedId(null); setViewedPatient(null); }}
              className="px-2 py-1 text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
              <option value="alpha">Alphabet</option>
              <option value="embedded">Embedded</option>
            </select>
          </label>
          <button type="button" disabled={!filtered.some(p => p.id === selectedId)} onClick={() => select(filtered.find(p => p.id === selectedId))}
            className="px-4 py-2 font-semibold text-white disabled:opacity-40" style={{ background: "var(--color-primary-dark)" }}>Load Patient</button>
        </div>
      </div>
    </div>

    <aside aria-label="Patient profile" aria-live="polite" className="list-modal-flat flex w-[320px] max-w-[38vw] shrink-0 flex-col overflow-hidden border shadow-xl" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      {viewedPatient ? <>
        <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #0a4a6e 100%)" }}>
          <h3 className="flex items-center gap-2 text-sm font-bold"><UserRound size={16} />Patient Information</h3>
          <button type="button" onClick={closeSidebar} className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.25)" }}>
            Close
          </button>
        </div>
        <div className="flex items-start justify-between gap-3 border-b px-5 py-4" style={{ borderColor: "var(--color-border)" }}>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{displayValue(viewedPatient.name)}</div>
            <div className="mt-1 text-[0.7rem]">
              <span style={{ color: "var(--color-text-muted)" }}>Patient ID: </span>
              <span className="font-bold" style={{ color: "var(--color-primary)" }}>{displayValue(viewedPatient.patientId || viewedPatient.id)}</span>
            </div>
          </div>
          {viewedPatient.photo || viewedPatient.profileImage || viewedPatient.avatar ? (
            <img src={viewedPatient.photo || viewedPatient.profileImage || viewedPatient.avatar} alt={`${viewedPatient.name || "Patient"} photo`} className="h-14 w-14 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--color-surface-alt)" }}>
              <UserRound size={24} style={{ color: "var(--color-text-muted)" }} />
            </div>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto patient-list-scrollbar">
          {profileRows(viewedPatient).map((items, idx) => <ProfilePipeRow key={idx} items={items} />)}
        </div>
        <div className="border-t p-3" style={{ borderColor: "var(--color-border)" }}>
          <button type="button" onClick={() => select(viewedPatient)} className="w-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--color-primary-dark)" }}>Load Patient</button>
        </div>
      </> : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--color-surface-alt)" }}>
            <UserRound size={28} style={{ color: "var(--color-text-muted)" }} />
          </div>
          <p className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>No patient selected</p>
          <p className="flex items-center gap-1.5 text-[0.7rem]" style={{ color: "var(--color-text-muted)" }}>
            <ArrowUpDown size={12} />Use ↑ / ↓ arrow keys, or click a row, to see details here
          </p>
        </div>
      )}
    </aside>
    </div>
  </div>;
}