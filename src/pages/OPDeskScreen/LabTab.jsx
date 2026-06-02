import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Plus, Copy, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  FlaskConical, Search, ChevronDown, TestTube, Microscope,
  BookOpen, Trash
} from "lucide-react";
import { LAB_SUGGESTIONS } from "./mockData";

const DETAIL_OPTIONS = ["—","Empty Stomach","1Hr. After Food","Any Time","Fasting","Random","Early Morning","Immediately"];

const FIELD_ORDER = ["name", "detail", "commit"];

/* ── Action Button Component with Label ── */
function ActionButton({ onClick, variant = "primary", icon: Icon, label, disabled = false }) {
  const variants = {
    primary: { bg: "var(--color-primary)", color: "white", hoverBg: "var(--color-primary-light)" },
    success: { bg: "var(--color-lab)", color: "white", hoverBg: "#92400e" },
    danger: { bg: "var(--color-danger)", color: "white", hoverBg: "#b91c1c" },
    warning: { bg: "var(--color-warning)", color: "white", hoverBg: "#d97706" },
    ghost: { bg: "transparent", color: "var(--color-text-muted)", hoverBg: "var(--color-surface-alt)" },
  };
  const style = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ background: style.bg, color: style.color, border: variant === "ghost" ? "1px solid var(--color-border)" : "none" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = style.hoverBg; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = style.bg; }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

/* ── Modern Toolbar Component ── */
function ModernToolbar({ docNo, docDt, onProto }) {
  return (
    <div className="flex items-center justify-between p-1 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-6">
        {/* <div className="flex gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider block" style={{ color: "var(--color-text-muted)" }}>
              <Hash size={10} className="inline mr-1" /> Doc #
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--color-text-base)" }}>{docNo || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider block" style={{ color: "var(--color-text-muted)" }}>
              <Calendar size={10} className="inline mr-1" /> Doc. Dt
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{docDt || "—"}</span>
          </div>
        </div> */}
        <div className="h-8 w-px" style={{ background: "var(--color-border)" }} />
        {/* <span className="px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1" style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}>
          <Stethoscope size={12} /> OP-LP: 3903
        </span> */}
      </div>
      <div className="flex gap-2">
        {/* <ActionButton variant="ghost" icon={Copy} label="Copy" /> */}
        <ActionButton variant="ghost" icon={Clipboard} label="Paste" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={BookOpen} label="Proto" onClick={onProto} />
        <ActionButton variant="ghost" icon={FileText} label="Preview" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={Printer} label="Print" />
      </div>
    </div>
  );
}

/* ── Table Header Component ── */
function TableHeader() {
  const columns = [
    { label: "Sl.No.", width: "w-16" },
    { label: "Test / Investigation", width: "flex-1" },
    { label: "Instructions", width: "w-48" },
    { label: "Actions", width: "w-28", center: true },
  ];
  return (
    <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-lab-light)", borderColor: "var(--color-border)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.width} px-3 py-2.5 ${col.center ? 'text-center' : ''}`}
          style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Lab Row Component ── */
function LabRow({ lab, index, isStruck, onDelete, onStrike, onEdit }) {
  return (
    <div className="flex border-b transition-all duration-150 hover:shadow-sm"
      style={{
        borderColor: "var(--color-border)",
        background: isStruck ? "var(--color-surface-alt)" : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1,
      }}
    >
      <div className="w-16 px-3 py-2 text-center">
        <span className="text-sm font-bold" style={{ color: "var(--color-lab)" }}>{index + 1}</span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className={`text-sm font-semibold inline-flex items-center gap-1.5 ${isStruck ? "line-through" : ""}`} style={{ color: "var(--color-text-base)" }}>
          <FlaskConical size={14} style={{ color: "var(--color-lab)" }} />
          {lab.name}
        </span>
      </div>
      <div className="w-48 px-3 py-2">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{lab.detail === "—" ? "—" : lab.detail}</span>
      </div>
      <div className="w-28 px-2 py-2 flex items-center justify-center gap-1.5">
        <button onClick={onEdit} className="p-1.5 rounded transition-all" title="Edit (E)"
          style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary-muted)"}>
          <Edit2 size={14} />
        </button>
        <button onClick={onStrike} className="p-1.5 rounded transition-all" title={isStruck ? "Undo Strike (S)" : "Strike (S)"}
          style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fde68a"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lab-light)"}>
          {isStruck ? <RotateCcw size={14} /> : <MinusCircle size={14} />}
        </button>
        <button onClick={onDelete} className="p-1.5 rounded transition-all" title="Delete (Del)"
          style={{ background: "#fee2e2", color: "var(--color-danger)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function TypableDetailInput({ value, onChange, onKeyDown }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [hasTyped, setHasTyped] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const detailOptions = DETAIL_OPTIONS.filter(opt => opt !== "—");

  const recalcDropdown = useCallback(() => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (showDropdown) {
      recalcDropdown();
      window.addEventListener("scroll", recalcDropdown, true);
      window.addEventListener("resize", recalcDropdown);
    }
    return () => {
      window.removeEventListener("scroll", recalcDropdown, true);
      window.removeEventListener("resize", recalcDropdown);
    };
  }, [showDropdown, recalcDropdown]);

  const handleSelectOption = (option) => {
    onChange({ target: { value: option } });
    setHasTyped(false);
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showDropdown && filteredOptions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, filteredOptions.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); handleSelectOption(filteredOptions[highlightedIdx]); return; }
      if (e.key === "Escape") { setShowDropdown(false); setHighlightedIdx(-1); return; }
    }
    onKeyDown?.(e);
  };

  const filteredOptions = !hasTyped
    ? detailOptions
    : detailOptions.filter(opt =>
        opt.toLowerCase().includes((value === "—" ? "" : value).toLowerCase())
      );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value === "—" ? "" : value}
        onChange={e => { setHasTyped(true); onChange(e); }}
        onFocus={() => { recalcDropdown(); setShowDropdown(true); }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => { setShowDropdown(false); setHasTyped(false); }, 200)}
        placeholder="Type or select instructions..."
        className="w-full px-2 py-1.5 rounded text-sm outline-none"
        style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <div
          className="rounded-lg shadow-xl overflow-hidden"
          style={{
            ...dropdownStyle,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((opt, i) => (
              <div
                key={opt}
                onMouseDown={() => handleSelectOption(opt)}
                className="px-3 py-2 cursor-pointer text-sm transition-colors"
                style={{ background: highlightedIdx === i ? "var(--color-lab-light)" : "transparent" }}
                onMouseEnter={() => setHighlightedIdx(i)}
                onMouseLeave={() => setHighlightedIdx(-1)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Add Row Component ── */
function AddRow({ draft, onDraftChange, onCommit, query, setQuery, suggestions, onCancel }) {
  const inputRef    = useRef(null);
  const rowRef      = useRef(null);
  const wrapperRef  = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const labTests = [
    "Complete Blood Count (CBC)", "Blood Glucose (Fasting)", "Blood Glucose (PP)",
    "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)",
    "Thyroid Profile (T3,T4,TSH)", "Urine Routine", "HbA1c", "Vitamin D3",
    "Vitamin B12", "Iron Studies", "CRP (C-Reactive Protein)", "ESR",
    "Coagulation Profile", "Blood Culture", "Urine Culture", "ECG",
    "2D Echo", "Chest X-Ray", "MRI Brain", "CT Scan"
  ];

  const dropdownItems = query === "" ? labTests : suggestions.slice(0, 8);

  const recalcDropdown = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.top - 8,
      left: rect.left,
      width: Math.max(rect.width, 520),
      transform: "translateY(-100%)",
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (showDropdown) {
      recalcDropdown();
      window.addEventListener("scroll", recalcDropdown, true);
      window.addEventListener("resize", recalcDropdown);
    }
    return () => {
      window.removeEventListener("scroll", recalcDropdown, true);
      window.removeEventListener("resize", recalcDropdown);
    };
  }, [showDropdown, recalcDropdown]);

  const handleSelectTest = (test) => {
    setQuery(test);
    onDraftChange("name")(test);
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleRowBlur = (e) => {
    if (rowRef.current && !rowRef.current.contains(e.relatedTarget)) {
      setShowDropdown(false);
      setHighlightedIdx(-1);
    }
  };

  const focusField = useCallback((fieldKey) => {
    if (!rowRef.current) return;
    const el = rowRef.current.querySelector(`[data-field="${fieldKey}"]`);
    if (el) el.focus();
  }, []);

  const handleFieldKeyDown = (e, currentField) => {
    const idx = FIELD_ORDER.indexOf(currentField);
    if (e.key === "Escape") { onCancel(); return; }

    if (currentField === "name" && showDropdown && dropdownItems.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, dropdownItems.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); handleSelectTest(dropdownItems[highlightedIdx]); return; }
    }

    if (e.key === "ArrowRight" && currentField === "name") { e.preventDefault(); const next = FIELD_ORDER[idx + 1]; if (next) focusField(next); return; }
    if (e.key === "ArrowRight" && e.altKey) { e.preventDefault(); const next = FIELD_ORDER[idx + 1]; if (next) focusField(next); return; }
    if (e.key === "ArrowLeft" && currentField === "name") { e.preventDefault(); const prev = FIELD_ORDER[idx - 1]; if (prev) focusField(prev); return; }
    if (e.key === "ArrowLeft" && e.altKey) { e.preventDefault(); const prev = FIELD_ORDER[idx - 1]; if (prev) focusField(prev); return; }
    if (e.key === "Tab") { setShowDropdown(false); }
    if (e.key === "Enter" && currentField !== "name") { e.preventDefault(); onCommit(); }
    if (e.key === "Enter" && currentField === "name" && !showDropdown) { e.preventDefault(); onCommit(); }
  };

  return (
    <div
      ref={rowRef}
      className="border-t-2 relative flex-shrink-0"
      style={{ background: "var(--color-lab-light)", borderColor: "var(--color-lab)" }}
      onBlur={handleRowBlur}
    >
      {showDropdown && dropdownItems.length > 0 && (
        <div className="rounded-lg shadow-xl overflow-hidden"
          style={{ ...dropdownStyle, background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
          <div className="max-h-72 overflow-y-auto">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider sticky top-0"
              style={{ color: "var(--color-text-muted)", background: "var(--color-primary-muted)" }}>
              {query === "" ? "Common Lab Tests" : "Search Results"}
            </div>
            {dropdownItems.map((test, i) => (
              <div key={test} onMouseDown={() => handleSelectTest(test)}
                className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2"
                style={{ borderBottom: "1px solid var(--color-border)", background: highlightedIdx === i ? "var(--color-lab-light)" : "transparent" }}
                onMouseEnter={() => setHighlightedIdx(i)} onMouseLeave={() => setHighlightedIdx(-1)}>
                {query === "" ? <TestTube size={14} style={{ color: "var(--color-lab)" }} /> : <Search size={12} style={{ color: "var(--color-primary)" }} />}
                <span style={{ color: "var(--color-text-base)" }}>{test}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center p-2 gap-2">
        <div className="w-16 px-2 text-center">
          <span className="text-sm font-bold" style={{ color: "var(--color-lab)" }}>New</span>
        </div>
        <div className="flex-1 relative" ref={wrapperRef}>
          <FlaskConical size={14} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-lab)" }} />
          <input data-field="name" ref={inputRef} value={query}
            onChange={e => { setQuery(e.target.value); onDraftChange("name")(e.target.value); setShowDropdown(true); setHighlightedIdx(-1); }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={e => handleFieldKeyDown(e, "name")}
            placeholder="Search or select lab test..."
            className="w-full pl-7 pr-8 py-1.5 rounded text-sm font-medium"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-lab)" }} />
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: "var(--color-text-muted)" }}
            onMouseDown={(e) => { e.preventDefault(); setShowDropdown(v => !v); }} />
        </div>
       <div className="w-48">
  <TypableDetailInput
    value={draft.detail}
    onChange={e => onDraftChange("detail")(e.target.value)}
    onKeyDown={e => handleFieldKeyDown(e, "detail")}
  />
</div>
        <div className="w-28 flex gap-1 justify-center">
          <button data-field="commit" onClick={onCommit} onKeyDown={e => handleFieldKeyDown(e, "commit")}
            className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
            style={{ background: "var(--color-lab)", color: "white" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#92400e"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lab)"}
            title="Add Lab Test (Enter)"><Plus size={16} /></button>
          <button onClick={onCancel}
            className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
            style={{ background: "#fee2e2", color: "var(--color-danger)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
            title="Cancel (Esc)"><X size={16} /></button>
        </div>
      </div>

      {/* <div className="px-3 pb-1.5 flex gap-4 flex-wrap" style={{ fontSize: "0.65rem", color: "var(--color-text-muted)" }}>
        <span><kbd className="px-1 py-0.5 rounded text-[0.6rem]" style={{ background: "var(--color-border)" }}>Tab</kbd> next field</span>
        <span><kbd className="px-1 py-0.5 rounded text-[0.6rem]" style={{ background: "var(--color-border)" }}>↑↓</kbd> browse list</span>
        <span><kbd className="px-1 py-0.5 rounded text-[0.6rem]" style={{ background: "var(--color-border)" }}>Enter</kbd> select / save</span>
        <span><kbd className="px-1 py-0.5 rounded text-[0.6rem]" style={{ background: "var(--color-border)" }}>Esc</kbd> cancel</span>
        <span><kbd className="px-1 py-0.5 rounded text-[0.6rem]" style={{ background: "var(--color-border)" }}>Alt+→/←</kbd> jump columns</span>
      </div> */}
    </div>
  );
}

/* ═══════════════════════════════════════════════ MAIN LAB TAB COMPONENT ═══════════════════ */
const EMPTY_DRAFT = { name: "", detail: "—" };

export default function LabTab({ labs, setLabs, patient }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(false);

  const suggestions = query.length > 1
    ? LAB_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const setD = (k) => (v) => setDraft(prev => ({ ...prev, [k]: v }));

  const commitDraft = () => {
    if (!draft.name.trim()) return;
    if (editId !== null) {
      setLabs(prev => prev.map(l => l.id === editId ? { ...l, ...draft } : l));
      setEditId(null);
    } else {
      setLabs(prev => [...prev, { id: Date.now(), ...draft }]);
    }
    setDraft(EMPTY_DRAFT);
    setQuery("");
    setShowAddRow(false);
  };

  const cancelAdd = () => {
    setShowAddRow(false);
    setDraft(EMPTY_DRAFT);
    setQuery("");
    setEditId(null);
  };

  const startEdit = (lab) => {
    setEditId(lab.id);
    setDraft({ name: lab.name, detail: lab.detail });
    setQuery(lab.name);
    setShowAddRow(true);
  };

  const toggleStrike = (id) => {
    setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all lab tests?")) {
      setLabs([]);
      setStruckIds([]);
    }
  };

  const handleSave = () => alert("Lab tests saved successfully!");
  const handleProto = () => alert("Proto feature coming soon!");

  const docNo = patient?.docNo ? `${patient.docNo.replace("OP:", "").trim()}: OP-LP` : "—";
  const docDt = patient?.docDate?.split(" ")[0] || "—";

  const addRowProps = { draft, onDraftChange: setD, onCommit: commitDraft, onCancel: cancelAdd, query, setQuery, suggestions };

  return (
    // ── OUTER WRAPPER: fixed height, flex column ──
    <div
      className="flex flex-col rounded-lg overflow-hidden shadow-lg"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        height: "100%",
        minHeight: "300px",
      }}
    >

      {/* ── HEADER: fixed, never scrolls ── */}
      <div
        className="flex-shrink-0 border-b"
        style={{ background: "linear-gradient(135deg, var(--color-lab-light) 0%, var(--color-surface) 100%)", borderColor: "var(--color-border)" }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical size={18} style={{ color: "var(--color-lab)" }} />
            <h2 className="text-base font-extrabold" style={{ color: "var(--color-lab)" }}>Lab Investigations</h2>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton variant="warning" icon={Trash} label="Clear" onClick={handleClearAll} />
            <ActionButton variant="success" icon={Save} label="Save" onClick={handleSave} />
          </div>
        </div>
        <ModernToolbar docNo={docNo} docDt={docDt} onProto={handleProto} />
      </div>

      {/* ── BODY: flex-1, consistent height ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Empty state (no labs, no add row) */}
        {labs.length === 0 && !showAddRow && (
          <div className="flex-1 flex flex-col items-center justify-center py-5">
            <div className="text-center">
              <div className="mb-2 p-4 rounded-full inline-flex" style={{ background: "var(--color-lab-light)" }}>
                <FlaskConical size={20} style={{ color: "var(--color-lab)" }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-base)" }}>No Lab Tests Ordered Yet</h3>
              <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>Click the button below to order lab investigations</p>
              <button
                onClick={() => setShowAddRow(true)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm mx-auto"
                style={{ background: "var(--color-lab)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#92400e"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lab)"}>
                <Plus size={16} /> Add New Test
              </button>
            </div>
          </div>
        )}

        {/* Empty state + add row: spacer pushes AddRow to bottom */}
        {labs.length === 0 && showAddRow && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1" />
            <AddRow {...addRowProps} />
          </div>
        )}

        {/* Table view (has labs) */}
        {labs.length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Table header — pinned */}
            <TableHeader />

            {/* Scrollable lab rows */}
            <div className="flex-1 overflow-y-auto">
              {labs.map((lab, index) => (
                <LabRow
                  key={lab.id}
                  lab={lab}
                  index={index}
                  isStruck={struckIds.includes(lab.id)}
                  onDelete={() => setLabs(prev => prev.filter(l => l.id !== lab.id))}
                  onStrike={() => toggleStrike(lab.id)}
                  onEdit={() => startEdit(lab)}
                />
              ))}
            </div>

            {/* Add Row pinned below scroll area */}
            {showAddRow && <AddRow {...addRowProps} />}

            {/* Add Test button pinned at bottom */}
            {!showAddRow && (
              <div className="flex-shrink-0 flex justify-end px-4 py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                <button
                  onClick={() => setShowAddRow(true)}
                  className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                  style={{ background: "var(--color-lab)", color: "white" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#92400e"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lab)"}>
                  <Plus size={15} /> Add Test
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Footer bar */}
      <div className="flex-shrink-0 h-1" style={{ background: "linear-gradient(90deg, var(--color-lab) 0%, var(--color-primary) 50%, var(--color-drugs) 100%)", opacity: 0.3 }} />
    </div>
  );
}