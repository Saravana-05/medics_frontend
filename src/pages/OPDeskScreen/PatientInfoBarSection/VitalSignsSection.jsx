import { ActivitySquare, Thermometer, Heart, Wind, Ruler, Weight, Calculator, Droplet } from "lucide-react";

/* ── Compact Badge (tablet / mobile) — now with colored bg for ALL vitals ── */
function VitalBadge({ icon: Icon, value, color, unit }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}35` }}
    >
      <Icon size={11} style={{ color }} />
      <span className="text-xs font-bold whitespace-nowrap" style={{ color }}>
        {value || "—"}
      </span>
      {unit && (
        <span className="text-[0.6rem] whitespace-nowrap" style={{ color: "#000000" }}>
          {unit}
        </span>
      )}
    </div>
  );
}

/* ── Vital Sign Card (Compact, desktop) ── */
function VitalSignCard({ icon: Icon, value, label, color, unit, trend }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg p-1.5 transition-all hover:scale-105"
      style={{ background: "var(--color-surface)", border: `1px solid ${color}20` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-[0.48rem] font-bold uppercase tracking-wide mb-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {label}
          </div>
          <div className="text-sm font-black leading-tight" style={{ color }}>
            {value || "—"}
          </div>
          {unit && (
            <div className="text-[0.65rem] mt-0.5" style={{ color: "#000000" }}>
              {unit}
            </div>
          )}
        </div>
        <div className="p-1 rounded-lg" style={{ background: `${color}15` }}>
          <Icon size={14} style={{ color }} />
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
        className="absolute top-0 right-0 w-16 h-16 -mr-6 -mt-6 rounded-full opacity-10"
        style={{ background: color }}
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

  /* ── Blood group colour ── */
  const getBloodGroupColor = (bg) => {
    if (!bg || bg === "—") return "var(--color-text-muted)";
    const g = bg.toUpperCase();
    if (g.includes("AB+")) return "#9333ea";
    if (g.includes("AB-")) return "#7e22ce";
    if (g.includes("A+"))  return "#dc2626";
    if (g.includes("A-"))  return "#b91c1c";
    if (g.includes("B+"))  return "#16a34a";
    if (g.includes("B-"))  return "#15803d";
    if (g.includes("O+"))  return "#2563eb";
    if (g.includes("O-"))  return "#1d4ed8";
    return "var(--color-text-muted)";
  };

  const bloodGroupColor = getBloodGroupColor(p.bloodGroup);

  /* ── Shared vital definitions so both views stay in sync ──
     All colors are plain hex so template-literal bg opacity (e.g. `${color}18`)
     works correctly for every badge and card.                              */
  const vitals = [
    {
      icon: ActivitySquare,
      value: `${p.bpSystolic || 145}/${p.bpDiastolic || 90}`,
      label: "BP",
      color: "#ef4444",   // red   — maps to --color-danger
      unit: "mmHg",
    },
    {
      icon: Thermometer,
      value: p.temp || "101.2",
      label: "Temp",
      color: "#f97316",   // amber-orange
      unit: "°F",
    },
    {
      icon: Heart,
      value: p.pulse || "95",
      label: "Pulse",
      color: "#6366f1",   // indigo — maps to --color-primary (adjust if yours differs)
      unit: "bpm",
    },
    {
      icon: Wind,
      value: p.oxygenLevel || "98",
      label: "SpO₂",
      color: "#06b6d4",   // cyan
      unit: "%",
    },
    {
      icon: Droplet,
      value: p.bloodGroup || "—",
      label: "Blood",
      color: bloodGroupColor.startsWith("var(") ? "#6b7280" : bloodGroupColor,
    },
    {
      icon: Ruler,
      value: p.height || "68",
      label: "Height",
      color: "#8b5cf6",   // violet — maps to --color-drugs
      unit: "cm",
    },
    {
      icon: Weight,
      value: p.weight || "86",
      label: "Weight",
      color: "#0ea5e9",   // sky blue — maps to --color-role-office
      unit: "kg",
    },
    {
      icon: Calculator,
      value: bmiValue,
      label: "BMI",
      color: bmiCategory.color.startsWith("var(") ? "#6b7280" : bmiCategory.color,
      unit: bmiCategory.label,
    },
  ];

  return (
    <div
      className="px-3 border-b"
      /* Tablet/mobile: tighter vertical padding. Desktop: normal. */
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}
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
            color={v.color}
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
            className="text-[0.6rem] font-bold uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
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
              color={v.color}
              unit={v.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}