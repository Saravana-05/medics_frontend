import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Plus, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  Settings, ChevronDown, Briefcase, Activity, Heart, Mic, Zap,
  BookOpen, Trash, List, ListChecks, Paperclip, Download, Eye
} from "lucide-react";
import { SERVICE_SUGGESTIONS } from "./mockData";
import useFillRowCount from "../../hooks/useFillRowCount";

const DETAIL_OPTIONS = ["—","Chest (Lung)","Abdomen","Upper Crest","Pelvis","Whole Abdomen","Brain","Lumbar Spine","Right Knee","Left Knee","Shoulder","Hip","Ankle","Both Knees","Neck"];

const SORTED_SERVICE_SUGGESTIONS = [...SERVICE_SUGGESTIONS].sort((a, b) => a.localeCompare(b));

const FIELD_ORDER = ["name", "detail", "commit"];

/* Fixed row height (px) used to compute how many blank rows fill the remaining
   visible space in the added-services grid — see useFillRowCount. */
const ROW_HEIGHT_PX = 52;

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function getFileTypeLabel(fileName) {
  if (!fileName) return "";
  const ext = fileName.split(".").pop();
  return ext ? ext.toUpperCase() : "";
}

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

/* ── Search-mode + prescription-mode row — sits above the add row ── */
function SearchModeToggle({ searchMode, onSearchModeChange, prescriptionMode, onPrescriptionModeChange }) {
  return (
    <div className="flex items-center gap-4 px-3 py-2 flex-shrink-0 border-t" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      {/* Alphabet/Embedded checkboxes */}
      <div className="flex items-center gap-3">
        <span className="text-[0.72rem] font-semibold" style={{ color: "var(--color-text-base)" }}>Search:</span>
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
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
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
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
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
  );
}

/* ── Modern Toolbar Component ── */
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

/* ── Portal Dropdown ── */
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

/* ── Added Service Table Header (left: service info, right: attached file) ── */
function TableHeader() {
  const leftColumns = [
    { label: "S.No", width: "w-16" },
    { label: "Name", width: "flex-1" },
    { label: "Remarks", width: "w-40" },
    { label: "Actions", width: "w-28", center: true },
  ];
  const rightColumns = [
    { label: "File Name", width: "flex-1" },
    { label: "Type", width: "w-20", center: true },
    { label: "Size", width: "w-24", center: true },
    { label: "Date & Time", width: "w-40", center: true },
    { label: "Actions", width: "w-28", center: true },
  ];
  return (
    <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-services-light)", borderColor: "var(--color-border)" }}>
      <div className="flex flex-1">
        {leftColumns.map(col => (
          <div key={col.label} className={`${col.width} px-3 py-2.5 ${col.center ? 'text-center' : ''}`}
            style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-services)" }}>
            {col.label}
          </div>
        ))}
      </div>
      <div className="w-0.5 flex-shrink-0" style={{ background: "var(--color-services)", opacity: 0.4 }} />
      <div className="flex flex-1">
        {rightColumns.map(col => (
          <div key={col.label} className={`${col.width} px-3 py-2.5 ${col.center ? 'text-center' : ''}`}
            style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-services)" }}>
            {col.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Empty placeholder row — same grid as ServiceRow, shown when no services added yet ── */
function EmptyServiceRow({ index }) {
  return (
    <div
      className="flex border-b"
      style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)" }}
    >
      <div className="flex flex-1">
        <div className="w-16 px-3 py-2 text-center">&nbsp;</div>
        <div className="flex-1 px-3 py-2">&nbsp;</div>
        <div className="w-40 px-3 py-2">&nbsp;</div>
        <div className="w-28 px-3 py-2 text-center">&nbsp;</div>
      </div>
      <div className="w-0.5 flex-shrink-0" style={{ background: "var(--color-services)", opacity: 0.2 }} />
      <div className="flex flex-1">
        <div className="flex-1 px-3 py-2">&nbsp;</div>
        <div className="w-20 px-3 py-2 text-center">&nbsp;</div>
        <div className="w-24 px-3 py-2 text-center">&nbsp;</div>
        <div className="w-40 px-3 py-2 text-center">&nbsp;</div>
        <div className="w-28 px-3 py-2 text-center">&nbsp;</div>
      </div>
    </div>
  );
}

/* ── Service Row Component (left: service info + actions, right: attached file + actions) ── */
function ServiceRow({ service, index, isStruck, isSelected, onSelect, onDelete, onStrike, onEdit, onArrowNav, onFileUpload, onFileRemove }) {
  const fileInputRef = useRef(null);
  const hasFile = !!service.fileName;

  const handleFilePick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(service.id, file);
    e.target.value = "";
  };

  const handleView = (e) => {
    e.stopPropagation();
    if (service.fileUrl) window.open(service.fileUrl, "_blank");
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!service.fileUrl) return;
    const a = document.createElement("a");
    a.href = service.fileUrl;
    a.download = service.fileName || "file";
    a.click();
  };

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
      {/* ── Left: service info ── */}
      <div className="flex flex-1">
        <div className="w-16 px-3 py-2 text-center">
          <span className="text-sm font-bold" style={{ color: "var(--color-services)" }}>{index + 1}</span>
        </div>
        <div className="flex-1 px-3 py-2">
          <span className={`text-sm font-semibold ${isStruck ? "line-through" : ""}`} style={{ color: "var(--color-text-base)" }}>
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

      {/* ── Divider ── */}
      <div className="w-0.5 flex-shrink-0" style={{ background: "var(--color-border)" }} />

      {/* ── Right: attached file ── */}
      <div className="flex flex-1">
        <div className="flex-1 px-3 py-2 flex items-center min-w-0">
          {hasFile ? (
            <span className="text-sm truncate flex items-center gap-1.5" style={{ color: "var(--color-text-base)" }}>
              <Paperclip size={13} style={{ color: "var(--color-services)" }} />
              <span className="truncate">{service.fileName}</span>
            </span>
          ) : (
            <button
              onClick={handleFilePick}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
              style={{ background: "var(--color-services-light)", color: "var(--color-services)", border: "1px dashed var(--color-services)" }}
            >
              <Paperclip size={12} /> Attach File
            </button>
          )}
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
        </div>
        <div className="w-20 px-2 py-2 text-center">
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{getFileTypeLabel(service.fileName)}</span>
        </div>
        <div className="w-24 px-2 py-2 text-center">
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatFileSize(service.fileSize)}</span>
        </div>
        <div className="w-40 px-2 py-2 text-center">
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatDateTime(service.fileDateTime)}</span>
        </div>
        <div className="w-28 px-2 py-2 flex items-center justify-center gap-1.5">
          <button onClick={handleView} disabled={!hasFile} title="View" className="p-1.5 rounded transition-all"
            style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)", opacity: hasFile ? 1 : 0.4, cursor: hasFile ? "pointer" : "not-allowed" }}
            onMouseEnter={(e) => { if (hasFile) e.currentTarget.style.background = "var(--color-primary-light)"; }}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary-muted)"}>
            <Eye size={14} />
          </button>
          <button onClick={handleDownload} disabled={!hasFile} title="Download" className="p-1.5 rounded transition-all"
            style={{ background: "var(--color-services-light)", color: "var(--color-services)", opacity: hasFile ? 1 : 0.4, cursor: hasFile ? "pointer" : "not-allowed" }}
            onMouseEnter={(e) => { if (hasFile) e.currentTarget.style.background = "#d0e4f5"; }}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-services-light)"}>
            <Download size={14} />
          </button>
          <button onClick={e => { e.stopPropagation(); onFileRemove(service.id); }} disabled={!hasFile} title="Remove File" className="p-1.5 rounded transition-all"
            style={{ background: "#fee2e2", color: "var(--color-danger)", opacity: hasFile ? 1 : 0.4, cursor: hasFile ? "pointer" : "not-allowed" }}
            onMouseEnter={(e) => { if (hasFile) e.currentTarget.style.background = "#fecaca"; }}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}>
            <X size={14} />
          </button>
        </div>
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
          <div>
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
const EMPTY_FILE_FIELDS = { fileName: "", fileType: "", fileSize: 0, fileDateTime: null, fileUrl: "" };

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
  const rowsScrollRef = useRef(null);
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, services.length);

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
        setServices(prev => [...prev, { id: Date.now(), ...draft, ...EMPTY_FILE_FIELDS }]);
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
        setServices(prev => [...prev, { id: Date.now(), ...draft, ...EMPTY_FILE_FIELDS }]);
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

  const handleFileUpload = (id, file) => {
    const fileUrl = URL.createObjectURL(file);
    setServices(prev => prev.map(s => s.id === id ? {
      ...s,
      fileName: file.name,
      fileType: getFileTypeLabel(file.name),
      fileSize: file.size,
      fileDateTime: new Date().toISOString(),
      fileUrl,
    } : s));
  };

  const handleFileRemove = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...EMPTY_FILE_FIELDS } : s));
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
          onClear={handleClearAll}
          onSave={handleSave}
        />
      </div>

      {/* BODY — pb reserves room below the add row so its search dropdown can open downward */}
      <div className="flex-1 flex flex-col overflow-hidden pb-44">

        {/* ── ADDED SERVICE TABLE (top): left = service info, right = attached file ── */}
        <div ref={addedTableWrapperRef} className="flex-1 flex flex-col overflow-hidden">
          <TableHeader />
          <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
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
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
              />
            ))}
            {Array.from({ length: fillRowCount }).map((_, i) => (
              <EmptyServiceRow key={`empty-${i}`} index={services.length + i} />
            ))}
          </div>
        </div>

        {/* ── SEARCH / PRESCRIPTION MODE (above the add row) ── */}
        <SearchModeToggle
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          prescriptionMode={prescriptionMode}
          onPrescriptionModeChange={setPrescriptionMode}
        />

        {/* ── ADD SERVICE TABLE (bottom) ── */}
        <div ref={addTableWrapperRef} className="flex-shrink-0">
          <AddTableHeader />
          {showAddRow ? (
            <AddRow ref={addRowRef} {...addRowProps} />
          ) : (
            <div className="flex items-center justify-center py-3 border-t cursor-pointer transition-all"
              style={{ background: "var(--color-services-light)", borderColor: "var(--color-services)" }}
              onClick={handleAddNewService}>
              <button className="px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                style={{ background: "var(--color-services)", color: "white" }}>
                <Plus size={14} /> Add Service
              </button>
            </div>
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