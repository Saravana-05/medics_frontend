
import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { Plus, X, Edit2, MinusCircle, RotateCcw, ChevronDown } from "lucide-react";
import useFillRowCount from "../../hooks/useFillRowCount";

const ROW_HEIGHT_PX = 42;
const NONE_OPTION = "<None>";

/* ── Portal Dropdown (unchanged from DrugTab) ── */
// Every dropdown opened from the entry section extends to the footer's bottom edge.

function PortalDropdown({ anchorEl, open, children }) {
  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const footerBottom = document.querySelector("[data-prescription-entry-footer]")?.getBoundingClientRect().bottom
    ?? window.innerHeight;
  const availableHeight = Math.max(0, footerBottom - rect.bottom - 2);
  const style = {
    position: "fixed",
    top: rect.bottom + 2,
    left: rect.left,
    width: rect.width,
    height: availableHeight,
    maxHeight: availableHeight,
    boxSizing: "border-box",
    zIndex: 99999,
  };

  return ReactDOM.createPortal(
    <div className="dropdown-thin-scrollbar" style={{ ...style, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", overflowY: "auto" }}>
      {children}
    </div>, document.body
  );
}

/* Flat, borderless segments that sit flush against each other, shaded from the
   active tab's own accent color — light green/green/dark green on Drug, light
   brown/brown/dark brown on Lab, etc. — instead of a fixed color regardless of tab. */
function ActionButton({ onClick, label, bg, hoverBg, textColor = "white" }) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center justify-center px-3.5 text-[0.72rem] font-semibold transition-all duration-150 cursor-pointer leading-none"
      style={{ background: bg, color: textColor, height: "30px", boxSizing: "border-box" }}
      onMouseEnter={e => e.currentTarget.style.background = hoverBg}
      onMouseLeave={e => e.currentTarget.style.background = bg}>
      {label}
    </button>
  );
}

function SearchModeCheckbox({ checked, onClick, label, accentColor, textAccent, accentText = "white" }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none"
      style={{ fontSize: "13px", fontWeight: "400", color: checked ? (textAccent || accentColor) : "var(--color-text-muted)" }}>
      <span onClick={onClick} className="flex items-center justify-center rounded transition-all"
        style={{ width: 15, height: 15, flexShrink: 0, cursor: "pointer", border: `2px solid ${checked ? accentColor : "var(--color-border)"}`, background: checked ? accentColor : "var(--color-surface)" }}>
        {checked && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><polyline points="1.5,4.5 3.5,7 7.5,2" stroke={accentText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <span onClick={onClick}>{label}</span>
    </label>
  );
}

/* ── Bottom footer bar: entity-type filter + record count + Alphabet/Embedded/Frequent
   search mode + "New X" button — sits below the add-row (config-driven labels). ── */
function EntryFooterBar({
  searchMode, onSearchModeChange, typeValue, onTypeChange, typeOptions, filterLabel,
  frequentOnly, onFrequentOnlyChange, accentColor, accentText = "white", textAccent, recordCount, newEntityButton, onNewEntity, hideNewButton = false, className = "",
}) {
  return (
    <div data-prescription-entry-footer className={`flex items-center justify-between gap-4 px-4 flex-shrink-0 border-t ${className}`} style={{ height: "48px", boxSizing: "border-box", background: "var(--color-primary-muted)", borderColor: "var(--color-border)", fontSize: "13px" }}>
      <div className="ml-10 mr-2 flex min-w-0 flex-shrink items-center gap-2 overflow-hidden">
        <span className="flex-shrink-0 whitespace-nowrap" style={{ color: "var(--color-text-base)", fontSize: "13px", fontWeight: "400" }}>{filterLabel}:</span>
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <select value={typeValue} onChange={e => onTypeChange(e.target.value)}
            className="w-32 max-w-full flex-shrink px-2 py-1 outline-none"
            style={{ fontSize: "13px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            {typeOptions.map(opt => <option key={opt} style={{ fontSize: "13px" }}>{opt}</option>)}
          </select>
          <span className="flex-shrink-0 whitespace-nowrap" style={{ color: "var(--color-text-subtle)", fontSize: "13px" }}>Showing {recordCount}/{recordCount}</span>
        </div>
      </div>

      <div className="flex items-center" style={{ marginLeft: "97px", gap: "4px" }}>
        <SearchModeCheckbox checked={searchMode === "alpha"} onClick={() => onSearchModeChange("alpha")} label="Alphabet" accentColor={accentColor} textAccent={textAccent} accentText={accentText} />
        <SearchModeCheckbox checked={searchMode === "embedded"} onClick={() => onSearchModeChange("embedded")} label="Embedded" accentColor={accentColor} textAccent={textAccent} accentText={accentText} />
        <div>
          <SearchModeCheckbox checked={frequentOnly} onClick={() => onFrequentOnlyChange(!frequentOnly)} label="Frequent" accentColor={accentColor} textAccent={textAccent} accentText={accentText} />
        </div>
      </div>

      {!hideNewButton && (
        <button onClick={onNewEntity} className="ml-auto flex flex-shrink-0 items-center gap-1.5" style={{ color: textAccent || accentColor, fontSize: "13px", fontWeight: "400" }}>
          {newEntityButton}
          <span className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: accentColor, color: accentText }}>
            <Plus size={12} />
          </span>
        </button>
      )}
    </div>
  );
}

export function ModernToolbar({ onClear, onSave, onPreview, accentColor, accentLight, accentText }) {
  const darkText = accentText || "white";
  // Five distinct shades of the active tab's own accent color, lightest to
  // darkest — one per button, not just a 3-tier split.
  const toolbarPalettes = {
    "var(--color-drugs)": {
      normal: ["#b6c2c8", "#8699a5", "#566f80", "#0c324a", "#0a283b"],
      hover: ["#93a5af", "#667e8d", "#304f62", "#0b2d43", "#08202f"],
    },
    "var(--color-lab)": {
      normal: ["#edb9bc", "#e08b90", "#d15d64", "#c11720", "#9a121a"],
      hover: ["#e49a9f", "#d36a70", "#c93b43", "#ae151d", "#7d0f15"],
    },
    "var(--color-services)": {
      normal: ["#d1e1e9", "#b3cedd", "#8eb6ca", "#679cbc", "#527d96"],
      hover: ["#bfd5e1", "#9fc1d2", "#7aa8c0", "#5d8ca9", "#426478"],
    },
    "var(--color-careplan)": {
      normal: ["#b7d6d4", "#87bbb7", "#579f9a", "#0f766e", "#0c5e58"],
      hover: ["#99c7c3", "#67aaa5", "#339087", "#0e6a63", "#094c47"],
    },
    "var(--color-primary)": {
      normal: ["#b7d3eb", "#87b5de", "#5797d0", "#0f6cbd", "#0c5697"],
      hover: ["#99c2e5", "#679fd4", "#337fc6", "#0e61aa", "#094579"],
    },
  };
  const palette = toolbarPalettes[accentColor] || toolbarPalettes["var(--color-primary)"];
  const shades = palette.normal;
  const hoverShades = palette.hover;

  return (
    <div className="flex items-center overflow-hidden rounded-md">
      <ActionButton label="Clear" onClick={onClear} bg={shades[0]} hoverBg={hoverShades[0]} textColor="#1f2937" />
      <ActionButton label="Paste" bg={shades[1]} hoverBg={hoverShades[1]} textColor="#1f2937" />
      <ActionButton label="Preview" onClick={onPreview} bg={shades[2]} hoverBg={hoverShades[2]} textColor={darkText} />
      <ActionButton label="Save" onClick={onSave} bg={shades[3]} hoverBg={hoverShades[3]} textColor={darkText} />
      <ActionButton label="Print" bg={shades[4]} hoverBg={hoverShades[4]} textColor={darkText} />
    </div>
  );
}

/* ── Table headers built from config.tableColumns ── */
function TableHeader({ columns, accentColor, wrapLabels = false }) {
  return (
    <div className="table-header-text flex items-stretch border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: "40px", boxSizing: "border-box" }}>
      {columns.map(col => (
        <div key={col.key} className={`${col.width} ${wrapLabels ? "" : "min-w-0"} ${col.vertical ? "px-0.5 py-0.5 flex items-center justify-center" : "px-2 py-1 flex items-center justify-center"} text-center`}
          style={{ fontSize: "0.65rem", fontWeight: "700", letterSpacing: "0.02em", lineHeight: 1, color: "var(--color-primary-dark)",
            ...(col.vertical
              ? { writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" }
              : { overflow: "hidden", textOverflow: wrapLabels ? "clip" : "ellipsis", whiteSpace: wrapLabels ? "pre-line" : "nowrap" }) }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

function AddTableHeader({ columns, accentColor, accentText = "white" }) {
  return (
    <div className="table-header-text flex border-b flex-shrink-0" style={{ background: accentColor, borderColor: accentColor, height: "40px", boxSizing: "border-box" }}>
      {columns.map(col => (
        <div key={col.key} className={`${col.width} min-w-0 px-2 py-1 flex items-center justify-center text-center`}
          style={{ fontSize: "0.65rem", fontWeight: "700", letterSpacing: "0.02em", lineHeight: 1, color: accentText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

function EmptyRow({ columns }) {
  return (
    <div className="flex border-b" style={{ borderColor: "var(--color-border)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
      {columns.map(col => <div key={col.key} className={`${col.width} px-2 py-1 text-left`}>&nbsp;</div>)}
    </div>
  );
}

/* ── Data row — renders whatever fields config.computeRowDisplay produced ── */
function EntryRow({ item, index, columns, isStruck, isSelected, onSelect, onDelete, onStrike, onEdit, onArrowNav, accentColor, accentLight, dataFontSize, preserveFullText = false }) {
  return (
    <div tabIndex={0} data-row-id={item.id} onClick={onSelect} onFocus={onSelect}
      onKeyDown={e => {
        if (e.altKey && e.key.toLowerCase() === "e") { e.preventDefault(); onEdit(); return; }
        if (e.altKey && (e.key === "Delete" || e.key === "Backspace")) { e.preventDefault(); onDelete(); return; }
        if (e.key === "ArrowDown") { e.preventDefault(); onArrowNav?.("down"); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); onArrowNav?.("up"); return; }
      }}
      className="flex items-center border-b transition-all duration-150 outline-none cursor-pointer overflow-hidden"
      style={{ borderColor: "var(--color-border)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box",
        background: isSelected ? accentLight : isStruck ? "var(--color-surface-alt)" : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1, boxShadow: isSelected ? `inset 0 0 0 2px ${accentColor}` : "none" }}>
      {columns.map(col => {
        if (col.key === "no") return (
          <div key="no" className="w-12 px-2 py-1 text-center">
            <span className="text-xs font-normal" style={{ color: "var(--color-text-base)", fontSize: dataFontSize }}>{index + 1}</span>
          </div>
        );
        if (col.key === "name") return (
          <div key="name" className={`${col.width} min-w-0 px-2 py-1 text-left`}>
            <div className={`font-normal text-xs ${preserveFullText ? "whitespace-nowrap" : "truncate"}`} style={{ color: "var(--color-text-base)", fontSize: dataFontSize }}>
              {item.display.primaryLine ?? item.name}
            </div>
            {item.display.secondaryLine && (
              <div className={`text-xs mt-0.5 font-normal ${preserveFullText ? "whitespace-nowrap" : "truncate"}`} style={{ color: "var(--color-text-base)", fontSize: dataFontSize }}>{item.display.secondaryLine}</div>
            )}
          </div>
        );
        if (col.key === "actions") return (
          <div key="actions" className={`${col.width} px-1 py-1 flex items-center justify-center gap-1`}>
            <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-1 rounded" title="Edit (Alt+E)"
              style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}><Edit2 size={12} /></button>
            <button onClick={e => { e.stopPropagation(); onStrike(); }} className="p-1 rounded" title="Strike"
              style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}>{isStruck ? <RotateCcw size={12} /> : <MinusCircle size={12} />}</button>
            <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 rounded" title="Delete (Alt+Del)"
              style={{ background: "#fee2e2", color: "var(--color-danger)" }}><X size={12} /></button>
          </div>
        );
        if (col.type === "computed") return (
          <div key={col.key} className={`${col.width} px-0.5 py-1 text-center`}>
            <span className="text-xs font-normal" style={{ color: "var(--color-text-base)", fontSize: dataFontSize }}>
              {item.display[col.key] ?? ""}
            </span>
          </div>
        );
        // plain text columns (when/detail/etc.)
        return (
          <div key={col.key} className={`${col.width} ${preserveFullText ? "" : "min-w-0"} px-2 py-1 ${col.align === "center" ? "text-center" : "text-left"}`}>
            <span className={`text-xs font-normal block ${preserveFullText ? "whitespace-nowrap" : "truncate"}`} style={{ color: "var(--color-text-base)", fontSize: dataFontSize }} title={item.display[col.key] || ""}>{item.display[col.key] ?? ""}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Typable remarks input w/ optional dropdown suggestions ── */
function TypableInput({ value, options = [], onChange, onKeyDown, dataField, placeholder }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const inputRef = useRef(null);
  const anchorRef = useRef(null);
  const hasValue = value !== "â€”" && String(value ?? "").trim() !== "";
  const filtered = options.filter(o => o !== "—" && o.toLowerCase().includes((value === "—" ? "" : value).toLowerCase()));

  const visibleOptions = options.filter(option => !(String(option).length === 1 && !/[a-z0-9]/i.test(String(option))));
  const displayedOptions = showAllOptions ? [NONE_OPTION, ...visibleOptions] : [NONE_OPTION, ...filtered];
  const select = opt => { onChange({ target: { value: opt } }); setShowDropdown(false); setShowAllOptions(false); setHighlightedIdx(-1); inputRef.current?.focus(); };
  const handleKeyDown = e => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) setShowAllOptions(false);
    if (showDropdown && displayedOptions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, displayedOptions.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); select(displayedOptions[highlightedIdx]); return; }
      if (e.key === "Escape") { setShowDropdown(false); setHighlightedIdx(-1); return; }
    }
    onKeyDown?.(e);
  };
  return (
    <div ref={anchorRef} className="relative w-full">
      <input data-field={dataField} ref={inputRef} type="text" value={value === "—" ? "" : value} onChange={onChange}
        onFocus={() => { setShowAllOptions(hasValue); setShowDropdown(options.length > 0); }}
        onClick={() => { setShowAllOptions(hasValue); setShowDropdown(options.length > 0); }} onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} placeholder={placeholder}
        className="prescription-entry-control w-full px-2 text-[1rem] outline-none" style={{ fontSize: "1rem", border: hasValue ? "1.5px solid var(--color-primary)" : "1px solid var(--color-border)", background: hasValue ? "var(--color-primary-muted)" : "var(--color-surface)",
          paddingRight: options.length > 0 ? "1.75rem" : undefined }} />
      {options.length > 0 && (
        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
      )}
      {options.length > 0 && (
        <PortalDropdown anchorEl={anchorRef.current} open={showDropdown && displayedOptions.length > 0}>
          {displayedOptions.map((opt, i) => (
            <div key={opt} onMouseDown={() => select(opt)} className="prescription-dropdown-option cursor-pointer"
              style={{ fontSize: "1rem", borderBottom: "1px solid var(--color-border)", background: highlightedIdx === i || opt === value ? "var(--color-primary-muted)" : "transparent" }}
              onMouseEnter={() => setHighlightedIdx(i)}>{opt}</div>
          ))}
        </PortalDropdown>
      )}
    </div>
  );
}

/* Custom dropdown (not a native <select>) so we control the popup: opens downward
   only, shows ~5 options at a time, and scrolls for the rest. Arrow keys still
   step the value directly without opening the list, matching the old behavior. */
const OPTION_ROW_PX = 33;

function ArrowSelect({ dataField, value, options, onChange, onNavigate, placeholder = "Select", style: extraStyle = {} }) {
  const dropdownOptions = [NONE_OPTION, ...options];
  const idx = dropdownOptions.indexOf(value);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const handleKeyDown = e => {
    if (e.key === "ArrowDown") { e.preventDefault(); onChange(dropdownOptions[Math.min(idx + 1, dropdownOptions.length - 1)]); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); onChange(dropdownOptions[Math.max(idx - 1, 0)]); return; }
    if (e.key === " ") { e.preventDefault(); setOpen(v => !v); return; }
    if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); return; }
    if (["ArrowLeft", "ArrowRight", "Enter", "Escape", "Tab"].includes(e.key)) { e.preventDefault(); onNavigate?.(e); }
  };
  const select = opt => { onChange(opt); setOpen(false); };
  return (
    <div ref={anchorRef} className="relative w-full">
      <button type="button" data-field={dataField} onClick={() => setOpen(v => !v)} onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="prescription-entry-control w-full flex items-center justify-between px-2 text-[1rem] text-left"
        style={{ border: "1px solid var(--color-border)", background: open ? "var(--color-primary-muted)" : "var(--color-surface)", ...extraStyle }}>
        <span className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${value ? "" : "prescription-dropdown-placeholder"}`} style={{ fontSize: value ? "1rem" : "0.8rem" }}>{value || placeholder}</span>
        <ChevronDown size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
      </button>
      <PortalDropdown anchorEl={anchorRef.current} open={open}>
        <div>
          {dropdownOptions.map(opt => (
            <div key={opt} onMouseDown={() => select(opt)}
              className="prescription-dropdown-option cursor-pointer"
              style={{ height: OPTION_ROW_PX, fontSize: "1rem", borderBottom: "1px solid var(--color-border)", background: opt === value ? "var(--color-primary-muted)" : "transparent" }}>
              {opt}
            </div>
          ))}
        </div>
      </PortalDropdown>
    </div>
  );
}

// Current system time as "HH:MM" — used to default the Time field.
function nowHHMM() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/* One column (hour or minute) of the Time field's picker — a custom
   PortalDropdown-based popup (not a native <select>) so, like every other
   dropdown in this app, it always opens downward instead of leaving it up
   to the browser/OS. Options past the current system time are individually
   unclickable/disabled, not just clamped after picking. */
function TimeColumnSelect({ value, options, disabledSet, onChange, format, width = "" }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const fmt = format || (n => String(n).padStart(2, "0"));
  const select = opt => { if (disabledSet.has(opt)) return; onChange(opt); setOpen(false); };
  return (
    <div ref={anchorRef} className={`relative min-w-0 ${width || "flex-1"}`}>
      <button type="button" onClick={() => setOpen(v => !v)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="prescription-entry-control w-full flex items-center justify-between px-1.5 text-[1rem] text-left"
        style={{ border: "1px solid var(--color-border)", background: open ? "var(--color-primary-muted)" : "var(--color-surface)" }}>
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: "1rem" }}>{fmt(value)}</span>
        <ChevronDown size={12} style={{ flexShrink: 0, opacity: 0.6 }} />
      </button>
      <PortalDropdown anchorEl={anchorRef.current} open={open}>
        <div>
          {options.map(opt => {
            const isDisabled = disabledSet.has(opt);
            return (
              <div key={opt} onMouseDown={() => select(opt)}
                className="prescription-dropdown-option"
                style={{ height: OPTION_ROW_PX, fontSize: "1rem", borderBottom: "1px solid var(--color-border)",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  color: isDisabled ? "var(--color-text-subtle)" : "var(--color-text-base)",
                  background: opt === value ? "var(--color-primary-muted)" : "transparent" }}>
                {fmt(opt)}
              </div>
            );
          })}
        </div>
      </PortalDropdown>
    </div>
  );
}

const pad2 = n => String(n).padStart(2, "0");
// 24h hour -> { h12: 1-12, period: "AM"|"PM" }
function to12Hour(h24) {
  const period = h24 >= 12 ? "PM" : "AM";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return { h12, period };
}
// { h12: 1-12, period } -> 24h hour
function to24Hour(h12, period) {
  if (period === "AM") return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

/* Hour(1-12) + Minute + AM/PM pickers (no seconds — the field only ever
   stores 24h "HH:MM" internally, this is just the display/entry format) for
   IP Time-line's Time field. Each option past the current system time is
   individually disabled, not just clamped after picking — so a future hour,
   minute, or AM/PM can't be selected in the first place. */
function TimeHourMinuteSelect({ dataField, value, onChange }) {
  const now = new Date();
  const curH = now.getHours(), curM = now.getMinutes();
  const [h24, m] = (value || nowHHMM()).split(":").map(Number);
  const { h12, period } = to12Hour(h24);

  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, mm) => mm);
  const periodOptions = ["AM", "PM"];

  const disabledHours = new Set(hourOptions.filter(hh => to24Hour(hh, period) > curH));
  const disabledPeriods = new Set(periodOptions.filter(p => to24Hour(h12, p) > curH));
  const disabledMinutes = new Set(minuteOptions.filter(mm => h24 === curH && mm > curM));

  const commit = (newH24, newM) => {
    const clampedM = newH24 === curH && newM > curM ? curM : newM;
    onChange(`${pad2(newH24)}:${pad2(clampedM)}`);
  };
  const changeHour = newH12 => commit(to24Hour(newH12, period), m);
  const changePeriod = newPeriod => commit(to24Hour(h12, newPeriod), m);
  const changeMinute = newM => commit(h24, newM);

  return (
    <div data-field={dataField} className="flex items-center gap-1 w-full">
      <TimeColumnSelect value={h12} options={hourOptions} disabledSet={disabledHours} onChange={changeHour} format={n => pad2(n)} />
      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>:</span>
      <TimeColumnSelect value={m} options={minuteOptions} disabledSet={disabledMinutes} onChange={changeMinute} />
      <TimeColumnSelect value={period} options={periodOptions} disabledSet={disabledPeriods} onChange={changePeriod} format={p => p} width="w-14 flex-none" />
    </div>
  );
}

/* ── Add row: renders only the fields listed in config.addRowFields ── */
const AddRow = React.forwardRef(({ config, draft, onDraftChange, onCommit, query, setQuery, suggestions, allSuggestions, onCancel, rowNumber, searchMode }, ref) => {
  const inputRef = useRef(null), rowRef = useRef(null), nameWrapRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [selected, setSelected] = useState(() => !!query);
  const [showAllItems, setShowAllItems] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setAnchorEl(nameWrapRef.current);
  }, []);

  React.useImperativeHandle(ref, () => ({
    focusName: () => inputRef.current?.focus(),
  }));

  useEffect(() => { setSelected(!!query.trim()); }, [query]);

  const dropdownItems = [NONE_OPTION, ...((showAllItems || selected) ? allSuggestions : suggestions.slice(0, 8))];
  const fieldOrder = config.addRowFields;

  const focusField = k => rowRef.current?.querySelector(`[data-field="${k}"]`)?.focus();
  const navigate = (current, dir) => {
    const i = fieldOrder.indexOf(current);
    if (dir === "right" && i < fieldOrder.length - 1) focusField(fieldOrder[i + 1]);
    else if (dir === "left" && i > 0) focusField(fieldOrder[i - 1]);
  };
  const handleFieldKeyDown = (e, field) => {
    if (e.key === "Escape") { onCancel(); return; }
    if (field === "name" && showDropdown && dropdownItems.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx(i => Math.min(i + 1, dropdownItems.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && highlightedIdx >= 0) { e.preventDefault(); handleSelect(dropdownItems[highlightedIdx]); return; }
    }
    if (e.key === "ArrowRight") { e.preventDefault(); navigate(field, "right"); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); navigate(field, "left"); return; }
    if (e.key === "Enter" && (field !== "name" || !showDropdown)) { e.preventDefault(); onCommit(); }
  };
  const handleSelect = item => {
    setQuery(item); onDraftChange("name")(item); setSelected(true); setShowDropdown(false); setShowAllItems(false); setHighlightedIdx(-1); inputRef.current?.focus();
  };
  const handleClear = () => { setQuery(""); onDraftChange("name")(""); setSelected(false); setShowAllItems(false); setTimeout(() => inputRef.current?.focus(), 0); };

  return (
    <div ref={rowRef} data-add-row="true" className="flex items-stretch border-b relative"
      style={{ background: config.colorLight, borderColor: config.color }}
      onBlur={e => { if (rowRef.current && !rowRef.current.contains(e.relatedTarget)) { setShowDropdown(false); setHighlightedIdx(-1); } }}>

      <div className="w-12 px-2 py-2 flex items-center justify-center flex-shrink-0">
        <span className="font-semibold" style={{ color: config.textAccent || config.color, fontSize: "1rem" }}>{rowNumber}</span>
      </div>

      {/* Fields render in config.addRowFields order (so e.g. IP Time-line can put
          Medic before the Subject search field, matching the view table's column
          order) — only the widget used per field differs, not its position. */}
      {fieldOrder.filter(f => f !== "commit").map(field => {
        if (field === "name") {
          if (config.hasSearchField === false) return null;
          return (
            <div key="name" className={`${config.key === "iptime" ? "w-[150px]" : "w-80"} flex-shrink-0 relative min-w-0 px-1 py-1.5 flex items-center`} ref={nameWrapRef}>
              <input data-field="name" ref={inputRef} value={query}
                onChange={e => { setQuery(e.target.value); onDraftChange("name")(e.target.value); setShowAllItems(false); setShowDropdown(true); setHighlightedIdx(-1); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => { setShowDropdown(false); if (query.trim()) setSelected(true); }, 200)}
                onKeyDown={e => handleFieldKeyDown(e, "name")}
                placeholder={config.labels.searchPlaceholder}
                className="prescription-entry-control prescription-entry-placeholder w-full text-[1rem] font-medium outline-none"
                style={{ fontSize: "1rem", border: selected ? "1.5px solid var(--color-primary)" : "1px solid var(--color-border)",
                  background: selected ? "var(--color-primary-muted)" : "var(--color-surface)", color: config.textAccent || config.color,
                  paddingLeft: "0.75rem", paddingRight: selected ? "3.5rem" : "1.75rem" }} />
              {selected && (
                <button type="button" onMouseDown={e => { e.preventDefault(); handleClear(); }} title="Clear"
                  className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                  style={{ right: "1.5rem", width: 16, height: 16, background: "var(--color-danger)", color: "white" }}><X size={10} strokeWidth={3} /></button>
              )}
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "var(--color-text-muted)" }}
                onMouseDown={e => { e.preventDefault(); setShowAllItems(true); setShowDropdown(v => !v); setHighlightedIdx(-1); }} />
              <PortalDropdown anchorEl={inputRef.current} open={showDropdown && dropdownItems.length > 0}>
                {dropdownItems.map((item, i) => (
                  <div key={item} onMouseDown={() => handleSelect(item)} className="prescription-dropdown-option cursor-pointer"
                    style={{ fontSize: "1rem", borderBottom: "1px solid var(--color-border)", background: highlightedIdx === i || item === query ? "var(--color-primary-muted)" : "transparent" }}>
                    {item}
                  </div>
                ))}
              </PortalDropdown>
            </div>
          );
        }

        if (field === "days") return (
          <div key="days" className="w-16 flex-shrink-0 px-1 py-1.5 flex items-center">
            <input data-field="days" type="number" min="1" max="365" value={draft.days}
              onChange={e => onDraftChange("days")(e.target.value)} onKeyDown={e => handleFieldKeyDown(e, "days")}
              className="prescription-entry-control prescription-entry-placeholder w-full px-2 text-left font-semibold outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: "1rem" }} placeholder="Days" />
          </div>
        );
        if (field === "intake") return (
          <div key="intake" className="w-20 flex-shrink-0 px-1 py-1.5 flex items-center">
            <ArrowSelect dataField="intake" value={draft.intake} options={config.fieldOptions.intake} placeholder="Dosage" onChange={v => onDraftChange("intake")(v)} onNavigate={e => handleFieldKeyDown(e, "intake")} />
          </div>
        );
        if (field === "period") return (
          <div key="period" className="w-20 flex-shrink-0 px-1 py-1.5 flex items-center">
            <ArrowSelect dataField="period" value={draft.period} options={config.fieldOptions.period} placeholder="Period" onChange={v => onDraftChange("period")(v)} onNavigate={e => handleFieldKeyDown(e, "period")} style={{ color: "var(--color-primary)", fontWeight: 700 }} />
          </div>
        );
        if (field === "when") return (
          <div key="when" className="w-40 flex-shrink-0 px-1 py-1.5 flex items-center">
            <ArrowSelect dataField="when" value={draft.when} options={config.fieldOptions.when} placeholder="When" onChange={v => onDraftChange("when")(v)} onNavigate={e => handleFieldKeyDown(e, "when")} />
          </div>
        );
        if (field === "detail") return (
          <div key="detail" className="flex-1 min-w-0 px-1 py-1.5 flex items-center">
            <TypableInput dataField="detail" value={draft.detail} options={config.fieldOptions?.detail || []}
              placeholder="Type or select remarks..." onChange={e => onDraftChange("detail")(e.target.value)} onKeyDown={e => handleFieldKeyDown(e, "detail")} />
          </div>
        );
        if (field === "time") return (
          <div key="time" className="w-48 flex-shrink-0 px-1 py-1.5 flex items-center">
            <TimeHourMinuteSelect dataField="time" value={draft.time} onChange={v => onDraftChange("time")(v)} />
          </div>
        );
        if (field === "entryType") return (
          <div key="entryType" className="flex-shrink-0 px-1 py-1.5 flex items-center" style={{ width: "150px" }}>
            <TypableInput dataField="entryType" value={draft.entryType ?? ""} options={config.fieldOptions?.entryType || []}
              placeholder="Entry Type" onChange={e => onDraftChange("entryType")(e.target.value)} onKeyDown={e => handleFieldKeyDown(e, "entryType")} />
          </div>
        );
        if (field === "schDate") return (
          <div key="schDate" className="w-28 flex-shrink-0 px-1 py-1.5 flex items-center">
            <input data-field="schDate" type="date" value={draft.schDate}
              onChange={e => onDraftChange("schDate")(e.target.value)} onKeyDown={e => handleFieldKeyDown(e, "schDate")}
              className="prescription-entry-control prescription-entry-placeholder w-full px-1.5 outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: "1rem" }} />
          </div>
        );

        // Generic typable-or-select fields (e.g. IP Time-line's Medic/Notes/Entry Type) —
        // any addRowFields entry not already handled above renders as a free-type-or-pick input.
        return (
          <div key={field} className="flex-1 min-w-0 px-1 py-1.5 flex items-center">
            <TypableInput dataField={field} value={draft[field] ?? ""} options={config.fieldOptions?.[field] || []}
              placeholder={`${config.tableColumns?.find(c => c.key === field)?.label || field}...`}
              onChange={e => onDraftChange(field)(e.target.value)} onKeyDown={e => handleFieldKeyDown(e, field)} />
          </div>
        );
      })}

      <div className="w-16 flex-shrink-0 px-1 py-1.5 flex gap-1 items-center justify-center">
        <button data-field="commit" onClick={onCommit} onKeyDown={e => handleFieldKeyDown(e, "commit")}
          className="p-1.5 rounded-md inline-flex items-center justify-center" style={{ background: "var(--color-success)", color: "white" }} title="Add (Enter)"><Plus size={16} /></button>
        <button onClick={onCancel} className="p-1.5 rounded-md inline-flex items-center justify-center" style={{ background: "var(--color-danger)", color: "white" }} title="Cancel (Esc)"><X size={16} /></button>
      </div>
    </div>
  );
});

/* ── Header labels/widths for the add-row's own fields (Days/Dosage/Period/When/etc.) —
   these don't all exist as data-grid columns (e.g. Drug's grid shows computed Buy/M/A/E/N
   instead of raw Days/Dosage), so the add-row header is built from addRowFields directly
   rather than filtered from config.tableColumns. ── */
const ADD_ROW_FIELD_META = {
  days:   { label: "Days",   width: "w-16" },
  intake: { label: "Dosage", width: "w-20" },
  period: { label: "Period", width: "w-20" },
  when:   { label: "When",   width: "w-40" },
  detail: { label: "Remarks", width: "flex-1" },
  time:   { label: "Time",   width: "w-48" },
  entryType: { label: "Entry Type", width: "w-[150px]" },
  schDate: { label: "Sch. Date", width: "w-28" },
};

function buildAddRowColumns(config) {
  const cols = [{ key: "no", label: "No.", width: "w-12" }];
  config.addRowFields.forEach(field => {
    if (field === "commit") return;
    if (field === "name") {
      if (config.hasSearchField === false) return;
      cols.push({ key: "name", label: config.labels.searchColumnLabel || "Name", width: config.key === "iptime" ? "w-[150px]" : "w-80" });
      return;
    }
    const meta = ADD_ROW_FIELD_META[field];
    if (meta) { cols.push({ key: field, ...meta }); return; }
    const tableCol = config.tableColumns?.find(c => c.key === field);
    cols.push({ key: field, label: tableCol?.label || field, width: "flex-1" });
  });
  cols.push({ key: "actions", label: "Actions", width: "w-16" });
  return cols;
}

/* ═══════════════ MAIN GENERIC COMPONENT ═══════════════ */
function makeFreshDraft(config, keepDays) {
  const draft = { name: "" };
  (config.addRowFields || []).forEach(field => {
    if (field === "commit") return;
    if (field === "days") draft.days = config.key === "drugs" ? "" : (keepDays ?? "1");
    else if (field === "intake") draft.intake = config.key === "drugs" ? "" : "1";
    else if (field === "period") draft.period = config.key === "drugs" ? "" : "OD";
    else if (field === "when") draft.when = config.key === "drugs" ? "" : "After Food";
    else if (field === "detail") draft.detail = "—";
    else if (field === "time") draft.time = nowHHMM(); // defaults to current system time
    else draft[field] = ""; // generic typable fields (e.g. subject/advice/nurse/treatment)
  });
  return draft;
}

const PrescriptionEntryTab = React.forwardRef(function PrescriptionEntryTab({ config, items, setItems, searchList = [], currentMedicName, visibleColOverrides = {} }, ref) {
  const persistedDaysRef = useRef("1");
  const [draft, setDraft] = useState(() => makeFreshDraft(config));
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [searchMode, setSearchMode] = useState("alpha");
  const [typeValue, setTypeValue] = useState(config.filters.typeOptions[0]);
  const [frequentOnly, setFrequentOnly] = useState(false);

  // Column visibility — opt-in via config.showColumnFilter (Care-Plan). The
  // toggle button/dropdown itself lives in OPDeskScreen's toolbar row (where
  // Clear/Paste/Print normally sit); this component just filters by it.
  const displayColumns = config.showColumnFilter
    ? config.tableColumns.filter(c => c.key === "no" || c.key === "actions" || visibleColOverrides[c.key] !== false)
    : config.tableColumns;
  const addRowRef = useRef(null), rowsScrollRef = useRef(null);
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, items.length);

    const suggestions = query.trim() ? searchList.filter(s => s.toLowerCase().includes(query.toLowerCase())) : searchList;
    const setD = k => v => setDraft(prev => ({ ...prev, [k]: v }));

  const requiredFields = config.requiredFields || [config.requiredField || "name"];

  const commitDraft = () => {
    if (requiredFields.some(f => !draft[f]?.trim())) return;
    const display = config.computeRowDisplay(draft, { currentMedicName });
    if (editId !== null) {
      setItems(prev => prev.map(it => it.id === editId ? { ...it, ...draft, display } : it));
      setEditId(null);
    } else {
      const extra = config.enrichItem ? config.enrichItem(draft) : {};
      setItems(prev => [...prev, { id: Date.now(), ...draft, ...extra, display }]);
    }
    if (items.length === 0) persistedDaysRef.current = draft.days;
    setShowAddRow(false);
    setTimeout(() => {
      setDraft(makeFreshDraft(config, persistedDaysRef.current));
      setQuery("");
      setShowAddRow(true);
      setTimeout(() => addRowRef.current?.focusName(), 100);
    }, 50);
  };

  const cancelAdd = () => { setShowAddRow(false); setDraft(makeFreshDraft(config, persistedDaysRef.current)); setQuery(""); setEditId(null); };
  const startEdit = item => {
    setEditId(item.id);
    const nextDraft = {};
    (config.addRowFields || []).forEach(field => { if (field !== "commit") nextDraft[field] = item[field] ?? ""; });
    setDraft(nextDraft);
    if (config.hasSearchField !== false) setQuery(item.name || "");
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusName(), 50);
  };
  const toggleStrike = id => setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const deleteItem = id => { setItems(prev => prev.filter(it => it.id !== id)); setStruckIds(prev => prev.filter(x => x !== id)); if (selectedRowId === id) setSelectedRowId(null); };
  const handleClearAll = () => { if (window.confirm(`Clear all ${config.label.toLowerCase()} entries?`)) { setItems([]); setStruckIds([]); setShowAddRow(false); setSelectedRowId(null); } };
  const handleAddNew = () => {
    setEditId(null);
    setDraft(makeFreshDraft(config, persistedDaysRef.current));
    setQuery("");
    setShowAddRow(true);
    setTimeout(() => addRowRef.current?.focusName(), 100);
  };
  const handleRowArrowNav = useCallback((currentId, dir) => {
    const idx = items.findIndex(it => it.id === currentId);
    const nextIdx = dir === "down" ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= items.length) return;
    setSelectedRowId(items[nextIdx].id);
  }, [items]);

  React.useImperativeHandle(ref, () => ({
    clearAll: handleClearAll,
  }));

  const carePlanOptionalColumnCount = displayColumns.filter(col =>
    ["name", "schStatus", "linkedStatus", "activityResult", "messageDoctor", "messagePatient", "messageAttendant"].includes(col.key)
  ).length;
  const carePlanGridMinWidth = `${1160 + carePlanOptionalColumnCount * 140}px`;

  return (
    <div className="flex flex-col overflow-hidden" style={{ background: "var(--color-surface)", height: "100%", minHeight: "300px" }}>
      <div className={`flex-1 ${config.key === "carePlan" ? "care-plan-horizontal-scroll overflow-x-auto overflow-y-hidden" : "flex flex-col overflow-hidden"}`}>
        <div
          className="h-full flex flex-col overflow-hidden"
          style={{ minWidth: config.key === "carePlan" ? carePlanGridMinWidth : undefined }}
        >
          <TableHeader columns={displayColumns} accentColor={config.color} wrapLabels={config.key === "carePlan"} />
          <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
            {items.map((item, index) => (
              <EntryRow key={item.id} item={item} index={index} columns={displayColumns}
                isStruck={struckIds.includes(item.id)} isSelected={selectedRowId === item.id}
                onSelect={() => setSelectedRowId(item.id)} onDelete={() => deleteItem(item.id)}
                onStrike={() => toggleStrike(item.id)} onEdit={() => startEdit(item)}
                onArrowNav={dir => handleRowArrowNav(item.id, dir)} accentColor={config.color} accentLight={config.colorLight}
                dataFontSize="14px" preserveFullText={config.key === "carePlan"} />
            ))}
            {Array.from({ length: fillRowCount }).map((_, i) => <EmptyRow key={`empty-${i}`} columns={displayColumns} />)}
          </div>
        </div>

        {!config.hideAddRow && (
          <div className="flex-shrink-0 mt-3">
            <AddTableHeader columns={buildAddRowColumns(config)} accentColor={config.color} accentText={config.colorText} />
            {showAddRow ? (
              <AddRow ref={addRowRef} config={config} draft={draft} onDraftChange={setD} onCommit={commitDraft} onCancel={cancelAdd}
                query={query} setQuery={setQuery} suggestions={suggestions} allSuggestions={searchList} rowNumber={items.length + 1} searchMode={searchMode} />
            ) : (
              <div className="flex items-center justify-center py-3 border-t cursor-pointer" style={{ background: config.colorLight, borderColor: config.color }} onClick={handleAddNew}>
                <button className="px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2" style={{ background: config.color, color: config.colorText || "white" }}>
                  <Plus size={14} /> {config.labels.addButton}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Fixed empty gap so the green entry row sits well clear of the footer,
            leaving visible room for the medicine dropdown to render downward.
            Not needed when there's no add-row (config.hideAddRow) to clear. */}
        {!config.hideAddRow && <div className="flex-shrink-0" style={{ height: "140px" }} />}

        <EntryFooterBar searchMode={searchMode} onSearchModeChange={setSearchMode}
          typeValue={typeValue} onTypeChange={setTypeValue} typeOptions={config.filters.typeOptions}
          filterLabel={config.labels.footerFilterLabel} frequentOnly={frequentOnly} onFrequentOnlyChange={setFrequentOnly}
          accentColor={config.color} accentText={config.colorText} textAccent={config.textAccent} recordCount={items.length} newEntityButton={config.labels.newEntityButton || config.labels.addButton}
          onNewEntity={handleAddNew} hideNewButton={config.hideAddRow} />
      </div>
    </div>
  );
});

export default PrescriptionEntryTab;
