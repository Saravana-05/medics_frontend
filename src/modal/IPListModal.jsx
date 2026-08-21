import { useEffect, useMemo, useRef, useState } from "react";
import { Bed, Calendar, CheckCircle, ChevronDown, Clock, Eye, Funnel, LogOut, ParkingCircle, Search, Stethoscope, Users } from "lucide-react";
import DataTable from "react-data-table-component";
import { formatTimeWithPeriod } from "../utils/formatTimeWithPeriod";

const COLUMNS = ["Ward", "Room#", "Patient's Doctor", "Queue Status", "Patient Name", "Chief Complaint", "Priority", "Duty Doctor", "Duty Nurse"];
const DUTY_NURSES = ["Niveditha", "Soundarya", "Rajalakshmi"];
const IP_TOOLBAR_BACKGROUND = "color-mix(in srgb, var(--color-danger) 50%, white)";
const IP_TABLE_HEADER_BACKGROUND = "color-mix(in srgb, var(--color-danger) 90%, white)";

const IP_SECTIONS = [
  {
    key: "in-bed",
    label: "IP-In Bed",
    color: "#b8d7ef",
    rows: [
      ["Gynacology", "104", "Dr.Sheela", "IP-In Bed", "Shyamala Aravind", "Surgery: Uterus", "Normal", "Dr.Vimala"],
      ["Gynacology", "202*", "Dr.Sheela", "IP-In Bed", "Kalaivani. R", "Delivery", "Normal", "Dr.Vimala"],
      ["Surgery-1", "201", "Dr.Thomas", "IP-In Bed", "Vishnuram. K", "Surgery: Right Arm", "Normal", "Dr.Krishna"],
      ["Ward-B1", "103*", "Dr.Chandra Sekar", "IP-In Bed", "Senthilkumar. D", "Lung Infection", "Important", "Dr.Krishna"],
      ["Ward-B1", "203#", "Dr.Thomas", "IP-In Bed", "Surendran. KH", "High BP / Sugar", "Normal", "Dr.Krishna"],
      ["Ward-B1", "ICU-1", "Dr.Thomas", "IP-In Bed", "Rajendran. K", "Infection-B", "Normal", "Dr.Krishna"],
    ],
  },
  {
    key: "parked",
    label: "IP-Parked List",
    color: "#c8dfa5",
    rows: [
      ["Dialysis", "102", "Dr.Chandra Sekar", "IP-Parked", "Vinodh Kumar. T", "Dialysis", "Urgent", "Dr.Krishna"],
      ["Gynacology", "@101", "Dr.Sheela", "IP-Parked", "Masha Arun", "Delivery", "Emergency", "Dr.Vimala"],
      ["Surgery-1", "ICU-2*", "Dr.Chandra Sekar", "IP-Parked (Report)", "Balaji. SR", "Surgery: Intestinal", "Urgent", "Dr.Krishna"],
      ["Ward-B1", "204*", "Dr.Chandra Sekar", "IP-Parked", "Vishnuvardhan. K", "Tuberculosis", "Important", "Dr.Krishna"],
      ["Ward-B1", "205*", "Dr.Sheela", "IP-Parked (Report)", "Kaveri. R", "Arthritis", "Normal", "Dr.Vimala"],
    ],
  },
  {
    key: "ready",
    label: "IP-Ready to Discharge List",
    color: "#e5a0a0",
    rows: [
      ["Surgery-1", "105", "Dr.Chandra Sekar", "IP-To Discharge", "Rajanathan. T", "Surgery: Bypass", "Normal", "Dr.Krishna"],
      ["Surgery-1", "106", "Dr.Chandra Sekar", "IP-To Discharge", "Thirumurugan.K", "Surgery: Liver", "Normal", "Dr.Krishna"],
    ],
  },
  {
    key: "discharged",
    label: "IP-Discharged List",
    color: "#ffc48f",
    rows: [
      ["Gynacology", "206", "Dr.Sheela", "IP-Discharged", "Leela. K", "Delivery", "Normal", "Dr.Vimala"],
      ["Gynacology", "207", "Dr.Sheela", "IP-Discharged", "Visalakshi. B", "Delivery", "Normal", "Dr.Vimala"],
    ],
  },
];

const GRID_COLUMNS = "92px 74px 115px 125px 153px 150px 90px 126px 126px";

const FILTER_OPTIONS = {
  ward: [...new Set(IP_SECTIONS.flatMap(section => section.rows.map(row => row[0])))],
  complaint: [...new Set(IP_SECTIONS.flatMap(section => section.rows.map(row => row[5])))],
  priority: [...new Set(IP_SECTIONS.flatMap(section => section.rows.map(row => row[6])))],
  dutyDoctor: [...new Set(IP_SECTIONS.flatMap(section => section.rows.map(row => row[7])))],
};

function HighlightedRoom({ room }) {
  const markerStyles = {
    "*": { background: "#dbeafe", color: "#1d4ed8" },
    "#": { background: "#fef3c7", color: "#b45309" },
    "@": { background: "#f3e8ff", color: "#7e22ce" },
  };

  return room.split("").map((character, index) => {
    const markerStyle = markerStyles[character];
    return markerStyle ? (
      <strong key={index} className="mx-px rounded px-1 font-extrabold" style={markerStyle}>
        {character}
      </strong>
    ) : character;
  });
}

function HeaderFilter({ label, value, options, onChange, textColor }) {
  const [open, setOpen] = useState(false);
  const filterRef = useRef(null);
  const allSelected = value.length === options.length;

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const toggleOption = option => {
    onChange(value.includes(option) ? value.filter(item => item !== option) : [...value, option]);
  };

  return (
    <div ref={filterRef} className="relative flex min-w-0 flex-1 flex-col gap-1">
      <span className="truncate" style={{ color: textColor }}>{label}</span>
      <button type="button" onClick={() => setOpen(current => !current)} className="flex min-w-0 items-center gap-1 border-b px-0.5 py-0.5 text-left text-[0.65rem] font-normal" style={{ color: textColor, borderColor: textColor === "white" ? "rgba(255,255,255,0.5)" : `${textColor}80` }} aria-label={`Filter by ${label}`} aria-expanded={open}>
        <Funnel size={10} style={{ color: value.length ? "#22d3ee" : textColor, opacity: value.length ? 1 : 0.6 }} />
        <span className="min-w-0 flex-1 truncate">{value.length ? `${value.length} selected` : "Filter by..."}</span>
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full min-w-[150px] overflow-y-auto border border-slate-200 bg-white p-2 text-slate-800 shadow-xl" onClick={event => event.stopPropagation()}>
          <label className="flex cursor-pointer items-center gap-2 border-b border-slate-200 px-1 py-1.5 text-xs font-semibold">
            <input type="checkbox" checked={allSelected} onChange={() => onChange(allSelected ? [] : [...options])} className="h-3.5 w-3.5 accent-blue-600" />
            <span>Select All</span>
          </label>
          {options.map(option => (
            <label key={option} className="flex cursor-pointer items-center gap-2 px-1 py-1.5 text-xs font-normal hover:bg-blue-50">
              <input type="checkbox" checked={value.includes(option)} onChange={() => toggleOption(option)} className="h-3.5 w-3.5 flex-shrink-0 accent-blue-600" />
              <span className="whitespace-nowrap">{option}</span>
            </label>
          ))}
          {value.length > 0 && <button type="button" onClick={() => onChange([])} className="mt-1 w-full border-t border-slate-200 px-1 pt-2 text-left text-xs font-semibold text-blue-700 hover:text-blue-900">Clear filter</button>}
        </div>
      )}
    </div>
  );
}

export default function IPListModal({ onClose, onSelectPatient, doctor = "Dr. Chandra Sekar", date = "24/02/2024", time = "10:00" }) {
  const modalRef = useRef(null);
  const [filter, setFilter] = useState("");
  const [wardFilters, setWardFilters] = useState([]);
  const [complaintFilters, setComplaintFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [dutyDoctorFilters, setDutyDoctorFilters] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [hoveredSection, setHoveredSection] = useState(null);
  const [focusedRowKey, setFocusedRowKey] = useState(null);
  const gridRef = useRef(null);
  const normalizedFilter = filter.trim().toLowerCase();

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    const trapFocus = event => {
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = [...modalRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!focusable.includes(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const sections = useMemo(() => IP_SECTIONS.map((section, sectionIndex) => ({
    ...section,
    rows: section.rows
      .map((row, rowIndex) => [...row, DUTY_NURSES[(sectionIndex + rowIndex) % DUTY_NURSES.length]])
      .filter(row =>
        (!wardFilters.length || wardFilters.includes(row[0])) &&
        (!complaintFilters.length || complaintFilters.includes(row[5])) &&
        (!priorityFilters.length || priorityFilters.includes(row[6])) &&
        (!dutyDoctorFilters.length || dutyDoctorFilters.includes(row[7])) &&
        (!normalizedFilter || row.some(value => value.toLowerCase().includes(normalizedFilter)))
      ),
  })), [complaintFilters, dutyDoctorFilters, normalizedFilter, priorityFilters, wardFilters]);

  const handleSelect = (row, sectionKey) => {
    const listSection = sectionKey || visibleSections.find(section => section.rows.includes(row))?.key || "ip";
    onSelectPatient?.({ name: row[4], ward: row[0], room: row[1], doctor: row[2], complaint: row[5], priority: row[6], dutyNurse: row[8], listType: "ip", listSection });
    onClose?.();
  };

  const tabConfig = [
    { key: "all", label: "All", icon: Users, color: "var(--color-primary)", textColor: "white" },
    { key: "in-bed", label: "In Bed", icon: Bed, color: "#8ebfe3", textColor: "#111827" },
    { key: "parked", label: "Parked", icon: ParkingCircle, color: "#a9cb77", textColor: "#111827" },
    { key: "ready", label: "Ready to Discharge", icon: LogOut, color: "#d67d7d", textColor: "#111827" },
    { key: "discharged", label: "Discharged", icon: CheckCircle, color: "#f0a866", textColor: "#111827" },
  ].map(tab => ({
    ...tab,
    count: tab.key === "all"
      ? sections.reduce((total, section) => total + section.rows.length, 0)
      : sections.find(section => section.key === tab.key)?.rows.length || 0,
  }));

  const visibleSections = activeSection === "all"
    ? sections
    : sections.filter(section => section.key === activeSection);
  const visibleRows = visibleSections.flatMap(section => section.rows);
  const rowKey = row => row.join("|");

  const focusRow = row => {
    setFocusedRowKey(rowKey(row));
    gridRef.current?.focus();
  };

  const handleGridKeyDown = event => {
    if (!visibleRows.length || !["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = visibleRows.findIndex(row => rowKey(row) === focusedRowKey);
    if (event.key === "Enter") {
      if (currentIndex >= 0) handleSelect(visibleRows[currentIndex]);
      return;
    }
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = currentIndex < 0
      ? (direction > 0 ? 0 : visibleRows.length - 1)
      : Math.max(0, Math.min(visibleRows.length - 1, currentIndex + direction));
    setFocusedRowKey(rowKey(visibleRows[nextIndex]));
  };
  const tableColumns = [
    { name: "Ward", selector: row => row[0], width: "92px" },
    { name: "Room#", selector: row => row[1], cell: row => <HighlightedRoom room={row[1]} />, width: "74px" },
    { name: "Patient's Doctor", selector: row => row[2], width: "115px" },
    { name: "Queue Status", selector: row => row[3], width: "125px" },
    { name: "Patient Name", selector: row => row[4], width: "153px" },
    { name: "Chief Complaint", selector: row => row[5], width: "150px" },
    { name: "Priority", selector: row => row[6], width: "90px" },
    { name: "Duty Doctor", selector: row => row[7], width: "126px" },
    { name: "Duty Nurse", selector: row => row[8], width: "126px" },
  ];

  const tableStyles = {
    table: { style: { backgroundColor: "var(--color-surface)" } },
    rows: {
      style: {
        minHeight: "29px",
        fontSize: "0.75rem",
        color: "var(--color-text)",
        borderBottom: "1px solid var(--color-border)",
      },
      stripedStyle: { backgroundColor: "var(--color-surface-alt)" },
      highlightOnHoverStyle: { backgroundColor: "#eff6ff", cursor: "pointer" },
    },
    cells: {
      style: {
        paddingLeft: "6px",
        paddingRight: "8px",
        borderRight: "1px solid var(--color-border)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
  };

  const headerFilters = {
    Ward: { value: wardFilters, options: FILTER_OPTIONS.ward, onChange: setWardFilters },
    "Chief Complaint": { value: complaintFilters, options: FILTER_OPTIONS.complaint, onChange: setComplaintFilters },
    Priority: { value: priorityFilters, options: FILTER_OPTIONS.priority, onChange: setPriorityFilters },
    "Duty Doctor": { value: dutyDoctorFilters, options: FILTER_OPTIONS.dutyDoctor, onChange: setDutyDoctorFilters },
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-8 animate-fade-in" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="In Patient List" tabIndex={-1} className="list-modal-flat flex h-[90vh] w-[min(96vw,1051px)] flex-col overflow-hidden shadow-2xl outline-none animate-slide-up" style={{ background: "var(--color-surface)" }}>
        <div className="flex-shrink-0 rounded-t-xl" style={{ background: IP_TOOLBAR_BACKGROUND }}>
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <div className="flex items-center gap-4">
              <h2 className="flex items-center gap-2 whitespace-nowrap text-lg font-bold text-white"><Bed size={20} />In Patient List</h2>
              <div className="flex items-center whitespace-nowrap text-xs">
                <div className="flex items-center gap-1.5 pr-4 text-[12.5px]" style={{ color: "#000000" }}>
                  <Calendar size={12} /><span className="font-semibold">Date:</span><span>{String(date).trim().split(/\s+/)[0].replaceAll("-", "/")}</span>
                </div>
                <div className="ml-4 flex items-center gap-1.5 border-l border-white/30 pl-4 text-[12.5px]" style={{ color: "#000000" }}>
                  <Clock size={12} /><span className="font-semibold">Time:</span><span>{formatTimeWithPeriod(time)}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80" style={{ background: "rgba(0,0,0,0.5)" }} title="Close">Close</button>
          </div>

          <div className="flex items-stretch" style={{ height: 34 }}>
            {tabConfig.map((tab, index) => {
              const showColor = activeSection === tab.key || hoveredSection === tab.key;
              const slant = 12;
              return (
                <button key={tab.key} type="button" onClick={() => setActiveSection(tab.key)} onMouseEnter={() => setHoveredSection(tab.key)} onMouseLeave={() => setHoveredSection(null)} className="relative flex items-center justify-center px-5 text-xs font-bold transition-all" style={{
                  minWidth: tab.key === "ready" ? 170 : 125,
                  marginLeft: index === 0 ? 0 : -slant,
                  zIndex: activeSection === tab.key ? tabConfig.length + 1 : tabConfig.length - index,
                  clipPath: index === 0
                    ? `polygon(0 0, calc(100% - ${slant}px) 0, 100% 100%, 0 100%)`
                    : `polygon(0 0, calc(100% - ${slant}px) 0, 100% 100%, ${slant}px 100%)`,
                  background: showColor ? tab.color : "#6b7280",
                  color: showColor ? tab.textColor : "white",
                  boxShadow: activeSection === tab.key ? "inset 0 1px 4px rgba(0,0,0,0.3)" : "none",
                }}>
                  <span className="whitespace-nowrap">{tab.label}</span><sup className="ml-1 text-[0.6rem]">{tab.count}</sup>
                </button>
              );
            })}
            <div className="relative ml-[30px] flex items-center">
              <Search size={13} className="search-field-icon pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-black" />
              <input value={filter} onChange={event => setFilter(event.target.value)} placeholder="Search by patient, ward, complaint..." className="w-[205px] border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400" />
            </div>
            <div className="ml-auto mr-[20px] flex items-center whitespace-nowrap">
              <div className="flex items-center gap-1.5" style={{ color: "#ffffff" }}>
                <Stethoscope size={16} /><span className="text-[16px] font-semibold">{doctor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-30 grid flex-shrink-0 border-b text-xs font-bold text-white" style={{ gridTemplateColumns: GRID_COLUMNS, background: IP_TABLE_HEADER_BACKGROUND, borderColor: "var(--color-border)" }}>
          {COLUMNS.map(column => {
            const filterConfig = headerFilters[column];
            return (
              <div key={column} className="flex min-w-0 items-start border-r px-2 py-1.5 last:border-r-0" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                {filterConfig ? <HeaderFilter label={column} {...filterConfig} textColor="white" /> : <span className="truncate py-1">{column}</span>}
              </div>
            );
          })}
        </div>

        <div ref={gridRef} tabIndex={0} onKeyDown={handleGridKeyDown} className="min-h-0 flex-1 overflow-auto outline-none">
          {visibleSections.map(section => (
            <div key={section.key}>
              <div className="sticky top-0 z-10 flex items-center gap-2 border-y px-4 py-2" style={{ background: section.color, borderColor: "var(--color-border)" }}>
                <span className="text-xs font-extrabold tracking-wide">{section.label}</span>
                <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[0.6rem] font-bold">{section.rows.length}</span>
              </div>
              <DataTable
                columns={tableColumns}
                data={section.rows}
                noTableHead
                striped
                highlightOnHover
                pointerOnHover
                dense
                customStyles={tableStyles}
                conditionalRowStyles={[{
                  when: row => rowKey(row) === focusedRowKey,
                  style: { backgroundColor: "#dbeafe", outline: "2px solid #2563eb", outlineOffset: "-2px" },
                }]}
                onRowClicked={focusRow}
                onRowDoubleClicked={row => handleSelect(row, section.key)}
                noDataComponent={<div className="px-4 py-8 text-sm" style={{ color: "var(--color-text-muted)" }}>No matching patients</div>}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center justify-between border-t px-5 py-3" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)" }}>
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded px-2 py-1" style={{ background: "#dbeafe", color: "#1d4ed8" }}>* Insurance</span>
            <span className="rounded px-2 py-1" style={{ background: "#fef3c7", color: "#b45309" }}># Corporate</span>
            <span className="rounded px-2 py-1" style={{ background: "#f3e8ff", color: "#7e22ce" }}>@ Referral</span>
          </div>
          <div className="flex items-center gap-1 text-xs italic" style={{ color: "var(--color-text-muted)" }}><Eye size={12} />Double-click any row to load patient</div>
        </div>
      </div>
    </div>
  );
}
