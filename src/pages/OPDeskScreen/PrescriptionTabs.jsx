import { Pill, FlaskConical, Settings as ServicesIcon, FileSearch, Clock } from "lucide-react";

const BURGUNDY = "#8e2a4c";

const PRESCRIPTION_TABS = [
  { key: "drugs",    label: "Drug",     icon: Pill,          colorVar: "--color-drugs",    description: "Medication prescription" },
  { key: "lab",      label: "Lab",      icon: FlaskConical,  colorVar: "--color-lab",      description: "Lab investigations" },
  { key: "services", label: "Service",  icon: ServicesIcon,  colorVar: "--color-services", description: "Medical services" },
  { key: "findings", label: "Findings", icon: FileSearch,    colorVar: "--color-info",     description: "Clinical findings" },
  { key: "iptime",   label: "IP Time",  icon: Clock,         colorVar: "--color-iptime",   description: "IP Time sheet" },
];

export default function PrescriptionTabs({ activeTab, setActiveTab, tabCount, onClear, onSave }) {
  const getActiveTabColor = (tabKey) => {
    const colorMap = {
      drugs:    "var(--color-drugs)",
      lab:      "var(--color-lab)",
      services: "var(--color-services)",
      findings: "var(--color-info)",
      iptime:   BURGUNDY
    };
    return colorMap[tabKey] || "var(--color-primary)";
  };

  // Translucent tint of a color token (works with both var(--…) and hex).
  const tint = (color, pct) => `color-mix(in srgb, ${color} ${pct}, transparent)`;

  return (
    <div className="flex-shrink-0" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="flex items-center justify-between px-2">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 py-2">
          {PRESCRIPTION_TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const activeColor = getActiveTabColor(tab.key);
            const Icon = tab.icon;
            const count = tabCount?.[tab.key];

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
                style={{
                  background: isActive ? tint(activeColor, "20%") : "transparent",
                  color: isActive ? activeColor : "var(--color-text-muted)",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--color-surface-alt)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? activeColor : "var(--color-text-subtle)" }}
                />
                <span className="whitespace-nowrap">{tab.label}</span>
                {count > 0 && (
                  <span
                    className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[0.65rem] font-bold leading-none text-white"
                    style={{ background: isActive ? activeColor : "var(--color-text-subtle)" }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}