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
      className="p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md group"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-[0.6rem] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>
            {label}
          </div>
          <div className="text-sm font-semibold" style={{ color: "var(--color-text-base)" }}>
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
    <div className="flex items-start py-2 border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="w-24 flex items-center gap-1.5">
        {Icon && <Icon size={12} style={{ color: "var(--color-text-muted)" }} />}
        <span className="text-[0.68rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </span>
      </div>
      <div className="flex-1">
        <div className={`text-sm ${bold ? "font-bold" : "font-medium"}`}
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
  { key: "insurance",   label: "Insurance",     icon: Shield,       color: "#ef5a6f" },
];

const HEADER_H = 112;
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
            <DetailRow label="Date & Time" value={patientData.appointment.datetime} icon={Clock} />
            <DetailRow label="Priority" value={<StatusBadge status={patientData.appointment.priority} type="priority" />} icon={AlertCircle} />
          </div>
        );
      case "insurance":
        return (
          <div className="space-y-2">
            <InfoCard label="Provider" value={patientData.insurer.name} icon={Building2} color="var(--color-primary)" />
            <DetailRow label="Plan" value={patientData.insurer.plan} icon={FileText} />
            <DetailRow label="Period" value={patientData.insurer.period} icon={Calendar} />
            <DetailRow label="Claim Status" value={<StatusBadge status={patientData.insurer.claim} type="claim" />} icon={CheckCircle} />
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
      {/* Compact patient identity header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #eef6fb 0%, #ffffff 100%)",
          borderColor: "var(--color-border)",
          height: HEADER_H,
        }}
      >
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

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold truncate" style={{ color: "var(--color-text-base)" }}>{p.name || "—"}</h3>
          <div className="mt-0.5 text-[0.65rem] font-semibold" style={{ color: "var(--color-primary)" }}>{p.id || p.patientId || "Patient profile"}</div>
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            <div className="px-2 py-1 rounded" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="text-[0.5rem] uppercase" style={{ color: "var(--color-text-muted)" }}>Age</div>
              <div className="text-xs font-bold">{p.age || "—"} yrs</div>
            </div>
            <div className="px-2 py-1 rounded" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="text-[0.5rem] uppercase" style={{ color: "var(--color-text-muted)" }}>Gender</div>
              <div className="text-xs font-bold truncate">{p.gender || "—"}</div>
            </div>
            <div className="px-2 py-1 rounded" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="text-[0.5rem] uppercase" style={{ color: "var(--color-text-muted)" }}>Blood</div>
              <div className="text-xs font-bold">{p.bloodGroup || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple section navigation leaves more room for profile information. */}
      <div className="flex-shrink-0 grid grid-cols-3 gap-1 p-2 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
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
