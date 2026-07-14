import { useState, useRef } from "react";
import { Plus, Search, BookOpen, Eye, Edit2, X } from "lucide-react";
import useFillRowCount from "../../hooks/useFillRowCount";

const INITIAL_REPEAT_PRESCRIPTIONS = [
  { id: 1, title: "Pain Killer & Sleep",          days: 5,  drugCount: 3 },
  { id: 2, title: "Cold & Cough",                 days: 7,  drugCount: 4 },
  { id: 3, title: "Fever",  days: 5,  drugCount: 5 },
  { id: 4, title: "Malarial Infection",            days: 10, drugCount: 6 },
  { id: 5, title: "High Blood Pressure",           days: 30, drugCount: 2 },
];

/* Simple centered modal for adding/renaming a repeat-prescription entry */
function RepeatPrescriptionModal({ initialTitle = "", onSave, onCancel }) {
  const [title, setTitle] = useState(initialTitle);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
      <div className="rounded-lg shadow-xl w-full max-w-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-drugs)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-drugs-light)" }}>
          <span className="text-sm font-bold" style={{ color: "var(--color-drugs)" }}>
            {initialTitle ? "Modify Prescription" : "Add Repeat Prescription"}
          </span>
        </div>
        <div className="p-4">
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Prescription Title</label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && title.trim()) onSave(title.trim()); if (e.key === "Escape") onCancel(); }}
            placeholder="e.g. Cold & Cough"
            className="w-full px-3 py-2 rounded text-sm outline-none"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
          />
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>
            Cancel
          </button>
          <button
            onClick={() => title.trim() && onSave(title.trim())}
            disabled={!title.trim()}
            className="px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "var(--color-drugs)", color: "white", opacity: title.trim() ? 1 : 0.5 }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* Row height (px) used to compute how many blank rows fill the remaining
   visible space in the Repeat Prescriptions grid — see useFillRowCount. */
const REPEAT_ROW_HEIGHT_PX = 42;

/* ── Empty placeholder row — same grid as a prescription row, shown to fill remaining space ── */
function EmptyRepeatRow({ index }) {
  return (
    <div className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${REPEAT_ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
      <div className="w-12 px-3 py-2.5 text-center">&nbsp;</div>
      <div className="flex-1 px-3 py-2.5">&nbsp;</div>
      <div className="w-16 px-3 py-2.5 text-center">&nbsp;</div>
      <div className="w-24 px-3 py-2.5 text-center">&nbsp;</div>
      <div className="w-40 px-3 py-2.5 text-center">&nbsp;</div>
    </div>
  );
}

/* Self-contained panel — owns its own prescriptions state so it can be rendered
   as a top-level column in OPDeskScreen (same level as Previous Information),
   independent of whichever prescription tab is currently active. */
export default function RepeatPrescriptionsPanel() {
  const [prescriptions, setPrescriptions] = useState(INITIAL_REPEAT_PRESCRIPTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null); // null | "add" | { id, title }
  const rowsScrollRef = useRef(null);

  const filtered = searchTerm.trim()
    ? prescriptions.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : prescriptions;

  const fillRowCount = useFillRowCount(rowsScrollRef, REPEAT_ROW_HEIGHT_PX, filtered.length);

  const handleAdd = title => {
    setPrescriptions(prev => [...prev, { id: Date.now(), title, days: 0, drugCount: 0 }]);
  };
  const handleModify = (id, title) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, title } : p));
  };
  const handleDelete = id => {
    if (window.confirm("Delete this repeat prescription?")) {
      setPrescriptions(prev => prev.filter(p => p.id !== id));
    }
  };
  const handleView = p => {
    alert(`${p.title}\n${p.drugCount} drug(s) · ${p.days} day(s)`);
  };

  return (
    <div
      className="flex flex-col rounded-xs overflow-hidden shadow-lg"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Header — same layout as Previous Information: icon chip + title + subtitle, right-side action icons */}
      <div className="flex-shrink-0 px-4 py-[0.44rem] border-b flex justify-between items-center"
        style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg" style={{ background: "var(--color-primary)", color: "white" }}>
            <BookOpen size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--color-primary-dark)" }}>
              Repeat Prescriptions
            </h3>
            <p className="text-[0.6rem] font-medium mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {prescriptions.length} Prescription{prescriptions.length !== 1 ? 's' : ''} Recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalMode("add")}
            className="p-1.5 rounded-lg transition-all"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            title="Add prescription"
          >
            <Plus size={14} style={{ color: "var(--color-drugs)" }} />
          </button>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Search title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg w-32 focus:w-44 transition-all duration-200 outline-none"
              style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
            />
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: `${REPEAT_ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
        <div className="w-12 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>No.</div>
        <div className="flex-1 px-3 py-2.5" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>Prescription Title</div>
        <div className="w-16 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>Days</div>
        <div className="w-24 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>Drugs</div>
        <div className="w-40 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      {/* Rows */}
      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((p, index) => (
          <div key={p.id} className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${REPEAT_ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-center"><span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>{index + 1}.</span></div>
            <div className="flex-1 px-3 py-2.5"><span className="text-xs font-medium" style={{ color: "var(--color-text-base)" }}>{p.title}</span></div>
            <div className="w-16 px-3 py-2.5 text-center"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{p.days || "—"}</span></div>
            <div className="w-24 px-3 py-2.5 text-center"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{p.drugCount}</span></div>
            <div className="w-40 px-3 py-2.5 flex items-center justify-center gap-1.5">
              <button onClick={() => handleView(p)} className="p-1 rounded transition-all" title="View"
                style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-primary-light)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary-muted)"}>
                <Eye size={11} />
              </button>
              <button onClick={() => setModalMode({ id: p.id, title: p.title })} className="p-1 rounded transition-all" title="Modify"
                style={{ background: "var(--color-drugs-light)", color: "var(--color-drugs)" }}
                onMouseEnter={e => e.currentTarget.style.background = "#146b4c"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-drugs-light)"}>
                <Edit2 size={11} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-1 rounded transition-all" title="Delete"
                style={{ background: "#fee2e2", color: "var(--color-danger)" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fecaca"}
                onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
                <X size={11} />
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => (
          <EmptyRepeatRow key={`empty-${i}`} index={filtered.length + i} />
        ))}
      </div>

      {modalMode === "add" && (
        <RepeatPrescriptionModal
          onSave={title => { handleAdd(title); setModalMode(null); }}
          onCancel={() => setModalMode(null)}
        />
      )}
      {modalMode && modalMode !== "add" && (
        <RepeatPrescriptionModal
          initialTitle={modalMode.title}
          onSave={title => { handleModify(modalMode.id, title); setModalMode(null); }}
          onCancel={() => setModalMode(null)}
        />
      )}
    </div>
  );
}
