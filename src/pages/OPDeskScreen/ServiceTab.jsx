import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Plus, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  Settings, Search, ChevronDown, Briefcase, Activity, Heart, Mic, Zap,
  BookOpen, Trash, List, ListChecks, Info
} from "lucide-react";
import { SERVICE_SUGGESTIONS } from "./mockData";

const DETAIL_OPTIONS = ["—","Chest (Lung)","Abdomen","Upper Crest","Pelvis","Whole Abdomen","Brain","Lumbar Spine","Right Knee","Left Knee","Shoulder","Hip","Ankle","Both Knees","Neck"];

const SORTED_SERVICE_SUGGESTIONS = [...SERVICE_SUGGESTIONS].sort((a, b) => a.localeCompare(b));

const FIELD_ORDER = ["name", "detail", "commit"];

/* ── Action Button Component ── */
function ActionButton({ onClick, variant = "primary", icon: Icon, label, disabled = false }) {
  const variants = {
    primary: { bg: "var(--color-primary)", color: "white", hoverBg: "var(--color-primary-light)" },
    success: { bg: "var(--color-services)", color: "white", hoverBg: "#0d4b8f" },
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

/* ── Keyboard-shortcut hint — icon that reveals shortcuts on hover ── */
function ShortcutHint() {
  const shortcuts = [
    { keys: "Alt + T", desc: "Switch tables" },
    { keys: "Alt + E", desc: "Edit row" },
    { keys: "Alt + Del", desc: "Delete row" },
  ];
  return (
    <div className="relative group flex items-center">
      <Info size={16} className="cursor-help" style={{ color: "var(--color-text-subtle)" }} />
      <div
        className="absolute right-0 top-full mt-1.5 z-50 hidden group-hover:block rounded-lg p-2 shadow-lg"
        style={{ background: "var(--color-text-base)", minWidth: "180px" }}
      >
        <div className="text-[0.6rem] font-bold uppercase tracking-wider mb-1.5 px-1" style={{ color: "var(--color-text-subtle)" }}>
          Keyboard shortcuts
        </div>
        {shortcuts.map(s => (
          <div key={s.keys} className="flex items-center justify-between gap-3 px-1 py-0.5">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>{s.desc}</span>
            <kbd className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
              {s.keys}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Modern Toolbar Component ── */
function ModernToolbar({ onProto, searchMode, onSearchModeChange, prescriptionMode, onPrescriptionModeChange, onClear, onSave }) {
  return (
    <div className="flex items-center justify-between p-2 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-4">
        {/* Alphabet/Embedded checkboxes */}
        <div className="flex items-center gap-3">
          {[{ value: "alpha", label: "Alphabet" }, { value: "embedded", label: "Embedded" }].map(({ value, label }) => {
            const checked = searchMode === value;
            return (
              <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none"
                style={{ fontSize: "0.72rem", fontWeight: checked ? "700" : "500", color: checked ? "var(--color-services)" : "var(--color-text-muted)" }}>
                <span onClick={() => onSearchModeChange(value)} className="flex items-center justify-center rounded transition-all"
                  style={{ width: 15, height: 15, flexShrink: 0, cursor: "pointer",
                    border: `2px solid ${checked ? "var(--color-services)" : "var(--color-border)"}`,
                    background: checked ? "var(--color-services)" : "var(--color-surface)" }}>
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

        {/* Divider */}
        <div className="w-px h-6" style={{ background: "var(--color-border)" }} />

        {/* Prescription Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPrescriptionModeChange("all")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              prescriptionMode === "all" 
                ? "bg-var(--color-services) text-white" 
                : "bg-transparent text-var(--color-text-muted) hover:bg-var(--color-surface-alt)"
            }`}
            style={{
              background: prescriptionMode === "all" ? "var(--color-services)" : "transparent",
              color: prescriptionMode === "all" ? "white" : "var(--color-text-muted)",
              border: prescriptionMode === "all" ? "none" : "1px solid var(--color-border)",
            }}
          >
            <List size={14} />
            All
          </button>
          <button
            onClick={() => onPrescriptionModeChange("onebyone")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              prescriptionMode === "onebyone" 
                ? "bg-var(--color-services) text-white" 
                : "bg-transparent text-var(--color-text-muted) hover:bg-var(--color-surface-alt)"
            }`}
            style={{
              background: prescriptionMode === "onebyone" ? "var(--color-services)" : "transparent",
              color: prescriptionMode === "onebyone" ? "white" : "var(--color-text-muted)",
              border: prescriptionMode === "onebyone" ? "none" : "1px solid var(--color-border)",
            }}
          >
            <ListChecks size={14} />
            One by One
          </button>
        </div>
      </div>

      {/* Right-side action buttons */}
      <div className="flex items-center gap-2">
        <ActionButton variant="ghost" icon={Clipboard} label="Paste" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={BookOpen} label="Proto" onClick={onProto} />
        <ActionButton variant="ghost" icon={FileText} label="Preview" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={Printer} label="Print" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ShortcutHint />
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
    <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-services)", borderColor: "var(--color-services)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.width} px-2 py-2 ${col.center ? 'text-center' : ''}`}
          style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "white" }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Added Service Table Header ── */
function TableHeader() {
  const columns = [
    { label: "S.No", width: "w-16" },
    { label: "Name", width: "flex-1" },
    { label: "Remarks", width: "w-40" },
    { label: "Actions", width: "w-28", center: true },
  ];
  return (
    <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-services-light)", borderColor: "var(--color-border)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.width} px-3 py-2.5 ${col.center ? 'text-center' : ''}`}
          style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-services)" }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Service Row Component ── */
function ServiceRow({ service, index, isStruck, isSelected, onSelect, onDelete, onStrike, onEdit, onArrowNav }) {
  return (
    <div
      tabIndex={0}
      data-row-id={service.id}
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
          ? "var(--color-services-light)"
          : isStruck
            ? "var(--color-surface-alt)"
            : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1,
        boxShadow: isSelected ? "inset 0 0 0 2px var(--color-services)" : "none",
      }}
    >
      <div className="w-16 px-3 py-2 text-center">
        <span className="text-sm font-bold" style={{ color: "var(--color-services)" }}>{index + 1}</span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className={`text-sm font-semibold inline-flex items-center gap-1.5 ${isStruck ? "line-through" : ""}`} style={{ color: "var(--color-text-base)" }}>
          <Briefcase size={14} style={{ color: "var(--color-services)" }} />
          {service.name}
        </span>
      </div>
      <div className="w-40 px-3 py-2">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{service.detail === "—" ? "—" : service.detail}</span>
      </div>
      <div className="w-28 px-2 py-2 flex items-center justify-center gap-1.5">
        <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded transition-all" title="Edit (Alt+E)"
          style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary-muted)"}>
          <Edit2 size={14} />
        </button>
        <button onClick={e => { e.stopPropagation(); onStrike(); }} className="p-1.5 rounded transition-all" title={isStruck ? "Undo Strike (S)" : "Strike (S)"}
          style={{ background: "var(--color-services-light)", color: "var(--color-services)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#d0e4f5"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-services-light)"}>
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
        placeholder="Type or select body part..."
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
              style={{ background: highlightedIdx === i ? "var(--color-services-light)" : "transparent" }}
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
  suggestions, onCancel, rowNumber, searchMode, prescriptionMode 
}, ref) => {
  const inputRef = useRef(null);
  const rowRef = useRef(null);
  const nameWrapRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [serviceSelected, setServiceSelected] = useState(() => !!query);

  React.useImperativeHandle(ref, () => ({
    focusName: () => inputRef.current?.focus(),
  }));

  useEffect(() => { setServiceSelected(!!query.trim()); }, [query]);

  const baseList = searchMode === "embedded" ? SERVICE_SUGGESTIONS : SORTED_SERVICE_SUGGESTIONS;
  const dropdownItems = query === "" ? baseList : suggestions.slice(0, 8);
  const listLabel = query === "" ? (searchMode === "embedded" ? "Services (Embedded)" : "Services (A–Z)") : "Search Results";

  const handleSelectService = (service) => {
    setQuery(service);
    onDraftChange("name")(service);
    setServiceSelected(true);
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleClearService = () => {
    setQuery("");
    onDraftChange("name")("");
    setServiceSelected(false);
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
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); handleSelectService(dropdownItems[highlightedIdx]); return; }
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
      style={{ background: "var(--color-services-light)", borderColor: "var(--color-services)" }}
      onBlur={handleRowBlur}
    >
      {/* S.No */}
      <div className="w-12 px-2 py-2 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold" style={{ color: "var(--color-services)" }}>{rowNumber}</span>
      </div>

      {/* Name - with portal dropdown */}
      <div className="flex-1 relative min-w-0 px-1 py-1.5 flex items-center" ref={nameWrapRef}>
        <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-services)" }} />
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
          onBlur={() => setTimeout(() => { setShowDropdown(false); if (query.trim()) setServiceSelected(true); }, 200)}
          onKeyDown={e => handleFieldKeyDown(e, "name")}
          placeholder="Search or select service (A–Z)..."
          className="w-full py-1.5 rounded text-sm font-medium"
          style={{
            border: serviceSelected ? "1.5px solid var(--color-services)" : "1px solid var(--color-border)",
            background: serviceSelected ? "var(--color-services-light)" : "var(--color-surface)",
            color: "var(--color-services)",
            paddingLeft: "1.75rem",
            paddingRight: serviceSelected ? "3.5rem" : "1.75rem",
          }}
        />
        {serviceSelected && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleClearService(); }}
            title="Clear service"
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
          onMouseDown={(e) => { e.preventDefault(); if (serviceSelected) handleClearService(); else setShowDropdown(v => !v); }}
        />

        <PortalDropdown anchorEl={nameWrapRef.current} open={showDropdown && dropdownItems.length > 0}>
          <div className="max-h-72 overflow-y-auto">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider sticky top-0"
              style={{ color: "var(--color-text-muted)", background: "var(--color-primary-muted)" }}>
              {listLabel}
            </div>
            {dropdownItems.map((service, i) => (
              <div
                key={service}
                onMouseDown={() => handleSelectService(service)}
                className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: highlightedIdx === i ? "var(--color-services-light)" : "transparent"
                }}
                onMouseEnter={() => setHighlightedIdx(i)}
                onMouseLeave={() => setHighlightedIdx(-1)}
              >
                {query === ""
                  ? <Briefcase size={14} style={{ color: "var(--color-services)" }} />
                  : <Search size={12} style={{ color: "var(--color-primary)" }} />
                }
                <span style={{ color: "var(--color-text-base)" }}>{service}</span>
              </div>
            ))}
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
          style={{ background: "var(--color-services)", color: "white" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#0d4b8f"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-services)"}
          title="Add Service (Enter)">
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

/* ═══════════════════════════════════════════════ MAIN SERVICE TAB COMPONENT ═══════════════ */
const EMPTY_DRAFT = { name: "", detail: "—" };

export default function ServiceTab({ services, setServices, patient }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [searchMode, setSearchMode] = useState("alpha");
  const [prescriptionMode, setPrescriptionMode] = useState("all"); // "all" | "onebyone"

  const addRowRef = useRef(null);
  const addTableWrapperRef = useRef(null);
  const addedTableWrapperRef = useRef(null);

  const baseSearchList = searchMode === "embedded" ? SERVICE_SUGGESTIONS : SORTED_SERVICE_SUGGESTIONS;
  const suggestions = query.length > 1
    ? baseSearchList.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const setD = (k) => (v) => setDraft(prev => ({ ...prev, [k]: v }));

  const commitDraft = () => {
    if (!draft.name.trim()) return;
    
    if (prescriptionMode === "all") {
      // Add all selected services at once
      // For now, just add the single service
      if (editId !== null) {
        setServices(prev => prev.map(s => s.id === editId ? { ...s, ...draft } : s));
        setEditId(null);
      } else {
        setServices(prev => [...prev, { id: Date.now(), ...draft }]);
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
    } else {
      // One by One mode - commit and keep row for next entry
      if (editId !== null) {
        setServices(prev => prev.map(s => s.id === editId ? { ...s, ...draft } : s));
        setEditId(null);
        setDraft(EMPTY_DRAFT);
        setQuery("");
        setTimeout(() => addRowRef.current?.focusName(), 100);
      } else {
        setServices(prev => [...prev, { id: Date.now(), ...draft }]);
        // Keep the form for next entry
        setDraft(EMPTY_DRAFT);
        setQuery("");
        setTimeout(() => addRowRef.current?.focusName(), 100);
      }
    }
  };

  const cancelAdd = () => {
    setShowAddRow(false);
    setDraft(EMPTY_DRAFT);
    setQuery("");
    setEditId(null);
  };

  const startEdit = (service) => {
    setEditId(service.id);
    setDraft({ name: service.name, detail: service.detail });
    setQuery(service.name);
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusName(), 50);
  };

  const toggleStrike = (id) => {
    setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setStruckIds(prev => prev.filter(x => x !== id));
    if (selectedRowId === id) setSelectedRowId(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all services?")) {
      setServices([]);
      setStruckIds([]);
      setShowAddRow(false);
      setSelectedRowId(null);
    }
  };

  const handleSave = () => alert("Services saved successfully!");
  const handleProto = () => alert("Proto feature coming soon!");

  const handleAddNewService = () => {
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusName(), 100);
  };

  const handleRowArrowNav = useCallback((currentId, direction) => {
    const idx = services.findIndex(s => s.id === currentId);
    let nextIdx = direction === "down" ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= services.length) return;
    const nextId = services[nextIdx].id;
    setSelectedRowId(nextId);
    const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${nextId}"]`);
    if (row) row.focus();
  }, [services]);

  // Alt+T to toggle between tables
  useEffect(() => {
    const handler = (e) => {
      if (!e.altKey || (e.key !== "t" && e.key !== "T")) return;
      e.preventDefault();
      const activeEl = document.activeElement;
      const inAddTable = activeEl?.closest('[data-add-row="true"]');
      if (inAddTable) {
        const targetId = selectedRowId ?? services[0]?.id;
        if (targetId != null) {
          const row = addedTableWrapperRef.current?.querySelector(`[data-row-id="${targetId}"]`);
          if (row) { row.focus(); setSelectedRowId(targetId); }
        }
      } else {
        if (showAddRow && addRowRef.current) addRowRef.current.focusName();
        else handleAddNewService();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [services, selectedRowId, showAddRow]);

  const addRowProps = {
    draft, onDraftChange: setD, onCommit: commitDraft, onCancel: cancelAdd,
    query, setQuery, suggestions, rowNumber: services.length + 1, searchMode, prescriptionMode,
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
      {/* HEADER / TOOLBAR — Clear, Save & the shortcut info icon live here alongside Paste/Proto/etc. */}
      <div className="flex-shrink-0">
        <ModernToolbar
          onProto={handleProto}
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          prescriptionMode={prescriptionMode}
          onPrescriptionModeChange={setPrescriptionMode}
          onClear={handleClearAll}
          onSave={handleSave}
        />
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── ADD SERVICE TABLE ── */}
        <div ref={addTableWrapperRef} className="flex-shrink-0">
          <AddTableHeader />
          {showAddRow ? (
            <AddRow ref={addRowRef} {...addRowProps} />
          ) : (
            <div className="flex items-center justify-center py-3 border-b cursor-pointer transition-all"
              style={{ background: "var(--color-services-light)", borderColor: "var(--color-services)" }}
              onClick={handleAddNewService}>
              <button className="px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                style={{ background: "var(--color-services)", color: "white" }}>
                <Plus size={14} /> Add Service
              </button>
            </div>
          )}
        </div>

        {/* ── ADDED SERVICE TABLE ── */}
        <div ref={addedTableWrapperRef} className="flex-1 flex flex-col overflow-hidden mt-6">
          {services.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-5">
              <div className="text-center">
                <div className="mb-2 p-4 rounded-full inline-flex" style={{ background: "var(--color-services-light)" }}>
                  <Settings size={20} style={{ color: "var(--color-services)" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-base)" }}>No Services Ordered Yet</h3>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Use the table above to add your first service.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 pb-2">
                <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-subtle)" }}>
                  Added Services ({services.length})
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
              </div>
              <TableHeader />
              <div className="overflow-y-auto">
                {services.map((service, index) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    index={index}
                    isStruck={struckIds.includes(service.id)}
                    isSelected={selectedRowId === service.id}
                    onSelect={() => setSelectedRowId(service.id)}
                    onDelete={() => deleteService(service.id)}
                    onStrike={() => toggleStrike(service.id)}
                    onEdit={() => startEdit(service)}
                    onArrowNav={dir => handleRowArrowNav(service.id, dir)}
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
        style={{ background: "linear-gradient(90deg, var(--color-services) 0%, var(--color-primary) 50%, var(--color-lab) 100%)", opacity: 0.3 }}
      />
    </div>
  );
}