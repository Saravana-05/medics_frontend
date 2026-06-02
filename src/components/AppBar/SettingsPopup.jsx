import { useState } from "react";
import {
  X, Moon, Sun, Monitor, Bell, Shield, Globe,
  Palette, Layout, ToggleLeft, ToggleRight, ChevronRight,
  Volume2, VolumeX, Eye, EyeOff, Keyboard, Printer,
  Clock, Save, RotateCcw
} from "lucide-react";

const SECTIONS = [
  {
    key: "appearance",
    title: "Appearance",
    icon: Palette,
    color: "#8b5cf6",
  },
  {
    key: "notifications",
    title: "Notifications",
    icon: Bell,
    color: "var(--color-warning)",
  },
  {
    key: "privacy",
    title: "Privacy & Security",
    icon: Shield,
    color: "var(--color-danger)",
  },
  {
    key: "regional",
    title: "Regional",
    icon: Globe,
    color: "var(--color-primary)",
  },
];

function Toggle({ value, onChange, color = "var(--color-primary)" }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative flex-shrink-0 rounded-full transition-all duration-200"
      style={{
        width: 36, height: 20,
        background: value ? color : "var(--color-border)",
      }}
    >
      <span
        className="absolute top-1 rounded-full transition-all duration-200"
        style={{
          width: 12, height: 12,
          background: "white",
          left: value ? 20 : 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

function SettingRow({ label, subtitle, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex-1 mr-4">
        <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{label}</div>
        {subtitle && <div className="text-[0.6rem] mt-0.5" style={{ color: "var(--color-text-muted)" }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPopup({ onClose }) {
  const [activeSection, setActiveSection] = useState("appearance");
  const [theme, setTheme]                 = useState("light");
  const [density, setDensity]             = useState("comfortable");
  const [notifs, setNotifs]               = useState({ sound: true, email: false, desktop: true, lab: true, appt: true });
  const [privacy, setPrivacy]             = useState({ twoFA: false, sessionLock: true, auditLog: true });
  const [lang, setLang]                   = useState("en");
  const [timezone, setTimezone]           = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat]       = useState("DD/MM/YYYY");

  const renderContent = () => {
    switch (activeSection) {
      case "appearance":
        return (
          <div>
            {/* Theme */}
            <div className="mb-4">
              <div className="text-[0.65rem] font-bold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>Theme</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "light",  icon: Sun,     label: "Light"  },
                  { key: "dark",   icon: Moon,    label: "Dark"   },
                  { key: "system", icon: Monitor, label: "System" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: theme === key ? "#8b5cf6" : "var(--color-border)",
                      background:  theme === key ? "#8b5cf610" : "var(--color-surface-alt)",
                    }}
                  >
                    <Icon size={18} style={{ color: theme === key ? "#8b5cf6" : "var(--color-text-muted)" }} />
                    <span className="text-[0.65rem] font-semibold" style={{ color: theme === key ? "#8b5cf6" : "var(--color-text-muted)" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Density */}
            <div className="mb-2">
              <div className="text-[0.65rem] font-bold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>Display Density</div>
              <div className="grid grid-cols-3 gap-2">
                {["compact", "comfortable", "spacious"].map(d => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className="py-2 rounded-lg border-2 text-[0.65rem] font-semibold capitalize transition-all"
                    style={{
                      borderColor: density === d ? "#8b5cf6" : "var(--color-border)",
                      background:  density === d ? "#8b5cf610" : "var(--color-surface-alt)",
                      color:       density === d ? "#8b5cf6"   : "var(--color-text-muted)",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <SettingRow label="Animations" subtitle="Smooth transitions and micro-interactions">
              <Toggle value={true} onChange={() => {}} color="#8b5cf6" />
            </SettingRow>
            <SettingRow label="Compact sidebar" subtitle="Reduce sidebar icon spacing">
              <Toggle value={false} onChange={() => {}} color="#8b5cf6" />
            </SettingRow>
          </div>
        );

      case "notifications":
        return (
          <div>
            <SettingRow label="Sound alerts" subtitle="Play audio for critical notifications">
              <Toggle value={notifs.sound} onChange={v => setNotifs(p => ({ ...p, sound: v }))} color="var(--color-warning)" />
            </SettingRow>
            <SettingRow label="Desktop notifications" subtitle="Browser push notifications">
              <Toggle value={notifs.desktop} onChange={v => setNotifs(p => ({ ...p, desktop: v }))} color="var(--color-warning)" />
            </SettingRow>
            <SettingRow label="Email digest" subtitle="Daily summary to your inbox">
              <Toggle value={notifs.email} onChange={v => setNotifs(p => ({ ...p, email: v }))} color="var(--color-warning)" />
            </SettingRow>
            <SettingRow label="Lab report alerts" subtitle="Notify when new reports are ready">
              <Toggle value={notifs.lab} onChange={v => setNotifs(p => ({ ...p, lab: v }))} color="var(--color-warning)" />
            </SettingRow>
            <SettingRow label="Appointment reminders" subtitle="15-minute advance reminder">
              <Toggle value={notifs.appt} onChange={v => setNotifs(p => ({ ...p, appt: v }))} color="var(--color-warning)" />
            </SettingRow>
          </div>
        );

      case "privacy":
        return (
          <div>
            <SettingRow label="Two-factor authentication" subtitle="Require OTP at every login">
              <Toggle value={privacy.twoFA} onChange={v => setPrivacy(p => ({ ...p, twoFA: v }))} color="var(--color-danger)" />
            </SettingRow>
            <SettingRow label="Auto screen lock" subtitle="Lock after 10 minutes of inactivity">
              <Toggle value={privacy.sessionLock} onChange={v => setPrivacy(p => ({ ...p, sessionLock: v }))} color="var(--color-danger)" />
            </SettingRow>
            <SettingRow label="Audit log" subtitle="Track all actions on patient records">
              <Toggle value={privacy.auditLog} onChange={v => setPrivacy(p => ({ ...p, auditLog: v }))} color="var(--color-danger)" />
            </SettingRow>
            <SettingRow label="Mask sensitive data" subtitle="Hide patient PII on idle screen">
              <Toggle value={false} onChange={() => {}} color="var(--color-danger)" />
            </SettingRow>
            <div className="mt-4">
              <button className="w-full py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background: "#fee2e2", color: "var(--color-danger)", border: "1px solid #fecaca" }}>
                Change Password
              </button>
            </div>
          </div>
        );

      case "regional":
        return (
          <div className="space-y-3">
            {[
              { label: "Language",    value: lang,       setValue: setLang,       options: [["en","English"],["ta","Tamil"],["hi","Hindi"]] },
              { label: "Timezone",    value: timezone,   setValue: setTimezone,   options: [["Asia/Kolkata","IST (Kolkata)"],["UTC","UTC"],["Asia/Dubai","GST (Dubai)"]] },
              { label: "Date Format", value: dateFormat, setValue: setDateFormat, options: [["DD/MM/YYYY","DD/MM/YYYY"],["MM/DD/YYYY","MM/DD/YYYY"],["YYYY-MM-DD","YYYY-MM-DD"]] },
            ].map(({ label, value, setValue, options }) => (
              <div key={label}>
                <div className="text-[0.6rem] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>{label}</div>
                <select
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="w-full text-xs rounded-lg px-3 py-2 outline-none"
                  style={{ background: "var(--color-surface-alt)", border: "1px solid var(--color-border)", color: "var(--color-text-base)" }}
                >
                  {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex overflow-hidden rounded-2xl shadow-2xl"
        style={{ width: 560, height: 460, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sidebar nav */}
        <div className="flex-shrink-0 border-r py-4" style={{ width: 160, borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
          <div className="px-4 mb-4">
            <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--color-text-base)" }}>Settings</div>
          </div>
          {SECTIONS.map(({ key, title, icon: Icon, color }) => {
            const active = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all"
                style={{
                  background:  active ? `${color}15` : "transparent",
                  borderLeft:  active ? `3px solid ${color}` : "3px solid transparent",
                }}
              >
                <Icon size={14} style={{ color: active ? color : "var(--color-text-muted)" }} />
                <span className="text-xs font-semibold" style={{ color: active ? color : "var(--color-text-muted)" }}>{title}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--color-border)" }}>
            <div className="text-sm font-bold" style={{ color: "var(--color-text-base)" }}>
              {SECTIONS.find(s => s.key === activeSection)?.title}
            </div>
            <button onClick={onClose} className="p-1 rounded-full transition-all" style={{ background: "var(--color-surface-alt)" }}>
              <X size={14} style={{ color: "var(--color-text-muted)" }} />
            </button>
          </div>

          {/* Scrollable section content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {renderContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t flex-shrink-0" style={{ borderColor: "var(--color-border)" }}>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "var(--color-surface-alt)", color: "var(--color-text-muted)" }}
            >
              <RotateCcw size={11} /> Reset
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "var(--color-primary)", color: "white" }}
            >
              <Save size={11} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}