import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Plus, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  Pill, Search, ChevronDown, BookOpen, Trash
} from "lucide-react";
import {
  DRUG_SUGGESTIONS
} from "./mockData";
import useFillRowCount from "../../hooks/useFillRowCount";

const FORM_OPTIONS   = ["Tab","Cap","Syp","Inj","Cream","Drop","Inhaler","Powder","Gel","Lotion"];
const INTAKE_OPTIONS = ["¼","½","¾","1","1½","2","3","4","1Ts","2Ts","3Ts","4Ts","5ml","10ml"];
const PERIOD_OPTIONS = ["OD","BD","TDS","QID","HS","SOS","Stat","Weekly","Monthly"];
const WHEN_OPTIONS   = ["AF","BF","BF&AF","Any Time","Empty Stomach","With Milk","Before Sleep"];
const DETAIL_OPTIONS = ["—","On Time","Only If Required","Discontinue Any Time","Continue","Reduce Dose","Increase Dose","Take with Water"];

const SORTED_DRUG_SUGGESTIONS = [...DRUG_SUGGESTIONS].sort((a, b) => a.localeCompare(b));

const FIELD_ORDER = ["name", "days", "intake", "period", "when", "detail", "commit"];

/* Fixed row height (px) used to compute how many blank rows fill the remaining
   visible space in the added-medicines grid — see useFillRowCount. */
const ROW_HEIGHT_PX = 52;

function getDosageSchedule(period, intake) {
  const schedules = {
    "OD":      { mor: "",       noon: "",       eve: "",       night: intake },
    "BD":      { mor: intake,   noon: "",       eve: "",       night: intake },
    "TDS":     { mor: intake,   noon: intake,   eve: "",       night: intake },
    "QID":     { mor: intake,   noon: intake,   eve: intake,   night: intake },
    "HS":      { mor: "",       noon: "",       eve: "",       night: intake },
    "SOS":     { mor: "",       noon: "",       eve: "",       night: "As needed" },
    "Stat":    { mor: "",       noon: "",       eve: "",       night: "Stat" },
    "Weekly":  { mor: "",       noon: "",       eve: "",       night: "Weekly" },
    "Monthly": { mor: "",       noon: "",       eve: "",       night: "Monthly" },
  };
  return schedules[period] || schedules["OD"];
}

function calculateBuy(days, intake, period) {
  const dosageCount = {
    "OD": 1, "BD": 2, "TDS": 3, "QID": 4,
    "HS": 1, "SOS": 1, "Stat": 1, "Weekly": 1, "Monthly": 1
  };
  let intakeNum = 1;
  if      (intake.includes("1½")) intakeNum = 1.5;
  else if (intake.includes("¼"))  intakeNum = 0.25;
  else if (intake.includes("½"))  intakeNum = 0.5;
  else if (intake.includes("¾"))  intakeNum = 0.75;
  else if (!isNaN(parseFloat(intake))) intakeNum = parseFloat(intake);
  const dailyDosage = (dosageCount[period] || 1) * intakeNum;
  return Math.ceil(days * dailyDosage);
}

function formatIntakeDisplay(intake, period, detail) {
  let display = `[${intake}`;
  if      (period === "HS")  display += `, Bedtime`;
  else if (period === "SOS") display += `, As needed`;
  else                       display += `, ${period}`;
  if (detail && detail !== "—") display += `, ${detail}`;
  display += `]`;
  return display;
}

/* ── Portal Dropdown ── renders into document.body to escape overflow:hidden */
function PortalDropdown({ anchorEl, open, children }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!open || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    // Always open downward, sized to the space below so it stays on-screen and scrolls.
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

/* ── Action Button ── */
function ActionButton({ onClick, variant = "primary", icon: Icon, label, disabled = false }) {
  const variants = {
    primary: { bg: "var(--color-primary)",     color: "white", hoverBg: "var(--color-primary-light)" },
    success: { bg: "var(--color-drugs)",        color: "white", hoverBg: "#146b4c" },
    danger:  { bg: "var(--color-danger)",       color: "white", hoverBg: "#b91c1c" },
    warning: { bg: "var(--color-warning)",      color: "white", hoverBg: "#d97706" },
    ghost:   { bg: "transparent",              color: "var(--color-text-muted)", hoverBg: "var(--color-surface-alt)" },
  };
  const style = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{ background: style.bg, color: style.color, border: variant === "ghost" ? "1px solid var(--color-border)" : "none" }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = style.hoverBg; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = style.bg; }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

const DRUG_TYPE_OPTIONS = ["Currently Live", "All", "Discontinued"];

/* ── Search-mode checkboxes (Alphabet / Embedded) + Drug Type controls — sits above the add row ── */
function SearchModeToggle({ searchMode, onSearchModeChange, drugType, onDrugTypeChange, frequentOnly, onFrequentOnlyChange }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 flex-shrink-0 border-t"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-3">
        <span className="text-[0.72rem] font-semibold" style={{ color: "var(--color-text-base)" }}>Search:</span>
        {[{ value: "alpha", label: "Alphabet" }, { value: "embedded", label: "Embedded" }].map(({ value, label }) => {
          const checked = searchMode === value;
          return (
            <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none"
              style={{ fontSize: "0.72rem", fontWeight: checked ? "700" : "500", color: checked ? "var(--color-drugs)" : "var(--color-text-muted)" }}>
              <span onClick={() => onSearchModeChange(value)} className="flex items-center justify-center rounded transition-all"
                style={{ width: 15, height: 15, flexShrink: 0, cursor: "pointer",
                  border: `2px solid ${checked ? "var(--color-drugs)" : "var(--color-border)"}`,
                  background: checked ? "var(--color-drugs)" : "var(--color-surface)" }}>
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

      <div className="flex items-center gap-3">
        <span className="text-[0.72rem] font-semibold" style={{ color: "var(--color-text-base)" }}>Drug Type:</span>
        <select
          value={drugType}
          onChange={e => onDrugTypeChange(e.target.value)}
          className="px-2 py-1 rounded text-xs outline-none"
          style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
        >
          {DRUG_TYPE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <label className="flex items-center gap-1.5 cursor-pointer select-none"
          style={{ fontSize: "0.72rem", fontWeight: frequentOnly ? "700" : "500", color: frequentOnly ? "var(--color-drugs)" : "var(--color-text-muted)" }}>
          <span onClick={() => onFrequentOnlyChange(!frequentOnly)} className="flex items-center justify-center rounded transition-all"
            style={{ width: 15, height: 15, flexShrink: 0, cursor: "pointer",
              border: `2px solid ${frequentOnly ? "var(--color-drugs)" : "var(--color-border)"}`,
              background: frequentOnly ? "var(--color-drugs)" : "var(--color-surface)" }}>
            {frequentOnly && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <polyline points="1.5,4.5 3.5,7 7.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span onClick={() => onFrequentOnlyChange(!frequentOnly)}>Frequent</span>
        </label>
      </div>
    </div>
  );
}

/* ── Toolbar ── */
function ModernToolbar({ onProto, onClear, onSave }) {
  return (
    <div className="flex items-center justify-end p-2 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      {/* Right-side action buttons */}
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

/* ── Add Table Header ── */
function AddTableHeader() {
  const columns = [
    { label: "S.No",    width: "w-12",   center: true },
    { label: "Name",    width: "w-80",   center: true },
    { label: "Days",    width: "w-16",   center: true },
    { label: "Dosage",  width: "w-20",   center: true },
    { label: "Period",  width: "w-20",   center: true },
    { label: "When",    width: "w-28",   center: true },
    { label: "Remarks", width: "flex-1", center: true },
    { label: "Actions", width: "w-16",   center: true },
  ];
  return (
    <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-drugs)", borderColor: "var(--color-drugs)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.width} px-2 py-2 ${col.center ? "text-center" : ""}`}
          style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Added Medicines Table Header ── */
function TableHeader() {
  const columns = [
    { label: "S.No",    width: "w-12",   center: true },
    { label: "Name",    width: "w-80",   center: true },
    { label: "Buy",     width: "w-12",   center: true },
    { label: "Mor",     width: "w-8",    center: true, vertical: true },
    { label: "A.N",     width: "w-8",    center: true, vertical: true },
    { label: "Eve",     width: "w-8",    center: true, vertical: true },
    { label: "Night",   width: "w-8",    center: true, vertical: true },
    { label: "When",    width: "w-20",   center: true },
    { label: "Remarks", width: "flex-1", center: true },
    { label: "Actions", width: "w-24",   center: true },
  ];
  return (
    <div className="flex items-stretch border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)" }}>
      {columns.map(col => (
        <div key={col.label}
          className={`${col.width} ${col.vertical ? "px-0.5 py-1.5 flex items-center justify-center" : "px-2 py-2"} ${col.center && !col.vertical ? "text-center" : ""}`}
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.03em",
            color: "var(--color-primary-dark)",
            ...(col.vertical ? { writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" } : {}),
          }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Empty placeholder row — same grid as DrugRow, shown when no medicines added yet ── */
function EmptyDrugRow({ index }) {
  return (
    <div
      className="flex border-b"
      style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)" }}
    >
      <div className="w-12 px-2 py-2 text-center">&nbsp;</div>
      <div className="w-80 min-w-0 px-2 py-2">&nbsp;</div>
      <div className="w-12 px-2 py-2 text-center">&nbsp;</div>
      <div className="w-8 px-0.5 py-2 text-center">&nbsp;</div>
      <div className="w-8 px-0.5 py-2 text-center">&nbsp;</div>
      <div className="w-8 px-0.5 py-2 text-center">&nbsp;</div>
      <div className="w-8 px-0.5 py-2 text-center">&nbsp;</div>
      <div className="w-20 px-2 py-2 text-center">&nbsp;</div>
      <div className="flex-1 px-2 py-2 text-center">&nbsp;</div>
      <div className="w-24 px-1 py-2 text-center">&nbsp;</div>
    </div>
  );
}

/* ── Drug Row ── */
function DrugRow({ drug, index, isStruck, isSelected, onSelect, onDelete, onStrike, onEdit, onArrowNav }) {
  const schedule = getDosageSchedule(drug.period, drug.intake);
  const buy = calculateBuy(parseInt(drug.days) || 1, drug.intake, drug.period);
  const intakeDisplay = formatIntakeDisplay(drug.intake, drug.period, drug.detail);

  return (
    <div
      tabIndex={0}
      data-row-id={drug.id}
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
          ? "var(--color-drugs-light)"
          : isStruck
            ? "var(--color-surface-alt)"
            : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1,
        boxShadow: isSelected ? "inset 0 0 0 2px var(--color-drugs)" : "none",
      }}
    >
      <div className="w-12 px-2 py-2 text-center">
        <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{index + 1}</span>
      </div>
      <div className="w-80 min-w-0 px-2 py-2">
        <div className="font-semibold text-sm truncate" style={{ color: isStruck ? "var(--color-text-muted)" : "var(--color-text-base)" }}>
          {drug.name}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[0.6rem] font-bold px-1 rounded"
            style={{ background: "var(--color-drugs-light)", color: "var(--color-drugs)" }}>
            {drug.days}d
          </span>
          <span className="text-[0.6rem]" style={{ color: "var(--color-text-subtle)" }}>
            {intakeDisplay}
          </span>
        </div>
      </div>
      <div className="w-12 px-2 py-2 text-center">
        <span className="text-sm font-bold" style={{ color: "var(--color-drugs)" }}>{buy}</span>
      </div>
      <div className="w-8 px-0.5 py-2 text-center"><span className="text-sm">{schedule.mor}</span></div>
      <div className="w-8 px-0.5 py-2 text-center"><span className="text-sm">{schedule.noon}</span></div>
      <div className="w-8 px-0.5 py-2 text-center"><span className="text-sm">{schedule.eve}</span></div>
      <div className="w-8 px-0.5 py-2 text-center"><span className="text-sm">{schedule.night}</span></div>
      <div className="w-20 px-2 py-2 text-center">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{drug.when}</span>
      </div>
      <div className="flex-1 px-2 py-2 text-center">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{drug.detail === "—" ? "" : drug.detail}</span>
      </div>
      <div className="w-24 px-1 py-2 flex items-center justify-center gap-1">
        <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-1 rounded transition-all" title="Edit (Alt+E)"
          style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--color-primary-light)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary-muted)"}>
          <Edit2 size={12} />
        </button>
        <button onClick={e => { e.stopPropagation(); onStrike(); }} className="p-1 rounded transition-all" title={isStruck ? "Undo Strike" : "Strike"}
          style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fde68a"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--color-lab-light)"}>
          {isStruck ? <RotateCcw size={12} /> : <MinusCircle size={12} />}
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 rounded transition-all" title="Delete (Alt+Del)"
          style={{ background: "#fee2e2", color: "var(--color-danger)" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fecaca"}
          onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

/* ── Typable Detail/Remarks Input ── */
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
        placeholder="Type or select remarks..."
        className="w-full px-2 py-1.5 rounded text-sm outline-none"
        style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
      />
      <PortalDropdown anchorEl={anchorRef.current} open={showDropdown && filteredOptions.length > 0}>
        {filteredOptions.map((opt, i) => (
          <div
            key={opt}
            onMouseDown={() => handleSelectOption(opt)}
            className="px-3 py-2 cursor-pointer text-sm transition-colors"
            style={{ background: highlightedIdx === i ? "var(--color-primary-muted)" : "transparent" }}
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

/* ── Arrow-key-only Select ── */
function ArrowSelect({ dataField, value, options, onChange, onNavigate, style: extraStyle = {}, className = "" }) {
  const currentIdx = options.indexOf(value);
  const handleKeyDown = e => {
    if (e.key === "ArrowDown") { e.preventDefault(); onChange(options[Math.min(currentIdx + 1, options.length - 1)]); return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); onChange(options[Math.max(currentIdx - 1, 0)]); return; }
    if (["ArrowLeft", "ArrowRight", "Enter", "Escape", "Tab"].includes(e.key)) { e.preventDefault(); onNavigate?.(e); }
  };
  return (
    <select
      data-field={dataField}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={`w-full px-2 py-1.5 rounded text-sm ${className}`}
      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", ...extraStyle }}
    >
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  );
}

/* ═══════════════ ADD ROW ═══════════════ */
const AddRow = React.forwardRef(({ draft, onDraftChange, onCommit, query, setQuery, suggestions, onCancel, rowNumber, searchMode }, ref) => {
  const inputRef   = useRef(null);
  const rowRef     = useRef(null);
  const nameWrapRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [drugSelected, setDrugSelected] = useState(() => !!query);

  React.useImperativeHandle(ref, () => ({
    focusDays: () => rowRef.current?.querySelector('[data-field="days"]')?.focus(),
    focusName: () => inputRef.current?.focus(),
  }));

  useEffect(() => { setDrugSelected(!!query.trim()); }, [query]);

  // searchMode: "alpha" → A–Z sorted list; "embedded" → original DRUG_SUGGESTIONS order
  const baseList = searchMode === "embedded" ? DRUG_SUGGESTIONS : SORTED_DRUG_SUGGESTIONS;
  const dropdownItems = query === "" ? baseList : suggestions.slice(0, 8);
  const listLabel = query === "" ? (searchMode === "embedded" ? "Medicines (Embedded)" : "Medicines (A–Z)") : "Search Results";

  const handleSelectMedicine = medicine => {
    setQuery(medicine);
    onDraftChange("name")(medicine);
    setDrugSelected(true);
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleClearDrug = () => {
    setQuery("");
    onDraftChange("name")("");
    setDrugSelected(false);
    setShowDropdown(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRowBlur = e => {
    if (rowRef.current && !rowRef.current.contains(e.relatedTarget)) {
      setShowDropdown(false);
      setHighlightedIdx(-1);
    }
  };

  const FIELD_ORDER_LOCAL = ["name", "days", "intake", "period", "when", "detail", "commit"];

  const focusField = useCallback(fieldKey => {
    const el = rowRef.current?.querySelector(`[data-field="${fieldKey}"]`);
    if (el) el.focus();
  }, []);

  const navigateField = useCallback((currentField, direction) => {
    const idx = FIELD_ORDER_LOCAL.indexOf(currentField);
    if (direction === "right" && idx < FIELD_ORDER_LOCAL.length - 1) focusField(FIELD_ORDER_LOCAL[idx + 1]);
    else if (direction === "left" && idx > 0)                         focusField(FIELD_ORDER_LOCAL[idx - 1]);
  }, [focusField]);

  const handleFieldKeyDown = (e, currentField) => {
    if (e.key === "Escape") { onCancel(); return; }

    if (currentField === "name" && showDropdown && dropdownItems.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, dropdownItems.length - 1)); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); handleSelectMedicine(dropdownItems[highlightedIdx]); return; }
    }

    if (e.key === "ArrowRight") { e.preventDefault(); navigateField(currentField, "right"); return; }
    if (e.key === "ArrowLeft")  { e.preventDefault(); navigateField(currentField, "left");  return; }
    if (e.key === "Tab")        setShowDropdown(false);
    if (e.key === "Enter" && currentField !== "name") { e.preventDefault(); onCommit(); }
    if (e.key === "Enter" && currentField === "name" && !showDropdown) { e.preventDefault(); onCommit(); }
  };

  return (
    <div
      ref={rowRef}
      data-add-row="true"
      className="flex items-stretch border-b relative"
      style={{ background: "var(--color-drugs-light)", borderColor: "var(--color-drugs)" }}
      onBlur={handleRowBlur}
    >
      {/* S.No */}
      <div className="w-12 px-2 py-2 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold" style={{ color: "var(--color-drugs)" }}>{rowNumber}</span>
      </div>

      {/* Name — portal dropdown so it escapes any overflow:hidden parent */}
      <div className="w-80 flex-shrink-0 relative min-w-0 px-1 py-1.5 flex items-center" ref={nameWrapRef}>
        <Pill size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-drugs)" }} />
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
          onBlur={() => setTimeout(() => { setShowDropdown(false); if (query.trim()) setDrugSelected(true); }, 200)}
          onKeyDown={e => handleFieldKeyDown(e, "name")}
          placeholder="Search or select medicine (A–Z)..."
          className="w-full py-1.5 rounded text-sm font-medium"
          style={{
            border: drugSelected ? "1.5px solid var(--color-drugs)" : "1px solid var(--color-border)",
            background: drugSelected ? "var(--color-drugs-light)" : "var(--color-surface)",
            color: "var(--color-drugs)",
            paddingLeft: "1.75rem",
            paddingRight: drugSelected ? "3.5rem" : "1.75rem",
          }}
        />
        {drugSelected && (
          <button type="button"
            onMouseDown={e => { e.preventDefault(); handleClearDrug(); }}
            title="Clear drug"
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{ right: "1.5rem", width: "16px", height: "16px", background: "var(--color-danger)", color: "white" }}>
            <X size={10} strokeWidth={3} />
          </button>
        )}
        <ChevronDown size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          style={{ color: "var(--color-text-muted)" }}
          onMouseDown={e => { e.preventDefault(); if (drugSelected) handleClearDrug(); else setShowDropdown(v => !v); }}
        />

        {/* FIXED: Portal dropdown — renders into document.body, never clipped */}
        <PortalDropdown anchorEl={nameWrapRef.current} open={showDropdown && dropdownItems.length > 0}>
          <div>
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider sticky top-0"
              style={{ color: "var(--color-text-muted)", background: "var(--color-primary-muted)" }}>
              {listLabel}
            </div>
            {dropdownItems.map((med, i) => (
              <div
                key={med}
                onMouseDown={() => handleSelectMedicine(med)}
                className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: highlightedIdx === i ? "var(--color-drugs-light)" : "transparent",
                }}
                onMouseEnter={() => setHighlightedIdx(i)}
                onMouseLeave={() => setHighlightedIdx(-1)}
              >
                {query === ""
                  ? <Pill size={14} style={{ color: "var(--color-drugs)" }} />
                  : <Search size={12} style={{ color: "var(--color-primary)" }} />
                }
                <span style={{ color: "var(--color-text-base)" }}>{med}</span>
              </div>
            ))}
          </div>
        </PortalDropdown>
      </div>

      {/* Days */}
      <div className="w-16 flex-shrink-0 px-1 py-1.5 flex items-center">
        <input
          data-field="days"
          type="number" min="1" max="365"
          value={draft.days}
          onChange={e => onDraftChange("days")(e.target.value)}
          onKeyDown={e => handleFieldKeyDown(e, "days")}
          className="w-full px-2 py-1.5 rounded text-sm text-center font-semibold"
          style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
          placeholder="Days"
        />
      </div>

      {/* Dosage (intake) */}
      <div className="w-20 flex-shrink-0 px-1 py-1.5 flex items-center">
        <ArrowSelect dataField="intake" value={draft.intake} options={INTAKE_OPTIONS}
          onChange={v => onDraftChange("intake")(v)}
          onNavigate={e => handleFieldKeyDown(e, "intake")} />
      </div>

      {/* Period */}
      <div className="w-20 flex-shrink-0 px-1 py-1.5 flex items-center">
        <ArrowSelect dataField="period" value={draft.period} options={PERIOD_OPTIONS}
          onChange={v => onDraftChange("period")(v)}
          onNavigate={e => handleFieldKeyDown(e, "period")}
          style={{ color: "var(--color-primary)", fontWeight: "700" }} />
      </div>

      {/* When */}
      <div className="w-28 flex-shrink-0 px-1 py-1.5 flex items-center">
        <ArrowSelect dataField="when" value={draft.when} options={WHEN_OPTIONS}
          onChange={v => onDraftChange("when")(v)}
          onNavigate={e => handleFieldKeyDown(e, "when")} />
      </div>

      {/* Remarks */}
      <div className="flex-1 min-w-0 px-1 py-1.5 flex items-center">
        <TypableDetailInput dataField="detail" value={draft.detail}
          onChange={e => onDraftChange("detail")(e.target.value)}
          onKeyDown={e => handleFieldKeyDown(e, "detail")} />
      </div>

      {/* Actions */}
      <div className="w-16 flex-shrink-0 px-1 py-1.5 flex gap-1 items-center justify-center">
        <button
          data-field="commit"
          onClick={onCommit}
          onKeyDown={e => handleFieldKeyDown(e, "commit")}
          className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
          style={{ background: "var(--color-drugs)", color: "white" }}
          onMouseEnter={e => e.currentTarget.style.background = "#146b4c"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--color-drugs)"}
          title="Add Medicine (Enter)">
          <Plus size={16} />
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
          style={{ background: "#fee2e2", color: "var(--color-danger)" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fecaca"}
          onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}
          title="Cancel (Esc)">
          <X size={16} />
        </button>
      </div>
    </div>
  );
});

/* ═══════════════════ REPEAT PRESCRIPTIONS (right panel) ═══════════════════ */

const INITIAL_REPEAT_PRESCRIPTIONS = [
  { id: 1, title: "Pain Killer & Sleep",          days: 5,  drugCount: 3 },
  { id: 2, title: "Cold & Cough",                 days: 7,  drugCount: 4 },
  { id: 3, title: "Fever, Head-ache, Body-Pain",  days: 5,  drugCount: 5 },
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
    <div className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)" }}>
      <div className="w-12 px-3 py-2.5 text-center">&nbsp;</div>
      <div className="flex-1 px-3 py-2.5">&nbsp;</div>
      <div className="w-16 px-3 py-2.5 text-center">&nbsp;</div>
      <div className="w-24 px-3 py-2.5 text-center">&nbsp;</div>
      <div className="w-40 px-3 py-2.5 text-center">&nbsp;</div>
    </div>
  );
}

function RepeatPrescriptionsPanel({ prescriptions, onAdd, onModify, onDelete, onView }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null); // null | "add" | { id, title }
  const rowsScrollRef = useRef(null);

  const filtered = searchTerm.trim()
    ? prescriptions.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : prescriptions;

  const fillRowCount = useFillRowCount(rowsScrollRef, REPEAT_ROW_HEIGHT_PX, filtered.length);

  return (
    <div
      className="flex flex-col rounded-xs overflow-hidden shadow-lg flex-shrink-0"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", width: "38%", minWidth: "420px", alignSelf: "stretch" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <span className="text-sm font-bold" style={{ color: "var(--color-text-base)", fontFamily: "var(--font-inter)" }}>Repeat Prescriptions</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setModalMode("add")} className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--color-drugs)" }}>
            <Plus size={14} /> Add
          </button>
          <button onClick={() => setShowSearch(v => !v)} className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--color-primary)" }}>
            <Search size={14} /> Search
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="px-4 py-2 border-b flex-shrink-0" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search prescription title..."
            className="w-full px-3 py-1.5 rounded text-sm outline-none"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
          />
        </div>
      )}

      {/* Table header */}
      <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)" }}>
        <div className="w-12 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>S.No</div>
        <div className="flex-1 px-3 py-2.5" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>Prescription Title</div>
        <div className="w-16 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>Days</div>
        <div className="w-24 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>No. of Drugs</div>
        <div className="w-40 px-3 py-2.5 text-center" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      {/* Rows */}
      <div ref={rowsScrollRef} className="overflow-y-auto flex-1">
        {filtered.map((p, index) => (
          <div key={p.id} className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)" }}>
            <div className="w-12 px-3 py-2.5 text-center"><span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{index + 1}.</span></div>
            <div className="flex-1 px-3 py-2.5"><span className="text-sm font-medium" style={{ color: "var(--color-text-base)" }}>{p.title}</span></div>
            <div className="w-16 px-3 py-2.5 text-center"><span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{p.days || "—"}</span></div>
            <div className="w-24 px-3 py-2.5 text-center"><span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{p.drugCount}</span></div>
            <div className="w-40 px-3 py-2.5 text-center whitespace-nowrap">
              <button onClick={() => onView(p)} className="text-xs font-semibold underline" style={{ color: "var(--color-primary)" }}>View</button>
              <span className="text-xs mx-1" style={{ color: "var(--color-text-subtle)" }}>/</span>
              <button onClick={() => setModalMode({ id: p.id, title: p.title })} className="text-xs font-semibold underline" style={{ color: "var(--color-drugs)" }}>Modify</button>
              <span className="text-xs mx-1" style={{ color: "var(--color-text-subtle)" }}>/</span>
              <button onClick={() => onDelete(p.id)} className="text-xs font-semibold underline" style={{ color: "var(--color-danger)" }}>Delete</button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => (
          <EmptyRepeatRow key={`empty-${i}`} index={filtered.length + i} />
        ))}
      </div>

      {modalMode === "add" && (
        <RepeatPrescriptionModal
          onSave={title => { onAdd(title); setModalMode(null); }}
          onCancel={() => setModalMode(null)}
        />
      )}
      {modalMode && modalMode !== "add" && (
        <RepeatPrescriptionModal
          initialTitle={modalMode.title}
          onSave={title => { onModify(modalMode.id, title); setModalMode(null); }}
          onCancel={() => setModalMode(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════ MAIN COMPONENT ═══════════════════ */

const EMPTY_DRAFT = { name: "", form: "Tab", intake: "1", period: "OD", when: "AF", detail: "—", days: "1" };

function makeFreshDraft(keepDays) {
  return { name: "", form: "Tab", intake: "1", period: "OD", when: "AF", detail: "—", days: keepDays ?? "1" };
}

export default function DrugTab({ drugs, setDrugs, patient }) {
  // FIXED: persistedDays lives in a ref so the showAddRow remount cycle never loses it
  const persistedDaysRef = useRef("1");

  const [draft, setDraft] = useState(() => EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [searchMode, setSearchMode] = useState("alpha"); // "alpha" | "embedded"
  const [drugType, setDrugType] = useState("Currently Live");
  const [frequentOnly, setFrequentOnly] = useState(false);
  const [repeatPrescriptions, setRepeatPrescriptions] = useState(INITIAL_REPEAT_PRESCRIPTIONS);

  const addRowRef            = useRef(null);
  const addTableWrapperRef   = useRef(null);
  const addedTableWrapperRef = useRef(null);
  const rowsScrollRef        = useRef(null);
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, drugs.length);

  const baseSearchList = searchMode === "embedded" ? DRUG_SUGGESTIONS : SORTED_DRUG_SUGGESTIONS;
  const suggestions = query.length > 1
    ? baseSearchList.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const setD = k => v => setDraft(prev => ({ ...prev, [k]: v }));

  const commitDraft = () => {
    if (!draft.name.trim()) return;
    if (editId !== null) {
      setDrugs(prev => prev.map(d => d.id === editId ? { ...d, ...draft } : d));
      setEditId(null);
    } else {
      setDrugs(prev => [...prev, { id: Date.now(), ...draft }]);
    }

    // Persist days only from the very first medicine (SNo 1); subsequent medicines don't overwrite it
    if (drugs.length === 0) {
      persistedDaysRef.current = draft.days;
    }

    setShowAddRow(false);
    setTimeout(() => {
      // Build next draft using persisted days — no setState race possible because
      // we read from the ref, not from stale closure state
      setDraft(makeFreshDraft(persistedDaysRef.current));
      setQuery("");
      setShowAddRow(true);
      setTimeout(() => addRowRef.current?.focusName(), 100);
    }, 50);
  };

  const cancelAdd = () => {
    setShowAddRow(false);
    setDraft(makeFreshDraft(persistedDaysRef.current));
    setQuery("");
    setEditId(null);
  };

  const startEdit = drug => {
    setEditId(drug.id);
    setDraft({ name: drug.name, form: drug.form, intake: drug.intake, period: drug.period, when: drug.when, detail: drug.detail, days: drug.days });
    setQuery(drug.name);
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusName(), 50);
  };

  const toggleStrike = id => setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const deleteDrug = id => {
    setDrugs(prev => prev.filter(d => d.id !== id));
    setStruckIds(prev => prev.filter(x => x !== id));
    if (selectedRowId === id) setSelectedRowId(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all medicines?")) {
      setDrugs([]); setStruckIds([]); setShowAddRow(false); setSelectedRowId(null);
    }
  };

  const handleSave  = () => alert("Prescription saved successfully!");
  const handleProto = () => alert("Proto feature coming soon!");

  const handleAddRepeatPrescription = title => {
    setRepeatPrescriptions(prev => [...prev, { id: Date.now(), title, days: 0, drugCount: 0 }]);
  };
  const handleModifyRepeatPrescription = (id, title) => {
    setRepeatPrescriptions(prev => prev.map(p => p.id === id ? { ...p, title } : p));
  };
  const handleDeleteRepeatPrescription = id => {
    if (window.confirm("Delete this repeat prescription?")) {
      setRepeatPrescriptions(prev => prev.filter(p => p.id !== id));
    }
  };
  const handleViewRepeatPrescription = p => {
    alert(`${p.title}\n${p.drugCount} drug(s) · ${p.days} day(s)`);
  };

  const handleAddNewMedicine = () => {
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusName(), 100);
  };

  const handleRowArrowNav = useCallback((currentId, direction) => {
    const idx = drugs.findIndex(d => d.id === currentId);
    let nextIdx = direction === "down" ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= drugs.length) return;
    const nextId = drugs[nextIdx].id;
    setSelectedRowId(nextId);
    const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${nextId}"]`);
    if (row) row.focus();
  }, [drugs]);

  useEffect(() => {
    const handler = e => {
      if (!e.altKey || (e.key !== "t" && e.key !== "T")) return;
      e.preventDefault();
      const activeEl = document.activeElement;
      const inAddTable = activeEl?.closest('[data-add-row="true"]');
      if (inAddTable) {
        const targetId = selectedRowId ?? drugs[0]?.id;
        if (targetId != null) {
          const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${targetId}"]`);
          if (row) { row.focus(); setSelectedRowId(targetId); }
        }
      } else {
        if (showAddRow && addRowRef.current) addRowRef.current.focusName();
        else handleAddNewMedicine();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drugs, selectedRowId, showAddRow]);

  const addRowProps = {
    draft, onDraftChange: setD, onCommit: commitDraft, onCancel: cancelAdd,
    query, setQuery, suggestions, rowNumber: drugs.length + 1, searchMode,
  };

  return (
    <div className="flex items-start gap-3" style={{ height: "100%" }}>
    <div className="flex flex-col rounded-xs overflow-hidden shadow-lg flex-1 min-w-0"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", height: "100%", minHeight: "300px" }}>

      {/* HEADER / TOOLBAR — Clear, Save & the shortcut info icon live here alongside Paste/Proto/etc. */}
      <div className="flex-shrink-0">
        <ModernToolbar
          onProto={handleProto}
          onClear={handleClearAll}
          onSave={handleSave}
        />
      </div>

      {/* BODY — pb reserves room below the add row so its search dropdown can open downward */}
      <div className="flex-1 flex flex-col overflow-hidden pb-44">

        {/* ── ADDED MEDICINES TABLE (top) ── */}
        <div ref={addedTableWrapperRef} className="flex-1 flex flex-col overflow-hidden">
          <TableHeader />
          <div ref={rowsScrollRef} className="overflow-y-auto flex-1">
            {drugs.map((drug, index) => (
              <DrugRow
                key={drug.id}
                drug={drug}
                index={index}
                isStruck={struckIds.includes(drug.id)}
                isSelected={selectedRowId === drug.id}
                onSelect={() => setSelectedRowId(drug.id)}
                onDelete={() => deleteDrug(drug.id)}
                onStrike={() => toggleStrike(drug.id)}
                onEdit={() => startEdit(drug)}
                onArrowNav={dir => handleRowArrowNav(drug.id, dir)}
              />
            ))}
            {Array.from({ length: fillRowCount }).map((_, i) => (
              <EmptyDrugRow key={`empty-${i}`} index={drugs.length + i} />
            ))}
          </div>
        </div>

        {/* ── SEARCH MODE (above the add row) ── */}
        <SearchModeToggle
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          drugType={drugType}
          onDrugTypeChange={setDrugType}
          frequentOnly={frequentOnly}
          onFrequentOnlyChange={setFrequentOnly}
        />

        {/* ── ADD MEDICINE TABLE (bottom) ── */}
        <div ref={addTableWrapperRef} className="flex-shrink-0">
          <AddTableHeader />
          {showAddRow ? (
            <AddRow ref={addRowRef} {...addRowProps} />
          ) : (
            <div className="flex items-center justify-center py-3 border-t cursor-pointer transition-all"
              style={{ background: "var(--color-drugs-light)", borderColor: "var(--color-drugs)" }}
              onClick={handleAddNewMedicine}>
              <button className="px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                style={{ background: "var(--color-drugs)", color: "white" }}>
                <Plus size={14} /> Add Medicine
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 h-1"
        style={{ background: "linear-gradient(90deg, var(--color-drugs) 0%, var(--color-primary) 50%, var(--color-lab) 100%)", opacity: 0.3 }}
      />
    </div>

      {/* ══════════ RIGHT PANEL — Repeat Prescriptions ══════════ */}
      <RepeatPrescriptionsPanel
        prescriptions={repeatPrescriptions}
        onAdd={handleAddRepeatPrescription}
        onModify={handleModifyRepeatPrescription}
        onDelete={handleDeleteRepeatPrescription}
        onView={handleViewRepeatPrescription}
      />
    </div>
  );
}