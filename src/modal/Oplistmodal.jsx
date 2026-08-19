import { useState } from "react";
import {
  X, Search, Calendar, Clock, User, FileText, AlertCircle,
  Users, ParkingCircle, CheckCircle, TrendingUp, Filter,
  Download, Printer, ChevronDown, ChevronUp, Star, StarOff,
  Activity, Heart, Stethoscope, Pill, Syringe, ClipboardList,
  Tag, Phone, Mail, MapPin, CalendarDays, Eye
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   MOCK DATA (replace with real API / props)
══════════════════════════════════════════════════════════ */
const MOCK_OP_LIST = {
  appointment: [
    { token: "B1-9*",  sched: "10:05", status: "OP-Waiting",     docNo: "",     name: "Raveendran. K",      complaint: "Fever, Headache",     priority: "Normal",      need: "New Need", age: 45, gender: "M" },
    { token: "B1-10",  sched: "10:10", status: "OP-Waiting",     docNo: "",     name: "Nandhini. A",        complaint: "Severe Headache",     priority: "Normal",      need: "New Need", age: 32, gender: "F" },
    { token: "B2-12",  sched: "10:35", status: "OP-Waiting",     docNo: "",     name: "Anjali (Baby). L",   complaint: "Fever, Cold, Cry",    priority: "Normal",      need: "New Need", age: 2, gender: "F" },
    { token: "B2-13",  sched: "10:40", status: "OP-Appointment", docNo: "",     name: "Vignesh (Infant). R",complaint: "Injury Arm, Leg",     priority: "Urgent (OS)", need: "New Patient", age: 1, gender: "M" },
    { token: "B2-14#", sched: "10:45", status: "OP-Appointment", docNo: "",     name: "Ramakrishnan. K.R",  complaint: "Allergy, Rashes",     priority: "Normal",      need: "New Need", age: 58, gender: "M" },
    { token: "B2-15",  sched: "10:50", status: "OP-Appointment", docNo: "",     name: "Shankar. S",         complaint: "Severe Headache",     priority: "Normal",      need: "New Need", age: 42, gender: "M" },
    { token: "B2-16",  sched: "10:55", status: "OP-Appointment", docNo: "",     name: "Sivakumar. T",       complaint: "Bruise Leg, Arm",     priority: "Normal",      need: "Follow-up", age: 39, gender: "M" },
    { token: "B2-17*", sched: "11:00", status: "OP-Waiting",     docNo: "",     name: "Radhika. P",         complaint: "High Fever, Cold",    priority: "Normal (OS)", need: "New Need", age: 28, gender: "F" },
  ],
  parked: [
    { token: "B1-2",    sched: "9:35", status: "OP-Parked",          docNo: "3898", name: "Vidhya Vimal",      complaint: "High Fever",          priority: "Normal",      need: "New Need", age: 35, gender: "F" },
    { token: "B1-4",    sched: "9:45", status: "OP-Parked",          docNo: "3898", name: "Christopher. A",    complaint: "Allergy, Wheasing",   priority: "Normal",      need: "New Need", age: 47, gender: "M" },
    { token: "@B1-6#",  sched: "9:55", status: "OP-Parked (Report)", docNo: "3899", name: "Pramila. L",        complaint: "Wheasing, Cough",     priority: "Important",   need: "Follow-up", age: 52, gender: "F" },
    { token: "@B2-11",  sched: "10:30",status: "OP-Parked",          docNo: "3900", name: "Kalaiyarasi. S",    complaint: "Allergy, Asthma",     priority: "Urgent (OS)", need: "Referral", age: 41, gender: "F" },
    { token: "B1-8",    sched: "10:02",status: "OP-Parked",          docNo: "3901", name: "Vinayagam. B",      complaint: "Breathing Trouble",   priority: "Emergency",   need: "Follow-up", age: 63, gender: "M" },
  ],
  treated: [
    { token: "B1-1", sched: "9:30", status: "OP-Treated", docNo: "3894", name: "Ramchandar. A",   complaint: "Fever, Cold",       priority: "Normal", need: "New Need", age: 44, gender: "M" },
    { token: "B1-3", sched: "9:40", status: "OP-Treated", docNo: "3895", name: "Tamilarasi. V",   complaint: "Fever, Cough, Cold",priority: "Normal", need: "Referral", age: 38, gender: "F" },
    { token: "B1-5", sched: "9:50", status: "OP-Treated", docNo: "3896", name: "Mohamed Azar. M", complaint: "Fever, Cold",       priority: "Normal", need: "New Need", age: 31, gender: "M" },
    { token: "B1-7", sched: "10:00",status: "OP-Treated", docNo: "3897", name: "Amarnath. N",     complaint: "Fever, Cold",       priority: "Normal", need: "New Need", age: 56, gender: "M" },
  ],
};

function PriorityBadge({ priority }) {
  const getStyle = () => {
    const p = priority?.toLowerCase() || "";
    if (p.includes("emergency")) return { bg: "#fee2e2", color: "var(--color-danger)", icon: AlertCircle };
    if (p.includes("urgent")) return { bg: "#fff7ed", color: "#ea580c", icon: AlertCircle };
    if (p.includes("important")) return { bg: "#fefce8", color: "#ca8a04", icon: Star };
    return { bg: "#f0fdf4", color: "#16a34a", icon: CheckCircle };
  };
  const style = getStyle();
  const Icon = style.icon;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold">
      <Icon size={10} />
      {priority}
    </span>
  );
}

function NeedBadge({ need }) {
  const getStyle = () => {
    if (need === "Referral") return { bg: "#f3e8ff", color: "#9333ea" };
    if (need === "Follow-up") return { bg: "#eff6ff", color: "var(--color-value)" };
    if (need === "New Patient") return { bg: "#ecfdf5", color: "#059669" };
    return { bg: "#f9fafb", color: "#6b7280" };
  };
  const style = getStyle();

  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-[0.6rem] font-bold" style={{ background: style.bg, color: style.color }}>
      {need}
    </span>
  );
}

function StatusBadge({ status }) {
  const getStyle = () => {
    if (status.includes("Waiting")) return { bg: "#dbeafe", color: "var(--color-value)", icon: Clock };
    if (status.includes("Parked")) return { bg: "#fef3c7", color: "#d97706", icon: ParkingCircle };
    if (status.includes("Treated")) return { bg: "#d1fae5", color: "#059669", icon: CheckCircle };
    return { bg: "#f3f4f6", color: "#6b7280", icon: FileText };
  };
  const style = getStyle();
  const Icon = style.icon;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.6rem] font-semibold" style={{ background: style.bg, color: style.color }}>
      <Icon size={10} />
      {status}
    </span>
  );
}

function HighlightedToken({ token }) {
  const markerStyles = {
    "*": { background: "#dbeafe", color: "#1d4ed8" },
    "#": { background: "#fef3c7", color: "#b45309" },
    "@": { background: "#f3e8ff", color: "#7e22ce" },
  };

  return token.split("").map((character, index) => {
    const markerStyle = markerStyles[character];
    return markerStyle ? (
      <strong key={index} className="mx-px rounded px-1 font-extrabold" style={markerStyle}>
        {character}
      </strong>
    ) : character;
  });
}

function PatientRow({ row, index, onSelect, section }) {
  const values = [row.token, row.sched, row.status, row.docNo || "—", row.name, row.complaint, row.priority, row.need];
  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(row)}
      className="grid w-full text-left text-xs transition-colors hover:bg-blue-50"
      style={{
        gridTemplateColumns: "70px 70px 140px 65px 1fr 1fr 100px 100px",
        background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
      }}
    >
      {values.map((value, cellIndex) => (
        <span key={cellIndex} className="truncate border-b border-r px-2 py-1.5 last:border-r-0" style={{ borderColor: "var(--color-border)" }} title={String(value)}>
          {cellIndex === 0 ? <HighlightedToken token={String(value)} /> : value}
        </span>
      ))}
    </button>
  );
}

function SectionHeader({ label, count, color, icon: Icon, note }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-y px-4 py-2" style={{ background: color, borderColor: "var(--color-border)" }}>
      <span className="text-xs font-extrabold uppercase tracking-wide">{label}</span>
      <span className="bg-black/10 px-1.5 py-0.5 text-[0.6rem] font-bold">{count}</span>
    </div>
  );
}

function EmptyState({ message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Icon size={32} style={{ color: "var(--color-text-subtle)" }} />
      <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>{message}</p>
    </div>
  );
}

function ColHeader() {
  const columns = [
    { label: "Token", icon: Tag, width: 70 },
    { label: "Time", icon: Clock, width: 70 },
    { label: "Status", icon: Activity, width: 140 },
    { label: "Doc#", icon: FileText, width: 65 },
    { label: "Patient", icon: User, width: null },
    { label: "Complaint", icon: AlertCircle, width: null },
    { label: "Priority", icon: Star, width: 100 },
    { label: "Need", icon: ClipboardList, width: 100 },
  ];

  return (
    <div className="sticky top-0 z-10 grid border-b" style={{
      gridTemplateColumns: "70px 70px 140px 65px 1fr 1fr 100px 100px",
      background: "var(--color-primary-dark)",
      borderColor: "var(--color-border)"
    }}>
      {columns.map(col => (
        <div key={col.label} className="px-3 py-2 flex items-center gap-1">
          {col.icon && <col.icon size={10} style={{ color: "rgba(255,255,255,0.7)" }} />}
          <span className="text-[0.6rem] font-bold uppercase tracking-wide text-white">
            {col.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OPListModal({ onClose, onSelectPatient, doctor = "Dr. Chandra Sekar", date = "03/02/2024", time = "10:00" }) {
  const [filter, setFilter] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [hoveredSection, setHoveredSection] = useState(null);

  const applyFilter = (rows) => {
    if (!filter.trim()) return rows;
    return rows.filter(r =>
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      r.complaint.toLowerCase().includes(filter.toLowerCase()) ||
      r.token.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const apt = applyFilter(MOCK_OP_LIST.appointment);
  const pkd = applyFilter(MOCK_OP_LIST.parked);
  const trtd = applyFilter(MOCK_OP_LIST.treated);

  const handleSelect = (row) => {
    onSelectPatient && onSelectPatient(row);
    onClose && onClose();
  };

  const sections = [
    { key: "all", label: "All", icon: Users, count: apt.length + pkd.length + trtd.length, color: "var(--color-primary)" },
    { key: "appointment", label: "Appointments", icon: Calendar, count: apt.length, color: "#60a5fa" },
    { key: "parked", label: "Parked", icon: ParkingCircle, count: pkd.length, color: "#d97706" },
    { key: "treated", label: "Treated", icon: CheckCircle, count: trtd.length, color: "#059669" },
  ];

  const totalPatients = apt.length + pkd.length + trtd.length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center p-8 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="list-modal-flat flex w-[min(96vw,1400px)] max-h-[90vh] flex-col overflow-hidden shadow-2xl animate-slide-up"
        style={{
          background: "var(--color-surface)",
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 rounded-t-xl" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)" }}>
          <div className="px-5 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardList size={20} />
                OP Patient List
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="Search by name, token, complaint..."
                  className="px-3 py-1.5 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    width: "220px"
                  }}
                />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex items-stretch" style={{ height: 34 }}>
            {sections.map((section, index) => {
              const showColor = activeSection === section.key || hoveredSection === section.key;
              const slant = 12;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  onMouseEnter={() => setHoveredSection(section.key)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative flex w-36 items-center justify-center text-xs font-bold transition-all"
                  style={{
                    marginLeft: index === 0 ? 0 : -slant,
                    zIndex: activeSection === section.key ? sections.length + 1 : sections.length - index,
                    clipPath: index === 0
                      ? `polygon(0 0, calc(100% - ${slant}px) 0, 100% 100%, 0 100%)`
                      : `polygon(0 0, calc(100% - ${slant}px) 0, 100% 100%, ${slant}px 100%)`,
                    background: showColor ? section.color : "#6b7280",
                    color: "white",
                    boxShadow: activeSection === section.key ? "inset 0 1px 4px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  <span className="whitespace-nowrap">{section.label}</span>
                  <sup className="ml-1 text-[0.6rem]">{section.count}</sup>
                </button>
              );
            })}
            <div className="ml-4 flex items-center gap-2 whitespace-nowrap text-xs">
              <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: "rgba(219,234,254,0.18)", color: "#dbeafe" }}>
                <Stethoscope size={12} />
                <span className="font-semibold">Doctor:</span>
                <span>{doctor}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: "rgba(254,243,199,0.18)", color: "#fef3c7" }}>
                <Calendar size={12} />
                <span className="font-semibold">Date:</span>
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: "rgba(243,232,255,0.18)", color: "#f3e8ff" }}>
                <Clock size={12} />
                <span className="font-semibold">Time:</span>
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <ColHeader />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Appointments Section */}
          {(activeSection === "all" || activeSection === "appointment") && apt.length > 0 && (
            <>
              <SectionHeader
                label="OP Appointments"
                count={apt.length}
                color="#dbeafe"
                icon={Calendar}
                note="At day end — remaining appointments will be counted as Cancelled"
              />
              {apt.map((row, i) => (
                <PatientRow key={row.token} row={row} index={i} onSelect={handleSelect} section="appointment" />
              ))}
            </>
          )}

          {/* Parked Section */}
          {(activeSection === "all" || activeSection === "parked") && pkd.length > 0 && (
            <>
              <SectionHeader
                label="OP Parked"
                count={pkd.length}
                color="#fef3c7"
                icon={ParkingCircle}
                note="At day end — parked patients will be carried over to next day"
              />
              {pkd.map((row, i) => (
                <PatientRow key={row.token} row={row} index={i} onSelect={handleSelect} section="parked" />
              ))}
            </>
          )}

          {/* Treated Section */}
          {(activeSection === "all" || activeSection === "treated") && trtd.length > 0 && (
            <>
              <SectionHeader
                label="OP Treated"
                count={trtd.length}
                color="#d1fae5"
                icon={CheckCircle}
                note="Completed consultations"
              />
              {trtd.map((row, i) => (
                <PatientRow key={row.token} row={row} index={i} onSelect={handleSelect} section="treated" />
              ))}
            </>
          )}

          {/* Empty States */}
          {activeSection === "appointment" && apt.length === 0 && (
            <EmptyState message="No appointments found" icon={Calendar} />
          )}
          {activeSection === "parked" && pkd.length === 0 && (
            <EmptyState message="No parked patients" icon={ParkingCircle} />
          )}
          {activeSection === "treated" && trtd.length === 0 && (
            <EmptyState message="No treated patients yet" icon={CheckCircle} />
          )}
          {activeSection === "all" && totalPatients === 0 && (
            <EmptyState message="No patients found matching your search" icon={Users} />
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t flex items-center justify-between" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)" }}>
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded px-2 py-1" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
              * Insurance
            </span>
            <span className="rounded px-2 py-1" style={{ background: "#fef3c7", color: "#b45309" }}>
              # Corporate
            </span>
            <span className="rounded px-2 py-1" style={{ background: "#f3e8ff", color: "#7e22ce" }}>
              @ Referral
            </span>
          </div>
          <div className="text-xs italic flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
            <Eye size={12} />
            Click any row to load patient
          </div>
        </div>
      </div>
    </div>
  );
}
