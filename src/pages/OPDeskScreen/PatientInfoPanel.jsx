import { useState } from "react";
import {
  MapPin, User, Phone, Calendar, Clock, AlertCircle,
  CreditCard, Baby, Hospital, FileText, Heart, Activity,
  DollarSign, Shield, CheckCircle, XCircle, TrendingUp,
  UserCheck, Stethoscope, Briefcase, Home, Mail, PhoneCall,
  UserPlus, Clock as ClockIcon, CalendarDays, Pill, Syringe,
  Scissors, Baby as BabyIcon, HeartPulse, Ambulance, Bed,
  DoorOpen, UserRound, Building2, Wallet, BadgeCheck,
  ChevronRight, Download, Printer, Edit3, Camera,
  Home as HomeIcon, Phone as PhoneIcon, Users, Calendar as CalendarIcon,
  Stethoscope as StethoscopeIcon, Shield as ShieldIcon, Baby as BabyIcon2,
  Hospital as HospitalIcon2
} from "lucide-react";

function InfoCard({ label, value, icon: Icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md group"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 min-w-0 items-center gap-2">
          <div className="shrink-0 text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>
            {label}
          </div>
          <div className="min-w-0 truncate text-sm font-semibold whitespace-nowrap" title={typeof value === "string" ? value : undefined} style={{ color: "var(--color-text-base)" }}>
            {value || "—"}
          </div>
        </div>
        {Icon && (
          <div className="p-1.5 rounded-lg transition-all duration-200 group-hover:scale-110"
            style={{ background: `${color}15`, color: color }}>
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon: Icon, valueColor, bold, subtitle }) {
  return (
    <div className="flex items-center gap-2 py-1 border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="w-36 shrink-0 flex items-center gap-1.5">
        {Icon && <Icon size={12} style={{ color: "var(--color-text-muted)" }} />}
        <span className="text-[12px] font-semibold tracking-wide whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`truncate text-sm whitespace-nowrap ${bold ? "font-bold" : "font-medium"}`}
          title={typeof value === "string" ? value : undefined}
          style={{ color: valueColor || "var(--color-text-base)" }}>
          {value || "—"}
        </div>
        {subtitle && (
          <div className="text-[0.6rem] mt-0.5" style={{ color: "var(--color-text-subtle)" }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, type, large }) {
  const getStatusColor = () => {
    if (type === "priority") return status === "Urgent" ? "var(--color-danger)" : "var(--color-success)";
    if (type === "fee")      return status === "Cash"   ? "var(--color-primary)" : "var(--color-info)";
    if (type === "claim")    return status?.includes("Yes") ? "var(--color-success)" : "var(--color-text-muted)";
    return "var(--color-primary)";
  };
  return (
    <span title={status} className={`inline-flex max-w-full items-center gap-1 rounded-full font-bold ${large ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs"}`}
      style={{ background: `${getStatusColor()}20`, color: getStatusColor() }}>
      {status === "Urgent"    && <AlertCircle size={large ? 13 : 10} />}
      {status === "Follow-up" && <Activity size={large ? 13 : 10} />}
      <span className="truncate">{status}</span>
    </span>
  );
}

function DropdownRow({ label, value, onChange, options, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 py-1 border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="w-36 shrink-0 flex items-center gap-1.5">
        {Icon && <Icon size={12} style={{ color: "var(--color-text-muted)" }} />}
        <span className="text-[12px] font-semibold tracking-wide whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium outline-none cursor-pointer"
          style={{ color: "var(--color-text-base)" }}
        >
          {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    </div>
  );
}

const toDateInputValue = value => {
  const text = String(value || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : "";
};

const formatInsuranceDate = value => {
  const isoDate = toDateInputValue(value);
  if (!isoDate) return value || "—";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

function SectionEditForm({ fields, value, onChange, onSave, onCancel }) {
  return (
    <div className="space-y-2">
      {fields.map(({ key, label }) => (
        <label key={key} className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-2 text-xs">
          <span className="font-semibold" style={{ color: "var(--color-text-muted)" }}>{label}</span>
          <input type={fields.find(field => field.key === key)?.type || "text"} value={fields.find(field => field.key === key)?.type === "date" ? toDateInputValue(value[key]) : value[key] || ""} onChange={event => onChange({ ...value, [key]: event.target.value })} className="h-7 min-w-0 border px-2 text-sm outline-none" style={{ borderColor: "var(--color-border)", color: "var(--color-text-base)" }} />
        </label>
      ))}
      <div className="flex justify-end gap-1">
        <button type="button" onClick={onSave} className="flex h-7 items-center gap-1 px-2 text-xs text-white" style={{ background: "var(--color-success)" }}><CheckCircle size={12} />Save</button>
        <button type="button" onClick={onCancel} className="flex h-7 items-center gap-1 px-2 text-xs text-white" style={{ background: "var(--color-danger)" }}><XCircle size={12} />Cancel</button>
      </div>
    </div>
  );
}

// Tab configuration — each tab renders as a vertical colored bar + icon button
const TABS = [
  { key: "address",     label: "Address",       icon: MapPin,       color: "#4a90d9" },
  { key: "appointment", label: "Appointment",   icon: CalendarIcon, color: "#f5b301" },
];

const PROFILE_HEADER_H = 50;
const HEADER_H = 190;
const FOOTER_H = 40;

export default function PatientInfoPanel({
  patient,
  isPopup = false,
  popupWidth = 384,
  popupHeight = 600,
}) {
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("address");
  const p = patient || {};
  const [appointmentPriority, setAppointmentPriority] = useState("Normal");
  const [appointmentBilling, setAppointmentBilling] = useState("Self");
  const [visitType, setVisitType] = useState("Follow Up");
  const [insurance, setInsurance] = useState(p.insurer || { name: "", plan: "", period: "", claim: "" });
  const [company, setCompany] = useState(p.company || { name: "Trisul Enterprises and Engineering Services Private Limited", designation: "Foreman", staffId: "A100302" });
  const [editingSection, setEditingSection] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const insuranceEndDate = toDateInputValue(insurance.period);
  const insuranceStatus = insuranceEndDate
    ? (new Date(`${insuranceEndDate}T23:59:59`) >= new Date() ? "Active" : "Elapsed")
    : "Unknown";

  const startEditing = (section, value) => {
    setEditingSection(section);
    setEditDraft({ ...value });
  };

  const saveSection = () => {
    if (editingSection === "insurance") setInsurance(editDraft);
    if (editingSection === "company") setCompany(editDraft);
    setEditingSection(null);
  };

  const patientData = {
    address: p.address || {
      line1: "",
      line2: "",
      line3: "",
      line4: "",
      phone: "",
    },
    appointment: p.appointment || { datetime: "", priority: "" },
    insurer: insurance,
  };

  // Get the initial letter for fallback avatar
  const getInitials = () => {
    const name = p.name || "Patient";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "address":
        return (
          <div className="space-y-2">
            {[patientData.address.line1, patientData.address.line2, patientData.address.line3, patientData.address.line4]
              .filter(Boolean).map((line, i) => (
                <div key={i} className="text-sm flex items-start gap-2">
                  <MapPin size={12} style={{ color: "var(--color-text-muted)" }} className="mt-0.5" />
                  <span style={{ color: "var(--color-text-base)" }}>{line}</span>
                </div>
              ))}
            {patientData.address.phone && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                <Phone size={12} style={{ color: "var(--color-primary)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                  {patientData.address.phone}
                </span>
              </div>
            )}
          </div>
        );
      case "appointment":
        return (
          <div className="space-y-2">
            {/* Appointment Today — replaces the old generic Date & Time /
                Priority rows with this more detailed breakdown. */}
            <div>
              <div className="mb-2 whitespace-nowrap text-xs font-bold tracking-wide" style={{ color: "var(--color-text-muted)" }}>Appointment Today</div>
              <div className="space-y-2">
                <DetailRow label="Request Dt-Time" value="18/06/2026 12:05 pm" icon={Clock} />
                <DetailRow label="Appt.Dt-Time" value="19/06/2026 04:00 pm" icon={CalendarIcon} />
                <DropdownRow label="Visit Type" value={visitType} onChange={setVisitType} options={["New Instance", "First Visit", "Follow Up"]} icon={UserCheck} />
                <DropdownRow label="Priority" value={appointmentPriority} onChange={setAppointmentPriority} options={["Normal", "Urgent", "Emergency"]} icon={AlertCircle} />
                <DropdownRow label="Billing" value={appointmentBilling} onChange={setAppointmentBilling} options={["Self", "Insurance", "Corporate"]} icon={Wallet} />
              </div>
            </div>

            {/* Insurance Information — merged in from the removed Insurance tab. */}
            <div className="pt-2 mt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="whitespace-nowrap text-xs font-bold tracking-wide" style={{ color: "var(--color-text-muted)" }}>Insurance Information</div>
                  <span className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold" style={{ background: insuranceStatus === "Active" ? "#dcfce7" : insuranceStatus === "Elapsed" ? "#fee2e2" : "#f3f4f6", color: insuranceStatus === "Active" ? "#15803d" : insuranceStatus === "Elapsed" ? "#b91c1c" : "#6b7280" }}>{insuranceStatus}</span>
                </div>
                {editingSection !== "insurance" && <button type="button" onClick={() => startEditing("insurance", insurance)} className="p-1" title="Edit insurance information"><Edit3 size={13} style={{ color: "var(--color-primary)" }} /></button>}
              </div>
              {editingSection === "insurance" ? (
                <SectionEditForm fields={[{ key: "name", label: "Provider" }, { key: "plan", label: "Plan" }, { key: "period", label: "Period", type: "date" }, { key: "claim", label: "Claim Status" }]} value={editDraft} onChange={setEditDraft} onSave={saveSection} onCancel={() => setEditingSection(null)} />
              ) : <div className="space-y-2">
                <InfoCard label="Provider" value={patientData.insurer.name} color="var(--color-primary)" />
                <DetailRow label="Plan" value={patientData.insurer.plan} icon={FileText} />
                <DetailRow label="Period" value={formatInsuranceDate(patientData.insurer.period)} icon={Calendar} />
                <DetailRow label="Claim Status" value={<StatusBadge status={patientData.insurer.claim} type="claim" large />} icon={CheckCircle} />
              </div>}
            </div>

            {/* Company Information — 3rd section after Insurance Information. */}
            <div className="pt-2 mt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="whitespace-nowrap text-xs font-bold tracking-wide" style={{ color: "var(--color-text-muted)" }}>Company Information</div>
                {editingSection !== "company" && <button type="button" onClick={() => startEditing("company", company)} className="p-1" title="Edit company information"><Edit3 size={13} style={{ color: "var(--color-primary)" }} /></button>}
              </div>
              {editingSection === "company" ? (
                <SectionEditForm fields={[{ key: "name", label: "Name" }, { key: "designation", label: "Staff Designation" }, { key: "staffId", label: "Staff ID" }]} value={editDraft} onChange={setEditDraft} onSave={saveSection} onCancel={() => setEditingSection(null)} />
              ) : <div className="space-y-2">
                <InfoCard label="Name" value={company.name} color="var(--color-primary)" />
                <DetailRow label="Staff Designation" value={company.designation} icon={Briefcase} />
                <DetailRow label="Staff ID" value={company.staffId} icon={BadgeCheck} />
              </div>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg shadow-2xl"
      style={{
        width: popupWidth,
        height: popupHeight,
        background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%)",
        border: isPopup ? "1px solid var(--color-border)" : "none",
        borderLeft: !isPopup ? "2px solid var(--color-primary)" : undefined,
      }}
    >
      {/* "Profile Information" toolbar — same treatment as the Caution tab's
          own header (solid tab-accent background, fixed height), using the
          Profile tab's own color (#eb6367 in LeftSidebar's LEFT_TABS). */}
      <div className="px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#eb6367", borderColor: "#eb6367", height: PROFILE_HEADER_H, flexShrink: 0 }}>
        <span className="text-base font-bold text-white">Patient Information</span>
      </div>

      {/* Compact patient identity header — Name left / Photo right on the
          top row, everything else stacked full-width beneath both. */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b flex flex-col gap-2"
        style={{
          background: "linear-gradient(135deg, #eef6fb 0%, #ffffff 100%)",
          borderColor: "var(--color-border)",
          height: HEADER_H,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[1.125rem] font-bold truncate" style={{ color: "var(--color-text-base)" }}>{p.name || "—"}</h3>

          <div className="relative flex-shrink-0 rounded-lg overflow-hidden group shadow-md"
            style={{
              width: 72,
              height: 82,
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
              border: "2px solid white",
            }}>
            {p.photo && !imageError ? (
              <img src={p.photo} alt={p.name} className="w-full h-full object-cover" onError={() => setImageError(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{getInitials()}</span>
              </div>
            )}
            <button className="absolute bottom-1 right-1 p-1 rounded-full bg-white shadow-md transition-all opacity-0 group-hover:opacity-100" title="Change photo">
              <Camera size={10} style={{ color: "var(--color-primary)" }} />
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-[0.68rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Patient ID:</span>
            <span className="text-[0.775rem] font-semibold" style={{ color: "var(--color-primary)" }}>{p.id || p.patientId || "—"}</span>
          </div>
          <div className="mt-1.5 space-y-1 text-sm" style={{ color: "var(--color-text-base)" }}>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span><span style={{ color: "var(--color-text-muted)" }}>Age:</span> <span className="font-bold">{p.age || "—"} yrs*</span></span>
              <span style={{ color: "var(--color-border-strong)" }}>|</span>
              <span><span style={{ color: "var(--color-text-muted)" }}>Gender:</span> <span className="font-bold">{p.gender || "—"}</span></span>
              <span style={{ color: "var(--color-border-strong)" }}>|</span>
              <span><span style={{ color: "var(--color-text-muted)" }}>Blood:</span> <span className="font-bold">{p.bloodGroup || "—"}</span></span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span><span style={{ color: "var(--color-text-muted)" }}>DOB:</span> <span className="font-bold">18/06/1995<sup className="text-[0.95em]">*</sup></span></span>
              <span style={{ color: "var(--color-border-strong)" }}>|</span>
              <span><span style={{ color: "var(--color-text-muted)" }}>Age Group:</span> <span className="font-bold">Adult</span></span>
            </div>
            <div className="whitespace-nowrap">
              <span><span style={{ color: "var(--color-text-muted)" }}>Marital Status:</span> <span className="font-bold">Married</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple section navigation leaves more room for profile information. */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-1 p-2 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center justify-center gap-1.5 px-2 transition-all"
              style={{ height: 38, background: isActive ? tab.color : "var(--color-surface-alt)", color: isActive ? "white" : "var(--color-text-base)", border: `1px solid ${isActive ? tab.color : "var(--color-border)"}`, boxShadow: isActive ? "0 2px 5px rgba(0,0,0,0.15)" : "none" }}>
              <Icon size={13} />
              <span className="text-[0.67rem] font-bold truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          {renderContent()}
        </div>
      </div>

      {/* ── FOOTER (popup only) ── */}
      {isPopup && (
        <div
          className="flex-shrink-0 px-4 border-t flex items-center justify-between"
          style={{ borderColor: "var(--color-border)", height: FOOTER_H }}
        >
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp size={12} style={{ color: "var(--color-success)" }} />
            <span style={{ color: "var(--color-text-muted)" }}>Last Visit:</span>
            <span className="font-semibold" style={{ color: "var(--color-text-base)" }}>02/03/2024</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <HeartPulse size={12} style={{ color: "var(--color-danger)" }} />
            <span style={{ color: "var(--color-text-muted)" }}>Follow-up:</span>
            <span className="font-semibold" style={{ color: "var(--color-primary)" }}>15/03/2024</span>
          </div>
        </div>
      )}
    </div>
  );
}
