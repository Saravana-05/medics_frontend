import { Clipboard, Stethoscope, Eye, Baby, ArrowRightLeft } from "lucide-react";

/* ── Clinical Card Component (compact, single-row friendly) ── */
function ClinicalCard({ icon: Icon, label, value, variant }) {
  const variants = {
    danger: { color: "#dc2626" },
    info: { color: "#0284c7" },
    purple: { color: "#9333ea" },
    warning: { color: "#d97706" },
  };

  const style = variant ? variants[variant] : { color: "var(--color-text-base)" };

  return (
    <div
      className="flex-1 min-w-[130px] lg:min-w-0 p-2 lg:p-3 rounded-lg transition-all hover:shadow-sm md:p-1 md:min-w-[110px]"
      style={{ background: "transparent", border: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center gap-1.5 mb-1 md:mb-0">
        <Icon size={12} className="md:w-2.5 md:h-2.5" style={{ color: style.color }} />
        <span className="text-[0.55rem] font-bold uppercase tracking-wide truncate md:text-[0.5rem]" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </span>
      </div>
      <div className="lg:text-[0.8rem] font-semibold truncate md:text-[0.6rem]" style={{ color: style.color }}>
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
    <div className="px-3 py-4 md:py-1.5" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
      {/* Clinical Information header - hidden on tablet, visible on mobile and desktop */}
      <div className="flex items-center gap-2 mb-2 md:hidden lg:flex lg:mb-2">
        <Clipboard size={14} style={{ color: "var(--color-primary)" }} />
        <span className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Clinical Information</span>
      </div>
      
      {/* Single Row Cards — scrolls horizontally if it can't all fit */}
      <div className="flex gap-2 md:gap-1 overflow-x-auto md:pb-1 lg:pb-6 lg:pt-1">
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