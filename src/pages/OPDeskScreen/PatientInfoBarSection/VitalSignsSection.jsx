
import { ActivitySquare, Thermometer, Heart, Wind, Ruler, Weight, Calculator, Droplet, BedDouble, CalendarDays, Stethoscope, UserRound, Building2, Users, CalendarCheck } from "lucide-react";

/* Fonts (Inter) are loaded globally in index.html + registered in the Tailwind
   theme (index.css). Colors below come from the shared design tokens. */

/* ── Value text stays blue for all vitals ── */
const VALUE_COLOR = "var(--color-value)";

/* ── Per-vital accent colors (registered as tokens in index.css @theme) ── */
const VITAL_ACCENTS = {
  bp: "var(--color-vital-bp)",
  temp: "var(--color-vital-temp)",
  pulse: "var(--color-vital-pulse)",
  spo2: "var(--color-vital-spo2)",
  blood: "var(--color-vital-blood)",
  height: "var(--color-vital-height)",
  weight: "var(--color-vital-weight)",
};

/* Translucent tint of a token color (works with CSS variables). pct like "15%". */
const tint = (color, pct) => `color-mix(in srgb, ${color} ${pct}, transparent)`;

/* ── IP Time-line's admission-info accents (same card component as Vital Signs,
   just a different accent per card since there's no vital-specific meaning here) ── */
const IP_ACCENTS = ["#0c324a", "#679cbc", "#73bfb8", "#eb6367", "#9333ea", "#d97706", "#16a34a", "#0284c7"];

/* ── Compact Badge (tablet / mobile) — solid vital-colored bg for ALL vitals ── */
function VitalBadge({ icon: Icon, value, accent, valueColor, unit }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 shadow-sm"
      style={{ background: accent }}
    >
      <Icon size={11} style={{ color: "#ffffff" }} />
      <span
        className="text-xs font-bold whitespace-nowrap"
        style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
      >
        {value || "—"}
      </span>
      {unit && (
        <span
          className="text-[0.6rem] whitespace-nowrap"
          style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-inter)" }}
        >
          {unit}
        </span>
      )}
    </div>
  );
}

/* ── IP Admission Info row item — plain text, no card box, just label:value
   arrangement (used instead of VitalSignCard while the IP Time-line tab is
   active, per an explicit "remove the card" request). ── */
function IPInfoText({ icon: Icon, label, value, unit, accent }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <Icon size={13} style={{ color: accent, flexShrink: 0 }} />
      <span className="text-[0.68rem] font-bold uppercase tracking-wide flex-shrink-0" style={{ color: "darkslategray", fontFamily: "var(--font-inter)" }}>
        {label}:
      </span>
      <span className="text-[0.8rem] font-semibold truncate" style={{ color: VALUE_COLOR, fontFamily: "var(--font-inter)" }} title={value || ""}>
        {value || "—"}{unit ? ` · ${unit}` : ""}
      </span>
    </div>
  );
}

/* ── Vital Sign Card (Compact, desktop) ── Fixed height + truncated text so
   longer content (e.g. IP Admission Info) can never stretch the row and
   break the rest of the layout — every card stays exactly the same size. */
function VitalSignCard({ icon: Icon, value, label, accent, valueColor, unit, trend }) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg p-1.5 transition-all hover:scale-105 shadow-sm"
      style={{ background: "var(--color-surface)", border: `1px solid ${tint(accent, "20%")}`, height: "58px", boxSizing: "border-box" }}
    >
      <div className="flex items-center justify-between h-full">
        <div className="min-w-0 flex-1">
          <div
            className="text-[0.58rem] uppercase tracking-wide mb-0.5 truncate"
            style={{ color: "darkslategray",fontWeight: "600", letterSpacing: "0.1em", fontFamily: "var(--font-inter)" }}
          >
            {label}
          </div>
          <div
            className="text-sm font-black leading-tight truncate"
            style={{ color: valueColor,letterSpacing: "0.05em", fontWeight: "600", fontFamily: "var(--font-inter)" }}
            title={value || ""}
          >
            {value || "—"}
          </div>
          {unit && (
            <div
              className="text-[0.7rem] font-regular mt-0.5 truncate"
              style={{ color: "#000000", fontFamily: "var(--font-inter)" }}
              title={unit}
            >
              {unit}
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
          style={{
            width: 26,
            height: 26,
            background: tint(accent, "15%"),
            border: `1px solid ${tint(accent, "30%")}`,
            boxShadow: `0 1px 3px ${tint(accent, "25%")}`,
          }}
        >
          <Icon size={16} style={{ color: accent, opacity: 2.8 }} />
        </div>
      </div>
      {trend && (
        <div
          className="absolute bottom-1 right-1 text-[0.5rem] font-semibold"
          style={{ color: trend === "up" ? "var(--color-danger)" : "var(--color-success)" }}
        >
          {trend === "up" ? "↑" : "↓"}
        </div>
      )}
      <div
        className="absolute top-0 right-0 w-16 h-16 -mr-6 -mt-6 rounded-full opacity-20"
        style={{ background: accent }}
      />
    </div>
  );
}

export default function VitalSignsSection({ patient, activeTab }) {
  const p = patient || {};
  const ip = p.ipInfo || {};
  const isIPTime = activeTab === "iptime";

  /* ── IP Time-line: same card grid, swapped for admission info (Admission,
     Treatment, Attender, Admitted@, Currently@, Doctors, Nursing, Discharge) ── */
  const ipCards = [
    {
      icon: CalendarDays,
      value: ip.admitDate || "—",
      label: "Admission",
      accent: IP_ACCENTS[0],
      valueColor: VALUE_COLOR,
      unit: ip.admitTime || "",
    },
    {
      icon: Stethoscope,
      value: ip.treatment || "—",
      label: "Treatment",
      accent: IP_ACCENTS[1],
      valueColor: VALUE_COLOR,
      unit: "",
    },
    {
      icon: UserRound,
      value: ip.attenderName || "—",
      label: "Attender",
      accent: IP_ACCENTS[2],
      valueColor: VALUE_COLOR,
      unit: ip.attenderPhone ? `${ip.attenderPhone}${ip.attenderRelation ? " · " + ip.attenderRelation : ""}` : "",
    },
    {
      icon: BedDouble,
      value: ip.ward || "—",
      label: "Admitted",
      accent: IP_ACCENTS[3],
      valueColor: VALUE_COLOR,
      unit: ip.room || ip.bed ? `Room ${ip.room || "—"} · Bed ${ip.bed || "—"}` : "",
    },
    {
      icon: Building2,
      value: ip.currentWard || "—",
      label: "Currently",
      accent: IP_ACCENTS[4],
      valueColor: VALUE_COLOR,
      unit: ip.currentRoom || ip.currentBed ? `Room ${ip.currentRoom || "—"} · Bed ${ip.currentBed || "—"}` : "",
    },
    {
      icon: Users,
      value: ip.consultant || "—",
      label: "Doctors",
      accent: IP_ACCENTS[5],
      valueColor: VALUE_COLOR,
      unit: ip.consultant2 || "",
    },
    {
      icon: Heart,
      value: ip.nurse1 || "—",
      label: "Nursing",
      accent: IP_ACCENTS[6],
      valueColor: VALUE_COLOR,
      unit: ip.nurse2 || "",
    },
    {
      icon: CalendarCheck,
      value: ip.dischargeDate || "—",
      label: "Discharge",
      accent: IP_ACCENTS[7],
      valueColor: VALUE_COLOR,
      unit: "",
    },
  ];

  /* ── BMI ── */
  const calculateBMI = () => {
    const height = p.height ? parseFloat(p.height) : null;
    const weight = p.weight ? parseFloat(p.weight) : null;
    if (height && weight) {
      const h = height > 10 ? height / 100 : height;
      return (weight / (h * h)).toFixed(1);
    }
    return "—";
  };

  const getBMICategory = (bmi) => {
    if (bmi === "—") return { label: "", color: "var(--color-text-muted)" };
    const n = parseFloat(bmi);
    if (n < 18.5) return { label: "Underweight", color: "#eab308" };
    if (n < 25)   return { label: "Normal",      color: "#22c55e" };
    if (n < 30)   return { label: "Overweight",  color: "#f97316" };
    return               { label: "Obese",       color: "#ef4444" };
  };

  const bmiValue    = calculateBMI();
  const bmiCategory = getBMICategory(bmiValue);

  /* ── Shared vital definitions so both views stay in sync ──
     accent = per-vital color for icon + badge/card background & border
     valueColor = shared blue used for every value's text                */
  const vitals = [
    {
      icon: ActivitySquare,
      value: p.bpSystolic && p.bpDiastolic ? `${p.bpSystolic}/${p.bpDiastolic}` : "—",
      label: "BP",
      accent: VITAL_ACCENTS.bp,
      valueColor: VALUE_COLOR,
      unit: "mmHg",
    },
    {
      icon: Thermometer,
      value: p.temp || "—",
      label: "Temp",
      accent: VITAL_ACCENTS.temp,
      valueColor: VALUE_COLOR,
      unit: "°F",
    },
    {
      icon: Heart,
      value: p.pulse || "—",
      label: "Pulse",
      accent: VITAL_ACCENTS.pulse,
      valueColor: VALUE_COLOR,
      unit: "bpm",
    },
    {
      icon: Wind,
      value: p.oxygenLevel || "—",
      label: "SpO₂",
      accent: VITAL_ACCENTS.spo2,
      valueColor: VALUE_COLOR,
      unit: "%",
    },
    {
      icon: Droplet,
      value: p.bloodGroup || "—",
      label: "Blood",
      accent: VITAL_ACCENTS.blood,
      valueColor: VALUE_COLOR,
      unit: "blood ",
    },
    {
      icon: Ruler,
      value: p.height || "—",
      label: "Height",
      accent: VITAL_ACCENTS.height,
      valueColor: VALUE_COLOR,
      unit: "cm",
    },
    {
      icon: Weight,
      value: p.weight || "—",
      label: "Weight",
      accent: VITAL_ACCENTS.weight,
      valueColor: VALUE_COLOR,
      unit: "kg",
    },
    {
      icon: Calculator,
      value: bmiValue,
      label: "BMI",
      accent: bmiCategory.color.startsWith("var(") ? "#6b7280" : bmiCategory.color,
      valueColor: VALUE_COLOR,
      unit: bmiCategory.label,
    },
  ];

  const cards = isIPTime ? ipCards : vitals;
  const HeaderIcon = isIPTime ? BedDouble : ActivitySquare;
  const headerLabel = isIPTime ? "IP Admission Info" : "Vital Signs";

  return (
    <div
      className="px-3 border-b"
      /* Tablet/mobile: tighter vertical padding. Desktop: normal. */
      style={{ borderColor: "var(--color-border)", background: "lightgray" }}
    >
      {/* ── Tablet / Mobile ──
          • Header is HIDDEN (no ActivitySquare title row)
          • Vital Signs: compact row of coloured badges
          • IP Admission Info: plain text, no card/badge box              */}
      <div className="flex lg:hidden items-center gap-4 overflow-x-auto py-1">
        {isIPTime
          ? cards.map((v) => <IPInfoText key={v.label} icon={v.icon} label={v.label} value={v.value} unit={v.unit} accent={v.accent} />)
          : cards.map((v) => (
              <VitalBadge
                key={v.label}
                icon={v.icon}
                value={v.value}
                accent={v.accent}
                valueColor={v.valueColor}
                unit={v.unit}
              />
            ))}
      </div>

      {/* ── Desktop ──
          • Header shown
          • Vital Signs: 8-column card grid
          • IP Admission Info: plain text arrangement, no card boxes        */}
      <div className="hidden lg:block py-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <HeaderIcon size={12} style={{ color: "var(--color-primary)" }} />
          <span
            className="text-[0.8rem] font-bold tracking-wide"
            style={{ color: "var(--color-text-base)", fontFamily: "var(--font-archivo)" }}
          >
            {headerLabel}
          </span>
        </div>

        {isIPTime ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {cards.map((v) => <IPInfoText key={v.label} icon={v.icon} label={v.label} value={v.value} unit={v.unit} accent={v.accent} />)}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1.5">
            {cards.map((v) => (
              <VitalSignCard
                key={v.label}
                icon={v.icon}
                value={v.value}
                label={v.label}
                accent={v.accent}
                valueColor={v.valueColor}
                unit={v.unit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}