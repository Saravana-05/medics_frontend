import { useState } from "react";
import { ParkingCircle, Save, FileText as FileIcon, Calendar, CalendarDays } from "lucide-react";

export default function TopBarSection({ patient, onPark, onFinalize }) {
  const p = patient;
  const [followUpDate, setFollowUpDate] = useState("");

  return (
    <div className="h-full p-2 flex flex-col" style={{ background: "var(--color-surface-alt)" }}>
      
      {/* Doc No and Doc Date - One Row (Left and Right) */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md flex-1" style={{ background: "var(--color-surface)" }}>
          <FileIcon size={12} style={{ color: "var(--color-primary)" }} />
          <div>
            <div className="text-[0.55rem] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Doc No</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{p.docNo || "OP: 3902"}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md flex-1" style={{ background: "var(--color-surface)" }}>
          <Calendar size={12} style={{ color: "var(--color-primary)" }} />
          <div>
            <div className="text-[0.55rem] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Doc Date</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{p.docDate || "03/02/2024"}</div>
          </div>
        </div>
      </div>
      
      {/* Follow-up Date with Label */}
      <div className="mb-3">
        <div className="text-[0.6rem] font-bold uppercase mb-1" style={{ color: "var(--color-text-muted)" }}>Follow-up Date</div>
        <div className="relative">
          <CalendarDays size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full pl-8 pr-2 py-2 rounded-md text-sm border outline-none"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-base)"
            }}
          />
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onPark}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[0.65rem] font-semibold transition-all hover:shadow-sm"
          style={{ background: "var(--color-lab-light)", color: "var(--color-lab)" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fde68a"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--color-lab-light)"}
        >
          <ParkingCircle size={12} />
          Park
        </button>
        <button
          onClick={onFinalize}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[0.65rem] font-bold transition-all shadow-sm"
          style={{ background: "var(--color-primary)", color: "white" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--color-primary-light)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary)"}
        >
          <Save size={12} />
          Finalize
        </button>
      </div>
    </div>
  );
}