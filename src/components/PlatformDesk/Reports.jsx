// src/components/PlatformDesk/Reports.jsx
import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-1">
        <FileText size={20} style={{ color: "var(--color-warning)" }} />
        <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Reports</h2>
      </div>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Reports module coming soon...</p>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border text-center" style={{ borderColor: "var(--color-border)" }}>
          <FileText size={24} className="mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
          <h3 className="text-sm font-semibold">Clinic Report</h3>
          <p className="text-xs mt-1 text-text-muted">Coming soon</p>
        </div>
        <div className="p-4 rounded-lg border text-center" style={{ borderColor: "var(--color-border)" }}>
          <FileText size={24} className="mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
          <h3 className="text-sm font-semibold">User Report</h3>
          <p className="text-xs mt-1 text-text-muted">Coming soon</p>
        </div>
      </div>
    </div>
  );
}   