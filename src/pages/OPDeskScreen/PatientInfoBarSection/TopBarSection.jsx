import { useState } from "react";
import { FileText as FileIcon, Calendar, CalendarDays } from "lucide-react";
import OPListModal from "../../../modal/Oplistmodal";

export default function TopBarSection({ patient, onPark, onFinalize, onIPList, onSelectPatient }) {
  const p = patient;
  const [followUpDate, setFollowUpDate] = useState("");
  const [showOPList, setShowOPList] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const tabStyle = (tab, background, borderColor) => ({
    borderRadius: 0,
    background,
    color: "white",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
    border: "none",
    outline: `1px solid ${activeTab === tab ? borderColor : "transparent"}`,
    outlineOffset: "2px",
  });

  const showTabBorder = (event, borderColor) => {
    event.currentTarget.style.outlineColor = borderColor;
  };

  const restoreTabBorder = (event, tab, borderColor) => {
    event.currentTarget.style.outlineColor = activeTab === tab ? borderColor : "transparent";
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
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--color-primary-light)";
                  showTabBorder(e, "var(--color-primary-light)");
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "var(--color-primary)";
                  restoreTabBorder(e, "op-list", "var(--color-primary-light)");
                }}
              >
                OP List
              </button>
              <button
                onClick={() => {
                  setActiveTab("ip-list");
                  onIPList?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("ip-list", "var(--color-danger)", "#7f1d1d")}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#b91c1c";
                  showTabBorder(e, "#7f1d1d");
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "var(--color-danger)";
                  restoreTabBorder(e, "ip-list", "#7f1d1d");
                }}
              >
                IP List
              </button>
              <button
                onClick={() => {
                  setActiveTab("all-patients");
                  onPark?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("all-patients", "#656D78", "#374151")}
                onMouseEnter={e => showTabBorder(e, "#374151")}
                onMouseLeave={e => restoreTabBorder(e, "all-patients", "#374151")}
              >
                All Patients
              </button>
              <button
                onClick={() => {
                  setActiveTab("park");
                  onPark?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-semibold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("park", "#fbbf24", "#b45309")}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--color-warning)";
                  showTabBorder(e, "#b45309");
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fbbf24";
                  restoreTabBorder(e, "park", "#b45309");
                }}
              >
                Park
              </button>
              <button
                onClick={() => {
                  setActiveTab("finalize");
                  onFinalize?.();
                }}
                className="flex-1 min-w-0 flex items-center justify-center text-center leading-tight gap-1.5 px-3 py-2 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("finalize", "#16a34a", "#14532d")}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#15803d";
                  showTabBorder(e, "#14532d");
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#16a34a";
                  restoreTabBorder(e, "finalize", "#14532d");
                }}
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
                  <div className="text-[0.7rem] font-semibold" style={{ color: "var(--color-text-base)" }}>{p?.docNo || "—"}</div>
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
                  <div className="text-[0.7rem] font-semibold" style={{ color: "var(--color-text-base)" }}>{p?.docDate || "—"}</div>
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
    </>
  );
}
