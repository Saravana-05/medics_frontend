import { Clipboard, Stethoscope, Eye, Baby, ArrowRightLeft } from "lucide-react";

/* Fonts (Inter) are loaded globally in index.html + registered in the Tailwind
   theme (index.css). Use var(--font-inter) / the `font-sans` utility anywhere. */

/* ── Clinical Card Component (compact, single-row friendly) ── */
function ClinicalCard({ icon: Icon, label, value, variant, disabled = false }) {
  const variants = {
    danger: { color: "#dc2626" },
    info: { color: "#0284c7" },
    purple: { color: "#9333ea" },
    warning: { color: "#d97706" },
    muted: { color: "#9ca3af" },
  };

  // For disabled state, use muted text but keep the icon color from the variant
  const textStyle = disabled ? variants.muted : (variant ? variants[variant] : { color: "var(--color-text-base)" });
  // Icon color - use the variant color even when disabled
  const iconColor = variant ? variants[variant]?.color || "var(--color-text-muted)" : "var(--color-text-muted)";

  return (
    <div
      className={`flex-1 min-w-[130px] lg:min-w-0 p-2 lg:p-3 rounded-lg transition-all shadow-sm hover:shadow-md md:p-1 md:min-w-[110px] ${disabled ? 'opacity-70' : ''}`}
      style={{ 
        background: disabled ? "var(--color-surface-alt)" : "transparent", 
        border: disabled ? "1px dashed var(--color-border)" : "1px solid var(--color-border)" 
      }}
    >
      <div className="flex items-center gap-1.5 mb-1 md:mb-0">
        <Icon size={12} className="md:w-2.5 md:h-2.5" style={{ color: iconColor }} />
        <span 
          className="text-[0.7rem] font-bold tracking-wide truncate md:text-[0.7rem]" 
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-inter)" }}
        >
          {label}
        </span>
      </div>
      <div 
        className="lg:text-[0.8rem] font-semibold truncate md:text-[0.6rem]" 
        style={{ color: textStyle.color, fontFamily: "var(--font-inter)" }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

export default function ClinicalInformationSection({ patient, isInline = false }) {
  const p = patient || {};

  // Define clinical cards
  const clinicalCards = [
    {
      icon: Stethoscope,
      label: "Chief Complaint",
      value: p.chiefComplaint || "",
      variant: "info"
    },
    {
      icon: Eye,
      label: "First Observation",
      value: p.firstObservation || "",
      variant: "info"
    },
  ];

  // Pregnancy Status - Show for all genders, but disabled for males
  const isMale = p.gender === "M" || p.gender === "Male";
  clinicalCards.push({
    icon: Baby,
    label: "Pregnancy Status",
    value: isMale ? "N/A" : (p.pregnancy || ""),
    variant: "info",  // Always use purple for the icon
    disabled: isMale
  });

  clinicalCards.push({
    icon: ArrowRightLeft,
    label: "Referral",
    value: p.referral || "",
    variant: "info"
  });
  
  return (
    <div className="px-3 py-2 sm:py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)"  }}>
      {/* Clinical Information header - hidden on tablet, visible on mobile and desktop */}
      <div className="flex items-center gap-2  md:hidden lg:flex lg:mt-1 ">
        <Clipboard size={14} style={{ color: "var(--color-primary)" }} />
        <span 
          className="text-[0.8rem] font-bold tracking-wide" 
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-inter)" }}
        >
          Clinical Information
        </span>
      </div>
      
      {/* Single Row Cards — scrolls horizontally if it can't all fit */}
      <div className="flex gap-2 md:gap-1 overflow-x-auto md:pb-1 lg:pb-1 lg:pt-1">
        {clinicalCards.map((card, index) => (
          <ClinicalCard 
            key={index}
            icon={card.icon} 
            label={card.label} 
            value={card.value} 
            variant={card.variant}
            disabled={card.disabled || false}
          />
        ))}
      </div>
    </div>
  );
}