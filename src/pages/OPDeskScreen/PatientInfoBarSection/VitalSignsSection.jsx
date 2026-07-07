
import { ActivitySquare, Thermometer, Heart, Wind, Ruler, Weight, Calculator, Droplet } from "lucide-react";

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

/* ── Compact Badge (tablet / mobile) — solid vital-colored bg for ALL vitals ── */
function VitalBadge({ icon: Icon, value, accent, valueColor, unit }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
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

/* ── Vital Sign Card (Compact, desktop) ── */
function VitalSignCard({ icon: Icon, value, label, accent, valueColor, unit, trend }) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg p-1.5 transition-all hover:scale-105"
      style={{ background: "var(--color-surface)", border: `1px solid ${tint(accent, "20%")}` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-[0.58rem] uppercase tracking-wide mb-0.5"
            style={{ color: "darkslategray",fontWeight: "600", letterSpacing: "0.1em", fontFamily: "var(--font-inter)" }}
          >
            {label}
          </div>
          <div 
            className="text-sm font-black leading-tight" 
            style={{ color: valueColor,letterSpacing: "0.05em", fontWeight: "600", fontFamily: "var(--font-inter)" }}
          >
            {value || "—"}
          </div>
          {unit && (
            <div 
              className="text-[0.80rem] font-regular mt-0.5" 
              style={{ color: "#000000", fontFamily: "var(--font-inter)" }}
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

export default function VitalSignsSection({ patient }) {
  const p = patient;

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
      value: `${p.bpSystolic || 145}/${p.bpDiastolic || 90}`,
      label: "BP",
      accent: VITAL_ACCENTS.bp,
      valueColor: VALUE_COLOR,
      unit: "mmHg",
    },
    {
      icon: Thermometer,
      value: p.temp || "101.2",
      label: "Temp",
      accent: VITAL_ACCENTS.temp,
      valueColor: VALUE_COLOR,
      unit: "°F",
    },
    {
      icon: Heart,
      value: p.pulse || "95",
      label: "Pulse",
      accent: VITAL_ACCENTS.pulse,
      valueColor: VALUE_COLOR,
      unit: "bpm",
    },
    {
      icon: Wind,
      value: p.oxygenLevel || "98",
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
      value: p.height || "68",
      label: "Height",
      accent: VITAL_ACCENTS.height,
      valueColor: VALUE_COLOR,
      unit: "cm",
    },
    {
      icon: Weight,
      value: p.weight || "86",
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

  return (
    <div
      className="px-3 border-b"
      /* Tablet/mobile: tighter vertical padding. Desktop: normal. */
      style={{ borderColor: "var(--color-border)", background: "#AAB2BD" }}
    >
      {/* ── Tablet / Mobile ──
          • Header is HIDDEN (no ActivitySquare title row)
          • Compact single row of coloured badges
          • py-1 keeps the whole strip lean                           */}
      <div className="flex lg:hidden items-center gap-4 overflow-x-auto py-1">
        {vitals.map((v) => (
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
          • Full 8-column card grid                                   */}
      <div className="hidden lg:block py-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <ActivitySquare size={12} style={{ color: "var(--color-primary)" }} />
          <span
            className="text-[0.8rem] font-bold tracking-wide"
            style={{ color: "var(--color-text-base)", fontFamily: "var(--font-archivo)" }}
          >
            Vital Signs
          </span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {vitals.map((v) => (
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
      </div>
    </div>
  );
}