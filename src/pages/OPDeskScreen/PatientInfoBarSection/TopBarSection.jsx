import { useState } from "react";
import { ParkingCircle, Save, FileText as FileIcon, Calendar, CalendarDays } from "lucide-react";

export default function TopBarSection({ patient, onPark, onFinalize }) {
  const p = patient;
  const [followUpDate, setFollowUpDate] = useState("");

  return (
    <div className="h-full p-2 md:p-1.5 flex flex-col" style={{ background: "var(--color-surface-alt)" }}>

      {/*
        Layout:
        - lg+ : stacked vertically (sidebar)
        - tablet (md): three columns - Left (Doc No + Doc Date stacked), Center (Follow-up Date), Right (Park + Finalize stacked)
        - mobile: stacked
      */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-7 lg:flex-col lg:gap-4 mb-2 lg:mb-3 md:mb-1">
        
        {/* LEFT SIDE - Doc No and Doc Date stacked vertically */}
        <div className="flex-1 md:flex-none md:w-1/3 lg:w-auto flex flex-col gap-2 md:gap-1">
          <div className="flex items-center justify-between gap-1.5 px-2 py-1 rounded-md w-full" style={{ background: "var(--color-surface)" }}>
            <div className="flex items-center gap-1.5">
              <FileIcon size={12} style={{ color: "var(--color-primary)" }} />
              <div className="text-[0.55rem] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Doc No</div>
            </div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{p.docNo || "OP: 3902"}</div>
          </div>

          <div className="flex items-center justify-between gap-1.5 px-2 py-1 rounded-md w-full" style={{ background: "var(--color-surface)" }}>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} style={{ color: "var(--color-primary)" }} />
              <div className="text-[0.55rem] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Doc Date</div>
            </div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{p.docDate || "03/02/2024"}</div>
          </div>
        </div>

        {/* CENTER - Follow-up Date */}
        <div className="flex-1 md:flex-none md:w-1/3 lg:w-auto">
          <div className="text-[0.6rem] font-bold uppercase mb-1 md:text-center" style={{ color: "var(--color-text-muted)" }}>Follow-up Date</div>
          <div className="relative">
            <CalendarDays size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full pl-8 pr-2 py-2 md:py-1.5 rounded-md text-sm border outline-none"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-base)"
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE - Park and Finalize buttons stacked vertically */}
        <div className="flex-1 md:flex-none md:w-1/4 lg:w-auto flex flex-col gap-2 md:gap-2">
          <button
            onClick={onPark}
            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 md:py-1 rounded-md text-[0.65rem] font-semibold transition-all hover:shadow-sm"
            style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}
            onMouseEnter={e => e.currentTarget.style.background = "#fde68a"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--color-lab-light)"}
          >
            <ParkingCircle size={12} />
            Park
          </button>
          <button
            onClick={onFinalize}
            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 md:py-1 rounded-md text-[0.65rem] font-bold transition-all shadow-sm"
            style={{ background: "var(--color-primary)", color: "white" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--color-primary-light)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary)"}
          >
            <Save size={12} />
            Finalize
          </button>
        </div>
      </div>
    </div>
  );
}