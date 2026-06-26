import { AlertTriangle } from "lucide-react";

function EmergencyPatientsPanel({ panelHeight }) {
  const headerH = 36;
  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#fee2e2", borderColor: "#fecaca", height: headerH }}>
        <AlertTriangle size={16} style={{ color: "#dc2626" }} />
        <span className="text-xs font-bold" style={{ color: "#7a0000" }}>Emergency Cases (2)</span>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        <div className="p-2 rounded-lg border-l-4"
          style={{ borderLeftColor: "#dc2626", borderColor: "var(--color-border)" }}>
          <div className="font-medium text-sm">Meena Iyer</div>
          <div className="text-xs text-red-600">High fever (104°F) - Critical</div>
        </div>
        <div className="p-2 rounded-lg border-l-4"
          style={{ borderLeftColor: "#f59e0b", borderColor: "var(--color-border)" }}>
          <div className="font-medium text-sm">Ramesh Gupta</div>
          <div className="text-xs text-orange-600">Chest pain - Under observation</div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyPatientsPanel;