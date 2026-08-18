import { useState } from "react";
import OPListModal from "../../../modal/Oplistmodal";
import IPListModal from "../../../modal/IPListModal";

export default function TopBarSection({ patient, onPark, onFinalize, onIPList, onSelectPatient }) {
  const p = patient;
  const [followUpDate, setFollowUpDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [showOPList, setShowOPList] = useState(false);
  const [showIPList, setShowIPList] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabStyle = (tab, background, hoverBackground = background) => {
    const isHovered = hoveredTab === tab;
    const visibleBackground = isHovered ? hoverBackground : background;
    return {
      borderRadius: 0,
      background: visibleBackground,
      color: "white",
      textShadow: "0 1px 2px rgba(0,0,0,0.4)",
      border: "none",
      outline: `1px solid ${isHovered ? visibleBackground : "transparent"}`,
      outlineOffset: "2px",
    };
  };

  return (
    <>
      {/* The right accent bar used to live here, but that put it INSIDE this
          section's border — it's now rendered by PatientInfoBar.jsx as a
          sibling outside the box, matching the left accent bar's positioning. */}
      <div
        className="h-full p-2 md:p-1.5 flex flex-col"
        style={{
          background: "var(--color-surface-alt)",
        }}
      >
          <div className="flex flex-col gap-0">

            {/* ── BUTTONS: all in one row, equal size (Park) & equal spacing ── */}
            <div className="flex flex-row gap-2 mb-2">
              <button
                onClick={() => {
                  setActiveTab("op-list");
                  setShowOPList(true);
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("op-list", "var(--color-primary)", "var(--color-primary-light)")}
                onMouseEnter={() => setHoveredTab("op-list")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                OP List
              </button>
              <button
                onClick={() => {
                  setActiveTab("ip-list");
                  setShowIPList(true);
                  onIPList?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("ip-list", "var(--color-danger)", "#b91c1c")}
                onMouseEnter={() => setHoveredTab("ip-list")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                IP List
              </button>
              <button
                onClick={() => {
                  setActiveTab("all-patients");
                  onPark?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("all-patients", "#656D78")}
                onMouseEnter={() => setHoveredTab("all-patients")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                All Patients
              </button>
              <button
                onClick={() => {
                  setActiveTab("park");
                  onPark?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-semibold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("park", "#fbbf24", "var(--color-warning)")}
                onMouseEnter={() => setHoveredTab("park")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                Park
              </button>
              <button
                onClick={() => {
                  setActiveTab("finalize");
                  onFinalize?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("finalize", "#16a34a", "#15803d")}
                onMouseEnter={() => setHoveredTab("finalize")}
                onMouseLeave={() => setHoveredTab(null)}
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
                <div className="text-[0.7rem] font-bold mb-0.5" style={{ color: "var(--color-text-muted)" }}>Follow-up Date</div>
                <div className="relative">
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-2 py-2.5 text-sm border outline-none shadow-sm"
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
                <div className="text-[0.9rem] font-regular uppercase mb-0.5 md:block lg:hidden" style={{ color: "var(--color-text-muted)" }}>Doc No</div>
                <div className="flex items-center justify-between gap-1.5 px-2 py-2.5 h-full md:h-auto shadow-sm" style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)" }}>
                  <div className="flex items-center gap-1.5">
                    
                    <div className="text-[0.9rem] font-regular lg:block md:hidden" style={{ color: "var(--color-text-muted)" }}>Doc.No</div>
                  </div>
                  <div className="text-[0.9rem] font-semibold" style={{ color: "var(--color-text-base)" }}>{p?.docNo || "—"}</div>
                </div>
              </div>

              {/* Doc Date */}
              <div className="flex-1 lg:flex-none">
                <div className="text-[0.rem] font-bold uppercase mb-0.5 md:block lg:hidden" style={{ color: "var(--color-text-muted)" }}>Doc Date</div>
                <div className="flex items-center justify-between gap-1.5 px-2 py-2.5 h-full md:h-auto shadow-sm" style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)" }}>
                  <div className="flex items-center gap-1.5">
                    
                    <div className="text-[0.9rem] font-regular lg:block md:hidden" style={{ color: "var(--color-text-muted)" }}>Doc.Date</div>
                  </div>
                  <div className="text-[0.9rem] font-semibold" style={{ color: "var(--color-text-base)" }}>{p?.docDate || "—"}</div>
                </div>
              </div>

            </div>

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
      {showIPList && (
        <IPListModal
          onClose={() => setShowIPList(false)}
          onSelectPatient={onSelectPatient}
        />
      )}
    </>
  );
}
