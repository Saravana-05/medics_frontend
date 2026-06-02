import PatientInfoPanel from "./PatientInfoPanel";

export default function SidePanel({ panelKey, patient }) {
  if (!panelKey || !patient) return null;

  if (panelKey === "patientInfo") {
    return <PatientInfoPanel patient={patient} />;
  }

  if (panelKey === "chronicAllergy") {
    const items = patient.chronicAllergy || [];
    return (
      <div style={{ width: "280px", borderLeft: "1px solid var(--color-border)", background: "#fff8f8", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ background: "#f9c8c8", padding: "4px 8px", fontSize: ".68rem", fontWeight: "800", color: "#7a0000", borderBottom: "1px solid #e8b0b0", textTransform: "uppercase", letterSpacing: ".06em" }}>
          Chronic & Allergy ({items.length})
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: "6px 8px", borderBottom: "1px solid #f8d8d8", background: i % 2 === 0 ? "white" : "#fff5f5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  background: item.type === "Allergy" ? "#fee2e2" : "#fef3e2",
                  color: item.type === "Allergy" ? "#dc2626" : "#b45309",
                  borderRadius: "2px", padding: "1px 5px", fontSize: ".62rem", fontWeight: "700",
                }}>{item.type}</span>
                <span style={{
                  background: item.severity === "High" ? "#fee2e2" : item.severity === "Medium" ? "#fef3e2" : "#f0f9f0",
                  color: item.severity === "High" ? "#dc2626" : item.severity === "Medium" ? "#b45309" : "#1a7f5a",
                  borderRadius: "2px", padding: "1px 5px", fontSize: ".62rem", fontWeight: "700",
                }}>{item.severity}</span>
              </div>
              <div style={{ fontWeight: "700", fontSize: ".8rem", marginTop: "2px", color: "#5a0000" }}>{item.name}</div>
              <div style={{ fontSize: ".68rem", color: "#8a5a5a" }}>Since {item.since}</div>
            </div>
          ))}
          {items.length === 0 && <div style={{ padding: "12px", color: "#8a5a5a", fontSize: ".78rem", textAlign: "center" }}>No records</div>}
        </div>
      </div>
    );
  }

  if (panelKey === "patientFamily") {
    const items = patient.family || [];
    return (
      <div style={{ width: "280px", borderLeft: "1px solid var(--color-border)", background: "#f8fff8", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ background: "#c8e8c8", padding: "4px 8px", fontSize: ".68rem", fontWeight: "800", color: "#004d00", borderBottom: "1px solid #b0d8b0", textTransform: "uppercase", letterSpacing: ".06em" }}>
          Patient Family ({items.length})
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.map((f, i) => (
            <div key={i} style={{ padding: "6px 8px", borderBottom: "1px solid #d8f0d8", background: i % 2 === 0 ? "white" : "#f5fff5" }}>
              <div style={{ fontWeight: "700", fontSize: ".8rem", color: "#004d00" }}>{f.name}</div>
              <div style={{ display: "flex", gap: "8px", fontSize: ".68rem", color: "#3a6a3a", marginTop: "2px" }}>
                <span style={{ background: "#d8f0d8", padding: "1px 5px", borderRadius: "2px", fontWeight: "700" }}>{f.relation}</span>
                <span>Age {f.age}</span>
                <span style={{ color: f.condition === "Nil" ? "#1a7f5a" : "#b45309" }}>● {f.condition}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ padding: "12px", color: "#3a6a3a", fontSize: ".78rem", textAlign: "center" }}>No family records</div>}
        </div>
      </div>
    );
  }

  if (panelKey === "period") {
    return (
      <div style={{ width: "280px", borderLeft: "1px solid var(--color-border)", background: "#fffaf0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ background: "#f0d8b0", padding: "4px 8px", fontSize: ".68rem", fontWeight: "800", color: "#5a3a00", borderBottom: "1px solid #d8c080", textTransform: "uppercase", letterSpacing: ".06em" }}>
          Period: Apr 22 – Mar 24
        </div>
        <div style={{ padding: "8px", color: "#8a6a3a", fontSize: ".78rem", textAlign: "center", marginTop: "20px" }}>
          Period summary view — coming in next version
        </div>
      </div>
    );
  }

  return null;
}