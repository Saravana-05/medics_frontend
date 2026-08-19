import { useEffect, useMemo, useRef, useState } from "react";
import { Bed, Calendar, CheckCircle, ChevronDown, Clock, Eye, Funnel, LogOut, ParkingCircle, Stethoscope, Users } from "lucide-react";
import DataTable from "react-data-table-component";

const COLUMNS = ["Ward", "Room#", "Patient's Doctor", "Queue Status", "Patient Name", "Chief Complaint", "Priority", "Duty Doctor", "Duty Nurse"];
const DUTY_NURSES = ["Niveditha", "Soundarya", "Rajalakshmi"];

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

const GRID_COLUMNS = "92px 74px 145px 145px 180px 200px 90px 110px 110px";

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
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 min-w-[190px] overflow-y-auto border border-slate-200 bg-white p-2 text-slate-800 shadow-xl" onClick={event => event.stopPropagation()}>
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

export default function IPListModal({ onClose, onSelectPatient, doctor = "Dr. Chandra Sekar", date = "03-02-2024", time = "10:00" }) {
  const [filter, setFilter] = useState("");
  const [wardFilters, setWardFilters] = useState([]);
  const [complaintFilters, setComplaintFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [dutyDoctorFilters, setDutyDoctorFilters] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [hoveredSection, setHoveredSection] = useState(null);
  const normalizedFilter = filter.trim().toLowerCase();

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

  const handleSelect = row => {
    onSelectPatient?.({ name: row[4], ward: row[0], room: row[1], doctor: row[2], complaint: row[5], priority: row[6], dutyNurse: row[8] });
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
  const tableColumns = [
    { name: "Ward", selector: row => row[0], width: "92px" },
    { name: "Room#", selector: row => row[1], cell: row => <HighlightedRoom room={row[1]} />, width: "74px" },
    { name: "Patient's Doctor", selector: row => row[2], width: "145px" },
    { name: "Queue Status", selector: row => row[3], width: "145px" },
    { name: "Patient Name", selector: row => row[4], width: "180px" },
    { name: "Chief Complaint", selector: row => row[5], width: "200px" },
    { name: "Priority", selector: row => row[6], width: "90px" },
    { name: "Duty Doctor", selector: row => row[7], width: "110px" },
    { name: "Duty Nurse", selector: row => row[8], width: "110px" },
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
        paddingLeft: "8px",
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-8 animate-fade-in" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="list-modal-flat flex h-[90vh] w-[min(96vw,1146px)] flex-col overflow-hidden shadow-2xl animate-slide-up" style={{ background: "var(--color-surface)" }} onClick={event => event.stopPropagation()}>
        <div className="flex-shrink-0 rounded-t-xl" style={{ background: "linear-gradient(135deg, #991b1b 0%, var(--color-danger) 100%)" }}>
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <div className="flex items-center gap-4">
              <h2 className="flex items-center gap-2 whitespace-nowrap text-lg font-bold text-white"><Bed size={20} />In Patient List</h2>
              <div className="flex items-center gap-2 whitespace-nowrap text-xs">
                <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: "rgba(254,243,199,0.18)", color: "#fef3c7" }}>
                  <Calendar size={12} /><span className="font-semibold">Date:</span><span>{date}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: "rgba(243,232,255,0.18)", color: "#f3e8ff" }}>
                  <Clock size={12} /><span className="font-semibold">Time:</span><span>{time}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/10" title="Close">Close</button>
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
            <div className="relative ml-3 flex items-center">
              <input value={filter} onChange={event => setFilter(event.target.value)} placeholder="Search by patient, ward, complaint..." className="w-[205px] border border-white/30 bg-white/15 px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/60" />
            </div>
            <div className="ml-auto mr-4 flex items-center whitespace-nowrap text-xs">
              <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: "rgba(219,234,254,0.18)", color: "#dbeafe" }}>
                <Stethoscope size={12} /><span className="font-semibold">Doctor:</span><span>{doctor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-30 grid flex-shrink-0 border-b text-xs font-bold text-white" style={{ gridTemplateColumns: GRID_COLUMNS, background: "#b91c1c", borderColor: "var(--color-border)" }}>
          {COLUMNS.map(column => {
            const filterConfig = headerFilters[column];
            return (
              <div key={column} className="flex min-w-0 items-start border-r px-2 py-1.5 last:border-r-0" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                {filterConfig ? <HeaderFilter label={column} {...filterConfig} textColor="white" /> : <span className="truncate py-1">{column}</span>}
              </div>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
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
                onRowClicked={handleSelect}
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
          <div className="flex items-center gap-1 text-xs italic" style={{ color: "var(--color-text-muted)" }}><Eye size={12} />Click any row to load patient</div>
        </div>
      </div>
    </div>
  );
}
