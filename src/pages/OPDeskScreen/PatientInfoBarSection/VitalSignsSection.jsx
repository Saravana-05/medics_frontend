
import { ActivitySquare, Thermometer, Heart, Wind, Ruler, Weight, Calculator, Droplet, BedDouble, CalendarDays, UserRound, Users } from "lucide-react";

/* Fonts (Inter) are loaded globally in index.html + registered in the Tailwind
   theme (index.css). Colors below come from the shared design tokens. */

/* ── Value text stays blue for all vitals ── */
const VALUE_COLOR = "var(--color-value)";

/* ── Per-vital accent colors (registered as tokens in index.css @theme) ── */
const VITAL_ACCENTS = {
  bp: "var(--color-vital-bp)",
  temp: "var(--color-vital-temp)",
  pulse: "var(--color-vital-pulse)",
  spo2: "var(--color-vital-spo2)",
  blood: "var(--color-vital-blood)",
  height: "var(--color-vital-height)",
  weight: "var(--color-vital-weight)",
};

/* Translucent tint of a token color (works with CSS variables). pct like "15%". */
const tint = (color, pct) => `color-mix(in srgb, ${color} ${pct}, transparent)`;


/* ── Compact Badge (tablet / mobile) — solid vital-colored bg for ALL vitals ── */
function VitalBadge({ icon: Icon, value, accent, valueColor, unit }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 shadow-sm"
      style={{ background: accent }}
    >
      <Icon size={11} style={{ color: "#ffffff" }} />
      <span
        className="text-xs font-bold whitespace-nowrap"
        style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
      >
        {value || "—"}
      </span>
      {unit && (
        <span
          className="text-[0.6rem] whitespace-nowrap"
          style={{ color: "#c6bcb3", fontFamily: "var(--font-inter)" }}
        >
          {unit}
        </span>
      )}
    </div>
  );
}

/* ── IP Admission Info group card — grouped (IP Info / Attender / Room /
   Medic) columns, each a bordered rounded box holding one or more stacked
   text lines or a name+phone list. Styled to match ClinicalCard's box
   treatment (border, rounded-lg, padding, shadow) in ClinicalInformationSection
   so the two info bars read as one consistent visual language.

   All rows show at once now (no expand/collapse) — Medic's 4 rows just make
   that card taller than the others, which is fine since the row uses
   default flex stretch alignment. ── */
// Font-size classes for IPInfoCard content — SIZE_NORMAL is the current/default
// size; SIZE_SMALL kicks in only on the Medic card, only when a row has 2+
// people sharing it (e.g. both nurses on one line) — every other card
// (IP Info, Attender, Room) always stays at SIZE_NORMAL.
const IP_SIZE_NORMAL = "lg:text-[0.8rem] md:text-[0.6rem]";
const IP_SIZE_SMALL = "lg:text-[0.65rem] md:text-[0.5rem]";

function IPInfoCard({ icon: Icon, label, accent, lines, people, textColor, cardBg, cardBorder, labelColor, valueColor }) {
  const visibleLines = (lines || []).filter(Boolean);
  const isPeople = !!people;
  // people is an array of ROWS (e.g. [[nurse1, nurse2], [doctor1, doctor2]]) —
  // each row renders on its own line, its people joined inline within it.
  const items = isPeople ? (people.length ? people : [[{ name: "—", phone: "" }]]) : (visibleLines.length ? visibleLines : ["—"]);

  return (
    <div className="flex-1 min-w-[150px] lg:min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} style={{ color: accent, flexShrink: 0 }} />
        <span className="text-[0.7rem] font-bold tracking-wide truncate" style={{ color: labelColor || "var(--color-text-muted)", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
          {label}
        </span>
      </div>
      <div
        className={`p-2 lg:p-3 rounded-none transition-all shadow-sm hover:shadow-md md:p-1 ${isPeople ? "overflow-hidden" : "overflow-y-auto"}`}
        style={{ background: cardBg || "transparent", border: `1px solid ${cardBorder || "var(--color-border)"}`, height: "60px", boxSizing: "border-box" }}
      >
        {isPeople ? (
          <div>
            {items.map((row, i) => {
              // 2+ nurses (or 2+ doctors) sharing one row need to shrink to
              // both fit — a single name on its own row stays full-size.
              const rowSizeClass = row.length > 1 ? IP_SIZE_SMALL : IP_SIZE_NORMAL;
              return (
                <div key={i} className="flex items-center gap-2">
                  {row.map((p, j) => (
                    <span key={j} className="flex items-center gap-1 flex-1 min-w-0" title={p.name ? `${p.name}${p.phone ? " - " + p.phone : ""}` : ""}>
                      <span className={`${rowSizeClass} font-semibold truncate text-left min-w-0`} style={{ color: "var(--color-text-base)", fontFamily: "var(--font-inter)", lineHeight: 1.3 }}>{p.name || "—"}</span>
                      {p.phone && (
                        <span className={`${rowSizeClass} font-semibold truncate flex-shrink-0`} style={{ color: valueColor || VALUE_COLOR, fontFamily: "var(--font-inter)", lineHeight: 1.3 }}>- {p.phone}</span>
                      )}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {items.map((line, i) => (
              <div key={i} className={`${IP_SIZE_NORMAL} font-semibold text-left`} style={{ color: textColor || "var(--color-text-base)", fontFamily: "var(--font-inter)", lineHeight: 1.6 }} title={line}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Vital Sign Card (Compact, desktop) ── Fixed height + truncated text so
   longer content (e.g. IP Admission Info) can never stretch the row and
   break the rest of the layout — every card stays exactly the same size. */
function VitalSignCard({ icon: Icon, value, label, accent, valueColor, unit, trend }) {
  return (
    <div
      className="group relative overflow-hidden rounded-none p-1.5 transition-all hover:scale-105 shadow-sm"
      style={{ background: "var(--color-surface)", border: `1px solid ${tint(accent, "20%")}`, height: "58px", boxSizing: "border-box" }}
    >
      <div className="flex items-center justify-between h-full">
        <div className="min-w-0 flex-1">
          <div
            className="text-[0.58rem]  tracking-wide mb-0.5 truncate"
            style={{ color: "darkslategray",fontWeight: "600", letterSpacing: "0.1em", fontFamily: "var(--font-inter)" }}
          >
            {label}
          </div>
          <div
            className="text-sm font-black leading-tight truncate"
            style={{ color: valueColor,letterSpacing: "0.05em", fontWeight: "400", fontFamily: "var(--font-inter)" }}
            title={value || ""}
          >
            {value || "—"}
          </div>
          {unit && (
            <div
              className="text-[0.7rem] font-regular mt-0.5 truncate"
              style={{ color: "#000000", fontFamily: "var(--font-inter)" }}
              title={unit}
            >
              {unit}
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
          style={{
            width: 26,
            height: 26,
            background: tint(accent, "15%"),
            border: `1px solid ${tint(accent, "30%")}`,
            boxShadow: `0 1px 3px ${tint(accent, "25%")}`,
          }}
        >
          <Icon size={16} style={{ color: accent, opacity: 2.8 }} />
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
        className="absolute top-0 right-0 w-16 h-16 -mr-6 -mt-6 rounded-full opacity-20"
        style={{ background: accent }}
      />
    </div>
  );
}

export default function VitalSignsSection({ patient, activeTab }) {
  const p = patient || {};
  const ip = p.ipInfo || {};
  const isIPTime = activeTab === "iptime";

  /* ── IP Time-line: 4 grouped columns (IP Info / Attender / Room / Medic),
     each a boxed card matching ClinicalCard's style, per the reference
     layout — replaces the old 8-up per-field card grid. "Name Phone"
     strings (consultant/consultant2/nurse1/nurse2) are split into
     {name, phone} pairs for the Medic column's two-column rows. */
  const parseNamePhone = raw => {
    const clean = (raw || "").replace(/^C\.Nurse:\s*/i, "").trim();
    if (!clean) return null;
    const parts = clean.split(" ");
    const phone = /^\d{6,}$/.test(parts[parts.length - 1]) ? parts.pop() : "";
    return { name: parts.join(" ") || "—", phone };
  };

  /* ── IP-only theme: this whole section (and only this section) switches to
     the IP Time-line tab's amber accent instead of the neutral grey/blue the
     Vital Signs bar uses — background, card border, label caption, icons,
     and the highlighted value color are all derived from the one accent
     token so they move together if the tab color ever changes. ── */
  const IPTIME_ACCENT = "var(--color-iptime)";
  const ipCardBg = "var(--color-surface)";
  const ipCardBorder = `color-mix(in srgb, ${IPTIME_ACCENT} 35%, white)`;
  const ipLabelColor = `color-mix(in srgb, ${IPTIME_ACCENT} 75%, black)`;
  const ipValueColor = `color-mix(in srgb, ${IPTIME_ACCENT} 85%, black)`;
  // 4 shades of the same accent (lightest→darkest) so the columns stay
  // visually distinct without leaving the amber family.
  const ipIconShades = [
    `color-mix(in srgb, ${IPTIME_ACCENT} 60%, black)`,
    IPTIME_ACCENT,
    `color-mix(in srgb, ${IPTIME_ACCENT} 75%, white)`,
    `color-mix(in srgb, ${IPTIME_ACCENT} 40%, black)`,
  ];

  const ipGroups = [
    {
      icon: CalendarDays,
      label: "Ip info",
      accent: ipIconShades[0],
      lines: [
        [ip.admitDate, ip.admitTime].filter(Boolean).join(" · "),
        ip.dischargeDate,
      ],
    },
    {
      icon: UserRound,
      label: "Attendant",
      accent: ipIconShades[1],
      textColor: ipValueColor,
      lines: [
        [ip.attenderName, ip.attenderPhone, ip.attenderRelation].filter(Boolean).join(" · "),
      ],
    },
    {
      icon: BedDouble,
      label: "Room",
      accent: ipIconShades[2],
      lines: [
        (ip.ward || ip.room || ip.bed) ? `${ip.ward || "—"} · Room ${ip.room || "—"} · Bed ${ip.bed || "—"}` : "",
        (ip.currentWard || ip.currentRoom || ip.currentBed) ? `${ip.currentWard || "—"} · Room ${ip.currentRoom || "—"} · Bed ${ip.currentBed || "—"}` : "",
      ],
    },
    {
      icon: Users,
      label: "Medic",
      accent: ipIconShades[3],
      // Grouped into two rows — both nurses together on one line, both
      // doctors together on the next — instead of one row per person.
      people: [
        [ip.nurse1, ip.nurse2].map(parseNamePhone).filter(Boolean),
        [ip.consultant, ip.consultant2].map(parseNamePhone).filter(Boolean),
      ].filter(row => row.length > 0),
    },
  ];

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

  /* ── Shared vital definitions so both views stay in sync ──
     accent = per-vital color for icon + badge/card background & border
     valueColor = shared blue used for every value's text                */
  const vitals = [
    {
      icon: ActivitySquare,
      value: p.bpSystolic && p.bpDiastolic ? `${p.bpSystolic}/${p.bpDiastolic}` : "—",
      label: "BP",
      accent: VITAL_ACCENTS.bp,
      valueColor: VALUE_COLOR,
      unit: "mmHg",
    },
    {
      icon: Thermometer,
      value: p.temp || "—",
      label: "Temp.",
      accent: VITAL_ACCENTS.temp,
      valueColor: VALUE_COLOR,
      unit: "Far./Cel.",
    },
    {
      icon: Heart,
      value: p.pulse || "—",
      label: "Pulse",
      accent: VITAL_ACCENTS.pulse,
      valueColor: VALUE_COLOR,
      unit: "bpm",
    },
    {
      icon: Wind,
      value: p.oxygenLevel || "—",
      label: "SpO₂",
      accent: VITAL_ACCENTS.spo2,
      valueColor: VALUE_COLOR,
      unit: "%",
    },
    {
      icon: Droplet,
      value: p.bloodGroup || "—",
      label: "Blood",
      accent: VITAL_ACCENTS.blood,
      valueColor: VALUE_COLOR,
      unit: "Group ",
    },
    {
      icon: Ruler,
      value: p.height || "—",
      label: "Height",
      accent: VITAL_ACCENTS.height,
      valueColor: VALUE_COLOR,
      unit: "Cm [Ft-In]",
    },
    {
      icon: Weight,
      value: p.weight || "—",
      label: "Weight",
      accent: VITAL_ACCENTS.weight,
      valueColor: VALUE_COLOR,
      unit: "Kgs [Lbs]",
    },
    {
      icon: Calculator,
      value: bmiValue,
      label: "BMI",
      accent: bmiCategory.color.startsWith("var(") ? "#6b7280" : bmiCategory.color,
      valueColor: VALUE_COLOR,
      unit: "Kg/m²",
    },
  ];

  const cards = vitals;
  const HeaderIcon = isIPTime ? BedDouble : ActivitySquare;
  const headerLabel = isIPTime ? "IP Admission Info" : "Vital Signs";

  return (
    <div
      className="px-3 border-b"
      /* Tablet/mobile: tighter vertical padding. Desktop: normal.
         Same background for both Vital Signs and IP Admission Info. */
      style={{ borderColor: "var(--color-border)", background: "#A7B3CE" }}
    >
      {/* ── Tablet / Mobile ──
          • Header is HIDDEN (no ActivitySquare title row)
          • Vital Signs: compact row of coloured badges
          • IP Admission Info: same boxed group cards as desktop, scrolled   */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto py-1">
        {isIPTime
          ? ipGroups.map((g) => <IPInfoCard key={g.label} icon={g.icon} label={g.label} accent={g.accent} lines={g.lines} people={g.people} textColor={g.textColor} cardBg={ipCardBg} cardBorder={ipCardBorder} labelColor={ipLabelColor} valueColor={ipValueColor} />)
          : cards.map((v) => (
              <VitalBadge
                key={v.label}
                icon={v.icon}
                value={v.value}
                accent={v.accent}
                valueColor={v.valueColor}
                unit={v.unit}
              />
            ))}
      </div>

      {/* ── Desktop ──
          • Header shown
          • Vital Signs: 8-column card grid
          • IP Admission Info: 4 grouped boxed cards (IP Info / Attender /
            Room / Medic) — each card collapses its own extra rows
            internally (see IPInfoCard), row itself always shown            */}
      <div className="hidden lg:block py-2">
        {!isIPTime && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <HeaderIcon size={12} style={{ color: "var(--color-primary)" }} />
            <span
              className="text-[0.8rem] font-bold tracking-wide"
              style={{ color: "var(--color-text-base)", fontFamily: "var(--font-archivo)" }}
            >
              {headerLabel}
            </span>
          </div>
        )}

        {isIPTime ? (
          <div className="flex gap-2">
            {ipGroups.map((g) => <IPInfoCard key={g.label} icon={g.icon} label={g.label} accent={g.accent} lines={g.lines} people={g.people} textColor={g.textColor} cardBg={ipCardBg} cardBorder={ipCardBorder} labelColor={ipLabelColor} valueColor={ipValueColor} />)}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1.5">
            {cards.map((v) => (
              <VitalSignCard
                key={v.label}
                icon={v.icon}
                value={v.value}
                label={v.label}
                accent={v.accent}
                valueColor={v.valueColor}
                unit={v.unit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
