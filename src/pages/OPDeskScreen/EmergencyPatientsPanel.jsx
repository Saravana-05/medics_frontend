
function EmergencyPatientsPanel({ panelHeight }) {
  const headerH = 50;
  const cases = [
    { name: "Meena Iyer", note: "High fever (104°F) - Critical" },
    { name: "Ramesh Gupta", note: "Chest pain - Under observation" },
  ];
  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ background: "#73bfb8", borderColor: "#73bfb8", height: headerH }}>
        <span className="text-md font-bold text-white">Emergency Cases ({cases.length})</span>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {cases.map((c, i) => (
          <div key={i} className="p-2 rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
            <div className="font-medium text-sm">{c.name}</div>
            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{c.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmergencyPatientsPanel;
