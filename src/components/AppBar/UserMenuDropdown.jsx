import { useState } from "react";
import {
  User, Settings, HelpCircle, LogOut,
  Camera, BadgeCheck, ChevronRight
} from "lucide-react";
import ProfilePopup  from "./ProfilePopup";
import SettingsPopup from "./SettingsPopup";
import HelpPopup     from "./HelpPopup";

const MENU_ITEMS = [
  { key: "profile",  icon: User,        label: "My Profile",     color: "var(--color-primary)"  },
  { key: "settings", icon: Settings,    label: "Settings",        color: "#8b5cf6"               },
  { key: "help",     icon: HelpCircle,  label: "Help & Support",  color: "var(--color-success)"  },
];

// Doctor image URL (same as in ProfilePopup)
const DOCTOR_IMAGE_URL = "https://randomuser.me/api/portraits/men/32.jpg";

export default function UserMenuDropdown({ user, onLogout, onClose }) {
  const [activePopup, setActivePopup] = useState(null); // "profile" | "settings" | "help"
  const [imageError, setImageError] = useState(false);

  const handleItemClick = (key) => {
    setActivePopup(key);
  };

  const closePopup = () => setActivePopup(null);

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
    <>
      {/* Dropdown card */}
      <div
        className="absolute top-full left-0 mt-2 rounded-xl shadow-2xl z-50 overflow-hidden"
        style={{
          width: 220,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Doctor card header */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-surface) 100%)", borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Avatar with Doctor Image */}
          <div
            className="relative flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              width: 44, height: 44,
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
                <span className="text-white font-bold text-sm">{getInitials()}</span>
              </div>
            )}
            {/* Camera button overlay */}
            <button
              className="absolute bottom-0 right-0 p-0.5 rounded-full"
              style={{ background: "var(--color-primary)" }}
            >
              <Camera size={8} style={{ color: "white" }} />
            </button>
          </div>

          {/* Name & email */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold truncate" style={{ color: "var(--color-text-base)" }}>
                {user?.name || "Dr. Aravind Kumar"}
              </span>
              <BadgeCheck size={12} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
            </div>
            <div className="text-[0.58rem] mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
              {user?.email || "dr.aravind@medix.com"}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-1">
          {MENU_ITEMS.map(({ key, icon: Icon, label, color }) => (
            <button
              key={key}
              onClick={() => handleItemClick(key)}
              className="w-full px-3 py-2 text-left flex items-center gap-2.5 transition-all group"
              onMouseEnter={e => e.currentTarget.style.background = "var(--color-surface-alt)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${color}15` }}>
                <Icon size={12} style={{ color }} />
              </div>
              <span className="flex-1 text-xs font-medium" style={{ color: "var(--color-text-base)" }}>{label}</span>
              <ChevronRight size={12} style={{ color: "var(--color-text-muted)" }} />
            </button>
          ))}

          <div className="mx-3 my-1" style={{ height: 1, background: "var(--color-border)" }} />

          <button
            onClick={onLogout}
            className="w-full px-3 py-2 text-left flex items-center gap-2.5 transition-all"
            onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: "#fee2e2" }}>
              <LogOut size={12} style={{ color: "var(--color-danger)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--color-danger)" }}>Logout</span>
          </button>
        </div>
      </div>

      {/* Sub-popups rendered at portal level */}
      {activePopup === "profile"  && <ProfilePopup  user={user} onClose={closePopup} />}
      {activePopup === "settings" && <SettingsPopup             onClose={closePopup} />}
      {activePopup === "help"     && <HelpPopup                 onClose={closePopup} />}
    </>
  );
}