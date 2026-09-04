import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";

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

// Groups that support the group-level modal edit.
const EDITABLE_GROUPS = ["Grand-parents", "Parents", "Siblings", "Children"];

function PatientFamilyPanel({ panelHeight, onUpdate }) {
  const [items, setItems] = useState(FAMILY_HISTORY);

  // Which group's modal is currently open ("Grand-parents" | "Siblings" | "Children" | null)
  const [editingGroup, setEditingGroup] = useState(null);
  // Draft copy of that group's members, pre-filled from the real data, edited inside the modal
  const [groupDraft, setGroupDraft] = useState([]);

  const headerH = 50;

  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    if (onUpdate) onUpdate(updatedItems);
  };

  // ── Group-level modal edit (Grand-parents / Siblings / Children) ──
  const openGroupEdit = (group) => {
    const groupMembers = items
      .filter((member) => member.relation === group)
      .map((member) => ({ ...member }));
    setGroupDraft(groupMembers);
    setEditingGroup(group);
  };

  const updateGroupDraft = (draftIndex, field, value) => {
    setGroupDraft((current) =>
      current.map((member, i) => (i === draftIndex ? { ...member, [field]: value } : member))
    );
  };

  const saveGroupEdit = () => {
    const groupEntries = items.filter((member) => member.relation === editingGroup);
    const updatedItems = items.map((member) => {
      if (member.relation !== editingGroup) return member;
      const draftIndex = groupEntries.indexOf(member);
      return groupDraft[draftIndex] || member;
    });
    setItems(updatedItems);
    if (onUpdate) onUpdate(updatedItems);
    setEditingGroup(null);
    setGroupDraft([]);
  };

  const cancelGroupEdit = () => {
    setEditingGroup(null);
    setGroupDraft([]);
  };

  return (
    <div
      className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#679cbc", borderColor: "#679cbc", height: headerH, flexShrink: 0 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-md font-bold text-white">Patient Family History</span>
          <span
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-center text-[0.6rem] font-bold leading-none"
            style={{ background: "white", color: "#679cbc" }}
          >
            {items.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {/* Group edit modal — shared by Grand-parents, Siblings, Children */}
        {editingGroup && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={cancelGroupEdit}
          >
            <div
              className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "var(--color-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "#679cbc" }}>
                <span className="text-base font-bold text-white">Edit {editingGroup}</span>
                <button onClick={cancelGroupEdit} className="p-1 rounded transition-all hover:bg-white/20" title="Close">
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Modal body — one editable row per member, pre-filled with their actual data */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {groupDraft.map((member, draftIndex) => (
                  <div
                    key={`${editingGroup}-${draftIndex}`}
                    className="space-y-2 pb-3"
                    style={{ borderBottom: draftIndex < groupDraft.length - 1 ? "1px solid var(--color-border)" : "none" }}
                  >
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => updateGroupDraft(draftIndex, "name", e.target.value)}
                        className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                      />
                      <input
                        type="text"
                        placeholder="Age"
                        value={member.age}
                        onChange={(e) => updateGroupDraft(draftIndex, "age", e.target.value)}
                        className="w-20 px-3 py-2 text-base rounded-lg border outline-none"
                        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Condition (e.g., Diabetes, Nil)"
                      value={member.condition}
                      onChange={(e) => updateGroupDraft(draftIndex, "condition", e.target.value)}
                      className="w-full px-3 py-2 text-base rounded-lg border outline-none"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                    />
                  </div>
                ))}
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 px-4 pb-4">
                <button
                  onClick={saveGroupEdit}
                  className="flex-1 px-3 py-2 rounded-lg text-base font-semibold flex items-center justify-center gap-1.5"
                  style={{ background: "var(--color-success)", color: "white" }}
                >
                  <Check size={16} /> Save
                </button>
                <button
                  onClick={cancelGroupEdit}
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
            const groupItems = items.filter((member) => member.relation === group);
            const isEditable = EDITABLE_GROUPS.includes(group);
            return (
              <section
                key={group}
                className={groupIndex > 0 ? "border-t pt-3" : ""}
                style={groupIndex > 0 ? { borderColor: "var(--color-border)" } : undefined}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold" style={{ color: "#3f6f8f" }}>{group}</h3>
                  {isEditable && groupItems.length > 0 && (
                    <button
                      onClick={() => openGroupEdit(group)}
                      className="flex h-7 w-7 items-center justify-center rounded border"
                      style={{ borderColor: "var(--color-border)", color: "#3f6f8f" }}
                      title={`Edit ${group}`}
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {groupItems.map((member, rowIndex) => {
                    const itemIndex = items.indexOf(member);
                    return (
                      <div
                        key={`${group}-${member.name}`}
                        className="flex items-center gap-1.5 rounded px-2 py-1.5"
                        style={{ background: rowIndex % 2 === 0 ? "white" : "#f2f7fb" }}
                      >
                        <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--color-text-muted)" }}>
                          {rowIndex + 1}.
                        </span>
                        <span
                          className="min-w-0 flex-1 truncate text-sm font-bold"
                          title={member.name}
                          style={{ color: "var(--color-text-base)" }}
                        >
                          {member.name}
                        </span>
                        <span className="shrink-0 text-sm" style={{ color: "var(--color-text-muted)" }}>-</span>
                        <span className="shrink-0 whitespace-nowrap text-sm" style={{ color: "var(--color-text-base)" }}>
                          {member.condition}
                        </span>
                        {isEditable && (
                          <div className="ml-auto flex shrink-0 items-center justify-end gap-1">
                            <button
                              onClick={() => handleDelete(itemIndex)}
                              className="rounded bg-white p-1"
                              title="Delete"
                            >
                              <X size={13} style={{ color: "var(--color-danger)" }} />
                            </button>
                          </div>
                        )}
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