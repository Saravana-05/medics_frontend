import { useState } from "react";
import { ListFilter } from "lucide-react";

export default function PatientCardFilter({ query, onChange, children }) {
  const [open, setOpen] = useState(false);
  return <div className="shrink-0 border-b px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}
        className="flex items-center gap-1 rounded-none border px-2 py-2 text-xs"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-base)" }}>
        <ListFilter size={14} /> Filter{query ? " •" : ""}
      </button>
      {children}
    </div>
    {open && <div className="mt-2 flex gap-2">
      <input type="search" aria-label="Filter patients" placeholder="Name, ID, room or observation" value={query}
        onChange={event => onChange(event.target.value)}
        className="min-w-0 flex-1 rounded-none border p-2 text-xs"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }} />
      <button type="button" onClick={() => onChange("")} className="text-xs underline">Clear</button>
    </div>}
  </div>;
}
