import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Plus, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Clock, Calendar,
  Search, ChevronDown, BookOpen, Trash, User,
  Stethoscope, Pill, Activity
} from "lucide-react";

/* ── Burgundy theme tokens (scoped to this tab) ── */
const BURGUNDY = "#8e2a4c";        // main accent (was --color-warning)
const BURGUNDY_DARK = "#6e1f3a";   // hover / pressed (was #d97706)
const BURGUNDY_LIGHT = "#fbe7ee";  // tinted background (was #fef3e2)
const BURGUNDY_LIGHTER = "#f5cdda"; // hover tint (was #fde68a)

const IP_SUBJECT_OPTIONS = [
  "General Check",
  "Vital Signs Monitoring",
  "Medication Administration",
  "Wound Dressing",
  "IV Fluids",
  "Blood Transfusion",
  "Lab Tests",
  "Consultation",
  "Emergency Care",
  "Discharge Planning"
];

// Sorted subject options
const SORTED_IP_SUBJECT_OPTIONS = [...IP_SUBJECT_OPTIONS].sort((a, b) => a.localeCompare(b));

const IP_ADVICE_OPTIONS = [
  "Bed Rest",
  "Monitor Vital Signs",
  "Administer Medication",
  "Change Dressing",
  "Monitor I/O Chart",
  "Physiotherapy",
  "Dietary Consultation",
  "Psychological Support",
  "Follow-up Schedule",
  "Referral to Specialist"
];

const SORTED_IP_ADVICE_OPTIONS = [...IP_ADVICE_OPTIONS].sort((a, b) => a.localeCompare(b));

const NURSE_OPTIONS = [
  "Nurse Sarah",
  "Nurse Priya",
  "Nurse Rajesh",
  "Nurse Anitha",
  "Nurse Kumar",
  "Nurse Meena",
  "Nurse Lakshmi"
];

const SORTED_NURSE_OPTIONS = [...NURSE_OPTIONS].sort((a, b) => a.localeCompare(b));

const IP_TREATMENT_OPTIONS = [
  "Antibiotics",
  "Pain Management",
  "IV Therapy",
  "Oxygen Therapy",
  "Physical Therapy",
  "Wound Care",
  "Dietary Management",
  "Blood Pressure Management",
  "Diabetic Care",
  "Respiratory Therapy"
];

const SORTED_IP_TREATMENT_OPTIONS = [...IP_TREATMENT_OPTIONS].sort((a, b) => a.localeCompare(b));

const FIELD_ORDER = ["subject", "advice", "nurse", "treatment", "commit"];

// ── Action Button Component ──
function ActionButton({ onClick, variant = "primary", icon: Icon, label, disabled = false }) {
  const variants = {
    primary: { bg: "var(--color-primary)", color: "white", hoverBg: "var(--color-primary-light)" },
    success: { bg: BURGUNDY, color: "white", hoverBg: BURGUNDY_DARK },
    danger: { bg: "var(--color-danger)", color: "white", hoverBg: "#b91c1c" },
    warning: { bg: BURGUNDY, color: "white", hoverBg: BURGUNDY_DARK },
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

// ── Modern Toolbar Component ──
function ModernToolbar({ onProto, searchMode, onSearchModeChange }) {
  return (
    <div className="flex items-center justify-between p-2 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-3">
        {[{ value: "alpha", label: "Alphabet" }, { value: "embedded", label: "Embedded" }].map(({ value, label }) => {
          const checked = searchMode === value;
          return (
            <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none"
              style={{ fontSize: "0.72rem", fontWeight: checked ? "700" : "500", color: checked ? BURGUNDY : "var(--color-text-muted)" }}>
              <span onClick={() => onSearchModeChange(value)} className="flex items-center justify-center rounded transition-all"
                style={{ width: 15, height: 15, flexShrink: 0, cursor: "pointer",
                  border: `2px solid ${checked ? BURGUNDY : "var(--color-border)"}`,
                  background: checked ? BURGUNDY : "var(--color-surface)" }}>
                {checked && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <polyline points="1.5,4.5 3.5,7 7.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span onClick={() => onSearchModeChange(value)}>{label}</span>
            </label>
          );
        })}
      </div>
      <div className="flex gap-2">
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

// ── Add Table Header ──
function AddTableHeader() {
  const columns = [
    { label: "S.No", width: "w-12", center: true },
    { label: "IP Subject", grow: true },
    { label: "IP Advice", grow: true },
    { label: "Nurse", grow: true },
    { label: "IP Treatment", grow: true },
  ];
  return (
    <div className="flex items-center border-b flex-shrink-0 gap-3 px-2" style={{ background: BURGUNDY, borderColor: BURGUNDY_DARK }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.grow ? "flex-1" : col.width} px-2 py-2 ${col.center ? 'text-center' : ''}`}
          style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>
          {col.label}
        </div>
      ))}
      <div className="w-20 px-2 py-2 text-center flex-shrink-0"
        style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>
        Actions
      </div>
    </div>
  );
}

// ── Added IP Table Header ──
function TableHeader() {
  const columns = [
    { label: "S.No", width: "w-16" },
    { label: "Date-Time", grow: true },
    { label: "IP Subject", grow: true },
    { label: "IP Advice", grow: true },
    { label: "Nurse", grow: true },
    { label: "IP Treatment", grow: true },
  ];
  return (
    <div className="flex items-center border-b flex-shrink-0 gap-3 px-2" style={{ background: BURGUNDY_LIGHT, borderColor: "var(--color-border)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.grow ? "flex-1" : col.width} px-3 py-2.5`}
          style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: BURGUNDY }}>
          {col.label}
        </div>
      ))}
      <div className="w-28 px-3 py-2.5 text-center flex-shrink-0"
        style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: BURGUNDY }}>
        Actions
      </div>
    </div>
  );
}

// ── IP Row Component ──
function IPRow({ item, index, isStruck, isSelected, onSelect, onDelete, onStrike, onEdit, onArrowNav }) {
  return (
    <div
      tabIndex={0}
      data-row-id={item.id}
      onClick={onSelect}
      onFocus={onSelect}
      onKeyDown={e => {
        if (e.altKey && (e.key === "e" || e.key === "E")) { e.preventDefault(); onEdit(); return; }
        if (e.altKey && (e.key === "Delete" || e.key === "Backspace")) { e.preventDefault(); onDelete(); return; }
        if (e.key === "ArrowDown") { e.preventDefault(); onArrowNav?.("down"); return; }
        if (e.key === "ArrowUp")   { e.preventDefault(); onArrowNav?.("up");   return; }
      }}
      className="flex items-center border-b transition-all duration-150 outline-none cursor-pointer gap-3 px-2"
      style={{
        borderColor: "var(--color-border)",
        background: isSelected
          ? BURGUNDY_LIGHT
          : isStruck
            ? "var(--color-surface-alt)"
            : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1,
        boxShadow: isSelected ? `inset 0 0 0 2px ${BURGUNDY}` : "none",
      }}
    >
      <div className="w-16 px-3 py-2 text-center flex-shrink-0">
        <span className="text-sm font-bold" style={{ color: BURGUNDY }}>{index + 1}</span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className="text-xs font-mono flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
          <Clock size={10} />
          {item.dateTime || "—"}
        </span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className={`text-sm font-medium ${isStruck ? "line-through" : ""}`} style={{ color: "var(--color-text-base)" }}>
          {item.subject}
        </span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className="text-sm" style={{ color: "var(--color-text-base)" }}>{item.advice}</span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
          style={{ background: BURGUNDY_LIGHT, color: BURGUNDY_DARK }}>
          <User size={10} />
          {item.nurse}
        </span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className="text-sm" style={{ color: "var(--color-text-base)" }}>{item.treatment}</span>
      </div>
      <div className="w-28 px-2 py-2 flex items-center justify-center gap-1.5 flex-shrink-0">
        <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded transition-all" title="Edit (Alt+E)"
          style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary-muted)"}>
          <Edit2 size={14} />
        </button>
        <button onClick={e => { e.stopPropagation(); onStrike(); }} className="p-1.5 rounded transition-all" title={isStruck ? "Undo Strike (S)" : "Strike (S)"}
          style={{ background: BURGUNDY_LIGHT, color: BURGUNDY }}
          onMouseEnter={(e) => e.currentTarget.style.background = BURGUNDY_LIGHTER}
          onMouseLeave={(e) => e.currentTarget.style.background = BURGUNDY_LIGHT}>
          {isStruck ? <RotateCcw size={14} /> : <MinusCircle size={14} />}
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded transition-all" title="Delete (Alt+Del)"
          style={{ background: "#fee2e2", color: "var(--color-danger)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Typable Select/Input Component ──
function TypableSelect({ options, sortedOptions, value, onChange, placeholder, dataField, onKeyDown, searchMode }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const inputRef = useRef(null);
  const anchorRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Use sorted or original based on searchMode
  const displayOptions = searchMode === "alpha" ? sortedOptions : options;

  const filteredOptions = displayOptions.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recalcDropdown = useCallback(() => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
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

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm("");
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showDropdown && filteredOptions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, filteredOptions.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); handleSelect(filteredOptions[highlightedIdx]); return; }
      if (e.key === "Escape") { setShowDropdown(false); setHighlightedIdx(-1); return; }
    }
    if (e.key === "Enter" && !showDropdown) {
      e.preventDefault();
      if (searchTerm.trim()) {
        onChange(searchTerm);
        setSearchTerm("");
      }
    }
    onKeyDown?.(e);
  };

  return (
    <div ref={anchorRef} className="relative w-full">
      <input
        ref={inputRef}
        data-field={dataField}
        type="text"
        value={searchTerm || value || ""}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
          setHighlightedIdx(-1);
        }}
        onFocus={() => { recalcDropdown(); setShowDropdown(true); }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => { setShowDropdown(false); setSearchTerm(""); }, 200)}
        placeholder={placeholder}
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
                onMouseDown={() => handleSelect(opt)}
                className="px-3 py-2 cursor-pointer text-sm transition-colors"
                style={{ background: highlightedIdx === i ? BURGUNDY_LIGHT : "transparent" }}
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

// ── Add Row Component ──
const AddRow = React.forwardRef(({
  draft, onDraftChange, onCommit, onCancel, rowNumber, searchMode
}, ref) => {
  const rowRef = useRef(null);

  React.useImperativeHandle(ref, () => ({
    focusFirst: () => {
      const el = rowRef.current?.querySelector('[data-field="subject"]');
      if (el) el.focus();
    }
  }));

  const handleFieldKeyDown = (e, currentField) => {
    if (e.key === "Escape") { onCancel(); return; }

    const fields = ["subject", "advice", "nurse", "treatment", "commit"];
    const idx = fields.indexOf(currentField);

    if (e.key === "ArrowRight" || e.key === "Enter") {
      e.preventDefault();
      if (idx < fields.length - 1) {
        const nextField = rowRef.current?.querySelector(`[data-field="${fields[idx + 1]}"]`);
        if (nextField) nextField.focus();
      } else if (e.key === "Enter") {
        onCommit();
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) {
        const prevField = rowRef.current?.querySelector(`[data-field="${fields[idx - 1]}"]`);
        if (prevField) prevField.focus();
      }
      return;
    }
  };

  return (
    <div
      ref={rowRef}
      data-add-row="true"
      className="flex items-stretch border-b relative gap-3 px-2"
      style={{ background: BURGUNDY_LIGHT, borderColor: BURGUNDY }}
    >
      {/* S.No */}
      <div className="w-12 px-2 py-2 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold" style={{ color: BURGUNDY }}>{rowNumber}</span>
      </div>

      {/* IP Subject */}
      <div className="flex-1 px-1 py-1.5 flex items-center">
        <TypableSelect
          dataField="subject"
          value={draft.subject}
          options={IP_SUBJECT_OPTIONS}
          sortedOptions={SORTED_IP_SUBJECT_OPTIONS}
          onChange={(v) => onDraftChange("subject")(v)}
          placeholder="Select subject..."
          onKeyDown={(e) => handleFieldKeyDown(e, "subject")}
          searchMode={searchMode}
        />
      </div>

      {/* IP Advice */}
      <div className="flex-1 px-1 py-1.5 flex items-center">
        <TypableSelect
          dataField="advice"
          value={draft.advice}
          options={IP_ADVICE_OPTIONS}
          sortedOptions={SORTED_IP_ADVICE_OPTIONS}
          onChange={(v) => onDraftChange("advice")(v)}
          placeholder="Select advice..."
          onKeyDown={(e) => handleFieldKeyDown(e, "advice")}
          searchMode={searchMode}
        />
      </div>

      {/* Nurse */}
      <div className="flex-1 px-1 py-1.5 flex items-center">
        <TypableSelect
          dataField="nurse"
          value={draft.nurse}
          options={NURSE_OPTIONS}
          sortedOptions={SORTED_NURSE_OPTIONS}
          onChange={(v) => onDraftChange("nurse")(v)}
          placeholder="Select nurse..."
          onKeyDown={(e) => handleFieldKeyDown(e, "nurse")}
          searchMode={searchMode}
        />
      </div>

      {/* IP Treatment */}
      <div className="flex-1 px-1 py-1.5 flex items-center">
        <TypableSelect
          dataField="treatment"
          value={draft.treatment}
          options={IP_TREATMENT_OPTIONS}
          sortedOptions={SORTED_IP_TREATMENT_OPTIONS}
          onChange={(v) => onDraftChange("treatment")(v)}
          placeholder="Select treatment..."
          onKeyDown={(e) => handleFieldKeyDown(e, "treatment")}
          searchMode={searchMode}
        />
      </div>

      {/* Actions — pinned to the right */}
      <div className="w-20 flex-shrink-0 px-1 py-1.5 flex gap-1 items-center justify-center">
        <button
          data-field="commit"
          onClick={onCommit}
          onKeyDown={(e) => handleFieldKeyDown(e, "commit")}
          className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
          style={{ background: BURGUNDY, color: "white" }}
          onMouseEnter={(e) => e.currentTarget.style.background = BURGUNDY_DARK}
          onMouseLeave={(e) => e.currentTarget.style.background = BURGUNDY}
          title="Add IP Entry (Enter)">
          <Plus size={16} />
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
          style={{ background: "#fee2e2", color: "var(--color-danger)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
          title="Cancel (Esc)">
          <X size={16} />
        </button>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════ MAIN IP TIME SHEET TAB ═══════════════════ */
const EMPTY_DRAFT = { subject: "", advice: "", nurse: "", treatment: "" };

export default function IPTimeSheetTab({ entries, setEntries, patient }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [searchMode, setSearchMode] = useState("alpha");

  const addRowRef = useRef(null);
  const addTableWrapperRef = useRef(null);
  const addedTableWrapperRef = useRef(null);

  const setD = (k) => (v) => setDraft(prev => ({ ...prev, [k]: v }));

  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;
  };

  const commitDraft = () => {
    if (!draft.subject.trim()) return;

    const newEntry = {
      id: Date.now(),
      dateTime: getCurrentDateTime(),
      subject: draft.subject,
      advice: draft.advice || "—",
      nurse: draft.nurse || "—",
      treatment: draft.treatment || "—",
    };

    if (editId !== null) {
      setEntries(prev => prev.map(e => e.id === editId ? { ...e, ...newEntry } : e));
      setEditId(null);
    } else {
      setEntries(prev => [...prev, newEntry]);
    }

    setDraft(EMPTY_DRAFT);
    setShowAddRow(false);
    setTimeout(() => {
      setDraft(EMPTY_DRAFT);
      setShowAddRow(true);
      setTimeout(() => addRowRef.current?.focusFirst(), 100);
    }, 50);
  };

  const cancelAdd = () => {
    setShowAddRow(false);
    setDraft(EMPTY_DRAFT);
    setEditId(null);
  };

  const startEdit = (entry) => {
    setEditId(entry.id);
    setDraft({
      subject: entry.subject,
      advice: entry.advice,
      nurse: entry.nurse,
      treatment: entry.treatment
    });
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusFirst(), 50);
  };

  const toggleStrike = (id) => {
    setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setStruckIds(prev => prev.filter(x => x !== id));
    if (selectedRowId === id) setSelectedRowId(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all IP entries?")) {
      setEntries([]);
      setStruckIds([]);
      setShowAddRow(false);
      setSelectedRowId(null);
    }
  };

  const handleSave = () => alert("IP Time sheet saved successfully!");
  const handleProto = () => alert("Proto feature coming soon!");

  const handleAddNewEntry = () => {
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusFirst(), 100);
  };

  const handleRowArrowNav = useCallback((currentId, direction) => {
    const idx = entries.findIndex(e => e.id === currentId);
    let nextIdx = direction === "down" ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= entries.length) return;
    const nextId = entries[nextIdx].id;
    setSelectedRowId(nextId);
    const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${nextId}"]`);
    if (row) row.focus();
  }, [entries]);

  // Alt+T to toggle between tables
  useEffect(() => {
    const handler = (e) => {
      if (!e.altKey || (e.key !== "t" && e.key !== "T")) return;
      e.preventDefault();
      const activeEl = document.activeElement;
      const inAddTable = activeEl?.closest('[data-add-row="true"]');
      if (inAddTable) {
        const targetId = selectedRowId ?? entries[0]?.id;
        if (targetId != null) {
          const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${targetId}"]`);
          if (row) { row.focus(); setSelectedRowId(targetId); }
        }
      } else {
        if (showAddRow && addRowRef.current) addRowRef.current.focusFirst();
        else handleAddNewEntry();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entries, selectedRowId, showAddRow]);

  const addRowProps = {
    draft, onDraftChange: setD, onCommit: commitDraft, onCancel: cancelAdd,
    rowNumber: entries.length + 1, searchMode,
  };

  return (
    <div
      className="flex flex-col rounded-xs overflow-hidden shadow-lg"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        height: "100%",
        minHeight: "300px",
      }}
    >
      {/* HEADER */}
      <div
        className="flex-shrink-0 border-b"
        style={{ background: `linear-gradient(135deg, ${BURGUNDY_LIGHT} 0%, var(--color-surface) 100%)`, borderColor: "var(--color-border)" }}
      >
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: BURGUNDY }} />
            <h2 className="lg:text-base md:text-xs font-light" style={{ color: BURGUNDY }}>
              IP Time Sheet
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[0.65rem] hidden lg:inline mr-2" style={{ color: "var(--color-text-subtle)" }}>
              Alt+T: switch tables · Alt+E: edit row · Alt+Del: delete row
            </span>
            <ActionButton variant="warning" icon={Trash} label="Clear" onClick={handleClearAll} />
            <ActionButton variant="success" icon={Save} label="Save" onClick={handleSave} />
          </div>
        </div>
        <ModernToolbar 
          onProto={handleProto} 
          searchMode={searchMode} 
          onSearchModeChange={setSearchMode} 
        />
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── ADD IP TABLE ── */}
        <div ref={addTableWrapperRef} className="flex-shrink-0">
          <AddTableHeader />
          {showAddRow ? (
            <AddRow ref={addRowRef} {...addRowProps} />
          ) : (
            <div className="flex items-center justify-center py-3 border-b cursor-pointer transition-all"
              style={{ background: BURGUNDY_LIGHT, borderColor: BURGUNDY }}
              onClick={handleAddNewEntry}>
              <button className="px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                style={{ background: BURGUNDY, color: "white" }}>
                <Plus size={14} /> Add IP Entry
              </button>
            </div>
          )}
        </div>

        {/* ── ADDED IP TABLE ── */}
        <div ref={addedTableWrapperRef} className="flex-1 flex flex-col overflow-hidden mt-6">
          {entries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-5">
              <div className="text-center">
                <div className="mb-2 p-4 rounded-full inline-flex" style={{ background: BURGUNDY_LIGHT }}>
                  <Clock size={20} style={{ color: BURGUNDY }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-base)" }}>No IP Entries Yet</h3>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Use the table above to add your first IP entry.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 pb-2">
                <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-subtle)" }}>
                  Added IP Entries ({entries.length})
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
              </div>
              <TableHeader />
              <div className="overflow-y-auto">
                {entries.map((entry, index) => (
                  <IPRow
                    key={entry.id}
                    item={entry}
                    index={index}
                    isStruck={struckIds.includes(entry.id)}
                    isSelected={selectedRowId === entry.id}
                    onSelect={() => setSelectedRowId(entry.id)}
                    onDelete={() => deleteEntry(entry.id)}
                    onStrike={() => toggleStrike(entry.id)}
                    onEdit={() => startEdit(entry)}
                    onArrowNav={dir => handleRowArrowNav(entry.id, dir)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="flex-shrink-0 h-1"
        style={{ background: `linear-gradient(90deg, ${BURGUNDY} 0%, var(--color-primary) 50%, var(--color-drugs) 100%)`, opacity: 0.3 }}
      />
    </div>
  );
}