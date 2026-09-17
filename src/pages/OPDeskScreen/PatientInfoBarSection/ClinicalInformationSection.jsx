/* Fonts (Inter) are loaded globally in index.html + registered in the Tailwind
   theme (index.css). Use var(--font-inter) / the `font-sans` utility anywhere. */
import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";

/* ── Clinical Card Component (compact, single-row friendly) ── */
function ClinicalCard({ label, value, variant, disabled = false, editable = false, onSave }) {
  const variants = {
    danger: { color: "#dc2626" },
    info: { color: "#0284c7" },
    purple: { color: "#9333ea" },
    warning: { color: "#d97706" },
    muted: { color: "#9ca3af" },
  };

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const textStyle = disabled ? variants.muted : (variant ? variants[variant] : { color: "var(--color-text-base)" });

  const startEdit = () => {
    setDraft(value || "");
    setIsEditing(true);
  };
  const save = () => {
    const trimmed = draft.trim();
    onSave?.(trimmed, label);
    setIsEditing(false);
  };
  const cancel = () => {
    setDraft(value || "");
    setIsEditing(false);
  };

  return (
    <div className={`flex-1 min-w-[130px] lg:min-w-0 md:min-w-[110px] ${disabled ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-1 mb-1">
        <span
          className="text-[0.7rem] font-bold tracking-wide truncate md:text-[0.7rem]"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}
        >
          {label}
        </span>
        {editable && !disabled && !isEditing && (
          <button onClick={startEdit} title={`Edit ${label}`} className="shrink-0">
            <Pencil size={11} style={{ color: "var(--color-text-muted)" }} />
          </button>
        )}
        {editable && !disabled && isEditing && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={save} title="Save"><Check size={12} style={{ color: "var(--color-success)" }} /></button>
            <button onClick={cancel} title="Cancel"><X size={12} style={{ color: "var(--color-danger)" }} /></button>
          </div>
        )}
      </div>
      <div
        className="p-2 lg:p-3 rounded-none transition-all shadow-sm hover:shadow-md md:p-1 overflow-y-auto"
        style={{
          background: disabled ? "var(--color-surface-alt)" : "transparent",
          border: disabled ? "1px dashed var(--color-border)" : "1px solid var(--color-border)",
          height: "80px", boxSizing: "border-box"
        }}
      >
        {isEditing ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); save(); }
              if (e.key === "Escape") cancel();
            }}
            className="w-full h-full resize-none outline-none bg-transparent lg:text-[0.9rem] md:text-[0.6rem]"
            style={{ color: textStyle.color, fontFamily: "var(--font-inter)", lineHeight: 1.6 }}
          />
        ) : (
          <div
            className="lg:text-[0.9rem] font-regular text-left md:text-[0.6rem]"
            style={{ color: textStyle.color, fontFamily: "var(--font-inter)", lineHeight: 1.6 }}
            title={value || ""}
          >
            {value || "—"}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Toast shown after a save, confirming what was edited ── */
function SaveToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] flex items-start gap-2 px-3 py-2 shadow-lg"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", maxWidth: "280px" }}
    >
      <Check size={14} style={{ color: "var(--color-success)", marginTop: "2px", flexShrink: 0 }} />
      <div className="text-xs">
        <div className="font-bold" style={{ color: "var(--color-text-base)" }}>{toast.label} updated</div>
        <div className="mt-0.5 break-words" style={{ color: "var(--color-text-muted)" }}>
          {toast.value || "—"}
        </div>
      </div>
      <button onClick={onDismiss} className="ml-1 shrink-0">
        <X size={12} style={{ color: "var(--color-text-muted)" }} />
      </button>
    </div>
  );
}

export default function ClinicalInformationSection({ patient, isInline = false, firstObservationCardRef, onUpdatePatientField }) {
  const p = patient || {};
  const [toast, setToast] = useState(null);

  const handleSave = (key, newValue, label) => {
    onUpdatePatientField?.(key, newValue);
    setToast({ label, value: newValue });
  };

  // Define clinical cards
  const clinicalCards = [
    {
      key: "chiefComplaint",
      label: "Chief Complaint",
      value: p.chiefComplaint || "",
      variant: "info",
      editable: true,
    },
    {
      key: "firstObservation",
      label: "First Observation",
      value: p.firstObservation || "",
      variant: "info",
      editable: true,
    },
  ];

  const isMale = p.gender === "M" || p.gender === "Male";
  clinicalCards.push({
    key: "pregnancy",
    label: "Pregnancy Status",
    value: isMale ? "N/A" : (p.pregnancy || ""),
    variant: "info",
    disabled: isMale,
    editable: true,
  });

  clinicalCards.push({
    key: "referral",
    label: "Referral From",
    value: p.referral || "",
    variant: "info",
    editable: false,
  });

  return (
    <div className="px-3 py-2 sm:py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
      <div className="flex gap-2 md:gap-1 overflow-x-auto md:pb-1 lg:pb-1 lg:pt-1">
        {clinicalCards.map((card, index) => {
          const cardRef = index === 1 ? firstObservationCardRef : undefined;
          return (
            <div key={card.key} ref={cardRef} className="flex-1 min-w-[130px] lg:min-w-0 md:min-w-[110px]">
              <ClinicalCard
                label={card.label}
                value={card.value}
                variant={card.variant}
                disabled={card.disabled || false}
                editable={card.editable}
                onSave={(newValue, label) => handleSave(card.key, newValue, label)}
              />
            </div>
          );
        })}
      </div>
      <SaveToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}