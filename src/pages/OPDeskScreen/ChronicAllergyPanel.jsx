import { useState } from "react";
import { Baby, Heart, Plus, Pencil, X, Check } from "lucide-react";

// ── ChronicAllergyPanel Component ──
function ChronicAllergyPanel({ patient, panelHeight, onUpdate }) {
  const [items, setItems] = useState(patient?.chronicAllergy || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("chronic");
  const [hoveredSection, setHoveredSection] = useState(null);
  const [newItem, setNewItem] = useState({
    type: "Allergy",
    name: "",
    since: "",
    severity: "Medium",
    reaction: ""
  });

  const headerH = 50;
  const gynacInfo = patient?.gynacInfo || null;
  const visibleItems = items.filter(item => item.type.toLowerCase() === activeSection);
  const sections = [
    { key: "chronic", label: "Chronic", count: items.filter(item => item.type === "Chronic").length, color: "#3f8f87" },
    { key: "allergy", label: "Allergy", count: items.filter(item => item.type === "Allergy").length, color: "#d97706" },
    { key: "gynecology", label: "Gynecology", count: gynacInfo ? 1 : 0, color: "#d946ef" },
  ];

  const openAddForm = () => {
    setEditingIndex(null);
    setNewItem({ type: activeSection === "chronic" ? "Chronic" : "Allergy", name: "", since: "", severity: "Medium", reaction: "" });
    setShowAddForm(true);
  };

  const handleAdd = () => {
    if (newItem.name && newItem.since) {
      const updatedItems = [...items, { ...newItem }];
      setItems(updatedItems);
      if (onUpdate) onUpdate(updatedItems);
      setNewItem({ type: "Allergy", name: "", since: "", severity: "Medium", reaction: "" });
      setShowAddForm(false);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewItem(items[index]);
    setShowAddForm(true);
  };

  const handleUpdate = () => {
    if (newItem.name && newItem.since && editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = { ...newItem };
      setItems(updatedItems);
      if (onUpdate) onUpdate(updatedItems);
      setNewItem({ type: "Allergy", name: "", since: "", severity: "Medium", reaction: "" });
      setShowAddForm(false);
      setEditingIndex(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingIndex(null);
    setNewItem({ type: "Allergy", name: "", since: "", severity: "Medium", reaction: "" });
  };

  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    if (onUpdate) onUpdate(updatedItems);
  };

  return (
    <div
      className="overflow-hidden rounded-lg shadow-xl flex flex-col"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}
    >
      {/* Header with Add Button */}
      <div className="px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#73bfb8", borderColor: "#73bfb8", height: headerH, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          {/* <AlertCircle size={16} style={{ color: "var(--color-danger)" }} /> */}
          <span className="text-md font-bold text-white">Patient Caution</span>
          <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "white", color: "#3f8f87" }}>{items.length + (gynacInfo ? 1 : 0)}</span>
        </div>
      </div>

      {/* OP List-style section tabs */}
      <div className="flex items-stretch flex-shrink-0" style={{ height: 36, background: "#e5e7eb" }}>
        {sections.map((section, index) => {
          const highlighted = activeSection === section.key || hoveredSection === section.key;
          const slant = 10;
          return (
            <button key={section.key} type="button" onClick={() => { setActiveSection(section.key); setShowAddForm(false); }}
              onMouseEnter={() => setHoveredSection(section.key)} onMouseLeave={() => setHoveredSection(null)}
              className="relative flex-1 flex items-center justify-center text-[0.68rem] font-bold transition-all"
              style={{ marginLeft: index ? -slant : 0, paddingLeft: index ? slant : 0, zIndex: activeSection === section.key ? sections.length + 1 : sections.length - index, clipPath: index === 0 ? `polygon(0 0, calc(100% - ${slant}px) 0, 100% 100%, 0 100%)` : `polygon(0 0, calc(100% - ${slant}px) 0, 100% 100%, ${slant}px 100%)`, background: highlighted ? section.color : "#6b7280", color: "white", boxShadow: activeSection === section.key ? "inset 0 1px 4px rgba(0,0,0,0.3)" : "none" }}>
              <span className="whitespace-nowrap">{section.label}</span>
              <sup className="ml-1 text-[0.55rem]">{section.count}</sup>
            </button>
          );
        })}
      </div>

      {/* Add button row — right-aligned with light-grey divider + drop shadow (matches SchedulePanel) */}
      {activeSection !== "gynecology" && <div className="px-3 py-2 flex items-center justify-between gap-2 flex-shrink-0"
        style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
        <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>{visibleItems.length} {activeSection === "chronic" ? "condition" : "allergy"}{visibleItems.length === 1 ? "" : " entries"}</span>
        <button
          onClick={openAddForm}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-black/5 flex-shrink-0"
          style={{ width: 40, height: 40, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          title="Add condition / allergy"
        >
          <Plus size={24} style={{ color: "#73bfb8" }} />
        </button>
      </div>}

      {/* Content */}
      <div className="overflow-y-auto flex-1 min-h-0">
        {/* Add/Edit Form — modal popup (teal theme only) */}
        {showAddForm && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={handleCancel}
          >
            <div
              className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "var(--color-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "#73bfb8" }}>
                <span className="text-base font-bold text-white">
                  {editingIndex !== null ? "Edit" : "Add"} {newItem.type}
                </span>
                <button onClick={handleCancel} className="p-1 rounded transition-all hover:bg-white/20" title="Close">
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-4 space-y-3">
                <div className="flex gap-3">
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  >
                    <option value="Allergy">Allergy</option>
                    <option value="Chronic">Chronic</option>
                  </select>
                  <select
                    value={newItem.severity}
                    onChange={(e) => setNewItem({ ...newItem, severity: e.target.value })}
                    className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Condition/Allergy name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 text-base rounded-lg border outline-none"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                />
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={newItem.since}
                    onChange={(e) => setNewItem({ ...newItem, since: e.target.value })}
                    className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  />
                  <input
                    type="text"
                    placeholder="Reaction (optional)"
                    value={newItem.reaction || ""}
                    onChange={(e) => setNewItem({ ...newItem, reaction: e.target.value })}
                    className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 px-4 pb-4">
                <button
                  onClick={editingIndex !== null ? handleUpdate : handleAdd}
                  className="flex-1 px-3 py-2 rounded-lg text-base font-semibold flex items-center justify-center gap-1.5"
                  style={{ background: "var(--color-success)", color: "white" }}
                >
                  <Check size={16} /> {editingIndex !== null ? "Update" : "Add"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-3 py-2 rounded-lg text-base font-semibold flex items-center justify-center gap-1.5"
                  style={{ background: "var(--color-danger)", color: "white" }}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gynecology summary */}
        {activeSection === "gynecology" && (gynacInfo ? (
          <div className="p-3">
            <div className="grid grid-cols-2 border-l border-t" style={{ borderColor: "var(--color-border)" }}>
              {[
                ["LMP", gynacInfo.lmp], ["EDD", gynacInfo.edd], ["Doctor", gynacInfo.doc],
                ["Pregnancies", gynacInfo.pregnancies], ["Deliveries", gynacInfo.deliveries],
                ["Abortions", gynacInfo.abortions], ["Living Children", gynacInfo.livingChildren],
              ].map(([label, value]) => (
                <div key={label} className="p-3 border-r border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                  <div className="text-[0.58rem] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{label}</div>
                  <div className="mt-1 text-sm font-semibold" style={{ color: "var(--color-text-base)" }}>{value ?? "—"}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center text-center">
            <Baby size={32} style={{ color: "var(--color-text-subtle)" }} />
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No gynecology information available</p>
          </div>
        ))}

        {/* Chronic / Allergy list */}
        {activeSection !== "gynecology" && (visibleItems.length === 0 ? (
          <div className="py-8 text-center">
            <Heart size={32} style={{ color: "var(--color-text-subtle)" }} />
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No {activeSection === "chronic" ? "chronic conditions" : "allergies"} recorded</p>
          </div>
        ) : visibleItems.map((item, i) => {
          const itemIndex = items.indexOf(item);
          return <div key={`${item.type}-${item.name}-${i}`} className="relative p-3 border-b group"
            style={{ borderColor: "var(--color-border)", background: i % 2 === 0 ? "white" : "#f2faf9" }}>
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                background: item.type === "Allergy" ? "#73bfb8" : "#e6f4f2",
                color: item.type === "Allergy" ? "white" : "#3f8f87",
              }}>{item.type}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                background: item.severity === "High" ? "#73bfb8" : item.severity === "Medium" ? "#dcefec" : "#eef6f5",
                color: item.severity === "High" ? "white" : item.severity === "Medium" ? "#3f8f87" : "var(--color-text-muted)",
              }}>{item.severity}</span>
            </div>
            <div className="font-bold text-sm mt-1" style={{ color: "var(--color-text-base)" }}>{item.name}</div>
            <div className="text-[0.65rem] mt-1" style={{ color: "var(--color-text-muted)" }}>
              Since {item.since ? new Date(item.since).getFullYear() : "N/A"}
            </div>
            {item.reaction && (
              <div className="text-[0.6rem] mt-1 italic" style={{ color: "var(--color-text-muted)" }}>Reaction: {item.reaction}</div>
            )}
            
            {/* Edit and Delete Buttons - Visible on Hover */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(itemIndex)}
                className="p-1 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)" }}
                title="Edit"
              >
                <Pencil size={13} style={{ color: "var(--color-success)" }} />
              </button>
              <button
                onClick={() => handleDelete(itemIndex)}
                className="p-1 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)" }}
                title="Delete"
              >
                <X size={13} style={{ color: "var(--color-danger)" }} />
              </button>
            </div>
          </div>;
        }))}
      </div>
    </div>
  );
}

export default ChronicAllergyPanel;
