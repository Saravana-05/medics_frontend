import { useState } from "react";
import { Plus, Pencil, X, Check } from "lucide-react";

const FAMILY_HISTORY = [
  { relation: "Grand-parents", name: "Grand Father", age: "72", condition: "Cancer", chronicAllergy: [] },
  { relation: "Grand-parents", name: "Grand Mother", age: "68", condition: "High BP", chronicAllergy: [] },
  { relation: "Parents", name: "Father", age: "54", condition: "Diabetes", chronicAllergy: [] },
  { relation: "Parents", name: "Mother", age: "50", condition: "Thyroid", chronicAllergy: [] },
  { relation: "Siblings", name: "Brother", age: "32", condition: "High BP", chronicAllergy: [] },
  { relation: "Siblings", name: "Sister", age: "27", condition: "Asthma", chronicAllergy: [] },
  { relation: "Children", name: "Son", age: "10", condition: "Dust Allergy", chronicAllergy: [] },
  { relation: "Children", name: "Daughter", age: "7", condition: "Migraine", chronicAllergy: [] },
];

const FAMILY_GROUPS = ["Grand-parents", "Parents", "Siblings", "Children"];

function PatientFamilyPanel({ panelHeight, onUpdate }) {
  const [items, setItems] = useState(FAMILY_HISTORY);
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
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-center text-[0.6rem] font-bold leading-none"
            style={{ background: "white", color: "#679cbc" }}>{items.length}</span>
        </div>
        
      </div>

      {/* Add button row — right-aligned with light-grey divider + drop shadow (matches SchedulePanel) */}
      <div className="px-3 py-2 flex items-center justify-end gap-2"
        style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex h-8 flex-shrink-0 items-center justify-center gap-1.5 px-2.5 text-xs font-semibold transition-all hover:bg-black/5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 0, color: "#3f6f8f" }}
          title="Add family member"
        >
          <Plus size={15} style={{ color: "#679cbc" }} />
          <span>Add Family Member</span>
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

        <div className="p-3 space-y-4">
          {FAMILY_GROUPS.map((group, groupIndex) => {
            const groupItems = items.filter(member => member.relation === group);
            return (
              <section key={group} className={groupIndex > 0 ? "border-t pt-3" : ""} style={groupIndex > 0 ? { borderColor: "var(--color-border)" } : undefined}>
                <h3 className="mb-2 text-sm font-bold" style={{ color: "#3f6f8f" }}>{group}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {groupItems.map((member, rowIndex) => {
                    const itemIndex = items.indexOf(member);
                    return (
                      <div key={`${group}-${member.name}`} className="flex items-center gap-1.5 rounded px-2 py-1.5" style={{ background: rowIndex % 2 === 0 ? "white" : "#f2f7fb" }}>
                        <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--color-text-muted)" }}>{rowIndex + 1}.</span>
                        <span className="min-w-0 flex-1 truncate text-sm font-bold" title={member.name} style={{ color: "var(--color-text-base)" }}>{member.name}</span>
                        <span className="shrink-0 text-sm" style={{ color: "var(--color-text-muted)" }}>-</span>
                        <span className="shrink-0 whitespace-nowrap text-sm" style={{ color: "var(--color-text-base)" }}>{member.condition}</span>
                        <div className="ml-auto flex shrink-0 items-center justify-end gap-1">
                          <button onClick={() => handleEdit(itemIndex)} className="rounded bg-white p-1" title="Edit"><Pencil size={13} style={{ color: "var(--color-success)" }} /></button>
                          <button onClick={() => handleDelete(itemIndex)} className="rounded bg-white p-1" title="Delete"><X size={13} style={{ color: "var(--color-danger)" }} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PatientFamilyPanel;
