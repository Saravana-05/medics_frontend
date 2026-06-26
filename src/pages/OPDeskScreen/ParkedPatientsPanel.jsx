import { ParkingCircle } from "lucide-react";

function ParkedPatientsPanel({ panelHeight }) {
  const headerH = 36;
  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#fef3e2", borderColor: "#fde68a", height: headerH }}>
        <ParkingCircle size={16} style={{ color: "#d97706" }} />
        <span className="text-xs font-bold" style={{ color: "#7a3a00" }}>Parked Patients (3)</span>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {["Rajesh Kumar (OP-1234)", "Priya Sharma (OP-1235)", "Anand Venkat (OP-1236)"].map((name, i) => (
          <div key={i} className="p-2 rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
            <div className="font-medium text-sm">{name}</div>
            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Waiting since 15 min</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkedPatientsPanel;