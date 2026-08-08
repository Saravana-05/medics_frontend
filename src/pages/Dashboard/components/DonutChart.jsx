import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Reusable donut with a centered total + a legend list on the right — used for
// both "Department Wise OPD" and "Patient Overview" (only the data differs).
export default function DonutChart({ data, total, totalLabel }) {
  return (
    <div className="flex items-center gap-4 h-full">
      <div className="relative flex-shrink-0" style={{ width: 150, height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="none">
              {data.map(d => <Cell key={d.label} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-800 leading-none">{total}</span>
          <span className="text-[0.62rem] text-slate-400 mt-0.5">{totalLabel}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {data.map(d => {
          const pct = total ? ((d.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={d.label} className="flex items-center gap-1.5 text-xs">
              <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: d.color }} />
              <span className="text-slate-600 truncate flex-1">{d.label}</span>
              <span className="text-slate-400 whitespace-nowrap">{d.value} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
