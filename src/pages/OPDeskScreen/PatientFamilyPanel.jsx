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

  const headerH = 50;

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
        style={{ background: "#679cbc", borderColor: "#679cbc", height: headerH, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          {/* <Users size={16} style={{ color: "#004d00" }} /> */}
          <span className="text-md font-bold text-white" >Patient Family History</span>
          <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "white", color: "#679cbc" }}>{items.length}</span>
        </div>
        
      </div>

      {/* Add button row — right-aligned with light-grey divider + drop shadow (matches SchedulePanel) */}
      <div className="px-3 py-2 flex items-center justify-end gap-2"
        style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-black/5 flex-shrink-0"
          style={{ width: 40, height: 40, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          title="Add family member"
        >
          <Plus size={24} style={{ color: "#679cbc" }} />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {/* Add/Edit Form — modal popup (blue theme only) */}
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
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "#679cbc" }}>
                <span className="text-base font-bold text-white">
                  {editingIndex !== null ? "Edit" : "Add"} Family Member
                </span>
                <button onClick={handleCancel} className="p-1 rounded transition-all hover:bg-white/20" title="Close">
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-4 space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  />
                  <input
                    type="text"
                    placeholder="Age"
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    className="w-20 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Relationship (e.g., Father, Mother)"
                  value={newMember.relation}
                  onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                  className="w-full px-3 py-2 text-base rounded-lg border outline-none"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                />
                <input
                  type="text"
                  placeholder="Condition (e.g., Diabetes, Nil)"
                  value={newMember.condition}
                  onChange={(e) => setNewMember({ ...newMember, condition: e.target.value })}
                  className="w-full px-3 py-2 text-base rounded-lg border outline-none"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                />
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

        {/* List Items */}
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <Users size={32} style={{ color: "var(--color-text-subtle)" }} />
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>No family history records</p>
          </div>
        ) : items.map((member, i) => (
          <div key={i} className="relative p-3 pr-16 border-b group"
            style={{ borderColor: "var(--color-border)", background: i % 2 === 0 ? "white" : "#f2f7fb" }}>

            {/* Main Content */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: "var(--color-text-base)" }}>{member.name}</span>
                  <span className="text-[0.55rem] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: "#e6eff6", color: "#3f6f8f" }}>
                    {member.relation || "—"}
                  </span>
                </div>
                <div className="text-[0.65rem] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  Age: {member.age || "—"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                  background: member.condition === "Nil" ? "#eef3f8" : "#679cbc",
                  color: member.condition === "Nil" ? "var(--color-text-muted)" : "white",
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
                      background: allergy.type === "Allergy" ? "#679cbc" : "#e6eff6",
                      color: allergy.type === "Allergy" ? "white" : "#3f6f8f",
                    }}>
                    <AlertCircle size={10} />
                    {allergy.name}
                  </span>
                ))}
              </div>
            )}

            {/* Edit and Delete Buttons - horizontal, green / red */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(i)}
                className="p-1.5 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                title="Edit"
              >
                <Pencil size={13} style={{ color: "var(--color-success)" }} />
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="p-1.5 rounded hover:bg-white/50 transition-all"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                title="Delete"
              >
                <X size={13} style={{ color: "var(--color-danger)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientFamilyPanel;