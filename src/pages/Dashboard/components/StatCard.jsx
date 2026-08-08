import { ArrowUp } from "lucide-react";
import { resolveIcon } from "../iconMap";

// One tile in a stat-card row (OPD Patients, IPD Patients, etc.) — same shape
// reused for all of them, only icon/color/numbers differ.
export default function StatCard({ label, value, sublabel, trend, icon, color, colorLight }) {
  const Icon = resolveIcon(icon);
  return (
    <div className="flex flex-col gap-3 rounded-xl p-4 shadow-sm bg-white border border-slate-100 min-w-0">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: colorLight }}>
          <Icon size={19} style={{ color }} />
        </div>
        <span className="text-xs font-semibold text-slate-500 truncate">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800 leading-none">{value}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.68rem] text-slate-400">{sublabel}</span>
        {typeof trend === "number" && (
          <span className="flex items-center gap-0.5 text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "#16a34a" }}>
            <ArrowUp size={11} /> {trend}%
          </span>
        )}
      </div>
    </div>
  );
}
