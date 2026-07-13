import { useState } from "react";
import { FileText as FileIcon, Calendar, CalendarDays } from "lucide-react";
import OPListModal from "../../../modal/Oplistmodal";

// Keys must match RightSidebar's RIGHT_TABS keys, in the same top-to-bottom order.
const ACCENT_SEGMENTS = [
  { key: "parked",    color: "#eb6367" },
  { key: "emergency", color: "#73bfb8" },
  { key: "reports",   color: "#679cbc" },
  { key: "schedule",  color: "#0c324a" },
];

export default function TopBarSection({ patient, onPark, onFinalize, onIPList, onSelectPatient, highlightedTab }) {
  const p = patient;
  const [followUpDate, setFollowUpDate] = useState("");
  const [showOPList, setShowOPList] = useState(false);

  return (
    <>
      <div
        className="flex gap-1 h-full"
      >
        {/* Main content */}
        <div
          className="flex-1 p-2 md:p-1.5 flex flex-col border border-solid border-gray-300"
          style={{
            background: "var(--color-surface-alt)",
          }}
        >
          <div className="flex flex-col gap-0">

            {/* ── BUTTONS: all in one row, equal size (Park) & equal spacing ── */}
            <div className="flex flex-row gap-2 mb-2">
              <button
                onClick={() => setShowOPList(true)}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={{ borderRadius: 0, background: "var(--color-primary)", color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-primary-light)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary)"}
              >
                OP List
              </button>
              <button
                onClick={onIPList}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={{ borderRadius: 0, background: "var(--color-danger)", color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.background = "#b91c1c"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-danger)"}
              >
                IP List
              </button>
              <button
                onClick={onPark}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={{ borderRadius: 0, background: "#656D78", color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
              >
                All Patients
              </button>
              <button
                onClick={onPark}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-semibold transition-all shadow-sm hover:shadow-md"
                style={{ borderRadius: 0, background: "#fbbf24", color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-warning)"}
                onMouseLeave={e => e.currentTarget.style.background = "#fbbf24"}
              >
                Park
              </button>
              <button
                onClick={onFinalize}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={{ borderRadius: 0, background: "#16a34a", color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.background = "#15803d"}
                onMouseLeave={e => e.currentTarget.style.background = "#16a34a"}
              >
                Finalize
              </button>
            </div>

            {/* ── DIVIDER: hidden on tablet (md), visible on lg+ ── */}
            <hr className="my-1 md:hidden lg:block" style={{ borderColor: "var(--color-border)", borderTopWidth: "1px", borderStyle: "solid" }} />

            {/* ── Follow-up Date + Doc No + Doc Date: one line on tablet (md), stacked on lg+ ── */}
            <div className="flex md:flex-row lg:flex-col gap-1.5">

              {/* Follow-up Date */}
              <div className="flex-1 lg:flex-none mb-0">
                <div className="text-[0.55rem] font-bold uppercase mb-0.5" style={{ color: "var(--color-text-muted)" }}>Follow-up Date</div>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 text-sm border outline-none shadow-sm"
                    style={{
                      borderRadius: 0,
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-base)"
                    }}
                  />
                </div>
              </div>

              {/* DIVIDER: hidden on tablet, visible on lg+ */}
              <hr className="my-0 md:hidden lg:block" style={{ borderColor: "var(--color-border)", borderTopWidth: "1px", borderStyle: "solid" }} />

              {/* Doc No */}
              <div className="flex-1 lg:flex-none">
                <div className="text-[0.55rem] font-bold uppercase mb-0.5 md:block lg:hidden" style={{ color: "var(--color-text-muted)" }}>Doc No</div>
                <div className="flex items-center justify-between gap-1.5 px-2 py-2.5 h-full md:h-auto shadow-sm" style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)" }}>
                  <div className="flex items-center gap-1.5">
                    <FileIcon size={12} style={{ color: "var(--color-primary)" }} />
                    <div className="text-[0.5rem] font-bold uppercase lg:block md:hidden" style={{ color: "var(--color-text-muted)" }}>Doc No</div>
                  </div>
                  <div className="text-[0.7rem] font-semibold" style={{ color: "var(--color-text-base)" }}>{p?.docNo || "OP: 3902"}</div>
                </div>
              </div>

              {/* Doc Date */}
              <div className="flex-1 lg:flex-none">
                <div className="text-[0.55rem] font-bold uppercase mb-0.5 md:block lg:hidden" style={{ color: "var(--color-text-muted)" }}>Doc Date</div>
                <div className="flex items-center justify-between gap-1.5 px-2 py-2.5 h-full md:h-auto shadow-sm" style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)" }}>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} style={{ color: "var(--color-primary)" }} />
                    <div className="text-[0.5rem] font-bold uppercase lg:block md:hidden" style={{ color: "var(--color-text-muted)" }}>Doc Date</div>
                  </div>
                  <div className="text-[0.7rem] font-semibold" style={{ color: "var(--color-text-base)" }}>{p?.docDate || "03/02/2024"}</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right accent bar — segmented to match the 4 sidebar tabs (Parked/Emergency/Reports/Schedule) */}
        {/* Invisible by default; a segment becomes visible only while its matching RightSidebar tab is hovered/active. */}
        <div
          className="flex flex-col h-full"
          style={{
            width: "2.5px",
            flexShrink: 0,
            marginRight: "2.5px",
          }}
        >
          {ACCENT_SEGMENTS.map((seg) => (
            <div
              key={seg.key}
              style={{
                flex: 1,
                background: seg.color,
                opacity: highlightedTab === seg.key ? 1 : 0,
                transition: "opacity 150ms ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── OP List Modal ── */}
      {showOPList && (
        <OPListModal
          onClose={() => setShowOPList(false)}
          onSelectPatient={(row) => {
            onSelectPatient && onSelectPatient(row);
            setShowOPList(false);
          }}
          doctor={p?.doctor || "Dr. Chandra Sekar"}
          date={p?.docDate || "03/02/2024"}
          time={p?.time || "10:00"}
        />
      )}
    </>
  );
}