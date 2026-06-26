import { useState } from "react";
import { Users, Plus, Pencil, X, Check, Heart, AlertCircle } from "lucide-react";

function PatientFamilyPanel({ patient, panelHeight, onUpdate }) {
  const [items, setItems] = useState(patient?.family || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    age: "",
    relation: "",
    condition: "Nil",
    chronicAllergy: []
  });

  const headerH = 36;

  const handleAdd = () => {
    if (newMember.name && newMember.age) {
      const updatedItems = [...items, { ...newMember }];
      setItems(updatedItems);
      if (onUpdate) onUpdate(updatedItems);
      setNewMember({ name: "", age: "", relation: "", condition: "Nil", chronicAllergy: [] });
      setShowAddForm(false);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewMember(items[index]);
    setShowAddForm(true);
  };

  const handleUpdate = () => {
    if (newMember.name && newMember.age && editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = { ...newMember };
      setItems(updatedItems);
      if (onUpdate) onUpdate(updatedItems);
      setNewMember({ name: "", age: "", relation: "", condition: "Nil", chronicAllergy: [] });
      setShowAddForm(false);
      setEditingIndex(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingIndex(null);
    setNewMember({ name: "", age: "", relation: "", condition: "Nil", chronicAllergy: [] });
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
        style={{ background: "#c8e8c8", borderColor: "#b0d8b0", height: headerH, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          <Users size={16} style={{ color: "#004d00" }} />
          <span className="text-xs font-bold" style={{ color: "#004d00" }}>Patient Family History</span>
          <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "#004d00", color: "white" }}>{items.length}</span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 rounded transition-all hover:bg-white/50"
          style={{ background: "var(--color-surface)" }}
        >
          <Plus size={14} style={{ color: "#004d00" }} />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="p-3 border-b" style={{ borderColor: "#b0d8b0", background: "#f5fff5" }}>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Member Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
                <input
                  type="text"
                  placeholder="Age"
                  value={newMember.age}
                  onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Relationship (e.g., Father, Mother)"
                  value={newMember.relation}
                  onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
                <input
                  type="text"
                  placeholder="Condition (e.g., Diabetes, Nil)"
                  value={newMember.condition}
                  onChange={(e) => setNewMember({ ...newMember, condition: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded border"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={editingIndex !== null ? handleUpdate : handleAdd}
                  className="flex-1 px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "#004d00", color: "white" }}
                >
                  <Check size={12} /> {editingIndex !== null ? "Update" : "Add"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "#d8f0d8", color: "#004d00" }}
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
            <Users size={32} style={{ color: "var(--color-text-subtle)" }} />
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No family history records</p>
          </div>
        ) : items.map((member, i) => (
          <div key={i} className="relative p-3 pr-16 border-b group"
            style={{ borderColor: "#d8f0d8", background: i % 2 === 0 ? "white" : "#f5fff5" }}>
            
            {/* Main Content */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: "#004d00" }}>{member.name}</span>
                  <span className="text-[0.55rem] font-medium px-1.5 py-0.5 rounded" 
                    style={{ background: "#c8e8c8", color: "#004d00" }}>
                    {member.relation || "—"}
                  </span>
                </div>
                <div className="text-[0.65rem] mt-0.5" style={{ color: "#5a8a5a" }}>
                  Age: {member.age || "—"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                  background: member.condition === "Nil" ? "#e6f5f0" : "#fef3e2",
                  color: member.condition === "Nil" ? "#1a7f5a" : "#b45309",
                }}>
                  {member.condition || "Nil"}
                </span>
              </div>
            </div>

            {/* Show Chronic/Allergy if available */}
            {member.chronicAllergy && member.chronicAllergy.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {member.chronicAllergy.map((allergy, idx) => (
                  <span key={idx} className="text-[0.55rem] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                    style={{
                      background: allergy.type === "Allergy" ? "#fee2e2" : "#fef3e2",
                      color: allergy.type === "Allergy" ? "#dc2626" : "#b45309",
                    }}>
                    <AlertCircle size={10} />
                    {allergy.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Edit and Delete Buttons - Properly positioned */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(i)}
                className="p-1.5 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)", border: "1px solid #c8e8c8" }}
                title="Edit"
              >
                <Pencil size={13} style={{ color: "#004d00" }} />
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="p-1.5 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)", border: "1px solid #f8d8d8" }}
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

export default PatientFamilyPanel;