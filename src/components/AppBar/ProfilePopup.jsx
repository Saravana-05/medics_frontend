import { useState } from "react";
import {
  X, Phone, Mail, MapPin, Award, Calendar,
  Stethoscope, Clock, Star, Edit3, Camera, BadgeCheck,
  Activity, Users
} from "lucide-react";

const STAT_CARDS = [
  { label: "Patients Today", value: "24", icon: Users,      color: "var(--color-primary)"  },
  { label: "Years Exp.",     value: "12", icon: Award,       color: "var(--color-warning)"  },
  { label: "Avg. Rating",    value: "4.9", icon: Star,       color: "var(--color-warning)"               },
  { label: "Consultations",  value: "3.2k", icon: Activity,  color: "var(--color-success)"  },
];

const DETAIL_ROWS = [
  { icon: Stethoscope, label: "Specialisation",  value: "General Medicine"              },
  { icon: BadgeCheck,  label: "Reg. No.",         value: "TN-MCI-28741"                  },
  { icon: Award,       label: "Qualification",    value: "MBBS, MD (General Medicine)"   },
  { icon: MapPin,      label: "Department",        value: "OPD – Block A, Room 204"      },
  { icon: Phone,       label: "Extension",         value: "+91 98765 43210"               },
  { icon: Mail,        label: "Email",             value: "dr.aravind@medix.com"          },
  { icon: Clock,       label: "Working Hours",     value: "Mon–Sat  9:00 AM – 5:00 PM"   },
  { icon: Calendar,    label: "Joined",            value: "April 2012"                    },
];

// Doctor image URL (you can replace with actual doctor image from user object or API)
const DOCTOR_IMAGE_URL = "https://randomuser.me/api/portraits/men/32.jpg";

export default function ProfilePopup({ user, onClose }) {
  const [editMode, setEditMode] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get initials for fallback
  const getInitials = () => {
    const name = user?.name || "Dr. Aravind Kumar";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: 520,
          maxHeight: "calc(100vh - 100px)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Banner ─────────────────────────────────────────────────── */}
        <div
          className="relative h-24"
          style={{ background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}
        >
          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          >
            <X size={14} />
          </button>

          {/* Avatar (overlaps banner) - with Doctor Image */}
          <div
            className="absolute -bottom-10 left-6 rounded-full border-4 overflow-hidden flex items-center justify-center"
            style={{
              width: 80, height: 80,
              borderColor: "var(--color-surface)",
              background: "linear-gradient(135deg, var(--color-primary) 0%, #0a4a6e 100%)",
            }}
          >
            {DOCTOR_IMAGE_URL && !imageError ? (
              <img
                src={DOCTOR_IMAGE_URL}
                alt="Doctor"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{getInitials()}</span>
              </div>
            )}
            {/* Camera button overlay */}
            <button
              className="absolute bottom-0 right-0 p-1 rounded-full"
              style={{ background: "var(--color-primary)", color: "white" }}
            >
              <Camera size={10} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────── */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
          {/* Name + edit */}
          <div className="px-6 pt-12 pb-4 flex items-end justify-between border-b" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold" style={{ color: "var(--color-text-base)" }}>
                  {user?.name || "Dr. Aravind Kumar"}
                </h2>
                <BadgeCheck size={16} style={{ color: "var(--color-primary)" }} />
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>General Medicine · Senior Consultant</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: editMode ? "var(--color-primary)" : "var(--color-primary-muted)",
                color: editMode ? "white" : "var(--color-primary)",
              }}
            >
              <Edit3 size={11} /> {editMode ? "Save" : "Edit"}
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
            {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center"
                style={{ background: `${color}12`, border: `1px solid ${color}30` }}
              >
                <Icon size={16} style={{ color, margin: "0 auto 4px" }} />
                <div className="text-sm font-extrabold" style={{ color }}>{value}</div>
                <div className="text-[0.58rem] font-medium mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Detail rows */}
          <div className="px-6 py-4 space-y-0">
            {DETAIL_ROWS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 py-2.5 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="mt-0.5 p-1.5 rounded-lg flex-shrink-0" style={{ background: "var(--color-primary-muted)" }}>
                  <Icon size={12} style={{ color: "var(--color-primary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.6rem] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{label}</div>
                  {editMode ? (
                    <input
                      defaultValue={value}
                      className="mt-0.5 w-full text-xs rounded px-2 py-1 outline-none"
                      style={{ background: "var(--color-surface-alt)", border: "1px solid var(--color-border)", color: "var(--color-text-base)" }}
                    />
                  ) : (
                    <div className="text-xs font-medium mt-0.5 truncate" style={{ color: "var(--color-text-base)" }}>{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}