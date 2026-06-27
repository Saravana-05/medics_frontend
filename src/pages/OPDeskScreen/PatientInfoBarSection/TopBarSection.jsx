import { useState } from "react";
import { ParkingCircle, Save, FileText as FileIcon, Calendar, CalendarDays, ClipboardList, BedDouble } from "lucide-react";
import OPListModal from "../../../modal/Oplistmodal";

export default function TopBarSection({ patient, onPark, onFinalize, onIPList, onSelectPatient }) {
  const p = patient;
  const [followUpDate, setFollowUpDate] = useState("");
  const [showOPList, setShowOPList] = useState(false);

  return (
    <>
      <div className="h-full p-2 md:p-1.5 flex flex-col" style={{ background: "var(--color-surface-alt)" }}>
        <div className="flex flex-col gap-0">

          {/* ── BUTTONS: 4-in-a-row on tablet (md), 2x2 on large screens (lg+) ── */}
          <div className="flex md:flex-row lg:flex-col gap-2 mb-2">

            {/* Pair 1: OP List + Park */}
            <div className="flex gap-2 flex-1 lg:flex-none">
              <button
                onClick={() => setShowOPList(true)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[0.6rem] font-bold transition-all hover:shadow-sm"
                style={{
                  borderRadius: 0,
                  background: "var(--color-primary)",
                  color: "white"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-primary-light)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary)"}
              >
                <ClipboardList size={14} />
                OP List
              </button>
              <button
                onClick={onPark}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[0.6rem] font-semibold transition-all hover:shadow-sm"
                style={{
                  borderRadius: 0,
                  background: "var(--color-lab-light)",
                  color: "var(--color-lab)"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#fde68a"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-lab-light)"}
              >
                <ParkingCircle size={14} />
                Park
              </button>
            </div>

            {/* Pair 2: IP List + Finalize */}
            <div className="flex gap-2 flex-1 lg:flex-none">
              <button
                onClick={onIPList}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[0.6rem] font-bold transition-all hover:shadow-sm"
                style={{
                  borderRadius: 0,
                  background: "#dc2626",
                  color: "white"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#b91c1c"}
                onMouseLeave={e => e.currentTarget.style.background = "#dc2626"}
              >
                <BedDouble size={14} />
                IP List
              </button>
              <button
                onClick={onFinalize}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[0.6rem] font-bold transition-all shadow-sm"
                style={{
                  borderRadius: 0,
                  background: "var(--color-primary)",
                  color: "white"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-primary-light)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary)"}
              >
                <Save size={14} />
                Finalize
              </button>
            </div>

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
                  className="w-full pl-8 pr-2 py-1.5 text-sm border outline-none"
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
              <div className="flex items-center justify-between gap-1.5 px-2 py-1 h-full md:h-auto" style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)" }}>
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
              <div className="flex items-center justify-between gap-1.5 px-2 py-1 h-full md:h-auto" style={{ background: "var(--color-surface)", border: "0.5px solid var(--color-border)" }}>
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