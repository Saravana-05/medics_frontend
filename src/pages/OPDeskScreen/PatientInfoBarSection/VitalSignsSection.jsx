import { ActivitySquare, Thermometer, Heart, Wind, Ruler, Weight, Calculator } from "lucide-react";

/* ── Vital Sign Card (Compact) ── */
function VitalSignCard({ icon: Icon, value, label, color, unit, trend }) {
  return (
    <div className="relative overflow-hidden rounded-lg p-1.5 transition-all hover:scale-105" style={{ background: "var(--color-surface)", border: `1px solid ${color}20` }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[0.48rem] font-bold uppercase tracking-wide mb-0.5" style={{ color: "var(--color-text-muted)" }}>
            {label}
          </div>
          <div className="text-sm font-black leading-tight" style={{ color }}>
            {value || "—"}
          </div>
          {unit && <div className="text-[0.5rem] mt-0.5" style={{ color: "var(--color-text-subtle)" }}>{unit}</div>}
        </div>
        <div className="p-1 rounded-lg" style={{ background: `${color}15` }}>
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      {trend && (
        <div className="absolute bottom-1 right-1 text-[0.5rem] font-semibold" style={{ color: trend === "up" ? "var(--color-danger)" : "var(--color-success)" }}>
          {trend === "up" ? "↑" : "↓"}
        </div>
      )}
      <div className="absolute top-0 right-0 w-16 h-16 -mr-6 -mt-6 rounded-full opacity-10" style={{ background: color }} />
    </div>
  );
}

export default function VitalSignsSection({ patient }) {
  const p = patient;
  
  // Calculate BMI from height and weight
  const calculateBMI = () => {
    const height = p.height ? parseFloat(p.height) : null;
    const weight = p.weight ? parseFloat(p.weight) : null;
    
    if (height && weight) {
      const heightInMeters = height > 10 ? height / 100 : height;
      const bmi = weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return "—";
  };
  
  // Get BMI category and color
  const getBMICategory = (bmi) => {
    if (bmi === "—") return { label: "", color: "var(--color-text-muted)" };
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { label: "Underweight", color: "#eab308" };
    if (bmiNum >= 18.5 && bmiNum < 25) return { label: "Normal", color: "#22c55e" };
    if (bmiNum >= 25 && bmiNum < 30) return { label: "Overweight", color: "#f97316" };
    return { label: "Obese", color: "#ef4444" };
  };
  
  const bmiValue = calculateBMI();
  const bmiCategory = getBMICategory(bmiValue);
  
  return (
    <div className="px-3 py-2 border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <ActivitySquare size={12} style={{ color: "var(--color-primary)" }} />
        <span className="text-[0.6rem] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Vital Signs</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        <VitalSignCard
          icon={ActivitySquare}
          value={`${p.bpSystolic || 145}/${p.bpDiastolic || 90}`}
          label="BP"
          color="var(--color-danger)"
          unit="mmHg"
        />
        <VitalSignCard
          icon={Thermometer}
          value={p.temp || "101.2"}
          label="Temp"
          color="var(--color-lab)"
          unit="°F"
        />
        <VitalSignCard
          icon={Heart}
          value={p.pulse || "95"}
          label="Pulse"
          color="var(--color-primary)"
          unit="bpm"
        />
        <VitalSignCard
          icon={Wind}
          value={p.oxygenLevel || "98"}
          label="SpO₂"
          color="var(--color-primary)"
          unit="%"
        />
        <VitalSignCard
          icon={Ruler}
          value={p.height || "68"}
          label="Height"
          color="var(--color-drugs)"
          unit="cm"
        />
        <VitalSignCard
          icon={Weight}
          value={p.weight || "86"}
          label="Weight"
          color="var(--color-role-office)"
          unit="kg"
        />
        <VitalSignCard
          icon={Calculator}
          value={bmiValue}
          label="BMI"
          color="var(--color-danger)"
          unit={bmiCategory.label}
        />
      </div>
    </div>
  );
}