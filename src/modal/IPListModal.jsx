import { useMemo, useState } from "react";
import { Bed, CheckCircle, Eye, LogOut, ParkingCircle, Search, Users, X } from "lucide-react";

const COLUMNS = ["Ward", "Room#", "Patient's Doctor", "Queue Status", "Patient Name", "Chief Complaint", "Priority", "Duty Doctor"];

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

const GRID_COLUMNS = "92px 74px 145px 145px minmax(150px,1fr) minmax(165px,1fr) 90px 110px";

export default function IPListModal({ onClose, onSelectPatient }) {
  const [filter, setFilter] = useState("");
  const [ward, setWard] = useState("All");
  const [activeSection, setActiveSection] = useState("all");
  const [hoveredSection, setHoveredSection] = useState(null);
  const normalizedFilter = filter.trim().toLowerCase();

  const sections = useMemo(() => IP_SECTIONS.map(section => ({
    ...section,
    rows: section.rows.filter(row =>
      (ward === "All" || row[0] === ward) &&
      (!normalizedFilter || row.some(value => value.toLowerCase().includes(normalizedFilter)))
    ),
  })), [normalizedFilter, ward]);

  const handleSelect = row => {
    onSelectPatient?.({ name: row[4], ward: row[0], room: row[1], doctor: row[2], complaint: row[5], priority: row[6] });
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
  const totalPatients = sections.reduce((total, section) => total + section.rows.length, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-8 animate-fade-in" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="list-modal-flat flex w-[min(96vw,1400px)] max-h-[90vh] flex-col overflow-hidden shadow-2xl animate-slide-up" style={{ background: "var(--color-surface)" }} onClick={event => event.stopPropagation()}>
        <div className="flex-shrink-0 rounded-t-xl" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)" }}>
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Bed size={20} />IP Patient List</h2>
              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/80">
                <span>Date: 03-02-2024</span><span>Time: 10:00</span>
                <span>Nurse-1: Niveditha</span><span>Nurse-2: Soundarya</span><span>Nurse-3: Rajalakshmi</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden gap-3 text-[0.6rem] font-semibold text-white/70 md:flex"><span># Corporate</span><span>* Insurance</span><span>@ Referral</span></div>
              <div className="relative">
                <input value={filter} onChange={event => setFilter(event.target.value)} placeholder="Search by patient, ward, complaint..." className="w-[220px] border border-white/30 bg-white/15 px-3 py-1.5 text-sm text-white outline-none placeholder:text-white/60" />
              </div>
              <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/10" title="Close">Close</button>
            </div>
          </div>

          <div className="flex items-stretch px-5" style={{ height: 34 }}>
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
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 border-b px-4 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
          <label className="text-xs font-bold">Ward (All/Select)</label>
          <select value={ward} onChange={event => setWard(event.target.value)} className="border px-2 py-1 text-xs outline-none" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <option>All</option><option>Gynacology</option><option>Surgery-1</option><option>Ward-B1</option><option>Dialysis</option>
          </select>
          <span className="ml-auto text-xs" style={{ color: "var(--color-text-muted)" }}>{totalPatients} patients</span>
        </div>

        <div className="grid flex-shrink-0 border-b text-xs font-bold text-white" style={{ gridTemplateColumns: GRID_COLUMNS, background: "var(--color-primary-dark)", borderColor: "var(--color-border)" }}>
          {COLUMNS.map(column => <div key={column} className="border-r px-3 py-2 last:border-r-0" style={{ borderColor: "rgba(255,255,255,0.12)" }}>{column}</div>)}
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {visibleSections.map(section => (
            <div key={section.key}>
              <div className="sticky top-0 z-10 flex items-center gap-2 border-y px-4 py-2" style={{ background: section.color, borderColor: "var(--color-border)" }}>
                <span className="text-xs font-extrabold uppercase tracking-wide">{section.label}</span>
                <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[0.6rem] font-bold">{section.rows.length}</span>
              </div>
              {section.rows.map((row, rowIndex) => (
                <button key={`${section.key}-${rowIndex}`} type="button" onClick={() => handleSelect(row)} className="grid w-full text-left text-xs transition-colors hover:bg-blue-50" style={{ gridTemplateColumns: GRID_COLUMNS, background: rowIndex % 2 ? "var(--color-surface-alt)" : "var(--color-surface)" }}>
                  {row.map((value, cellIndex) => <span key={cellIndex} className="truncate border-b border-r px-2 py-1.5 last:border-r-0" style={{ borderColor: "var(--color-border)" }} title={value}>{value}</span>)}
                </button>
              ))}
              {section.rows.length === 0 && <div className="border-b px-4 py-8 text-center text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>No matching patients</div>}
            </div>
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center justify-between border-t px-5 py-3" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)" }}>
          <div className="flex gap-4 text-xs">
            {IP_SECTIONS.map(section => <div key={section.key} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: section.color }} /><span style={{ color: "var(--color-text-muted)" }}>{section.label.replace("IP-", "").replace(" List", "")}:</span><b>{sections.find(item => item.key === section.key)?.rows.length || 0}</b></div>)}
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-primary)" }} /><span style={{ color: "var(--color-text-muted)" }}>Total:</span><b style={{ color: "var(--color-primary)" }}>{totalPatients}</b></div>
          </div>
          <div className="flex items-center gap-1 text-xs italic" style={{ color: "var(--color-text-muted)" }}><Eye size={12} />Click any row to load patient</div>
        </div>
      </div>
    </div>
  );
}
