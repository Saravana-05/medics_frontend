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
  { key: "attendant",   label: "Attendant",     icon: Users,        color: "#a78bdb" },
  { key: "appointment", label: "Appointment",   icon: CalendarIcon, color: "#f5b301" },
  { key: "visit",       label: "Today's Visit", icon: Clock,        color: "#4caf82" },
  { key: "insurance",   label: "Insurance",     icon: Shield,       color: "#ef5a6f" },
  { key: "gynac",       label: "Gynecology",    icon: BabyIcon2,    color: "#d946ef" },
  { key: "ipinfo",      label: "IP Info",       icon: Hospital,     color: "#6dc4c4" },
];

// Header height for scroll calculation - Increased to accommodate larger photo + details
const HEADER_H = 180; // Increased significantly for passport photo + details
const TABS_H = 44;
const FOOTER_H = 40;

export default function PatientInfoPanel({
  patient,
  isPopup = false,
  popupWidth = 384,
  popupHeight = 600,
}) {
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("address");

  if (!patient) {
    return (
      <div className="flex items-center justify-center rounded-lg"
        style={{
          width: popupWidth,
          height: popupHeight,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}>
        <div className="text-center">
          <User size={32} style={{ color: "var(--color-text-subtle)" }} />
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No patient selected</p>
        </div>
      </div>
    );
  }

  const p = patient;

  const patientData = {
    address: p.address || {
      line1: "Ram Krishna Apartments",
      line2: "12/24, Srinivasapuram 3rd St.",
      line3: "Samayanallur – 625 102",
      line4: "Madurai Dt",
      phone: "9855523456",
    },
    attendant: p.attendant || { name: "Sri.Krishnaswamy", relationship: "Husband", phone: "9300440039" },
    appointment: p.appointment || { datetime: "Today, 10:30 AM", priority: "Normal" },
    todaysVisit: p.todaysVisit || { type: "Follow-up", firstVisit: "02/01/2024", visitCount: "5th visit", corporate: "ABC Corp Ltd", fee: "Cash" },
    insurer: p.insurer || { name: "Star Health", plan: "Family Floater", period: "2024-2025", claim: "Yes (₹25,000)" },
    gynacInfo: p.gynacInfo || null,
    ipInfo: p.ipInfo || { ward: "General Ward", bed: "Bed No. 12A", admitDate: "15/02/2024", consultant: "Dr. Aravind Kumar" },
  };

  // Scrollable content area height
  const footerH = isPopup ? FOOTER_H : 0;
  const scrollAreaH = popupHeight - HEADER_H - TABS_H - footerH;

  // Get the initial letter for fallback avatar
  const getInitials = () => {
    const name = patient.name || "Patient";
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
      case "attendant":
        return (
          <div className="space-y-3">
            <InfoCard label="Name" value={patientData.attendant.name} icon={User} color="var(--color-info)" />
            <div className="grid grid-cols-2 gap-2">
              <InfoCard label="Relationship" value={patientData.attendant.relationship} color="var(--color-info)" />
              <InfoCard label="Phone" value={patientData.attendant.phone} icon={Phone} color="var(--color-primary)" />
            </div>
          </div>
        );
      case "appointment":
        return (
          <div className="space-y-2">
            <DetailRow label="Date & Time" value={patientData.appointment.datetime} icon={Clock} />
            <DetailRow label="Priority" value={<StatusBadge status={patientData.appointment.priority} type="priority" />} icon={AlertCircle} />
          </div>
        );
      case "visit":
        return (
          <div className="space-y-2">
            <DetailRow label="Visit Type" value={<StatusBadge status={patientData.todaysVisit.type} />} icon={Activity} />
            <DetailRow label="First Visit" value={patientData.todaysVisit.firstVisit} subtitle={patientData.todaysVisit.visitCount} icon={CalendarDays} />
            <DetailRow label="Corporate" value={patientData.todaysVisit.corporate} icon={Building2} />
            <DetailRow label="Fee Type" value={<StatusBadge status={patientData.todaysVisit.fee} type="fee" />} icon={Wallet} />
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
      case "gynac":
        if (!patientData.gynacInfo) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BabyIcon2 size={32} style={{ color: "var(--color-text-subtle)" }} />
                <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No gynecology information available</p>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <InfoCard label="LMP" value={patientData.gynacInfo.lmp} color="#d946ef" />
              <InfoCard label="EDD" value={patientData.gynacInfo.edd} color="#d946ef" />
            </div>
            <DetailRow label="Doctor" value={patientData.gynacInfo.doc} icon={User} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <InfoCard label="Pregnancies" value={patientData.gynacInfo.pregnancies} />
              <InfoCard label="Deliveries" value={patientData.gynacInfo.deliveries} />
              <InfoCard label="Abortions" value={patientData.gynacInfo.abortions} />
              <InfoCard label="Living Children" value={patientData.gynacInfo.livingChildren} />
            </div>
          </div>
        );
      case "ipinfo":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <InfoCard label="Ward" value={patientData.ipInfo.ward} icon={DoorOpen} color="var(--color-info)" />
              <InfoCard label="Bed" value={patientData.ipInfo.bed} icon={Bed} color="var(--color-info)" />
            </div>
            <DetailRow label="Admit Date" value={patientData.ipInfo.admitDate} icon={CalendarDays} />
            <DetailRow label="Consultant" value={patientData.ipInfo.consultant} icon={UserRound} />
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
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 p-4 border-b flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-surface) 100%)",
          borderColor: "var(--color-border)",
          height: HEADER_H,
        }}
      >
        {/* Avatar with Photo Support - Passport Size */}
        <div className="relative flex-shrink-0 rounded-full overflow-hidden group shadow-lg"
          style={{
            width: 104,
            height: 104,
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
            border: "3px solid white",
          }}>
          
          {patient.photo && !imageError ? (
            <img
              src={patient.photo}
              alt={patient.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-bold text-4xl">{getInitials()}</span>
            </div>
          )}
          
          {/* Edit/Camera button overlay */}
          <button className="absolute bottom-1 right-1 p-1.5 rounded-full bg-white shadow-md transition-all opacity-0 group-hover:opacity-100">
            <Camera size={12} style={{ color: "var(--color-primary)" }} />
          </button>
        </div>

        {/* Patient details below photo */}
        <div className="text-center mt-2.5">
          <h3 className="text-lg font-bold truncate" style={{ color: "var(--color-text-base)" }}>
            {patient.name || "Smt. Vijayalakshmi"}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
              <Activity size={10} /> {patient.age || 29} yrs
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--color-text-muted)" }} />
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
              <Heart size={10} /> {patient.bloodGroup || "O+"}
            </span>
            {patient.gender && (
              <>
                <span className="w-1 h-1 rounded-full" style={{ background: "var(--color-text-muted)" }} />
                <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                  <User size={10} /> {patient.gender === "Female" ? "Female" : patient.gender === "Male" ? "Male" : patient.gender}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── TAB BARS: vertical colored "lollipop" bars with rotated labels ── */}
      <div className="flex-shrink-0 flex gap-1.5 px-2" style={{ background: "var(--color-surface)" }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-end justify-center rounded-b-[22px] transition-all duration-200"
              style={{
                height: isActive ? 172 : 158,
                background: isActive ? "var(--color-success)" : "var(--color-danger)",
                opacity: isActive ? 1 : 0.88,
                boxShadow: isActive ? "0 8px 16px rgba(0,0,0,0.20)" : "none",
              }}
            >
              <span
                className="font-bold text-white pb-4 whitespace-nowrap"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.02em",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── ICON ROW: circular icon button per tab ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-3">
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center justify-center rounded-full transition-all"
              style={{
                width: 40,
                height: 40,
                background: "var(--color-surface)",
                boxShadow: isActive
                  ? "0 0 0 2px var(--color-success), 0 4px 10px rgba(0,0,0,0.14)"
                  : "0 2px 6px rgba(0,0,0,0.10)",
              }}
            >
              <Icon size={18} style={{ color: isActive ? "var(--color-success)" : "var(--color-danger)" }} />
            </button>
          );
        })}
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
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