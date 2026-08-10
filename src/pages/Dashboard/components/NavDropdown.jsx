import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { resolveIcon } from "../iconMap";

// One top-nav menu button (Open / Settings / Patient & Treatment / ...) with
// its dropdown list of sub-items. Sub-items are display-only for now — no
// destination pages exist yet, so clicking one just closes the menu.
export default function NavDropdown({ label, icon, items, color = "#334155" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const Icon = resolveIcon(icon);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-all hover:bg-slate-50"
        style={{ color }}>
        <Icon size={16} />
        {label}
        <ChevronDown size={13} className="transition-transform" style={{ transform: open ? "rotate(180deg)" : "none", opacity: 0.6 }} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-56 rounded-lg shadow-xl border border-slate-100 bg-white z-50 py-1.5 animate-fade-in">
          {items.map(item => (
            <button key={item} onClick={() => setOpen(false)}
              className="w-full text-left px-3.5 py-1.5 text-[0.7rem] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
