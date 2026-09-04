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
          <div className="shrink-0 text-[0.6rem] font-bold" style={{ color: "var(--color-text-muted)" }}>
            {label}
          </div>
          <div className="min-w-0 text-sm font-semibold whitespace-nowrap" style={{ color: "var(--color-text-base)" }}>
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
        <div className={`text-sm whitespace-nowrap ${bold ? "font-bold" : "font-medium"}`}
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

function StatusBadge({ status, type }) {
  const getStatusColor = () => {
    if (type === "priority") return status === "Urgent" ? "var(--color-danger)" : "var(--color-success)";
    if (type === "fee")      return status === "Cash"   ? "var(--color-primary)" : "var(--color-info)";
    if (type === "claim")    return status?.includes("Yes") ? "var(--color-success)" : "var(--color-text-muted)";
    return "var(--color-primary)";
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold"
      style={{ background: `${getStatusColor()}20`, color: getStatusColor() }}>
      {status === "Urgent"    && <AlertCircle size={10} />}
      {status === "Follow-up" && <Activity size={10} />}
      {status}
    </span>
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

  const patientData = {
    address: p.address || {
      line1: "",
      line2: "",
      line3: "",
      line4: "",
      phone: "",
    },
    appointment: p.appointment || { datetime: "", priority: "" },
    insurer: p.insurer || { name: "", plan: "", period: "", claim: "" },
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
              <div className="text-[11.6px] font-bold tracking-wide whitespace-nowrap mb-2" style={{ color: "var(--color-text-muted)" }}>Appointment Today</div>
              <div className="space-y-2">
                <DetailRow label="Request Dt-Time" value="18/06/2026 12:05 pm" icon={Clock} />
                <DetailRow label="Appt.Dt-Time" value="19/06/2026" icon={CalendarIcon} />
                <DetailRow label="Time-Slot" value="04:00 pm" icon={ClockIcon} />
                <DetailRow label="Visit Type" value="Follow-Up" icon={UserCheck} />
                <DetailRow label="Priority" value={<StatusBadge status="Normal" type="priority" />} icon={AlertCircle} />
                <DetailRow label="Billing" value="Self" icon={Wallet} />
              </div>
            </div>

            {/* Insurance Information — merged in from the removed Insurance tab. */}
            <div className="pt-2 mt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <div className="text-[11.6px] font-bold tracking-wide whitespace-nowrap mb-2" style={{ color: "var(--color-text-muted)" }}>Insurance Information</div>
              <div className="space-y-2">
                <InfoCard label="Provider" value={patientData.insurer.name} icon={Building2} color="var(--color-primary)" />
                <DetailRow label="Plan" value={patientData.insurer.plan} icon={FileText} />
                <DetailRow label="Period" value={patientData.insurer.period} icon={Calendar} />
                <DetailRow label="Claim Status" value={<StatusBadge status={patientData.insurer.claim} type="claim" />} icon={CheckCircle} />
              </div>
            </div>

            {/* Company Information — 3rd section after Insurance Information. */}
            <div className="pt-2 mt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <div className="text-[11.6px] font-bold tracking-wide whitespace-nowrap mb-2" style={{ color: "var(--color-text-muted)" }}>Company Information</div>
              <div className="space-y-2">
                <InfoCard label="Name" value="Trisul Enterprises" icon={Building2} color="var(--color-primary)" />
                <DetailRow label="Staff Designation" value="Foreman" icon={Briefcase} />
                <DetailRow label="Staff ID" value="A100302" icon={BadgeCheck} />
              </div>
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
        <span className="text-md font-bold text-white">Profile Information</span>
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
