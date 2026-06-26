import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Plus, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  FlaskConical, Search, ChevronDown, TestTube, Microscope,
  BookOpen, Trash, FolderOpen, List
} from "lucide-react";
import { LAB_SUGGESTIONS } from "./mockData";

const DETAIL_OPTIONS = ["—","Empty Stomach","1Hr. After Food","Any Time","Fasting","Random","Early Morning","Immediately"];

const SORTED_LAB_SUGGESTIONS = [...LAB_SUGGESTIONS].sort((a, b) => a.localeCompare(b));

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

// Get all tests from groups
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

// Combine all lab suggestions with individual tests
const ALL_LAB_SUGGESTIONS = [...LAB_SUGGESTIONS, ...INDIVIDUAL_LAB_TESTS];

// Get individual tests (not in any group) from ALL_LAB_SUGGESTIONS
const getIndividualTests = () => {
  return ALL_LAB_SUGGESTIONS.filter(test => !ALL_GROUP_TESTS.has(test));
};

const INDIVIDUAL_TESTS = getIndividualTests();

// Sorted list of all tests (for display)
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

/* ── Modern Toolbar Component ── */
function ModernToolbar({ onProto, searchMode, onSearchModeChange }) {
  return (
    <div className="flex items-center justify-between p-2 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-3">
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

/* ── Portal Dropdown ── */
function PortalDropdown({ anchorEl, open, children }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!open || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropHeight = 300;

    if (spaceBelow >= dropHeight || spaceBelow >= spaceAbove) {
      setStyle({
        position: "fixed",
        top: rect.bottom + 2,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    } else {
      setStyle({
        position: "fixed",
        bottom: window.innerHeight - rect.top + 2,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    }
  }, [open, anchorEl]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div style={{ ...style, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", overflow: "hidden" }}>
      {children}
    </div>,
    document.body
  );
}

/* ── Add Table Header ── */
function AddTableHeader() {
  const columns = [
    { label: "S.No", width: "w-12", center: true },
    { label: "Name", width: "flex-1" },
    { label: "Remarks", width: "w-48" },
    { label: "Actions", width: "w-16", center: true },
  ];
  return (
    <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-lab)", borderColor: "var(--color-lab)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.width} px-2 py-2 ${col.center ? 'text-center' : ''}`}
          style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Added Lab Table Header ── */
function TableHeader() {
  const columns = [
    { label: "S.No", width: "w-16" },
    { label: "Name", width: "flex-1" },
    { label: "Remarks", width: "w-48" },
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
      className="flex border-b transition-all duration-150 outline-none cursor-pointer"
      style={{
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
      <div className="w-16 px-3 py-2 text-center">
        <span className="text-sm font-bold" style={{ color: "var(--color-lab)" }}>{index + 1}</span>
      </div>
      <div className="flex-1 px-3 py-2">
        <div className="flex flex-col">
          <span className={`text-sm font-semibold flex items-center gap-1.5 ${isStruck ? "line-through" : ""}`} style={{ color: "var(--color-text-base)" }}>
            <FlaskConical size={14} style={{ color: "var(--color-lab)" }} />
            {lab.name}
          </span>
          {lab.group && (
            <span className="text-[0.55rem] mt-0.5 flex items-center gap-1" style={{ color: "var(--color-text-subtle)" }}>
              <FolderOpen size={10} />
              {lab.group}
            </span>
          )}
        </div>
      </div>
      <div className="w-48 px-3 py-2">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{lab.detail === "—" ? "—" : lab.detail}</span>
      </div>
      <div className="w-28 px-2 py-2 flex items-center justify-center gap-1.5">
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
      </PortalDropdown>
    </div>
  );
}

/* ── Add Row Component ── */
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
  const [selectedGroup, setSelectedGroup] = useState(null);

  React.useImperativeHandle(ref, () => ({
    focusName: () => inputRef.current?.focus(),
  }));

  useEffect(() => { setTestSelected(!!query.trim()); }, [query]);

  // Use sorted all lab suggestions
  const baseList = searchMode === "embedded" ? ALL_LAB_SUGGESTIONS : SORTED_ALL_LAB_SUGGESTIONS;
  
  // Build dropdown items with groups and individual tests
  const getDropdownItems = () => {
    const items = [];
    const allGroupTests = new Set();
    LAB_GROUPS.forEach(g => g.tests.forEach(t => allGroupTests.add(t)));
    
    if (query === "") {
      // Show all groups first with a section header
      if (LAB_GROUPS.length > 0) {
        items.push({
          type: "section-header",
          label: "📁 TEST GROUPS"
        });
        LAB_GROUPS.forEach(group => {
          items.push({
            type: "group",
            label: group.name,
            icon: group.icon || "📁",
            tests: group.tests,
            groupName: group.name
          });
        });
      }
      
      // Then show individual tests with a section header
      const individualTests = baseList.filter(test => !allGroupTests.has(test));
      if (individualTests.length > 0) {
        items.push({
          type: "section-header",
          label: "🧪 INDIVIDUAL TESTS"
        });
        individualTests.forEach(test => {
          items.push({
            type: "test",
            label: test,
            icon: "🧪"
          });
        });
      }
      
      return items;
    } else {
      // Search results - show matching groups and individual tests
      const searchLower = query.toLowerCase();
      
      // Check groups
      const matchingGroups = [];
      LAB_GROUPS.forEach(group => {
        const matchingTests = group.tests.filter(t => 
          t.toLowerCase().includes(searchLower)
        );
        const groupNameMatches = group.name.toLowerCase().includes(searchLower);
        
        if (matchingTests.length > 0 || groupNameMatches) {
          matchingGroups.push({
            type: "group",
            label: group.name,
            icon: group.icon || "📁",
            tests: groupNameMatches ? group.tests : matchingTests,
            groupName: group.name,
            isPartialMatch: !groupNameMatches && matchingTests.length > 0
          });
        }
      });
      
      if (matchingGroups.length > 0) {
        items.push({
          type: "section-header",
          label: "📁 TEST GROUPS"
        });
        matchingGroups.forEach(group => items.push(group));
      }
      
      // Add individual matching tests
      const matchingTests = baseList.filter(test => 
        test.toLowerCase().includes(searchLower) && !allGroupTests.has(test)
      );
      if (matchingTests.length > 0) {
        items.push({
          type: "section-header",
          label: "🧪 INDIVIDUAL TESTS"
        });
        matchingTests.forEach(test => {
          items.push({
            type: "test",
            label: test,
            icon: "🧪"
          });
        });
      }
      
      return items;
    }
  };

  const dropdownItems = getDropdownItems();

  const handleSelectItem = (item) => {
    if (item.type === "group") {
      // Select the group name as the main entry
      setQuery(item.label);
      onDraftChange("name")(item.label);
      setSelectedGroup(item.groupName);
      setTestSelected(true);
      setShowDropdown(false);
      setHighlightedIdx(-1);
      inputRef.current?.focus();
    } else if (item.type === "test") {
      // Select individual test
      setQuery(item.label);
      onDraftChange("name")(item.label);
      setSelectedGroup(null);
      setTestSelected(true);
      setShowDropdown(false);
      setHighlightedIdx(-1);
      inputRef.current?.focus();
    }
    // Section headers are not selectable
  };

  const handleClearTest = () => {
    setQuery("");
    onDraftChange("name")("");
    setSelectedGroup(null);
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
        if (item.type !== "section-header") {
          handleSelectItem(item);
        }
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
      className="flex items-stretch border-b relative"
      style={{ background: "var(--color-lab-light)", borderColor: "var(--color-lab)" }}
      onBlur={handleRowBlur}
    >
      {/* S.No */}
      <div className="w-12 px-2 py-2 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold" style={{ color: "var(--color-lab)" }}>{rowNumber}</span>
      </div>

      {/* Name - with portal dropdown */}
      <div className="flex-1 relative min-w-0 px-1 py-1.5 flex items-center" ref={nameWrapRef}>
        <FlaskConical size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-lab)" }} />
        <input
          data-field="name"
          ref={inputRef}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            onDraftChange("name")(e.target.value);
            setSelectedGroup(null);
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
          <div className="max-h-72 overflow-y-auto">
            {dropdownItems.map((item, i) => {
              if (item.type === "section-header") {
                return (
                  <div
                    key={`section-${item.label}`}
                    className="px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-wider sticky top-0"
                    style={{ 
                      color: "var(--color-text-muted)", 
                      background: "var(--color-surface)",
                      borderBottom: "1px solid var(--color-border)"
                    }}
                  >
                    {item.label}
                  </div>
                );
              }
              
              return (
                <div
                  key={item.type === "group" ? `group-${item.label}` : `test-${item.label}`}
                  onMouseDown={() => handleSelectItem(item)}
                  className={`px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2 ${
                    item.type === "group" ? "border-l-4" : ""
                  }`}
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    background: highlightedIdx === i ? "var(--color-lab-light)" : "transparent",
                    borderLeftColor: item.type === "group" ? "var(--color-lab)" : "transparent",
                  }}
                  onMouseEnter={() => setHighlightedIdx(i)}
                  onMouseLeave={() => setHighlightedIdx(-1)}
                >
                  {item.type === "group" ? (
                    <>
                      <FolderOpen size={14} style={{ color: "var(--color-lab)" }} />
                      <span style={{ color: "var(--color-lab)", fontWeight: "700" }}>{item.label}</span>
                      <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full" 
                        style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}>
                        {item.tests.length} {item.tests.length === 1 ? 'test' : 'tests'}
                      </span>
                      {item.isPartialMatch && (
                        <span className="text-[0.55rem] px-1 py-0.5 rounded" 
                          style={{ background: "#fef3e2", color: "#b45309" }}>
                          Partial match
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <TestTube size={14} style={{ color: "var(--color-lab)" }} />
                      <span style={{ color: "var(--color-text-base)" }}>{item.label}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </PortalDropdown>
      </div>

      {/* Remarks */}
      <div className="w-48 flex-shrink-0 px-1 py-1.5 flex items-center">
        <TypableDetailInput
          dataField="detail"
          value={draft.detail}
          onChange={e => onDraftChange("detail")(e.target.value)}
          onKeyDown={e => handleFieldKeyDown(e, "detail")}
        />
      </div>

      {/* Actions */}
      <div className="w-16 flex-shrink-0 px-1 py-1.5 flex gap-1 items-center justify-center">
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

export default function LabTab({ labs, setLabs, patient }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [searchMode, setSearchMode] = useState("alpha");

  const addRowRef = useRef(null);
  const addTableWrapperRef = useRef(null);
  const addedTableWrapperRef = useRef(null);

  // Use combined suggestions for search
  const baseSearchList = searchMode === "embedded" ? ALL_LAB_SUGGESTIONS : SORTED_ALL_LAB_SUGGESTIONS;
  const suggestions = query.length > 1
    ? baseSearchList.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const setD = (k) => (v) => setDraft(prev => ({ ...prev, [k]: v }));

  const commitDraft = () => {
    if (!draft.name.trim()) return;
    
    // Check if the selected name is a group
    const selectedGroup = LAB_GROUPS.find(g => g.name === draft.name);
    
    if (selectedGroup) {
      // Add all tests from the group
      const newLabs = selectedGroup.tests.map(test => ({
        id: Date.now() + Math.random() * 1000,
        name: test,
        detail: draft.detail,
        group: selectedGroup.name
      }));
      setLabs(prev => [...prev, ...newLabs]);
    } else if (editId !== null) {
      setLabs(prev => prev.map(l => l.id === editId ? { ...l, ...draft } : l));
      setEditId(null);
    } else {
      // Add individual test
      setLabs(prev => [...prev, { id: Date.now(), ...draft }]);
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

  // Alt+T to toggle between tables
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
      {/* HEADER */}
      <div
        className="flex-shrink-0 border-b"
        style={{ background: "linear-gradient(135deg, var(--color-lab-light) 0%, var(--color-surface) 100%)", borderColor: "var(--color-border)" }}
      >
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical size={16} style={{ color: "var(--color-lab)" }} />
            <h2 className="lg:text-base md:text-xs font-light" style={{ color: "var(--color-lab)" }}>Lab Investigations</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[0.65rem] hidden lg:inline mr-2" style={{ color: "var(--color-text-subtle)" }}>
              Alt+T: switch tables · Alt+E: edit row · Alt+Del: delete row
            </span>
            <ActionButton variant="warning" icon={Trash} label="Clear" onClick={handleClearAll} />
            <ActionButton variant="success" icon={Save} label="Save" onClick={handleSave} />
          </div>
        </div>
        <ModernToolbar onProto={handleProto} searchMode={searchMode} onSearchModeChange={setSearchMode} />
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── ADD LAB TABLE ── */}
        <div ref={addTableWrapperRef} className="flex-shrink-0">
          <AddTableHeader />
          {showAddRow ? (
            <AddRow ref={addRowRef} {...addRowProps} />
          ) : (
            <div className="flex items-center justify-center py-3 border-b cursor-pointer transition-all"
              style={{ background: "var(--color-lab-light)", borderColor: "var(--color-lab)" }}
              onClick={handleAddNewTest}>
              <button className="px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                style={{ background: "var(--color-lab)", color: "white" }}>
                <Plus size={14} /> Add Test
              </button>
            </div>
          )}
        </div>

        {/* ── ADDED LAB TABLE ── */}
        <div ref={addedTableWrapperRef} className="flex-1 flex flex-col overflow-hidden mt-6">
          {labs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-5">
              <div className="text-center">
                <div className="mb-2 p-4 rounded-full inline-flex" style={{ background: "var(--color-lab-light)" }}>
                  <FlaskConical size={20} style={{ color: "var(--color-lab)" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-base)" }}>No Lab Tests Ordered Yet</h3>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Use the table above to add your first lab test.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 pb-2">
                <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-subtle)" }}>
                  Added Lab Tests ({labs.length})
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
              </div>
              <TableHeader />
              <div className="overflow-y-auto">
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="flex-shrink-0 h-1"
        style={{ background: "linear-gradient(90deg, var(--color-lab) 0%, var(--color-primary) 50%, var(--color-drugs) 100%)", opacity: 0.3 }}
      />
    </div>
  );
}