import { useState } from "react";
import { AlertCircle, Heart, Plus, Pencil, X, Check } from "lucide-react";

// ── ChronicAllergyPanel Component ──
function ChronicAllergyPanel({ patient, panelHeight, onUpdate }) {
  const [items, setItems] = useState(patient?.chronicAllergy || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    type: "Allergy",
    name: "",
    since: "",
    severity: "Medium",
    reaction: ""
  });

  const headerH = 36;

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
      className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}
    >
      {/* Header with Add Button */}
      <div className="px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#fee2e2", borderColor: "#fecaca", height: headerH, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          <AlertCircle size={16} style={{ color: "#dc2626" }} />
          <span className="text-xs font-bold" style={{ color: "#7a0000" }}>Chronic &amp; Allergy</span>
          <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "#dc2626", color: "white" }}>{items.length}</span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 rounded transition-all hover:bg-white/50"
          style={{ background: "var(--color-surface)" }}
        >
          <Plus size={14} style={{ color: "#dc2626" }} />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="p-3 border-b" style={{ borderColor: "#fecaca", background: "#fff5f5" }}>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                >
                  <option value="Allergy">Allergy</option>
                  <option value="Chronic">Chronic</option>
                </select>
                <select
                  value={newItem.severity}
                  onChange={(e) => setNewItem({ ...newItem, severity: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
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
                className="w-full px-2 py-1.5 text-xs rounded border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newItem.since}
                  onChange={(e) => setNewItem({ ...newItem, since: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
                <input
                  type="text"
                  placeholder="Reaction (optional)"
                  value={newItem.reaction || ""}
                  onChange={(e) => setNewItem({ ...newItem, reaction: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={editingIndex !== null ? handleUpdate : handleAdd}
                  className="flex-1 px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "#dc2626", color: "white" }}
                >
                  <Check size={12} /> {editingIndex !== null ? "Update" : "Add"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "#fee2e2", color: "#dc2626" }}
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List Items */}
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <Heart size={32} style={{ color: "var(--color-text-subtle)" }} />
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No chronic conditions or allergies recorded</p>
          </div>
        ) : items.map((item, i) => (
          <div key={i} className="relative p-3 border-b group"
            style={{ borderColor: "#f8d8d8", background: i % 2 === 0 ? "white" : "#fff5f5" }}>
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                background: item.type === "Allergy" ? "#fee2e2" : "#fef3e2",
                color: item.type === "Allergy" ? "#dc2626" : "#b45309",
              }}>{item.type}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                background: item.severity === "High" ? "#fee2e2" : item.severity === "Medium" ? "#fef3e2" : "#e6f5f0",
                color: item.severity === "High" ? "#dc2626" : item.severity === "Medium" ? "#b45309" : "#1a7f5a",
              }}>{item.severity}</span>
            </div>
            <div className="font-bold text-sm mt-1" style={{ color: "#5a0000" }}>{item.name}</div>
            <div className="text-[0.65rem] mt-1" style={{ color: "#8a5a5a" }}>
              Since {item.since ? new Date(item.since).getFullYear() : "N/A"}
            </div>
            {item.reaction && (
              <div className="text-[0.6rem] mt-1 italic" style={{ color: "#a05a5a" }}>Reaction: {item.reaction}</div>
            )}
            
            {/* Edit and Delete Buttons - Visible on Hover */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(i)}
                className="p-1 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)" }}
                title="Edit"
              >
                <Pencil size={13} style={{ color: "#dc2626" }} />
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="p-1 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)" }}
                title="Delete"
              >
                <X size={13} style={{ color: "#dc2626" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChronicAllergyPanel;