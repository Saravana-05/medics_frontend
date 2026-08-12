import { useState } from "react";
import { TAB_CONFIGS } from "../../config/tabConfig";

// Same color each tab's table header (AddTableHeader) uses — TAB_CONFIGS.<tab>.color —
// so the tab bar and the medicine/lab/service/IP-time list header always match.
const TAB_ICON_SIZE = 15;
const PRESCRIPTION_TABS = [
  { key: "drugs",    label: "Drug",     icon: TAB_CONFIGS.drugs.icon,    color: TAB_CONFIGS.drugs.color,    textColor: TAB_CONFIGS.drugs.colorText,    textAccent: TAB_CONFIGS.drugs.textAccent },
  { key: "lab",      label: "Lab",      icon: TAB_CONFIGS.lab.icon,      color: TAB_CONFIGS.lab.color,      textColor: TAB_CONFIGS.lab.colorText,      textAccent: TAB_CONFIGS.lab.textAccent },
  { key: "services", label: "Service",  icon: TAB_CONFIGS.services.icon, color: TAB_CONFIGS.services.color, textColor: TAB_CONFIGS.services.colorText, textAccent: TAB_CONFIGS.services.textAccent },
  { key: "carePlan", label: "Care-Plan", icon: TAB_CONFIGS.carePlan.icon, color: TAB_CONFIGS.carePlan.color, textColor: TAB_CONFIGS.carePlan.colorText, textAccent: TAB_CONFIGS.carePlan.textAccent },
  { key: "iptime",   label: "IP Timeline", icon: TAB_CONFIGS.iptime.icon, color: TAB_CONFIGS.iptime.color, textColor: TAB_CONFIGS.iptime.colorText, textAccent: TAB_CONFIGS.iptime.textAccent },
];

const GRAY_DARK = "#6b7280";

// Width of the diagonal slant (px) between tabs — a parallelogram "slide" cut,
// not a pointed chevron.
const SLANT = 16;

export default function PrescriptionTabs({ activeTab, setActiveTab, tabCount }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <div className="flex-1 min-w-0 flex items-stretch" style={{ height: 48, marginLeft: -8 }}>
      {PRESCRIPTION_TABS.map((tab, i) => {
        const isActive = activeTab === tab.key;
        const isHovered = hoveredKey === tab.key;
        // Default = gray. Hover previews the tab's own color; clicking (active) locks it in.
        const showColor = isActive || isHovered;
        const isLast = i === PRESCRIPTION_TABS.length - 1;
        const isFirst = i === 0;
        const Icon = tab.icon;
        const count = tabCount?.[tab.key];

        // Each tab is a slanted parallelogram — flat top/bottom, "\" diagonal
        // left/right edges (top point left of bottom point) — so consecutive
        // tabs slide into each other along one shared backslash-direction cut.
        const clipPath = isFirst
          ? `polygon(0 0, calc(100% - ${SLANT}px) 0, 100% 100%, 0 100%)`
          : isLast
            ? `polygon(0 0, calc(100% - ${SLANT}px) 0, 100% 100%, ${SLANT}px 100%)`
            : `polygon(0 0, calc(100% - ${SLANT}px) 0, 100% 100%, ${SLANT}px 100%)`;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            onMouseEnter={() => setHoveredKey(tab.key)}
            onMouseLeave={() => setHoveredKey(null)}
            className={`relative flex items-center justify-center gap-1 font-bold text-md transition-all duration-200 ${isLast ? "px-5" : ""}`}
            style={{
              width: isLast ? "auto" : 132,
              minWidth: isLast ? 128 : undefined,
              flexShrink: 0,
              marginLeft: isFirst ? 0 : -SLANT,
              zIndex: isActive ? PRESCRIPTION_TABS.length + 1 : PRESCRIPTION_TABS.length - i,
              clipPath,
              background: showColor ? tab.color : GRAY_DARK,
              boxShadow: isActive ? "inset 0 1px 4px rgba(0,0,0,0.3)" : "none",
              color: showColor ? (tab.textColor || "white") : "white",
            }}
          >
            <Icon size={TAB_ICON_SIZE} style={{ color: showColor ? (tab.textColor || "white") : "white", opacity: showColor ? 1 : 0.9 }} />
            <span className="whitespace-nowrap">{tab.label}</span>
            {count > 0 && (
              <span
                className="flex items-center justify-center min-w-[14px] h-[14px] px-1 rounded-full text-[0.55rem] font-bold leading-none"
                style={{ background: "white", color: showColor ? (tab.textAccent || tab.color) : GRAY_DARK }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
