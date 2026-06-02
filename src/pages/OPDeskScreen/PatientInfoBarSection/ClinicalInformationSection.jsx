import { Clipboard, Stethoscope, Eye, Baby, ArrowRightLeft } from "lucide-react";

/* ── Clinical Card Component ── */
function ClinicalCard({ icon: Icon, label, value, variant }) {
  const variants = {
    danger: { color: "#dc2626" },
    info: { color: "#0284c7" },
    purple: { color: "#9333ea" },
    warning: { color: "#d97706" },
  };
  
  const style = variant ? variants[variant] : { color: "var(--color-text-base)" };
  
  return (
    <div className="flex-1 p-4.5 rounded-lg transition-all hover:shadow-sm" style={{ background: "transparent", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color: style.color }} />
        <span className="text-[0.6rem] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      </div>
      <div className="text-[0.75rem] font-semibold truncate" style={{ color: style.color }}>
        {value || "—"}
      </div>
    </div>
  );
}

export default function ClinicalInformationSection({ patient, isInline = false }) {
  const p = patient;
  
  // Define clinical cards
  const clinicalCards = [
    { 
      icon: Stethoscope, 
      label: "Chief Complaint", 
      value: p.chiefComplaint || "Allergy, Anxiety", 
      variant: "danger" 
    },
    { 
      icon: Eye, 
      label: "First Observation", 
      value: p.firstObservation || "Rashes, Weak, No sleep", 
      variant: "info" 
    },
  ];
  
  // Add Pregnancy Status only if Gender is Female
  if (p.gender !== "M" && p.gender !== "Male") {
    clinicalCards.push({ 
      icon: Baby, 
      label: "Pregnancy Status", 
      value: p.pregnancy || "Yes. 60 Days", 
      variant: "purple" 
    });
  }
  
  clinicalCards.push({ 
    icon: ArrowRightLeft, 
    label: "Referral", 
    value: p.referral || "Dr. Sheela (From)", 
    variant: "warning" 
  });
  
  return (
    <div className="px-3 py-3 " style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
      <div className="flex items-center gap-2 mb-2">
        <Clipboard size={14} style={{ color: "var(--color-primary)" }} />
        <span className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Clinical Information</span>
      </div>
      
      {/* Single Row Cards */}
      <div className="flex gap-2">
        {clinicalCards.map((card, index) => (
          <ClinicalCard 
            key={index}
            icon={card.icon} 
            label={card.label} 
            value={card.value} 
            variant={card.variant}
          />
        ))}
      </div>
    </div>
  );
}