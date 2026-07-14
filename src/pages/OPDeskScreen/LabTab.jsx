import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Plus, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  FlaskConical, Search, ChevronDown, Microscope,
  BookOpen, Trash, FolderOpen, List
} from "lucide-react";
import { LAB_SUGGESTIONS } from "./mockData";
import useFillRowCount from "../../hooks/useFillRowCount";

const DETAIL_OPTIONS = ["—","Empty Stomach","1Hr. After Food","Any Time","Fasting","Random","Early Morning","Immediately"];

const SORTED_LAB_SUGGESTIONS = [...LAB_SUGGESTIONS].sort((a, b) => a.localeCompare(b));

/* ═══ Grid column templates ═══ */
// "Add new test" row: S.No | Name | Remarks | Actions
const ADD_GRID = "48px minmax(0,1fr) 180px 100px";
// LEFT panel (order list): S.No | Name | Remarks | Actions
const LEFT_GRID = "64px minmax(0,1fr) 192px 112px";

/* Fixed row height (px) used to compute how many blank rows fill the remaining
   visible space in the added-tests grid — see useFillRowCount. */
const ROW_HEIGHT_PX = 45;

// ── Lab Test Groups ──
const LAB_GROUPS = [
  {
    name: "Hematology",
    icon: "🩸",
    tests: [
      "Complete Blood Count (CBC)",
      "ESR",
      "CRP",
      "Blood Culture"
    ]
  },
  {
    name: "Biochemistry",
    icon: "🧪",
    tests: [
      "Blood Sugar Fasting",
      "Blood Sugar PP",
      "HbA1c",
      "Lipid Profile",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Vitamin D Total",
      "Vitamin B12",
      "Ferritin",
      "Iron Studies"
    ]
  },
  {
    name: "Serology & Immunology",
    icon: "🔬",
    tests: [
      "Thyroid Profile (T3,T4,TSH)",
      "Dengue NS1 Antigen",
      "Malaria Antigen Test",
      "Widal Test",
      "HIV Screening"
    ]
  },
  {
    name: "Urine & Others",
    icon: "💧",
    tests: [
      "Urine Routine"
    ]
  }
];

// ── Additional Individual Lab Tests (not in any group) ──
const INDIVIDUAL_LAB_TESTS = [
  "Arterial Blood Gas (ABG)",
  "Blood Urea Nitrogen (BUN)",
  "Creatinine",
  "Serum Electrolytes (Na, K, Cl)",
  "Calcium (Serum)",
  "Phosphorus (Serum)",
  "Magnesium (Serum)",
  "Amylase",
  "Lipase",
  "Uric Acid",
  "Lactate Dehydrogenase (LDH)",
  "Creatine Kinase (CK-MB)",
  "Troponin I",
  "Procalcitonin",
  "NT-proBNP",
  "Cortisol",
  "Growth Hormone",
  "Progesterone",
  "Testosterone",
  "Estradiol",
  "FSH",
  "LH",
  "Prolactin",
  "CA-125",
  "CEA",
  "AFP",
  "CA 19-9",
  "PSA (Total)",
  "Sputum Culture",
  "Stool Routine",
  "Semen Analysis"
];

const getAllGroupTests = () => {
  const allTests = [];
  LAB_GROUPS.forEach(group => {
    group.tests.forEach(test => {
      allTests.push(test);
    });
  });
  return allTests;
};

const ALL_GROUP_TESTS = new Set(getAllGroupTests());

const ALL_LAB_SUGGESTIONS = [...LAB_SUGGESTIONS, ...INDIVIDUAL_LAB_TESTS];

const getIndividualTests = () => {
  return ALL_LAB_SUGGESTIONS.filter(test => !ALL_GROUP_TESTS.has(test));
};

const INDIVIDUAL_TESTS = getIndividualTests();

const SORTED_ALL_LAB_SUGGESTIONS = [...ALL_LAB_SUGGESTIONS].sort((a, b) => a.localeCompare(b));

const FIELD_ORDER = ["name", "detail", "commit"];

/* ── Action Button Component ── */
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

/* ── Search-mode checkboxes (Alphabet / Embedded) — sits above the add row ── */
function SearchModeToggle({ searchMode, onSearchModeChange }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 flex-shrink-0 border-t"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <span className="text-[0.72rem] font-semibold" style={{ color: "var(--color-text-base)" }}>Search:</span>
      {[{ value: "alpha", label: "Alphabet" }, { value: "embedded", label: "Embedded" }].map(({ value, label }) => {
        const checked = searchMode === value;
        return (
          <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none"
            style={{ fontSize: "0.72rem", fontWeight: checked ? "700" : "500", color: checked ? "var(--color-lab)" : "var(--color-text-muted)" }}>
            <span onClick={() => onSearchModeChange(value)} className="flex items-center justify-center rounded transition-all"
              style={{ width: 15, height: 15, flexShrink: 0, cursor: "pointer",
                border: `2px solid ${checked ? "var(--color-lab)" : "var(--color-border)"}`,
                background: checked ? "var(--color-lab)" : "var(--color-surface)" }}>
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
  );
}

/* ── Modern Toolbar Component ── */
function ModernToolbar({ onProto, onClear, onSave }) {
  return (
    <div className="flex items-center justify-end p-2 border-b flex-shrink-0" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", height: "45px", boxSizing: "border-box" }}>
      <div className="flex items-center gap-2">
        <ActionButton variant="ghost" icon={Clipboard} label="Paste" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={BookOpen} label="Proto" onClick={onProto} />
        <ActionButton variant="ghost" icon={FileText} label="Preview" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={Printer} label="Print" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="warning" icon={Trash} label="Clear" onClick={onClear} />
        <ActionButton variant="success" icon={Save} label="Save" onClick={onSave} />
      </div>
    </div>
  );
}

/* ── Portal Dropdown ── */
function PortalDropdown({ anchorEl, open, children }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!open || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setStyle({
      position: "fixed",
      top: rect.bottom + 2,
      left: rect.left,
      width: rect.width,
      maxHeight: spaceBelow - 8,
      zIndex: 99999,
    });
  }, [open, anchorEl]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div style={{ ...style, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", overflowY: "auto" }}>
      {children}
    </div>,
    document.body
  );
}

/* ── Add Table Header (grid: S.No | Name | Remarks | Actions) ── */
function AddTableHeader() {
  return (
    <div className="grid border-b flex-shrink-0" style={{ gridTemplateColumns: ADD_GRID, background: "var(--color-lab)", borderColor: "var(--color-lab)" }}>
      <div className="px-2 py-2 text-center" style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>S.No</div>
      <div className="px-2 py-2" style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>Name</div>
      <div className="px-2 py-2" style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>Remarks</div>
      <div className="px-2 py-2 text-center" style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>Actions</div>
    </div>
  );
}

/* ── LEFT (order list) table header — S.No | Name | Remarks | Actions ── */
function OrderTableHeader() {
  return (
    <div className="grid border-b flex-shrink-0" style={{ gridTemplateColumns: LEFT_GRID, background: "var(--color-lab-light)", borderColor: "var(--color-border)" }}>
      <div className="px-3 py-2.5" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>S.No</div>
      <div className="px-3 py-2.5" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>Name</div>
      <div className="px-3 py-2.5" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>Remarks</div>
      <div className="px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>Actions</div>
    </div>
  );
}

/* ── Empty placeholder row (left order list) — shown when no tests added yet ── */
function EmptyLabRow({ index }) {
  return (
    <div
      className="grid border-b"
      style={{ gridTemplateColumns: LEFT_GRID, borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)" }}
    >
      <div className="px-3 py-2 text-center">&nbsp;</div>
      <div className="px-3 py-2 min-w-0">&nbsp;</div>
      <div className="px-3 py-2">&nbsp;</div>
      <div className="px-2 py-2 text-center">&nbsp;</div>
    </div>
  );
}

/* ── LEFT (order list) row ── */
function LabRow({ lab, index, isStruck, isSelected, onSelect, onDelete, onStrike, onEdit, onArrowNav }) {
  return (
    <div
      tabIndex={0}
      data-row-id={lab.id}
      onClick={onSelect}
      onFocus={onSelect}
      onKeyDown={e => {
        if (e.altKey && (e.key === "e" || e.key === "E")) { e.preventDefault(); onEdit(); return; }
        if (e.altKey && (e.key === "Delete" || e.key === "Backspace")) { e.preventDefault(); onDelete(); return; }
        if (e.key === "ArrowDown") { e.preventDefault(); onArrowNav?.("down"); return; }
        if (e.key === "ArrowUp")   { e.preventDefault(); onArrowNav?.("up");   return; }
      }}
      className="grid border-b transition-all duration-150 outline-none cursor-pointer"
      style={{
        gridTemplateColumns: LEFT_GRID,
        borderColor: "var(--color-border)",
        background: isSelected
          ? "var(--color-lab-light)"
          : isStruck
            ? "var(--color-surface-alt)"
            : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1,
        boxShadow: isSelected ? "inset 0 0 0 2px var(--color-lab)" : "none",
      }}
    >
      <div className="px-3 py-2 text-center">
        <span className="text-sm font-bold" style={{ color: "var(--color-lab)" }}>{index + 1}</span>
      </div>
      <div className="px-3 py-2 min-w-0">
        <span className={`text-sm font-semibold ${isStruck ? "line-through" : ""}`} style={{ color: "var(--color-text-base)" }}>
          {lab.name}
        </span>
      </div>
      <div className="px-3 py-2">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{lab.detail === "—" ? "—" : lab.detail}</span>
      </div>
      <div className="px-2 py-2 flex items-center justify-center gap-1.5">
        <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded transition-all" title="Edit (Alt+E)"
          style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary-muted)"}>
          <Edit2 size={14} />
        </button>
        <button onClick={e => { e.stopPropagation(); onStrike(); }} className="p-1.5 rounded transition-all" title={isStruck ? "Undo Strike (S)" : "Strike (S)"}
          style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fde68a"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lab-light)"}>
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

/* ── Typable Detail Input ── */
function TypableDetailInput({ value, onChange, onKeyDown, dataField }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const inputRef = useRef(null);
  const anchorRef = useRef(null);

  const detailOptions = DETAIL_OPTIONS.filter(opt => opt !== "—");
  const filteredOptions = detailOptions.filter(opt =>
    opt.toLowerCase().includes((value === "—" ? "" : value).toLowerCase())
  );

  const handleSelectOption = option => {
    onChange({ target: { value: option } });
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = e => {
    if (showDropdown && filteredOptions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, filteredOptions.length - 1)); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); handleSelectOption(filteredOptions[highlightedIdx]); return; }
      if (e.key === "Escape") { setShowDropdown(false); setHighlightedIdx(-1); return; }
    }
    onKeyDown?.(e);
  };

  return (
    <div ref={anchorRef} className="relative w-full">
      <input
        data-field={dataField}
        ref={inputRef}
        type="text"
        value={value === "—" ? "" : value}
        onChange={onChange}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder="Type or select instructions..."
        className="w-full px-2 py-1.5 rounded text-sm outline-none"
        style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
      />
      <PortalDropdown anchorEl={anchorRef.current} open={showDropdown && filteredOptions.length > 0}>
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
      </PortalDropdown>
    </div>
  );
}

/* ── Add Row Component — grid mirrors AddTableHeader ── */
const AddRow = React.forwardRef(({ 
  draft, onDraftChange, onCommit, query, setQuery, 
  suggestions, onCancel, rowNumber, searchMode 
}, ref) => {
  const inputRef = useRef(null);
  const rowRef = useRef(null);
  const nameWrapRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [testSelected, setTestSelected] = useState(() => !!query);

  React.useImperativeHandle(ref, () => ({
    focusName: () => inputRef.current?.focus(),
  }));

  useEffect(() => { setTestSelected(!!query.trim()); }, [query]);

  const baseList = searchMode === "embedded" ? ALL_LAB_SUGGESTIONS : SORTED_ALL_LAB_SUGGESTIONS;

  const getDropdownItems = () => {
    const flatTests = Array.from(new Set([...baseList, ...getAllGroupTests()]));
    const orderedTests = searchMode === "embedded"
      ? flatTests
      : [...flatTests].sort((a, b) => a.localeCompare(b));

    const filtered = query === ""
      ? orderedTests
      : orderedTests.filter(test => test.toLowerCase().includes(query.toLowerCase()));

    return filtered.map(test => ({ type: "test", label: test, icon: "🧪" }));
  };

  const dropdownItems = getDropdownItems();

  const handleSelectItem = (item) => {
    setQuery(item.label);
    onDraftChange("name")(item.label);
    setTestSelected(true);
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleClearTest = () => {
    setQuery("");
    onDraftChange("name")("");
    setTestSelected(false);
    setShowDropdown(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRowBlur = (e) => {
    if (rowRef.current && !rowRef.current.contains(e.relatedTarget)) {
      setShowDropdown(false);
      setHighlightedIdx(-1);
    }
  };

  const FIELD_ORDER_LOCAL = ["name", "detail", "commit"];

  const focusField = useCallback((fieldKey) => {
    const el = rowRef.current?.querySelector(`[data-field="${fieldKey}"]`);
    if (el) el.focus();
  }, []);

  const navigateField = useCallback((currentField, direction) => {
    const idx = FIELD_ORDER_LOCAL.indexOf(currentField);
    if (direction === "right" && idx < FIELD_ORDER_LOCAL.length - 1) focusField(FIELD_ORDER_LOCAL[idx + 1]);
    else if (direction === "left" && idx > 0) focusField(FIELD_ORDER_LOCAL[idx - 1]);
  }, [focusField]);

  const handleFieldKeyDown = (e, currentField) => {
    if (e.key === "Escape") { onCancel(); return; }

    if (currentField === "name" && showDropdown && dropdownItems.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, dropdownItems.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { 
        e.preventDefault(); 
        const item = dropdownItems[highlightedIdx];
        handleSelectItem(item);
        return; 
      }
    }

    if (e.key === "ArrowRight") { e.preventDefault(); navigateField(currentField, "right"); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); navigateField(currentField, "left"); return; }
    if (e.key === "Tab") setShowDropdown(false);
    if (e.key === "Enter" && currentField !== "name") { e.preventDefault(); onCommit(); }
    if (e.key === "Enter" && currentField === "name" && !showDropdown) { e.preventDefault(); onCommit(); }
  };

  return (
    <div
      ref={rowRef}
      data-add-row="true"
      className="grid items-stretch border-b relative"
      style={{ gridTemplateColumns: ADD_GRID, background: "var(--color-lab-light)", borderColor: "var(--color-lab)" }}
      onBlur={handleRowBlur}
    >
      {/* S.No */}
      <div className="px-2 py-2 flex items-center justify-center">
        <span className="text-sm font-semibold" style={{ color: "var(--color-lab)" }}>{rowNumber}</span>
      </div>

      {/* Name - with portal dropdown */}
      <div className="relative min-w-0 px-1 py-1.5 flex items-center" ref={nameWrapRef}>
        <FlaskConical size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-lab)" }} />
        <input
          data-field="name"
          ref={inputRef}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            onDraftChange("name")(e.target.value);
            setShowDropdown(true);
            setHighlightedIdx(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => { setShowDropdown(false); if (query.trim()) setTestSelected(true); }, 200)}
          onKeyDown={e => handleFieldKeyDown(e, "name")}
          placeholder="Search or select lab test (A–Z)..."
          className="w-full py-1.5 rounded text-sm font-medium"
          style={{
            border: testSelected ? "1.5px solid var(--color-lab)" : "1px solid var(--color-border)",
            background: testSelected ? "var(--color-lab-light)" : "var(--color-surface)",
            color: "var(--color-lab)",
            paddingLeft: "1.75rem",
            paddingRight: testSelected ? "3.5rem" : "1.75rem",
          }}
        />
        {testSelected && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleClearTest(); }}
            title="Clear test"
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{ right: "1.5rem", width: "16px", height: "16px", background: "var(--color-danger)", color: "white" }}
          >
            <X size={10} strokeWidth={3} />
          </button>
        )}
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          style={{ color: "var(--color-text-muted)" }}
          onMouseDown={(e) => { e.preventDefault(); if (testSelected) handleClearTest(); else setShowDropdown(v => !v); }}
        />

        <PortalDropdown anchorEl={nameWrapRef.current} open={showDropdown && dropdownItems.length > 0}>
          <div>
            {dropdownItems.map((item, i) => (
              <div
                key={`test-${item.label}`}
                onMouseDown={() => handleSelectItem(item)}
                className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: highlightedIdx === i ? "var(--color-lab-light)" : "transparent",
                }}
                onMouseEnter={() => setHighlightedIdx(i)}
                onMouseLeave={() => setHighlightedIdx(-1)}
              >
                <span style={{ color: "var(--color-text-base)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </PortalDropdown>
      </div>

      {/* Remarks */}
      <div className="px-1 py-1.5 flex items-center">
        <TypableDetailInput
          dataField="detail"
          value={draft.detail}
          onChange={e => onDraftChange("detail")(e.target.value)}
          onKeyDown={e => handleFieldKeyDown(e, "detail")}
        />
      </div>

      {/* Actions */}
      <div className="px-1 py-1.5 flex gap-1 items-center justify-center">
        <button
          data-field="commit"
          onClick={onCommit}
          onKeyDown={e => handleFieldKeyDown(e, "commit")}
          className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
          style={{ background: "var(--color-lab)", color: "white" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#92400e"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lab)"}
          title="Add Lab Test (Enter)">
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

/* ═══════════════════════════════════════════════ MAIN LAB TAB COMPONENT ═══════════════════ */
const EMPTY_DRAFT = { name: "", detail: "—" };
const EMPTY_RESULT_FIELDS = { observedValue: "", unit: "", bioRef: "", specimen: "" };

export default function LabTab({ labs, setLabs, patient, struckIds, setStruckIds, selectedRowId, setSelectedRowId }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [showAddRow, setShowAddRow] = useState(true);
  const [searchMode, setSearchMode] = useState("alpha");

  const addRowRef = useRef(null);
  const addTableWrapperRef = useRef(null);
  const addedTableWrapperRef = useRef(null);
  const rowsScrollRef = useRef(null);
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, labs.length);

  const baseSearchList = searchMode === "embedded" ? ALL_LAB_SUGGESTIONS : SORTED_ALL_LAB_SUGGESTIONS;
  const suggestions = query.length > 1
    ? baseSearchList.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const setD = (k) => (v) => setDraft(prev => ({ ...prev, [k]: v }));

  const commitDraft = () => {
    if (!draft.name.trim()) return;

    if (editId !== null) {
      setLabs(prev => prev.map(l => l.id === editId ? { ...l, ...draft } : l));
      setEditId(null);
    } else {
      setLabs(prev => [...prev, { id: Date.now(), ...draft, ...EMPTY_RESULT_FIELDS }]);
    }

    setDraft(EMPTY_DRAFT);
    setQuery("");
    setShowAddRow(false);
    setTimeout(() => {
      setDraft(EMPTY_DRAFT);
      setQuery("");
      setShowAddRow(true);
      setTimeout(() => addRowRef.current?.focusName(), 100);
    }, 50);
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
    setTimeout(() => addRowRef.current?.focusName(), 50);
  };

  const toggleStrike = (id) => {
    setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const deleteLab = (id) => {
    setLabs(prev => prev.filter(l => l.id !== id));
    setStruckIds(prev => prev.filter(x => x !== id));
    if (selectedRowId === id) setSelectedRowId(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all lab tests?")) {
      setLabs([]);
      setStruckIds([]);
      setShowAddRow(false);
      setSelectedRowId(null);
    }
  };

  const handleSave = () => alert("Lab tests saved successfully!");
  const handleProto = () => alert("Proto feature coming soon!");

  const handleAddNewTest = () => {
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusName(), 100);
  };

  const handleRowArrowNav = useCallback((currentId, direction) => {
    const idx = labs.findIndex(l => l.id === currentId);
    let nextIdx = direction === "down" ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= labs.length) return;
    const nextId = labs[nextIdx].id;
    setSelectedRowId(nextId);
    const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${nextId}"]`);
    if (row) row.focus();
  }, [labs]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.altKey || (e.key !== "t" && e.key !== "T")) return;
      e.preventDefault();
      const activeEl = document.activeElement;
      const inAddTable = activeEl?.closest('[data-add-row="true"]');
      if (inAddTable) {
        const targetId = selectedRowId ?? labs[0]?.id;
        if (targetId != null) {
          const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${targetId}"]`);
          if (row) { row.focus(); setSelectedRowId(targetId); }
        }
      } else {
        if (showAddRow && addRowRef.current) addRowRef.current.focusName();
        else handleAddNewTest();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [labs, selectedRowId, showAddRow]);

  const addRowProps = {
    draft, onDraftChange: setD, onCommit: commitDraft, onCancel: cancelAdd,
    query, setQuery, suggestions, rowNumber: labs.length + 1, searchMode,
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
        <ModernToolbar
          onProto={handleProto}
          onClear={handleClearAll}
          onSave={handleSave}
        />

        <div className="flex-1 flex flex-col overflow-hidden pb-44">
          <div ref={addedTableWrapperRef} className="flex-1 flex flex-col overflow-hidden">
            <OrderTableHeader />
            <div ref={rowsScrollRef} className="overflow-y-auto flex-1">
              {labs.map((lab, index) => (
                <LabRow
                  key={lab.id}
                  lab={lab}
                  index={index}
                  isStruck={struckIds.includes(lab.id)}
                  isSelected={selectedRowId === lab.id}
                  onSelect={() => setSelectedRowId(lab.id)}
                  onDelete={() => deleteLab(lab.id)}
                  onStrike={() => toggleStrike(lab.id)}
                  onEdit={() => startEdit(lab)}
                  onArrowNav={dir => handleRowArrowNav(lab.id, dir)}
                />
              ))}
              {Array.from({ length: fillRowCount }).map((_, i) => (
                <EmptyLabRow key={`empty-${i}`} index={labs.length + i} />
              ))}
            </div>
          </div>

          <SearchModeToggle searchMode={searchMode} onSearchModeChange={setSearchMode} />

          <div ref={addTableWrapperRef} className="flex-shrink-0">
            <AddTableHeader />
            {showAddRow ? (
              <AddRow ref={addRowRef} {...addRowProps} />
            ) : (
              <div className="flex items-center justify-center py-3 border-t cursor-pointer transition-all"
                style={{ background: "var(--color-lab-light)", borderColor: "var(--color-lab)" }}
                onClick={handleAddNewTest}>
                <button className="px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                  style={{ background: "var(--color-lab)", color: "white" }}>
                  <Plus size={14} /> Add Test
                </button>
              </div>
            )}
          </div>
        </div>

      <div
        className="flex-shrink-0 h-1"
        style={{ background: "linear-gradient(90deg, var(--color-lab) 0%, var(--color-primary) 50%, var(--color-drugs) 100%)", opacity: 0.3 }}
      />
    </div>
  );
}