// src/components/PlatformDesk/Settings.jsx
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-1">
        <SettingsIcon size={20} style={{ color: "var(--color-lab)" }} />
        <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Settings</h2>
      </div>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Settings module coming soon...</p>
      
      <div className="mt-6 space-y-3">
        <div className="p-3 rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-sm font-semibold">General Settings</h3>
          <p className="text-xs mt-1 text-text-muted">Coming soon</p>
        </div>
        <div className="p-3 rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-sm font-semibold">Email Configuration</h3>
          <p className="text-xs mt-1 text-text-muted">Coming soon</p>
        </div>
      </div>
    </div>
  );
}