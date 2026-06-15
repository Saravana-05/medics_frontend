import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Plus, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  Pill, Search, ChevronDown, BookOpen, Trash
} from "lucide-react";
import { 
  DRUG_SUGGESTIONS
} from "./mockData";

const FORM_OPTIONS   = ["Tab","Cap","Syp","Inj","Cream","Drop","Inhaler","Powder","Gel","Lotion"];
const INTAKE_OPTIONS = ["¼","½","¾","1","1½","2","3","4","1Ts","2Ts","3Ts","4Ts","5ml","10ml"];
const PERIOD_OPTIONS = ["OD","BD","TDS","QID","HS","SOS","Stat","Weekly","Monthly"];
const WHEN_OPTIONS   = ["AF","BF","BF&AF","Any Time","Empty Stomach","With Milk","Before Sleep"];
const DETAIL_OPTIONS = ["—","On Time","Only If Required","Discontinue Any Time","Continue","Reduce Dose","Increase Dose","Take with Water"];

const FIELD_ORDER = ["days", "name", "intake", "period", "when", "detail", "commit"];

// Function to calculate dosage schedule based on period
function getDosageSchedule(period, intake) {
  const schedules = {
    "OD": { mor: "", noon: "", eve: "", night: intake },
    "BD": { mor: intake, noon: "", eve: "", night: intake },
    "TDS": { mor: intake, noon: intake, eve: "", night: intake },
    "QID": { mor: intake, noon: intake, eve: intake, night: intake },
    "HS": { mor: "", noon: "", eve: "", night: intake },
    "SOS": { mor: "", noon: "", eve: "", night: "As needed" },
    "Stat": { mor: "", noon: "", eve: "", night: "Stat" },
    "Weekly": { mor: "", noon: "", eve: "", night: "Weekly" },
    "Monthly": { mor: "", noon: "", eve: "", night: "Monthly" }
  };
  return schedules[period] || schedules["OD"];
}

// Function to calculate total quantity (Buy)
function calculateBuy(days, intake, period) {
  const dosageCount = {
    "OD": 1, "BD": 2, "TDS": 3, "QID": 4,
    "HS": 1, "SOS": 1, "Stat": 1, "Weekly": 1, "Monthly": 1
  };
  let intakeNum = 1;
  if (intake.includes("½")) intakeNum = 0.5;
  else if (intake.includes("¼")) intakeNum = 0.25;
  else if (intake.includes("¾")) intakeNum = 0.75;
  else if (intake.includes("1½")) intakeNum = 1.5;
  else if (intake.includes("2")) intakeNum = 2;
  else if (intake.includes("3")) intakeNum = 3;
  else if (intake.includes("4")) intakeNum = 4;
  else if (!isNaN(parseFloat(intake))) intakeNum = parseFloat(intake);
  const dailyDosage = (dosageCount[period] || 1) * intakeNum;
  return Math.ceil(days * dailyDosage);
}

// Helper to format intake display
function formatIntakeDisplay(intake, period, detail) {
  let display = `[${intake}`;
  if (period === "HS") display += `, Bedtime`;
  else if (period === "SOS") display += `, As needed`;
  else display += `, ${period}`;
  if (detail && detail !== "—") display += `, ${detail}`;
  display += `]`;
  return display;
}

/* ── Action Button Component with Label ── */
function ActionButton({ onClick, variant = "primary", icon: Icon, label, disabled = false }) {
  const variants = {
    primary: { bg: "var(--color-primary)", color: "white", hoverBg: "var(--color-primary-light)" },
    success: { bg: "var(--color-drugs)", color: "white", hoverBg: "#146b4c" },
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
function ModernToolbar({ onProto }) {
  return (
    <div className="flex items-center justify-end p-2 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
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

/* ── Table Header Component ── */
function TableHeader() {
  const columns = [
    { label: "S.No", width: "w-12", center: true },
    { label: "Drug", width: "flex-1" },
    { label: "Buy", width: "w-12", center: true },
    { label: "Mor", width: "w-12", center: true },
    { label: "Noon", width: "w-12", center: true },
    { label: "Eve", width: "w-12", center: true },
    { label: "Night", width: "w-12", center: true },
    { label: "When", width: "w-20", center: true },
    { label: "Detail", width: "w-36" },
    { label: "Actions", width: "w-24", center: true },
  ];
  return (
    <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.width} px-2 py-2 ${col.center ? 'text-center' : ''}`}
          style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.03em", color: "var(--color-primary-dark)" }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Drug Row Component ── */
// FIX #4: Display selected days below the drug name
function DrugRow({ drug, index, isStruck, onDelete, onStrike, onEdit }) {
  const schedule = getDosageSchedule(drug.period, drug.intake);
  const buy = calculateBuy(parseInt(drug.days) || 1, drug.intake, drug.period);
  const intakeDisplay = formatIntakeDisplay(drug.intake, drug.period, drug.detail);
  
  return (
    <div className="flex border-b transition-all duration-150 hover:bg-primary-muted/30"
      style={{
        borderColor: "var(--color-border)",
        background: isStruck ? "var(--color-surface-alt)" : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1,
      }}
    >
      <div className="w-12 px-2 py-2 text-center">
        <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0 px-2 py-2">
        <div className="font-semibold text-sm truncate" style={{ color: isStruck ? "var(--color-text-muted)" : "var(--color-text-base)" }}>
          {drug.name}
        </div>
        {/* FIX #4: Show days + intake display below drug name */}
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[0.6rem] font-bold px-1 rounded"
            style={{ background: "var(--color-drugs-light)", color: "var(--color-drugs)" }}
          >
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
      <div className="w-12 px-2 py-2 text-center">
        <span className="text-sm">{schedule.mor}</span>
      </div>
      <div className="w-12 px-2 py-2 text-center">
        <span className="text-sm">{schedule.noon}</span>
      </div>
      <div className="w-12 px-2 py-2 text-center">
        <span className="text-sm">{schedule.eve}</span>
      </div>
      <div className="w-12 px-2 py-2 text-center">
        <span className="text-sm">{schedule.night}</span>
      </div>
      <div className="w-20 px-2 py-2 text-center">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{drug.when}</span>
      </div>
      <div className="w-36 px-2 py-2">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{drug.detail === "—" ? "" : drug.detail}</span>
      </div>
      <div className="w-24 px-1 py-2 flex items-center justify-center gap-1">
        <button onClick={onEdit} className="p-1 rounded transition-all" title="Edit"
          style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary-muted)"}>
          <Edit2 size={12} />
        </button>
        <button onClick={onStrike} className="p-1 rounded transition-all" title={isStruck ? "Undo Strike" : "Strike"}
          style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fde68a"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lab-light)"}>
          {isStruck ? <RotateCcw size={12} /> : <MinusCircle size={12} />}
        </button>
        <button onClick={onDelete} className="p-1 rounded transition-all" title="Delete"
          style={{ background: "#fee2e2", color: "var(--color-danger)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

/* ── Typable Detail Input Component ── */
function TypableDetailInput({ value, onChange, onKeyDown }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
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
    setShowDropdown(false);
    setHighlightedIdx(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showDropdown && detailOptions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx(i => Math.min(i + 1, detailOptions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && highlightedIdx >= 0) {
        e.preventDefault();
        handleSelectOption(detailOptions[highlightedIdx]);
        return;
      }
      if (e.key === "Escape") {
        setShowDropdown(false);
        setHighlightedIdx(-1);
        return;
      }
    }
    onKeyDown?.(e);
  };

  const filteredOptions = detailOptions.filter(opt => 
    opt.toLowerCase().includes((value === "—" ? "" : value).toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value === "—" ? "" : value}
        onChange={onChange}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder="Type or select detail..."
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
                className="px-3 py-2 cursor-pointer text-sm transition-colors hover:bg-primary-muted"
                style={{
                  background: highlightedIdx === i ? "var(--color-primary-muted)" : "transparent"
                }}
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

/* ── FIX #2: Arrow-key-only Select Component ── */
// Replaces native <select> for intake, period, when fields so that
// only ArrowUp / ArrowDown cycle through options — Left/Right are
// free to navigate between fields (FIX #3).
function ArrowSelect({ dataField, value, options, onChange, onNavigate, style: extraStyle = {}, className = "" }) {
  const currentIdx = options.indexOf(value);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = options[Math.min(currentIdx + 1, options.length - 1)];
      onChange(next);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = options[Math.max(currentIdx - 1, 0)];
      onChange(next);
      return;
    }
    // FIX #3: delegate left/right to parent for field navigation
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      onNavigate?.(e);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      onNavigate?.(e);
      return;
    }
    if (e.key === "Escape") {
      onNavigate?.(e);
      return;
    }
    if (e.key === "Tab") {
      onNavigate?.(e);
    }
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

/* ── Add Row Component with focus tracking ── */
const AddRow = React.forwardRef(({ draft, onDraftChange, onCommit, query, setQuery, suggestions, onCancel }, ref) => {
  const inputRef    = useRef(null);
  const rowRef      = useRef(null);
  const wrapperRef  = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [drugSelected, setDrugSelected] = useState(() => !!query);

  React.useImperativeHandle(ref, () => ({
    focusDays: () => {
      const daysInput = rowRef.current?.querySelector('[data-field="days"]');
      if (daysInput) daysInput.focus();
    }
  }));

  useEffect(() => {
    if (query.trim()) setDrugSelected(true);
    else setDrugSelected(false);
  }, [query]);

  const medicineTypes = DRUG_SUGGESTIONS;
  const dropdownItems = query === "" ? medicineTypes : suggestions.slice(0, 8);

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

  const handleSelectMedicine = (medicine) => {
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

  const handleRowBlur = (e) => {
    if (rowRef.current && !rowRef.current.contains(e.relatedTarget)) {
      setShowDropdown(false);
      setHighlightedIdx(-1);
    }
  };

  const FIELD_ORDER_LOCAL = ["days", "name", "intake", "period", "when", "detail", "commit"];

  // FIX #3: Central field focus helper used by all fields
  const focusField = useCallback((fieldKey) => {
    if (!rowRef.current) return;
    const el = rowRef.current.querySelector(`[data-field="${fieldKey}"]`);
    if (el) el.focus();
  }, []);

  // FIX #3: Navigate left/right between fields
  const navigateField = useCallback((currentField, direction) => {
    const idx = FIELD_ORDER_LOCAL.indexOf(currentField);
    if (direction === "right" && idx < FIELD_ORDER_LOCAL.length - 1) {
      focusField(FIELD_ORDER_LOCAL[idx + 1]);
    } else if (direction === "left" && idx > 0) {
      focusField(FIELD_ORDER_LOCAL[idx - 1]);
    }
  }, [focusField]);

  const handleFieldKeyDown = (e, currentField) => {
    if (e.key === "Escape") {
      onCancel();
      return;
    }

    // Drug name dropdown navigation
    if (currentField === "name" && showDropdown && dropdownItems.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx(i => Math.min(i + 1, dropdownItems.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && highlightedIdx >= 0) {
        e.preventDefault();
        handleSelectMedicine(dropdownItems[highlightedIdx]);
        return;
      }
    }

    // FIX #3: ArrowRight moves to next field, ArrowLeft to previous
    if (e.key === "ArrowRight") {
      e.preventDefault();
      navigateField(currentField, "right");
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      navigateField(currentField, "left");
      return;
    }

    if (e.key === "Tab") {
      setShowDropdown(false);
    }
    if (e.key === "Enter" && currentField !== "name") {
      e.preventDefault();
      onCommit();
    }
    if (e.key === "Enter" && currentField === "name" && !showDropdown) {
      e.preventDefault();
      onCommit();
    }
  };

  const handleDetailChange = (e) => {
    onDraftChange("detail")(e.target.value);
  };

  return (
    <div
      ref={rowRef}
      className="border-t-2 relative flex-shrink-0"
      style={{ background: "var(--color-drugs-light)", borderColor: "var(--color-drugs)" }}
      onBlur={handleRowBlur}
    >
      {showDropdown && dropdownItems.length > 0 && (
        <div
          className="rounded-lg shadow-xl overflow-hidden"
          style={{
            ...dropdownStyle,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <div className="max-h-72 overflow-y-auto">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider sticky top-0"
              style={{ color: "var(--color-text-muted)", background: "var(--color-primary-muted)" }}>
              {query === "" ? "Common Medicines" : "Search Results"}
            </div>
            {dropdownItems.map((med, i) => (
              <div
                key={med}
                onMouseDown={() => handleSelectMedicine(med)}
                className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: highlightedIdx === i ? "var(--color-drugs-light)" : "transparent"
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
        </div>
      )}

      <div className="flex items-center p-2 gap-2">
        {/* Days */}
        <div className="w-16 flex-shrink-0">
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

        {/* Drug name search */}
        <div className="flex-1 relative min-w-0" ref={wrapperRef}>
          <Pill size={14} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-drugs)" }} />
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
            onBlur={() => {
              setTimeout(() => {
                setShowDropdown(false);
                if (query.trim()) setDrugSelected(true);
              }, 200);
            }}
            onKeyDown={e => handleFieldKeyDown(e, "name")}
            placeholder="Search or select medicine..."
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
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleClearDrug(); }}
              title="Clear drug and pick again"
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
              style={{ right: "1.5rem", width: "16px", height: "16px", background: "var(--color-danger)", color: "white" }}
            >
              <X size={10} strokeWidth={3} />
            </button>
          )}
          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: "var(--color-text-muted)" }}
            onMouseDown={(e) => {
              e.preventDefault();
              if (drugSelected) handleClearDrug();
              else setShowDropdown(v => !v);
            }}
          />
        </div>

        {/* FIX #2: intake — ArrowUp/Down only, ArrowLeft/Right navigates fields */}
        <div className="w-20 flex-shrink-0">
          <ArrowSelect
            dataField="intake"
            value={draft.intake}
            options={INTAKE_OPTIONS}
            onChange={v => onDraftChange("intake")(v)}
            onNavigate={e => handleFieldKeyDown(e, "intake")}
          />
        </div>

        {/* FIX #2: period — ArrowUp/Down only */}
        <div className="w-20 flex-shrink-0">
          <ArrowSelect
            dataField="period"
            value={draft.period}
            options={PERIOD_OPTIONS}
            onChange={v => onDraftChange("period")(v)}
            onNavigate={e => handleFieldKeyDown(e, "period")}
            style={{ color: "var(--color-primary)", fontWeight: "700" }}
          />
        </div>

        {/* FIX #2: when — ArrowUp/Down only */}
        <div className="w-28 flex-shrink-0">
          <ArrowSelect
            dataField="when"
            value={draft.when}
            options={WHEN_OPTIONS}
            onChange={v => onDraftChange("when")(v)}
            onNavigate={e => handleFieldKeyDown(e, "when")}
          />
        </div>

        {/* Detail */}
        <div className="w-48 flex-shrink-0">
          <TypableDetailInput
            value={draft.detail}
            onChange={handleDetailChange}
            onKeyDown={(e) => handleFieldKeyDown(e, "detail")}
          />
        </div>

        {/* Commit / Cancel */}
        <div className="w-16 flex-shrink-0 flex gap-1 justify-center">
          <button
            data-field="commit"
            onClick={onCommit}
            onKeyDown={e => handleFieldKeyDown(e, "commit")}
            className="p-1.5 rounded-md transition-all inline-flex items-center justify-center"
            style={{ background: "var(--color-drugs)", color: "white" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#146b4c"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-drugs)"}
            title="Add Medicine (Enter)">
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
    </div>
  );
});

/* ═══════════════════════════════════════════════ MAIN DRUG TAB COMPONENT ═══════════════════ */
const EMPTY_DRAFT = { name: "", form: "Tab", intake: "1", period: "OD", when: "AF", detail: "—", days: "1" };

export default function DrugTab({ drugs, setDrugs, patient }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(true);
  const addRowRef = useRef(null);

  const suggestions = query.length > 1
    ? DRUG_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const setD = (k) => (v) => setDraft(prev => ({ ...prev, [k]: v }));

  const commitDraft = () => {
    if (!draft.name.trim()) return;
    if (editId !== null) {
      setDrugs(prev => prev.map(d => d.id === editId ? { ...d, ...draft } : d));
      setEditId(null);
    } else {
      setDrugs(prev => [...prev, { id: Date.now(), ...draft }]);
    }
    setDraft(EMPTY_DRAFT);
    setQuery("");
    setShowAddRow(false);

    setTimeout(() => {
      setShowAddRow(true);
      setTimeout(() => {
        if (addRowRef.current) addRowRef.current.focusDays();
      }, 100);
    }, 50);
  };

  const cancelAdd = () => {
    setShowAddRow(false);
    setDraft(EMPTY_DRAFT);
    setQuery("");
    setEditId(null);
  };

  const startEdit = (drug) => {
    setEditId(drug.id);
    setDraft({ name: drug.name, form: drug.form, intake: drug.intake, period: drug.period, when: drug.when, detail: drug.detail, days: drug.days });
    setQuery(drug.name);
    setShowAddRow(true);
  };

  const toggleStrike = (id) => {
    setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all medicines?")) {
      setDrugs([]);
      setStruckIds([]);
      setShowAddRow(false);
    }
  };

  const handleSave = () => alert("Prescription saved successfully!");
  const handleProto = () => alert("Proto feature coming soon!");

  const handleAddNewMedicine = () => {
    setShowAddRow(true);
    setTimeout(() => {
      if (addRowRef.current) addRowRef.current.focusDays();
    }, 100);
  };

  const addRowProps = { draft, onDraftChange: setD, onCommit: commitDraft, onCancel: cancelAdd, query, setQuery, suggestions };

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
        style={{
          background: "linear-gradient(135deg, var(--color-drugs-light) 0%, var(--color-surface) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill size={16} style={{ color: "var(--color-drugs)" }} />
            <h2 className="lg:text-base md:text-xs font-light" style={{ color: "var(--color-drugs)" }}>
              Drug Prescription
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton variant="warning" icon={Trash} label="Clear" onClick={handleClearAll} />
            <ActionButton variant="success" icon={Save} label="Save" onClick={handleSave} />
          </div>
        </div>
        <ModernToolbar onProto={handleProto} />
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* EMPTY STATE */}
        {drugs.length === 0 && !showAddRow && (
          <div className="flex-1 flex flex-col items-center justify-center py-5">
            <div className="text-center">
              <div className="mb-2 p-4 rounded-full inline-flex" style={{ background: "var(--color-drugs-light)" }}>
                <Pill size={20} style={{ color: "var(--color-drugs)" }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-base)" }}>No Medicines Added Yet</h3>
              <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>Click the button below to start prescribing</p>
              <button
                onClick={handleAddNewMedicine}
                className="px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm mx-auto"
                style={{ background: "var(--color-drugs)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#146b4c"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-drugs)"}
              >
                <Plus size={16} /> Add New Medicine
              </button>
            </div>
          </div>
        )}

        {/* Add Row for empty state */}
        {drugs.length === 0 && showAddRow && (
          <div className="flex-shrink-0">
            <AddRow ref={addRowRef} {...addRowProps} />
          </div>
        )}

        {/* TABLE VIEW - When drugs exist */}
        {drugs.length > 0 && (
          // FIX #1: flex-col so AddRow sits flush right below the last drug row
          <div className="flex-1 flex flex-col overflow-hidden">
            <TableHeader />
            {/* Scrollable drug list — does NOT grow to fill remaining space so AddRow stays close */}
            <div className="overflow-y-auto">
              {drugs.map((drug, index) => (
                <DrugRow
                  key={drug.id}
                  drug={drug}
                  index={index}
                  isStruck={struckIds.includes(drug.id)}
                  onDelete={() => setDrugs(prev => prev.filter(d => d.id !== drug.id))}
                  onStrike={() => toggleStrike(drug.id)}
                  onEdit={() => startEdit(drug)}
                />
              ))}
            </div>

            {/* FIX #1: AddRow is placed directly after the drug list, no gap */}
            <AddRow ref={addRowRef} {...addRowProps} />
          </div>
        )}
      </div>

      {/* FOOTER BAR */}
      <div
        className="flex-shrink-0 h-1"
        style={{
          background: "linear-gradient(90deg, var(--color-drugs) 0%, var(--color-primary) 50%, var(--color-lab) 100%)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}