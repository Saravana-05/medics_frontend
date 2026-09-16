import { useState } from "react";
import OPListModal from "../../../modal/Oplistmodal";
import AllPatientsModal from "../../../modal/AllPatientsModal";
import IPListModal from "../../../modal/IPListModal";

const ShortcutLetter = ({ children }) => (
  <span style={{ textDecorationLine: "underline", textDecorationThickness: "1px", textUnderlineOffset: "2px" }}>
    {children}
  </span>
);

export default function TopBarSection({ patient, patients, onPark, onFinalize, onIPList, onSelectPatient, tabsRowRef }) {
  const p = patient;
  const [feesByVisit, setFeesByVisit] = useState({});
  const visitKey = JSON.stringify([p?.id ?? p?.patientId, p?.docNo, p?.docDate]);
  const priority = p?.priority || p?.appointment?.priority || "";
  const billing = p?.billing || (p?.todaysVisit?.fee === "Cash" ? "Self" : p?.todaysVisit?.fee) || "";
  const service = "1200/-";
  const fieldStyle = {
    borderRadius: 0,
    background: "var(--color-surface)",
    borderColor: "var(--color-border)",
    color: "var(--color-text-base)",
  };
  const [followUpDate, setFollowUpDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [showOPList, setShowOPList] = useState(false);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [showIPList, setShowIPList] = useState(false);
  const [, setActiveTab] = useState(null);
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
        className="h-full p-1.5 flex flex-col"
        style={{
          background: "var(--color-surface-alt)",
        }}
      >
          <div className="flex flex-col gap-0">

            {/* ── BUTTONS: all in one row, equal size (Park) & equal spacing ── */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              <button
                data-page-shortcut="o"
                aria-label="OP List (Alt+O)"
                onClick={() => {
                  setActiveTab("op-list");
                  setShowOPList(true);
                }}
                className="min-w-0 h-[42px] flex items-center justify-center text-center leading-tight px-1 py-1 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("op-list", "var(--color-primary)", "var(--color-primary-light)")}
                onMouseEnter={() => setHoveredTab("op-list")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span><ShortcutLetter>O</ShortcutLetter>P List</span>
              </button>
              <button
                data-page-shortcut="i"
                aria-label="IP List (Alt+I)"
                onClick={() => {
                  setActiveTab("ip-list");
                  setShowIPList(true);
                  onIPList?.();
                }}
                className="min-w-0 h-[42px] flex items-center justify-center text-center leading-tight px-1 py-1 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("ip-list", "var(--color-danger)", "#b91c1c")}
                onMouseEnter={() => setHoveredTab("ip-list")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span><ShortcutLetter>I</ShortcutLetter>P List</span>
              </button>
              <button
                data-page-shortcut="l"
                aria-label="All Patients (Alt+L)"
                onClick={() => {
                  setActiveTab("all-patients");
                  setShowAllPatients(true);
                }}
                className="min-w-0 h-[42px] flex items-center justify-center text-center leading-tight px-1 py-1 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("all-patients", "#656D78")}
                onMouseEnter={() => setHoveredTab("all-patients")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span>Al<ShortcutLetter>l</ShortcutLetter> Patients</span>
              </button>
              <button
                data-page-shortcut="k"
                aria-label="Park (Alt+K)"
                onClick={() => {
                  setActiveTab("park");
                  onPark?.();
                }}
                className="min-w-0 h-[42px] flex items-center justify-center text-center leading-tight px-1 py-1 text-[0.7rem] font-semibold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("park", "#fbbf24", "var(--color-warning)")}
                onMouseEnter={() => setHoveredTab("park")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span>Par<ShortcutLetter>k</ShortcutLetter></span>
              </button>
              <button
                data-page-shortcut="z"
                aria-label="Finalize (Alt+Z)"
                onClick={() => {
                  setActiveTab("finalize");
                  onFinalize?.();
                }}
                className="min-w-0 h-[42px] flex items-center justify-center text-center leading-tight px-1 py-1 text-[0.7rem] font-bold transition-all shadow-sm hover:shadow-md"
                style={tabStyle("finalize", "#16a34a", "#15803d")}
                onMouseEnter={() => setHoveredTab("finalize")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span>Finali<ShortcutLetter>z</ShortcutLetter>e</span>
              </button>
            </div>

            {/* Separate the actions from the visit details. */}
            <hr className="mt-0 mb-1.5" style={{ borderColor: "var(--color-border)", borderTopWidth: "1px", borderStyle: "solid" }} />

            {/* Each row pairs visit information with its document field. */}
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-x-2 gap-y-1.5" style={{ color: "var(--color-text-base)" }}>
              <span aria-hidden="true" />
              <label htmlFor="top-bar-follow-up-date" className="text-[0.7rem] leading-none font-semibold" style={{ color: "var(--color-text-muted)" }}>Follow-up Date</label>
              <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-[20px] min-h-10 text-xs font-semibold">
                <span style={{ color: "var(--color-text-muted)", fontWeight: 600 }}>Priority</span>
                <span className="break-words">{priority}</span>
              </div>
              <div className="min-w-0">
                <input
                  id="top-bar-follow-up-date"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full min-w-0 h-10 px-2 text-xs tabular-nums border shadow-sm focus:outline-2 focus:outline-offset-1"
                  style={fieldStyle}
                />
              </div>

              <div className="grid grid-cols-2 items-start gap-2 min-h-10 text-xs font-semibold">
                <div className="min-w-0">
                  <span className="block mb-1 font-semibold" style={{ color: "var(--color-text-muted)" }}>Billing</span>
                  <span className="block break-words">{billing}</span>
                </div>
                <div className="min-w-0">
                  <span className="block mb-1 font-semibold" style={{ color: "var(--color-text-muted)" }}>Service</span>
                  <span className="block tabular-nums break-words">{service}</span>
                </div>
              </div>
              <div className="grid grid-cols-[52px_minmax(0,1fr)] min-w-0 min-h-10 items-center gap-1 px-2 py-2 border shadow-sm" style={fieldStyle}>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Doc.No</span>
                <span className="text-right text-xs font-semibold tabular-nums break-words">{p?.docNo?.replace(/\s*:\s*/g, " ") || ""}</span>
              </div>

              <label className="grid grid-cols-[44px_minmax(0,1fr)] min-h-10 min-w-0 items-center gap-x-1 text-xs font-semibold">
                <span style={{ color: "var(--color-text-muted)", fontWeight: 600 }}>Fee</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  aria-label="Fee"
                  value={feesByVisit[visitKey] ?? p?.feeAmount ?? ""}
                  onChange={(event) => setFeesByVisit(previous => ({ ...previous, [visitKey]: event.target.value }))}
                  className="h-10 w-full min-w-0 border px-1 text-right text-xs tabular-nums focus:outline-2 focus:outline-offset-1"
                  style={{ ...fieldStyle, background: "var(--color-surface-alt)" }}
                />
              </label>
              <div className="grid grid-cols-[52px_minmax(0,1fr)] min-w-0 min-h-10 items-center gap-1 px-2 py-2 border shadow-sm" style={fieldStyle}>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Doc.Date</span>
                <span className="text-right text-xs font-semibold tabular-nums">{p?.docDate || ""}</span>
              </div>
            </div>

          </div>
        </div>

      {showAllPatients && <AllPatientsModal patients={patients} verticalAnchorRef={tabsRowRef} onClose={() => setShowAllPatients(false)} onSelectPatient={onSelectPatient} />}
      {/* ── OP List Modal ── */}
      {showOPList && (
        <OPListModal
          patients={patients}
          verticalAnchorRef={tabsRowRef}
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
          patients={patients}
          verticalAnchorRef={tabsRowRef}
          onClose={() => setShowIPList(false)}
          onSelectPatient={onSelectPatient}
        />
      )}
    </>
  );
}
