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

const FIELD_ORDER = ["days", "name", "form", "intake", "period", "when", "detail", "commit"];

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
    "OD": 1,
    "BD": 2,
    "TDS": 3,
    "QID": 4,
    "HS": 1,
    "SOS": 1,
    "Stat": 1,
    "Weekly": 1,
    "Monthly": 1
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
  const total = Math.ceil(days * dailyDosage);
  return total;
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

/* ── Modern Toolbar Component (without Doc info and Copy) ── */
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

/* ── Table Header Component (New Structure) ── */
function TableHeader() {
  const columns = [
    { label: "S.No", width: "w-12", center: true },
    { label: "Drug", width: "w-48" },
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

/* ── Drug Row Component (New Structure) ── */
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
      <div className="w-48 px-2 py-2">
        <div className="font-semibold text-sm" style={{ color: isStruck ? "var(--color-text-muted)" : "var(--color-text-base)" }}>
          {drug.name}
        </div>
        <div className="text-[0.6rem]" style={{ color: "var(--color-text-subtle)" }}>
          {intakeDisplay}
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

/* ── Typable Detail Input Component with Dropdown Above ── */
/* ── Typable Detail Input Component with Dropdown Above ── */
function TypableDetailInput({ value, onChange, onKeyDown }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Filter out the "--" option
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

  const [hasTyped, setHasTyped] = useState(false);

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
        onChange={e => {
  setHasTyped(true);   // ← add this line
  onChange(e);
}}
       onFocus={() => {
  recalcDropdown();        // ← calculate position BEFORE showing
  setShowDropdown(true);
}}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => { setShowDropdown(false); setHasTyped(false); }, 200)}
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

/* ── Add Row Component (with typable detail field) ── */
function AddRow({ draft, onDraftChange, onCommit, query, setQuery, suggestions, onCancel }) {
  const inputRef    = useRef(null);
  const rowRef      = useRef(null);
  const wrapperRef  = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const medicineTypes = [
    "Paracetamol","Amoxicillin","Azithromycin","Ciprofloxacin",
    "Doxycycline","Metformin","Omeprazole","Losartan",
    "Amlodipine","Atorvastatin","Cetirizine","Ibuprofen"
  ];

  const dropdownItems = query === ""
    ? medicineTypes
    : suggestions.slice(0, 8);

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

    if (e.key === "Escape") {
      onCancel();
      return;
    }

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

    if (e.key === "ArrowRight" && (currentField === "days" || currentField === "name")) {
      e.preventDefault();
      const next = FIELD_ORDER[idx + 1];
      if (next) focusField(next);
      return;
    }
    if (e.key === "ArrowRight" && e.altKey) {
      e.preventDefault();
      const next = FIELD_ORDER[idx + 1];
      if (next) focusField(next);
      return;
    }

    if (e.key === "ArrowLeft" && (currentField === "days" || currentField === "name")) {
      e.preventDefault();
      const prev = FIELD_ORDER[idx - 1];
      if (prev) focusField(prev);
      return;
    }
    if (e.key === "ArrowLeft" && e.altKey) {
      e.preventDefault();
      const prev = FIELD_ORDER[idx - 1];
      if (prev) focusField(prev);
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
        <div className="w-16 px-2">
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

        <div className="flex-1 relative" ref={wrapperRef}>
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
            onKeyDown={e => handleFieldKeyDown(e, "name")}
            placeholder="Search or select medicine..."
            className="w-full pl-7 pr-8 py-1.5 rounded text-sm font-medium"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-drugs)" }}
          />
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: "var(--color-text-muted)" }}
            onMouseDown={(e) => { e.preventDefault(); setShowDropdown(v => !v); }} />
        </div>

        <div className="w-20">
          <select data-field="form" value={draft.form}
            onChange={e => onDraftChange("form")(e.target.value)}
            onKeyDown={e => handleFieldKeyDown(e, "form")}
            className="w-full px-2 py-1.5 rounded text-sm"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
            {FORM_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="w-20">
          <select data-field="intake" value={draft.intake}
            onChange={e => onDraftChange("intake")(e.target.value)}
            onKeyDown={e => handleFieldKeyDown(e, "intake")}
            className="w-full px-2 py-1.5 rounded text-sm"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
            {INTAKE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="w-20">
          <select data-field="period" value={draft.period}
            onChange={e => onDraftChange("period")(e.target.value)}
            onKeyDown={e => handleFieldKeyDown(e, "period")}
            className="w-full px-2 py-1.5 rounded text-sm font-bold"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-primary)" }}>
            {PERIOD_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="w-28">
          <select data-field="when" value={draft.when}
            onChange={e => onDraftChange("when")(e.target.value)}
            onKeyDown={e => handleFieldKeyDown(e, "when")}
            className="w-full px-2 py-1.5 rounded text-sm"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
            {WHEN_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="w-48">
          <TypableDetailInput
            value={draft.detail}
            onChange={handleDetailChange}
            onKeyDown={(e) => handleFieldKeyDown(e, "detail")}
          />
        </div>

        <div className="w-28 flex gap-1 justify-center">
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
}

/* ═══════════════════════════════════════════════ MAIN DRUG TAB COMPONENT ═══════════════════ */
const EMPTY_DRAFT = { name: "", form: "Tab", intake: "1", period: "OD", when: "AF", detail: "—", days: "1" };

export default function DrugTab({ drugs, setDrugs, patient }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");
  const [struckIds, setStruckIds] = useState([]);
  const [showAddRow, setShowAddRow] = useState(false);

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
    }
  };

  const handleSave = () => {
    alert("Prescription saved successfully!");
  };

  const handleProto = () => {
    alert("Proto feature coming soon!");
  };

  const addRowProps = { draft, onDraftChange: setD, onCommit: commitDraft, onCancel: cancelAdd, query, setQuery, suggestions };

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden shadow-lg"
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
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill size={18} style={{ color: "var(--color-drugs)" }} />
            <h2 className="text-base font-extrabold" style={{ color: "var(--color-drugs)" }}>
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
                onClick={() => setShowAddRow(true)}
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

        {/* EMPTY STATE + ADD ROW */}
        {drugs.length === 0 && showAddRow && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1" />
            <AddRow {...addRowProps} />
          </div>
        )}

        {/* TABLE VIEW */}
        {drugs.length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <TableHeader />
            <div className="flex-1 overflow-y-auto">
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
            {showAddRow && <AddRow {...addRowProps} />}
            {!showAddRow && (
              <div
                className="flex-shrink-0 flex justify-end px-4 py-3 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <button
                  onClick={() => setShowAddRow(true)}
                  className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                  style={{ background: "var(--color-drugs)", color: "white" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#146b4c"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-drugs)"}
                >
                  <Plus size={15} /> Add Medicine
                </button>
              </div>
            )}
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