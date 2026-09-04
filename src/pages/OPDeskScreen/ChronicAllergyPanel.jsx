import { useState, useEffect } from "react";
import { Plus, Pencil, X, Check } from "lucide-react";

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

  const headerH = 50;
  const [gynacInfoState, setGynacInfoState] = useState(patient?.gynacInfo || null);
  const [editingGynac, setEditingGynac] = useState(false);
  const [gynacDraft, setGynacDraft] = useState({});
  const gynacFields = [
    { key: "lmp", label: "LMP" },
    { key: "edd", label: "EDD" },
    { key: "doc", label: "Doctor" },
    { key: "pregnancies", label: "Pregnancies" },
    { key: "deliveries", label: "Deliveries" },
    { key: "abortions", label: "Abortions" },
    { key: "livingChildren", label: "Living Children" }
  ];
  useEffect(() => {
    setGynacInfoState(patient?.gynacInfo || null);
  }, [patient?.gynacInfo]);

  const openGynacEdit = () => {
    setGynacDraft({ ...(gynacInfoState || {}) });
    setEditingGynac(true);
  };
  const saveGynacEdit = () => {
    setGynacInfoState({ ...gynacDraft });
    setEditingGynac(false);
  };
  const cancelGynacEdit = () => {
    setEditingGynac(false);
    setGynacDraft({});
  };
  const chronicItems = items.filter(item => item.type === "Chronic");
  const allergyItems = items.filter(item => item.type === "Allergy");

  const openAddForm = (type) => {
    setEditingIndex(null);
    setNewItem({ type, name: "", since: "", severity: "Medium", reaction: "" });
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
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-center text-[0.6rem] font-bold leading-none" style={{ background: "white", color: "#3f8f87" }}>{items.length + (gynacInfoState ? 1 : 0)}</span>
        </div>
      </div>

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
                    type="year"
                    value={newItem.since}
                    onChange={(e) => setNewItem({ ...newItem, since: e.target.value })}
                    className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  />
                  {/* <input
                    type="text"
                    placeholder="Reaction (optional)"
                    value={newItem.reaction || ""}
                    onChange={(e) => setNewItem({ ...newItem, reaction: e.target.value })}
                    className="flex-1 px-3 py-2 text-base rounded-lg border outline-none"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                  /> */}
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

        <div className="p-3 space-y-4">
          {[{ type: "Allergy", entries: allergyItems }, { type: "Chronic", entries: chronicItems }].map(({ type, entries }, sectionIndex) => (
            <section key={type} className={sectionIndex > 0 ? "border-t pt-3" : ""} style={sectionIndex > 0 ? { borderColor: "var(--color-border)" } : undefined}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold" style={{ color: type === "Chronic" ? "#3f8f87" : "#d97706" }}>{type} ({entries.length})</h3>
                <button onClick={() => openAddForm(type)} className="flex h-7 w-7 items-center justify-center rounded border" style={{ borderColor: "var(--color-border)", color: "#3f8f87" }} title={`Add ${type.toLowerCase()}`}>
                  <Plus size={17} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {entries.length === 0 ? (
                  <div className="col-span-2 rounded border p-3 text-center text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>No {type === "Chronic" ? "chronic conditions" : "allergies"} recorded</div>
                ) : entries.map((item, i) => {
                  const itemIndex = items.indexOf(item);
                  return (
                    <div key={`${item.type}-${item.name}-${i}`} className="flex flex-col rounded px-2 py-1.5" style={{ background: i % 2 === 0 ? "white" : "#f2faf9" }}>
                      {/* Top row: index, full name, severity, actions */}
                      <div className="flex items-start gap-1.5">
                        <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--color-text-muted)" }}>{i + 1}.</span>
                        <span title={item.name} className="min-w-0 flex-1 text-sm font-bold break-words leading-tight" style={{ color: "var(--color-text-base)" }}>{item.name}</span>
                        <span className="shrink-0 whitespace-nowrap text-sm" style={{ color: "var(--color-text-base)" }}>- {item.severity}</span>
                        <div className="ml-1 flex shrink-0 items-center justify-end gap-1">
                          <button onClick={() => handleEdit(itemIndex)} className="rounded bg-white p-1" title="Edit"><Pencil size={13} style={{ color: "var(--color-success)" }} /></button>
                          <button onClick={() => handleDelete(itemIndex)} className="rounded bg-white p-1" title="Delete"><X size={13} style={{ color: "var(--color-danger)" }} /></button>
                        </div>
                      </div>
                      {/* Bottom row: since year, smaller font, indented under the name, tight gap */}
                      <div className="pl-5 -mt-0.5 leading-tight">
                        <span className="whitespace-nowrap text-[0.65rem]" style={{ color: "var(--color-text-muted)" }}>(Since {item.since ? new Date(item.since).getFullYear() : "N/A"})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold" style={{ color: "#d946ef" }}>Gynecology</h3>
              {gynacInfoState && (
                <div className="flex items-center gap-1">
                  {editingGynac ? (
                    <>
                      <button onClick={saveGynacEdit} className="flex h-7 w-7 items-center justify-center rounded border" style={{ borderColor: "var(--color-border)", color: "var(--color-success)" }} title="Save">
                        <Check size={15} />
                      </button>
                      <button onClick={cancelGynacEdit} className="flex h-7 w-7 items-center justify-center rounded border" style={{ borderColor: "var(--color-border)", color: "var(--color-danger)" }} title="Cancel">
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <button onClick={openGynacEdit} className="flex h-7 w-7 items-center justify-center rounded border" style={{ borderColor: "var(--color-border)", color: "#d946ef" }} title="Edit">
                      <Pencil size={15} />
                    </button>
                  )}
                </div>
              )}
            </div>
            {gynacInfoState ? (
              <div className="grid grid-cols-1 gap-2">
                {gynacFields.map(({ key, label }, i) => (
                  <div key={key} className="flex items-center gap-1.5 rounded px-2 py-1.5" style={{ background: i % 2 === 0 ? "white" : "#faf2fc" }}>
                    <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--color-text-muted)" }}>{i + 1}.</span>
                    <span className="shrink-0 text-sm font-bold" style={{ color: "var(--color-text-base)" }}>{label}</span>
                    <span className="shrink-0 text-sm" style={{ color: "var(--color-text-muted)" }}>-</span>
                    {editingGynac ? (
                      <input
                        type="text"
                        value={gynacDraft[key] ?? ""}
                        onChange={(e) => setGynacDraft({ ...gynacDraft, [key]: e.target.value })}
                        className="min-w-0 flex-1 rounded border px-2 py-0.5 text-right text-sm outline-none"
                        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
                      />
                    ) : (
                      <span className="min-w-0 flex-1 truncate text-right text-sm" style={{ color: "var(--color-text-base)" }}>{gynacInfoState[key] ?? "—"}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded border p-3 text-center text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>No gynecology information available</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChronicAllergyPanel;