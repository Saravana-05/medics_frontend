import { useState } from "react";
import { Pencil, Plus, X, Check } from "lucide-react";

const FAMILY_HISTORY = [
  { relation: "Grand Parents", side: "Paternal", role: "Grand Father", name: "Mr. Raman", age: "72", condition: "Cancer" },
  { relation: "Grand Parents", side: "Paternal", role: "Grand Mother", name: "Mrs. Lakshmi", age: "68", condition: "High BP" },
  { relation: "Grand Parents", side: "Maternal", role: "Grand Father", name: "", age: "", condition: "" },
  { relation: "Grand Parents", side: "Maternal", role: "Grand Mother", name: "", age: "", condition: "" },
  { relation: "Parents", role: "Father", name: "Mr. Krishnaswamy", age: "54", condition: "Diabetes" },
  { relation: "Parents", role: "Mother", name: "Mrs. Meenakshi", age: "50", condition: "Thyroid" },
  { relation: "Siblings", role: "Brother", name: "Mr. Kannan", age: "32", condition: "High BP" },
  { relation: "Siblings", role: "Sister", name: "Ms. Priya", age: "27", condition: "Asthma" },
  { relation: "Children", role: "Son", name: "Master. Arjun", age: "10", condition: "Dust Allergy" },
  { relation: "Children", role: "Daughter", name: "Miss. Ananya", age: "7", condition: "Migraine" },
];

const FAMILY_GROUPS = ["Grand Parents", "Parents", "Siblings", "Children"];
const GROUP_ROLES = {
  "Grand Parents": ["Grand Father", "Grand Mother"],
  Parents: ["Father", "Mother"],
  Siblings: ["Brother", "Sister"],
  Children: ["Son", "Daughter"],
};

// Grand Parents are further split by side; each side has the same fixed roles.
const GRANDPARENT_SIDES = ["Paternal", "Maternal"];

// Groups that support the group-level modal edit.
const EDITABLE_GROUPS = ["Grand Parents", "Parents", "Siblings", "Children"];
// Groups whose modal allows adding/removing individual members.
// (Grand Parents is fixed at 4 slots — Paternal/Maternal x Grand Father/Grand Mother — so no add/remove there.)
const ADD_REMOVE_GROUPS = ["Siblings", "Children"];

// Header text color for each group section label.
const GROUP_HEADER_COLORS = {
  "Grand Parents": "#c0392b", // red
  Parents: "#27ae60", // green
  Siblings: "#2980b9", // blue
  Children: "#8e44ad", // violet
};

function PatientFamilyPanel({ panelHeight, onUpdate }) {
  const [items, setItems] = useState(FAMILY_HISTORY);

  // Which group's modal is currently open.
  const [editingGroup, setEditingGroup] = useState(null);
  // Draft copy of that group's members, pre-filled from the real data, edited inside the modal
  const [groupDraft, setGroupDraft] = useState([]);

  const headerH = 50;
  const isGrandParents = editingGroup === "Grand Parents";

  // ── Group-level modal edit (Grand-parents / Parents / Siblings / Children) ──
  const openGroupEdit = (group) => {
    if (group === "Grand Parents") {
      // Fixed 4-slot draft: Paternal/Maternal x Grand Father/Grand Mother.
      const draft = GRANDPARENT_SIDES.flatMap((side) =>
        GROUP_ROLES["Grand Parents"].map((role) => {
          const existing = items.find(
            (member) => member.relation === "Grand Parents" && member.side === side && member.role === role
          );
          return existing ? { ...existing } : { relation: "Grand Parents", side, role, name: "", age: "", condition: "" };
        })
      );
      setGroupDraft(draft);
      setEditingGroup(group);
      return;
    }
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

  const addGroupMember = (role) => {
    setGroupDraft((current) => [...current, { relation: editingGroup, role, name: "", age: "", condition: "" }]);
  };

  const removeGroupDraft = (draftIndex) => {
    setGroupDraft((current) => current.filter((_, index) => index !== draftIndex));
  };

  const saveGroupEdit = () => {
    const updatedItems = [
      ...items.filter((member) => member.relation !== editingGroup),
      ...groupDraft.filter((member) => member.name.trim()).map((member) => ({ ...member, relation: editingGroup })),
    ];
    setItems(updatedItems);
    if (onUpdate) onUpdate(updatedItems);
    setEditingGroup(null);
    setGroupDraft([]);
  };

  const cancelGroupEdit = () => {
    setEditingGroup(null);
    setGroupDraft([]);
  };

  const canAddOrRemove = editingGroup ? ADD_REMOVE_GROUPS.includes(editingGroup) : false;

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
          <span className="text-base font-bold text-white">Family History</span>
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
        {/* Group edit modal — shared by Grand Parents, Parents, Siblings, Children */}
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

              {/* Modal body */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {isGrandParents ? (
                  // Fixed Paternal / Maternal sub-sections. Within each: Grand Father on the
                  // left, Grand Mother on the right, with that person's fields stacked below.
                  GRANDPARENT_SIDES.map((side) => (
                    <div key={side} className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wide" style={{ color: "#3f6f8f" }}>
                        {side}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {groupDraft
                          .map((member, draftIndex) => ({ member, draftIndex }))
                          .filter(({ member }) => member.side === side)
                          .sort((a, b) => GROUP_ROLES["Grand Parents"].indexOf(a.member.role) - GROUP_ROLES["Grand Parents"].indexOf(b.member.role))
                          .map(({ member, draftIndex }) => (
                            <div key={draftIndex} className="space-y-2 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
                              <div className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>
                                {member.role}
                              </div>
                              <label className="block space-y-1">
                                <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Name</span>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => updateGroupDraft(draftIndex, "name", e.target.value)}
                                  className="h-8 w-full border px-2 text-sm outline-none"
                                  style={{ borderColor: "var(--color-border)" }}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Age</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={member.age}
                                  onChange={(e) => updateGroupDraft(draftIndex, "age", e.target.value)}
                                  className="h-8 w-full border px-2 text-sm outline-none"
                                  style={{ borderColor: "var(--color-border)" }}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Disease</span>
                                <input
                                  type="text"
                                  value={member.condition}
                                  onChange={(e) => updateGroupDraft(draftIndex, "condition", e.target.value)}
                                  className="h-8 w-full border px-2 text-sm outline-none"
                                  style={{ borderColor: "var(--color-border)" }}
                                />
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Generic per-member editor for Parents / Siblings / Children.
                  groupDraft.map((member, draftIndex) => (
                    <div key={draftIndex} className="space-y-2 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex items-end gap-2">
                        <label className="flex-1 space-y-1">
                          <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Relation</span>
                          <select
                            value={member.role}
                            onChange={(e) => updateGroupDraft(draftIndex, "role", e.target.value)}
                            className="h-8 w-full border px-2 text-sm outline-none"
                            style={{ borderColor: "var(--color-border)" }}
                          >
                            {GROUP_ROLES[editingGroup].map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </label>
                        {canAddOrRemove && (
                          <button type="button" onClick={() => removeGroupDraft(draftIndex)} className="mb-1.5 p-1" title="Remove">
                            <X size={15} style={{ color: "var(--color-danger)" }} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-[1fr_76px] gap-2">
                        <label className="space-y-1">
                          <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Name</span>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateGroupDraft(draftIndex, "name", e.target.value)}
                            className="h-8 w-full border px-2 text-sm outline-none"
                            style={{ borderColor: "var(--color-border)" }}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Age</span>
                          <input
                            type="number"
                            min="0"
                            value={member.age}
                            onChange={(e) => updateGroupDraft(draftIndex, "age", e.target.value)}
                            className="h-8 w-full border px-2 text-sm outline-none"
                            style={{ borderColor: "var(--color-border)" }}
                          />
                        </label>
                      </div>
                      <label className="block space-y-1">
                        <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Disease</span>
                        <input
                          type="text"
                          value={member.condition}
                          onChange={(e) => updateGroupDraft(draftIndex, "condition", e.target.value)}
                          className="h-8 w-full border px-2 text-sm outline-none"
                          style={{ borderColor: "var(--color-border)" }}
                        />
                      </label>
                    </div>
                  ))
                )}

                {!isGrandParents && groupDraft.length === 0 && (
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>No members added</div>
                )}

                {canAddOrRemove && (
                  <button
                    type="button"
                    onClick={() => addGroupMember(GROUP_ROLES[editingGroup][0])}
                    className="flex h-8 w-full items-center justify-center gap-1 border text-xs font-semibold"
                    style={{ borderColor: "#679cbc", color: "#3f6f8f" }}
                  >
                    <Plus size={13} /><span>Add {editingGroup === "Children" ? "child" : "member"}</span>
                  </button>
                )}
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

        <div className="p-3 space-y-2">
          {FAMILY_GROUPS.map((group, groupIndex) => {
            const isEditable = EDITABLE_GROUPS.includes(group);

            if (group === "Grand Parents") {
              const grandparentItems = items.filter((member) => member.relation === group);
              return (
                <section key={group} className={groupIndex > 0 ? "pt-1" : ""}>
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-xs font-bold" style={{ color: GROUP_HEADER_COLORS[group] }}>{group}</h3>
                    {isEditable && (
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
                  {GRANDPARENT_SIDES.map((side) => {
                    const sideItems = grandparentItems
                      .filter((member) => member.side === side)
                      .sort((left, right) => GROUP_ROLES[group].indexOf(left.role) - GROUP_ROLES[group].indexOf(right.role));
                    if (sideItems.length === 0) return null;
                    return (
                      <div key={side} className="mb-1">
                        <div className="px-2 pt-1 text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                          {side}
                        </div>
                        <div className="grid grid-cols-2 gap-2 px-2 pb-1">
                          {sideItems.map((member) => (
                            <div
                              key={`${group}-${side}-${member.role}`}
                              className="min-w-0 border-b pb-1"
                              style={{ borderColor: "var(--color-border)" }}
                            >
                              <div className="truncate text-[0.65rem]" style={{ color: "var(--color-text-muted)" }}>{member.role}</div>
                              <div className="truncate text-[0.65rem]" title={`${member.name}, ${member.age} years`} style={{ color: "var(--color-text-muted)" }}>{member.name || "—"} · {member.age || "—"} yrs</div>
                              <div className="truncate text-[0.65rem]" title={member.condition} style={{ color: "var(--color-text-base)" }}>{member.condition || "—"}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            }

            const groupItems = items
              .filter((member) => member.relation === group)
              .sort((left, right) => GROUP_ROLES[group].indexOf(left.role) - GROUP_ROLES[group].indexOf(right.role));
            return (
              <section
                key={group}
                className={groupIndex > 0 ? "pt-1" : ""}
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-xs font-bold" style={{ color: GROUP_HEADER_COLORS[group] }}>{group}</h3>
                  {isEditable && (
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
                <div className="grid grid-cols-1 gap-0">
                  {groupItems.map((member) => {
                    const sameRoleMembers = groupItems.filter(item => item.role === member.role);
                    const roleNumber = sameRoleMembers.indexOf(member) + 1;
                    const roleLabel = sameRoleMembers.length > 1 ? `${member.role} ${roleNumber}` : member.role;
                    return (
                      <div
                        key={`${group}-${member.role}-${member.name}`}
                        className="flex items-center gap-2 border-b px-2 py-1"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>{roleLabel}</div>
                          <div className="truncate text-[0.65rem]" title={`${member.name}, ${member.age} years`} style={{ color: "var(--color-text-muted)" }}>{member.name} · {member.age || "—"} yrs</div>
                        </div>
                        <span className="max-w-[42%] shrink-0 truncate text-right text-sm" title={member.condition} style={{ color: "var(--color-text-base)" }}>{member.condition || "—"}</span>
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