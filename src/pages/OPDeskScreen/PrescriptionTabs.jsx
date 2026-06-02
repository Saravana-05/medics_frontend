import { Pill, FlaskConical, Settings as ServicesIcon, FileSearch } from "lucide-react";

const PRESCRIPTION_TABS = [
  { key: "drugs", label: "Drug", icon: Pill, colorVar: "--color-drugs", description: "Medication prescription" },
  { key: "lab", label: "Lab", icon: FlaskConical, colorVar: "--color-lab", description: "Lab investigations" },
  { key: "services", label: "Service", icon: ServicesIcon, colorVar: "--color-services", description: "Medical services" },
  { key: "findings", label: "Findings", icon: FileSearch, colorVar: "--color-info", description: "Clinical findings" },
];

export default function PrescriptionTabs({ activeTab, setActiveTab, tabCount, onClear, onSave }) {
  const getActiveTabColor = (tabKey) => {
    const colorMap = {
      drugs: "var(--color-drugs)",
      lab: "var(--color-lab)",
      services: "var(--color-services)",
      findings: "var(--color-info)"
    };
    return colorMap[tabKey] || "var(--color-primary)";
  };

  return (
    <div className="flex-shrink-0" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="flex items-center justify-between px-2">
        {/* Tab Buttons */}
        <div className="flex gap-1">
          {PRESCRIPTION_TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const activeColor = getActiveTabColor(tab.key);
            const Icon = tab.icon;
            const count = tabCount[tab.key];
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative px-4 py-3 transition-all duration-200 group"
                style={{
                  background: isActive ? `linear-gradient(180deg, ${activeColor}10 0%, transparent 100%)` : "transparent",
                  borderBottom: isActive ? `2px solid ${activeColor}` : "2px solid transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg transition-all group-hover:scale-110" style={{
                    background: isActive ? `${activeColor}20` : "transparent",
                  }}>
                    <Icon size={16} style={{ color: isActive ? activeColor : "var(--color-text-muted)" }} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold" style={{ color: isActive ? activeColor : "var(--color-text-base)" }}>
                        {tab.label}
                      </span>
                      {count > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold text-white" style={{ background: activeColor }}>
                          {count}
                        </span>
                      )}
                    </div>
                    <div className="text-[0.6rem] hidden lg:block" style={{ color: "var(--color-text-muted)" }}>
                      {tab.description}
                    </div>
                  </div>
                </div>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: activeColor }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side Actions - Follow-up Date Field */}
        {/* <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[0.65rem] font-semibold" style={{ color: "var(--color-text-muted)" }}>
              Follow-up Date:
            </label>
            <input
              type="date"
              className="px-2 py-1.5 rounded-lg text-xs border outline-none"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-base)"
              }}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}