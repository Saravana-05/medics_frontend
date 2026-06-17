// src/components/PlatformDesk/Sidebar.jsx
import { useState } from "react";
import { 
  Building2, MapPin, Users, Settings, Activity, 
  Calendar, FileText, HelpCircle, Briefcase, 
  Stethoscope, UserCircle, Heart, ActivitySquare,
  Building, Shield, UserCog
} from "lucide-react";

const MENU_ITEMS = [
  { key: "clinic", label: "Clinic", icon: Building2, color: "var(--color-primary)" },
  { key: "clinicBranches", label: "Clinic Branches", icon: MapPin, color: "var(--color-drugs)" },
  { key: "departments", label: "Departments", icon: Building, color: "var(--color-info)" },
  { key: "staff", label: "Staff", icon: Briefcase, color: "var(--color-warning)" },
  { key: "doctors", label: "Doctors", icon: Stethoscope, color: "var(--color-primary)" },
  { key: "nurses", label: "Nurses", icon: UserCircle, color: "var(--color-success)" },
  { key: "patients", label: "Patients", icon: Heart, color: "var(--color-danger)" },
  { key: "users", label: "Users", icon: Users, color: "var(--color-info)" },
  { key: "roles", label: "Roles", icon: Shield, color: "var(--color-warning)" },
  { key: "reports", label: "Reports", icon: FileText, color: "var(--color-info)" },
  { key: "settings", label: "Settings", icon: Settings, color: "var(--color-lab)" },
];

export default function Sidebar({ activeMenu, onMenuChange, isOpen }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <div
      className={`flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${
        isOpen ? "w-64" : "w-16"
      }`}
      style={{
        background: "linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-alt) 100%)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: "var(--color-primary-muted)" }}>
              <Building2 size={16} style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: "var(--color-text-base)" }}>Platform</div>
              <div className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Management</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="p-1.5 rounded-lg" style={{ background: "var(--color-primary-muted)" }}>
              <Building2 size={16} style={{ color: "var(--color-primary)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-2 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const isActive = activeMenu === item.key;
          const isHovered = hoveredKey === item.key;
          const Icon = item.icon;
          const highlight = isActive || isHovered;

          return (
            <div
              key={item.key}
              onClick={() => onMenuChange(item.key)}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="relative cursor-pointer transition-all duration-200 group"
              style={{
                background: highlight ? `${item.color}15` : "transparent",
                borderLeft: isActive ? `3px solid ${item.color}` : "3px solid transparent",
              }}
            >
              <div className={`flex items-center gap-3 px-3 py-2.5 ${!isOpen && "justify-center"}`}>
                <div
                  className="p-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: highlight ? `${item.color}20` : "transparent",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <Icon size={18} style={{ color: highlight ? item.color : "var(--color-text-muted)" }} />
                </div>
                {isOpen && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: highlight ? item.color : "var(--color-text-base)" }}
                  >
                    {item.label}
                  </span>
                )}
              </div>

              {/* Tooltip for collapsed mode */}
              {!isOpen && isHovered && (
                <div
                  className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-md whitespace-nowrap z-40 animate-fade-in"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-md)",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: item.color,
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t" style={{ borderColor: "var(--color-border)" }}>
        {isOpen ? (
          <div className="text-[0.6rem] text-center" style={{ color: "var(--color-text-muted)" }}>
            <HelpCircle size={12} className="inline mr-1" />
            Platform v1.0
          </div>
        ) : (
          <div className="flex justify-center">
            <HelpCircle size={14} style={{ color: "var(--color-text-muted)" }} />
          </div>
        )}
      </div>
    </div>
  );
}