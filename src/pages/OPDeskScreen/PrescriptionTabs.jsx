import { useState } from "react";
import { TAB_CONFIGS } from "../../config/tabConfig";

// All prescription UI surfaces derive their palette from TAB_CONFIGS.
const PRESCRIPTION_TABS = [
  { key: "drugs",    label: "Drug",        color: TAB_CONFIGS.drugs.color,    textColor: "black" },
  { key: "lab",      label: "Lab-Test",    color: TAB_CONFIGS.lab.color,      textColor: TAB_CONFIGS.lab.colorText },
  { key: "services", label: "Service",     color: TAB_CONFIGS.services.color, textColor: TAB_CONFIGS.services.colorText },
  { key: "carePlan", label: "Care-Plan",   color: TAB_CONFIGS.carePlan.color, textColor: TAB_CONFIGS.carePlan.colorText },
  { key: "iptime",   label: "IP Timeline", color: TAB_CONFIGS.iptime.color,   textColor: TAB_CONFIGS.iptime.colorText },
];

// Width of the diagonal slant (px) between tabs — a parallelogram "slide" cut,
// not a pointed chevron.
const SLANT = 16;

// Fixed tab-bar height (matches the container's own `height: 48` below) —
// needed to compute exactly where the selected-tab's diagonal accent line
// should stop so it meets the bottom accent line without protruding past it.
const TAB_HEIGHT = 48;
const ACCENT_MARGIN = 5; // inset from the tab's right/bottom edges
const ACCENT_THICKNESS = 2;
// y (px, from the top) where the bottom accent line's top edge sits —
// the diagonal line's endpoint is trimmed to land exactly here.
const ACCENT_JOIN_Y = TAB_HEIGHT - ACCENT_MARGIN - ACCENT_THICKNESS;
// The diagonal shifts SLANT px over the full tab height; at the trimmed
// join point it's only shifted proportionally that far.
const ACCENT_JOIN_SHIFT = SLANT * (ACCENT_JOIN_Y / TAB_HEIGHT);

export default function PrescriptionTabs({ activeTab, setActiveTab, tabCount, compact = false, fullBorder = false }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <div className="flex-1 min-w-0 flex items-stretch" style={{ height: 48, marginLeft: -8 }}>
      {PRESCRIPTION_TABS.map((tab, i) => {
        const isActive = activeTab === tab.key;
        const isHovered = hoveredKey === tab.key;
        // Hover "lift" applies to unselected tabs only — the active tab
        // stays put on hover, it already has its own selected indicator.
        const isLifted = isHovered && !isActive;
        const isLast = i === PRESCRIPTION_TABS.length - 1;
        const isFirst = i === 0;
        const count = tabCount?.[tab.key];

        // Each tab is a slanted parallelogram — flat top/bottom, "\" diagonal
        // left/right edges (top point left of bottom point) — so consecutive
        // tabs slide into each other along one shared backslash-direction cut.
        // Same cut on every tab, including the first (Drug) — its left edge
        // is sliced at the same angle instead of staying flat/vertical.
        const clipPath = `polygon(0 0, calc(100% - ${SLANT}px) 0, 100% 100%, ${SLANT}px 100%)`;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            onMouseEnter={() => setHoveredKey(tab.key)}
            onMouseLeave={() => setHoveredKey(null)}
            className={`relative flex items-center justify-center gap-1 font-bold text-md transition-all duration-200 ${isLast ? "px-5" : ""}`}
            style={{
              width: isLast ? "auto" : compact ? 116 : 132,
              minWidth: isLast ? (compact ? 112 : 128) : undefined,
              flexShrink: 0,
              marginLeft: isFirst ? 0 : -SLANT,
              zIndex: isLifted ? PRESCRIPTION_TABS.length + 2 : isActive ? PRESCRIPTION_TABS.length + 1 : PRESCRIPTION_TABS.length - i,
              clipPath,
              background: tab.color,
              // Same hover "lift" treatment as Main Menu 2's quick-action
              // squares (.em-quick-action:hover) — brightness bump, raise
              // up, soft drop shadow. Skipped for the currently selected
              // tab, which already has its own accent-line indicator.
              transform: isLifted ? "translateY(-3px)" : "translateY(0)",
              filter: isLifted ? "brightness(1.06)" : "none",
              boxShadow: [
                isActive ? "inset 0 1px 4px rgba(0,0,0,0.3)" : null,
                fullBorder ? "inset 0 0 0 1px rgba(255,255,255,0.75)" : null,
                isLifted ? "3px 9px 18px rgba(16,67,70,0.38)" : null,
              ].filter(Boolean).join(", ") || "none",
              color: tab.textColor || "white",
            }}
          >
            {isActive && (
              <>
                {/* 2px white accent on the right + bottom edges, inset 5px —
                    selected-tab indicator only, shown on no other state.
                    The right edge is cut with the same "\" slant as the tab's
                    own clip-path (SLANT px over the full height), so this
                    line runs parallel to that edge instead of straight down.
                    Its bottom endpoint is trimmed to ACCENT_JOIN_Y — exactly
                    where the bottom accent line's top edge sits — so it
                    meets that line flush instead of continuing past it. */}
                <span aria-hidden="true" style={{
                  position: "absolute", inset: 0,
                  clipPath: `polygon(calc(100% - ${SLANT + ACCENT_MARGIN}px) 0, calc(100% - ${SLANT + ACCENT_MARGIN - ACCENT_JOIN_SHIFT}px) ${ACCENT_JOIN_Y}px, calc(100% - ${SLANT + ACCENT_MARGIN + ACCENT_THICKNESS - ACCENT_JOIN_SHIFT}px) ${ACCENT_JOIN_Y}px, calc(100% - ${SLANT + ACCENT_MARGIN + ACCENT_THICKNESS}px) 0)`,
                  background: "#fff",
                }} />
                {/* Stops at right:7 (5px margin + the diagonal's own 2px
                    thickness), i.e. exactly where the diagonal line begins,
                    so the two fuse into one clean corner instead of
                    overlapping/crossing at the joint. */}
                <span aria-hidden="true" style={{ position: "absolute", left: 5, right: 7, bottom: 5, height: 2, background: "#fff" }} />
              </>
            )}
            <span className="whitespace-nowrap">{tab.label}</span>
            {count > 0 && (
              <sup
                className="inline-flex items-center justify-center text-center font-bold leading-none"
                style={{ fontSize: "12px", color: tab.textColor || "white", transform: "translateY(-0.45em)" }}
              >
                {count}
              </sup>
            )}
          </button>
        );
      })}
    </div>
  );
}
