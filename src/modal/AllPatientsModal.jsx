import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DataTable from "react-data-table-component";
import { Users, UserRound, Search, ArrowUpDown, MapPin, Phone, ChevronDown, Filter, X } from "lucide-react";
import useWorkspaceModalLayout from "../hooks/useWorkspaceModalLayout";

/* ── Column filters + react-data-table-component (local to this modal) ── */
const HEADER_HEIGHT = 64; // was 32

// Green theme
const GREEN_DARK = "#166534";   // table header, buttons, patient-info header
const GREEN_LIGHT = "#dcfce7";  // toolbar

const cellKey = value => {
  const text = String(value ?? "").trim();
  return text === "" ? "—" : text;
};
const readValue = (row, column) => (column.value ? column.value(row) : row[column.key]);
const isActive = filter => (Array.isArray(filter) ? filter.length > 0 : Boolean(filter && filter.trim()));

/* ── filtering helpers ─────────────────────────────────── */
function applyColumnFilters(rows, columns, filters) {
  const active = columns.filter(column => isActive(filters[column.key]));
  if (!active.length) return rows;
  return rows.filter(row => active.every(column => {
    const filter = filters[column.key];
    const value = readValue(row, column);
    return Array.isArray(filter)
      ? filter.includes(cellKey(value))
      : String(value ?? "").toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase());
  }));
}

function useColumnFilters(columns) {
  const [filters, setFilters] = useState({});
  const setFilter = useCallback((key, value) => setFilters(current => ({ ...current, [key]: value })), []);
  const clearAll = useCallback(() => setFilters({}), []);
  const apply = useCallback(rows => applyColumnFilters(rows, columns, filters), [columns, filters]);
  const activeCount = Object.values(filters).filter(isActive).length;
  return { filters, setFilter, clearAll, apply, activeCount };
}

const optionsFor = (rows, column) =>
  [...new Set(rows.map(row => cellKey(readValue(row, column))))]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

/* ── header filter controls ────────────────────────────── */
function TextFilter({ label, value, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-1 border-b border-white/50 px-0.5 py-0.5 text-white/70 focus-within:border-white focus-within:text-white">
      <Filter size={10} className={`shrink-0 ${value ? "text-cyan-300" : "text-white/50"}`} />
      <input
        data-header-filter
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Filter"
        aria-label={`Filter by ${label}`}
        className="min-w-0 flex-1 bg-transparent text-[0.65rem] font-normal text-white outline-none placeholder:text-white/50"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label={`Clear ${label} filter`} className="shrink-0 text-white/70 hover:text-white">
          <X size={10} />
        </button>
      )}
    </label>
  );
}

function SelectFilter({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const allSelected = options.length > 0 && value.length === options.length;

  const toggleOpen = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 200)),
        top: rect.bottom + 4,
        minWidth: Math.max(160, rect.width),
      });
    }
    setOpen(current => !current);
  };

  // The list is rendered in a portal (fixed position) so the table's own
  // scroll container and the modal's overflow-hidden can't clip it.
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onMouseDown = event => {
      if (buttonRef.current?.contains(event.target) || popoverRef.current?.contains(event.target)) return;
      close();
    };
    const onScroll = event => {
      if (popoverRef.current?.contains(event.target)) return;
      close();
    };
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const toggleOption = option =>
    onChange(value.includes(option) ? value.filter(item => item !== option) : [...value, option]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        aria-label={`Filter by ${label}`}
        aria-expanded={open}
        className="flex min-w-0 items-center gap-1 border-b border-white/50 px-0.5 py-0.5 text-left text-[0.65rem] font-normal text-white/70 hover:text-white"
      >
        <Filter size={10} className={`shrink-0 ${value.length ? "text-cyan-300" : "text-white/50"}`} />
        <span className="min-w-0 flex-1 truncate">{value.length ? `${value.length} selected` : "Filter"}</span>
        <ChevronDown size={10} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && pos && createPortal(
        <div
          ref={popoverRef}
          data-header-filter
          className="z-[300] max-h-64 overflow-y-auto border border-slate-200 bg-white p-2 text-slate-800 shadow-xl"
          style={{ position: "fixed", left: pos.left, top: pos.top, minWidth: pos.minWidth }}
        >
          <label className="flex cursor-pointer items-center gap-2 border-b border-slate-200 px-1 py-1.5 text-xs font-semibold">
            <input type="checkbox" checked={allSelected} onChange={() => onChange(allSelected ? [] : [...options])} className="h-3.5 w-3.5 accent-blue-600" />
            <span>Select All</span>
          </label>
          {options.map(option => (
            <label key={option} className="flex cursor-pointer items-center gap-2 px-1 py-1.5 text-xs font-normal hover:bg-blue-50">
              <input type="checkbox" checked={value.includes(option)} onChange={() => toggleOption(option)} className="h-3.5 w-3.5 shrink-0 accent-blue-600" />
              <span className="whitespace-nowrap">{option}</span>
            </label>
          ))}
          {value.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="mt-1 w-full border-t border-slate-200 px-1 pt-2 text-left text-xs font-semibold text-blue-700 hover:text-blue-900">
              Clear filter
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
}

function HeaderCell({ column, type, value, options, onChange }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5 py-1">
      <span className="truncate text-[11.25px] font-bold tracking-wide text-white">{column.label}</span>
      {type === "select" && <SelectFilter label={column.label} options={options} value={value} onChange={onChange} />}
      {type === "text" && <TextFilter label={column.label} value={value} onChange={onChange} />}
    </div>
  );
}

/* ── table styles ──────────────────────────────────────── */
const customStyles = {
  headRow: { style: { background: GREEN_DARK, minHeight: `${HEADER_HEIGHT}px`, borderBottom: "none" } },
  headCells: {
    style: {
      paddingLeft: "6px", paddingRight: "6px", paddingTop: "6px", paddingBottom: "6px",
      background: GREEN_DARK, color: "#ffffff",
      fontSize: "11px", fontWeight: 700, letterSpacing: "0.02em",
    },
  },
  rows: {
    style: { minHeight: "28px", fontSize: "11.5px", cursor: "pointer", borderBottom: "1px solid var(--color-border)" },
    stripedStyle: { background: "var(--color-surface-alt)" },
  },
  cells: { style: { paddingLeft: "6px", paddingRight: "6px", paddingTop: "2px", paddingBottom: "2px" } },
};

const cellStyle = { display: "block", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

/* ── the table ─────────────────────────────────────────── */
function PatientDataTable({
  columns,
  data,
  sourceRows,            // full, unfiltered rows — used to build the select-filter options
  filters,               // from useColumnFilters
  onFilterChange,        // (key, value) => void
  keyField = "id",
  selectedKey,           // row[keyField] of the highlighted row
  onRowClick,
  onRowDoubleClick,
  conditionalRowStyles = [],
  striped = true,
  emptyComponent,
}) {
  const optionRows = sourceRows ?? data;

  const tableColumns = useMemo(() => columns.map(column => {
    const type = column.filter ?? "text";
    const filterValue = filters[column.key] ?? (type === "select" ? [] : "");
    return {
      id: column.key,
      name: (
        <HeaderCell
          column={column}
          type={type}
          value={filterValue}
          options={type === "select" ? optionsFor(optionRows, column) : []}
          onChange={next => onFilterChange(column.key, next)}
        />
      ),
      selector: row => readValue(row, column),
      cell: row => {
        if (column.cell) return column.cell(row);
        const text = cellKey(readValue(row, column));
        return <span style={cellStyle} title={text}>{text}</span>;
      },
      sortable: false,
      wrap: false,
      minWidth: column.width,
      grow: column.grow ?? 1,
    };
  }), [columns, filters, optionRows, onFilterChange]);

  const rowStyles = useMemo(() => [
    ...conditionalRowStyles,
    {
      when: row => selectedKey !== null && selectedKey !== undefined && row[keyField] === selectedKey,
      style: { backgroundColor: "#dbeafe", outline: "2px solid #2563eb", outlineOffset: "-2px" },
    },
  ], [conditionalRowStyles, selectedKey, keyField]);

  return (
    <DataTable
      columns={tableColumns}
      data={data}
      keyField={keyField}
      customStyles={customStyles}
      striped={striped}
      highlightOnHover
      pointerOnHover
      fixedHeader
      fixedHeaderScrollHeight="100%"
      noDataComponent={emptyComponent ?? <p className="p-8 text-center text-sm">No matching patients</p>}
      onRowClicked={onRowClick}
      onRowDoubleClicked={onRowDoubleClick}
      conditionalRowStyles={rowStyles}
    />
  );
}

const normalizeSearchText = value => String(value ?? "").trim().toLocaleLowerCase();

const rowValues = p => ({
  patientId: p.patientId || p.id,
  name: p.name,
  city: p.city || p.address?.city,
  phone: p.phone || p.address?.phone,
  careOfPhone: p.careOfPhone || p.attendant?.phone,
  careOfName: p.careOfName || p.attendant?.name,
});

// Individual address lines for the pin-icon list in the Address tab (a flat
// string gets split on commas; an object shape is read field by field).
const addressComponents = p => {
  if (typeof p.address === "string" && p.address.trim()) {
    return p.address.split(",").map(part => part.trim()).filter(Boolean);
  }
  const addr = p.address || {};
  return [addr.line1, addr.line2, addr.line3, addr.line4, addr.city, addr.state, addr.pincode].filter(Boolean);
};

// The address is shown as two rows (first half / second half of its parts) so
// the phone number below always stays visible.
const addressRows = p => {
  const parts = addressComponents(p);
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid), parts.slice(mid)].map(row => row.join(", ")).filter(Boolean);
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

// Rows of label-less, pipe-separated fields for the sidebar, grouped the way
// the reference "Patient Information" card groups them.
const profileRows = p => {
  const age = p.age ?? calcAge(p.dob);
  const isDerived = p.age === undefined || p.age === null;
  return [
    [
      { label: "Age", value: age !== null ? `${age} yrs${isDerived ? "*" : ""}` : null, hideLabel: true },
      { label: "Gender", value: p.gender, hideLabel: true },
      { label: "Blood", value: p.bloodGroup, hideLabel: true },
    ],
    [
      { label: "DOB", value: p.dob ? `${p.dob}${isDerived ? "*" : ""}` : null, hideLabel: true },
      { label: "Age Group", value: p.ageGroup || ageGroupFor(age), hideLabel: true },
      { label: "Marital Status", value: p.maritalStatus || "Married", hideLabel: true },
    ],
  ];
};

function ProfilePipeRow({ items }) {
  const visible = items.filter(item => item.value);
  if (!visible.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 text-sm">
      {visible.map((item, idx) => (
        <span key={item.label} className="flex items-center gap-2">
          {idx > 0 && <span aria-hidden="true" style={{ color: "var(--color-border-strong, var(--color-border))" }}>|</span>}
          <span>
            {!item.hideLabel && <span style={{ color: "var(--color-text-muted)" }}>{item.label}: </span>}
            {item.value}
          </span>
        </span>
      ))}
    </div>
  );
}

const displayValue = value => value === undefined || value === null || value === "" ? "—" : value;

// Every column has its own header filter: free-text for identifiers / names /
// phones, multi-select checklist for low-cardinality columns (City).
const ALL_COLUMNS = [
  { key: "patientId",   label: "Patient ID",    width: "100px", filter: "text",   value: row => rowValues(row).patientId },
  { key: "name",        label: "Patient Name",  width: "150px", grow: 2, filter: "text",   value: row => rowValues(row).name },
  { key: "city",        label: "City",          width: "100px", filter: "select", value: row => rowValues(row).city },
  { key: "phone",       label: "Phone",         width: "105px", filter: "text",   value: row => rowValues(row).phone },
  { key: "careOfPhone", label: "Care-of Phone", width: "115px", filter: "text",   value: row => rowValues(row).careOfPhone },
  { key: "careOfName",  label: "Care-of Name",  width: "120px", grow: 2, filter: "text",   value: row => rowValues(row).careOfName },
];

export default function AllPatientsModal({ patients = [], verticalAnchorRef, onClose, onSelectPatient }) {
  const { modalRef, verticalBounds, dragOffset, dragHandlers } = useWorkspaceModalLayout(verticalAnchorRef, 118);
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("alpha");
  const [selectedId, setSelectedId] = useState(null);
  const [viewedPatient, setViewedPatient] = useState(null);
  const searchRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  const { filters, setFilter, clearAll, apply, activeCount } = useColumnFilters(ALL_COLUMNS);

  const searched = useMemo(() => {
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

  // Top search box first, then the per-column header filters on top of it.
  const filtered = useMemo(() => apply(searched), [apply, searched]);

  // Keep refs of the latest filtered list / selection so the single
  // document-level keydown listener never closes over stale values.
  const filteredRef = useRef(filtered);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { filteredRef.current = filtered; }, [filtered]);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  const view = patient => { setSelectedId(patient.id); setViewedPatient(patient); };
  const select = patient => { onSelectPatient({ ...patient, listSource: "all" }); onClose(); };
  const closeSidebar = () => { setViewedPatient(null); setSelectedId(null); };

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
    setSelectedId(null);
    setViewedPatient(null);
  };
  const handleClearFilters = () => {
    clearAll();
    setSelectedId(null);
    setViewedPatient(null);
  };

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();
    const onKey = event => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); return; }

      // Typing / navigating inside a column-filter control must not move the
      // row selection or load a patient.
      if (event.target.closest?.("[data-header-filter]") && ["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return;

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
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="All Patients" className="flex w-[1040px] max-w-[96vw]" style={{ height: verticalBounds.height, color: "var(--color-text-base)", transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}>
    <div className="list-modal-flat flex min-w-0 flex-1 overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)" }}>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 px-5" style={{ height: HEADER_HEIGHT, background: GREEN_LIGHT, color: "#1f2937", cursor: "grab", touchAction: "none" }} {...dragHandlers}>
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Users size={20} />All Patients</h2>
          <span className="text-xs font-bold" style={{ color: "#4b5563" }}>({patients.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative max-w-full" onPointerDown={event => event.stopPropagation()}>
            <Search className="absolute left-2 top-2.5" size={14} />
            <input ref={searchRef} aria-label="Search by name, attender, phone, ID, or city" value={query}
              onChange={e => { setQuery(e.target.value); setSelectedId(null); setViewedPatient(null); }}
              placeholder="Name, attender, phone, ID, city…"
              className="w-72 max-w-full border bg-white py-2 pl-7 pr-2 text-xs text-slate-800" />
          </label>
          <button onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90" style={{ background: GREEN_DARK }}>Close</button>
        </div>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto patient-list-scrollbar">
        <PatientDataTable
          columns={ALL_COLUMNS}
          data={filtered}
          sourceRows={patients}
          filters={filters}
          onFilterChange={handleFilterChange}
          keyField="id"
          selectedKey={selectedId}
          onRowClick={view}
          onRowDoubleClick={row => select(row)}
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t px-5 py-3 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
        <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden whitespace-nowrap text-[11px]" style={{ color: "var(--color-text-muted)" }} title={`${filtered.length} of ${patients.length} patients · Use ↑ / ↓ or click a row to view details · Double-click to load`}>
          <ArrowUpDown size={11} className="shrink-0" />
          <span className="overflow-hidden text-ellipsis">{filtered.length}/{patients.length} · ↑/↓ or click to view · Dbl-click to load</span>
        </span>
        <div className="flex flex-shrink-0 items-center gap-3">
          {activeCount > 0 && (
            <button type="button" onClick={handleClearFilters} className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-900">
              Clear filters ({activeCount})
            </button>
          )}
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>Search By:</span>
            <select value={searchMode} onChange={e => { setSearchMode(e.target.value); setSelectedId(null); setViewedPatient(null); }}
              className="px-2 py-1 text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
              <option value="alpha">Alphabet</option>
              <option value="embedded">Embedded</option>
            </select>
          </label>
        </div>
      </div>
      </div>

      {/* Same card as the list, just divided by a border — not a separate
          floating panel — so the two halves read as one modal. */}
      <div aria-label="Patient profile" aria-live="polite" className="flex w-[320px] max-w-[38vw] shrink-0 flex-col overflow-hidden border-l" style={{ borderColor: "var(--color-border)" }}>
      {viewedPatient ? <>
        <div className="flex shrink-0 items-center justify-between px-4" style={{ background: GREEN_DARK, height: HEADER_HEIGHT }}>
          <h3 className="text-base font-bold text-white">Patient Information</h3>
          <button type="button" onClick={closeSidebar} className="shrink-0 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-slate-800 shadow-sm">
            Close
          </button>
        </div>
        <div className="shrink-0 border-b pb-4" style={{ borderColor: "var(--color-border)", background: "linear-gradient(135deg, #eef6fb 0%, #ffffff 100%)" }}>
          {/* Name left / patient ID right */}
          <div className="flex items-center justify-between gap-3 px-5 pt-4">
            <div className="min-w-0 truncate text-[1.125rem] font-bold">{displayValue(viewedPatient.name)}</div>
            <span className="shrink-0 rounded-md px-2.5 py-1 text-[0.775rem] font-semibold" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}>
              {displayValue(viewedPatient.patientId || viewedPatient.id)}
            </span>
          </div>

          {/* Photo, centered */}
          <div className="mt-3 flex justify-center">
            <div className="shrink-0 overflow-hidden shadow-md" style={{ width: 96, height: 96, borderRadius: "50%", border: "3px solid white", background: "var(--color-surface-alt)" }}>
              {viewedPatient.photo || viewedPatient.profileImage || viewedPatient.avatar ? (
                <img src={viewedPatient.photo || viewedPatient.profileImage || viewedPatient.avatar} alt={`${viewedPatient.name || "Patient"} photo`} className="block h-full w-full object-cover" style={{ objectPosition: "center 20%", borderRadius: "50%" }} />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserRound size={40} style={{ color: "var(--color-text-muted)" }} />
                </div>
              )}
            </div>
          </div>

          {/* Details: 2 rows, values only, pipe-separated */}
          <div className="mt-3 space-y-1">
            {profileRows(viewedPatient).map((items, idx) => <ProfilePipeRow key={idx} items={items} />)}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div>
            <div className="space-y-2">
              {addressRows(viewedPatient).length ? addressRows(viewedPatient).map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-medium">
                  <MapPin size={13} className="mt-px shrink-0" style={{ color: "var(--color-text-muted)" }} />
                  {line}
                </div>
              )) : <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No address on file</p>}
            </div>
            {(viewedPatient.phone || viewedPatient.address?.phone) && <>
              <div className="my-3 border-t" style={{ borderColor: "var(--color-border)" }} />
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                <Phone size={13} className="shrink-0" />{viewedPatient.phone || viewedPatient.address?.phone}
              </div>
            </>}
          </div>
        </div>

        <div className="border-t p-3" style={{ borderColor: "var(--color-border)" }}>
          <button type="button" onClick={() => select(viewedPatient)} className="w-full px-4 py-2 text-sm font-semibold text-white" style={{ background: GREEN_DARK }}>Load Patient</button>
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
      </div>
    </div>
    </div>
  </div>;
}