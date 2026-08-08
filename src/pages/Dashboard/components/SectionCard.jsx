// Generic white rounded-card shell — title + optional right-side control
// (e.g. "This Week" filter, "View All" link) + body content. Reused by every
// panel that needs this shape (charts, lists, etc.).
export default function SectionCard({ title, action, children, className = "" }) {
  return (
    <div className={`flex flex-col rounded-xl p-4 shadow-sm bg-white border border-slate-100 min-w-0 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {action}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
