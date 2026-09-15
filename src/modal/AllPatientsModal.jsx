import { useEffect, useRef, useState } from "react";
import { Users, Search } from "lucide-react";
import useWorkspaceModalLayout from "../hooks/useWorkspaceModalLayout";

export default function AllPatientsModal({ patients, verticalAnchorRef, onClose, onSelectPatient }) {
  const { modalRef, verticalBounds, dragOffset, dragHandlers } = useWorkspaceModalLayout(verticalAnchorRef, 118, 0.8);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const searchRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const filtered = patients.filter(p => (type === "all" || p.listType === type) && (!status || p.status === status) &&
    [p.id, p.name, p.phone, p.doctor, p.complaint, p.room, p.token].some(value => String(value || "").toLowerCase().includes(query.trim().toLowerCase())));
  const select = patient => { onSelectPatient({ ...patient, listSource: "all" }); onClose(); };
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();
    const onKey = event => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const elements = [...modalRef.current.querySelectorAll('button:not([disabled]), input, select, [tabindex="0"]')];
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey); previous?.focus?.(); };
  }, [modalRef]);
  const columns = ["Patient ID", "Patient Name", "Age / Sex", "Type", "Status", "Doctor", "Chief Complaint", "Token / Room", "Phone"];
  return <div className="fixed inset-0 z-[100] flex items-start justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.5)", paddingTop: verticalBounds.top }}>
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="All Patients" className="list-modal-flat flex w-[min(96vw,1180px)] flex-col overflow-hidden shadow-2xl" style={{ height: verticalBounds.height, background: "var(--color-surface)", color: "var(--color-text-base)", transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}>
      <div className="flex items-center justify-between px-5 py-3 text-white" style={{ background: "var(--color-primary)", cursor: "grab", touchAction: "none" }} {...dragHandlers}>
        <h2 className="flex items-center gap-2 text-lg font-bold"><Users size={20} />All Patients</h2>
        <button onClick={onClose} className="bg-black/40 px-3 py-1.5 text-xs font-semibold">Close</button>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
        {[["all", "All"], ["op", "OP"], ["ip", "IP"], ["registered", "Registered"]].map(([key,label]) => <button key={key} onClick={() => { setType(key); setStatus(""); setSelectedId(null); }} aria-pressed={type === key} className="px-3 py-2 text-xs font-bold" style={{ background: type === key ? "var(--color-primary)" : "var(--color-surface)", color: type === key ? "white" : "var(--color-text-base)" }}>{label} ({patients.filter(p => key === "all" || p.listType === key).length})</button>)}
        <label className="relative ml-auto"><Search className="absolute left-2 top-2.5" size={14}/><input ref={searchRef} aria-label="Search all patients" value={query} onChange={e => { setQuery(e.target.value); setSelectedId(null); }} placeholder="Search name, ID, phone, doctor…" className="w-64 border bg-white py-2 pl-7 pr-2 text-xs text-slate-800" /></label>
        <select aria-label="Filter patient status" value={status} onChange={e => { setStatus(e.target.value); setSelectedId(null); }} className="border bg-white p-2 text-xs text-slate-800"><option value="">All statuses</option>{[...new Set(patients.filter(p => type === "all" || p.listType === type).map(p => p.status))].map(value => <option key={value}>{value}</option>)}</select>
      </div>
      <div className="min-h-0 flex-1 overflow-auto" tabIndex={0} aria-label="Patient register" onKeyDown={event => {
        if (!["ArrowDown", "ArrowUp", "Enter"].includes(event.key) || !filtered.length) return;
        event.preventDefault();
        const index = filtered.findIndex(p => p.id === selectedId);
        if (event.key === "Enter") { if (index >= 0) select(filtered[index]); return; }
        const next = index < 0 ? 0 : Math.max(0, Math.min(filtered.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)));
        setSelectedId(filtered[next].id);
        modalRef.current.querySelector(`[data-patient-id="${filtered[next].id}"]`)?.scrollIntoView({ block: "nearest" });
      }}>
        <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
          <thead className="sticky top-0 text-white" style={{ background: "var(--color-primary)" }}><tr>{columns.map(column => <th key={column} className="px-3 py-3">{column}</th>)}</tr></thead>
          <tbody>{filtered.map((p,index) => <tr key={p.id} data-patient-id={p.id} aria-selected={selectedId === p.id} onClick={() => setSelectedId(p.id)} onDoubleClick={() => select(p)} className="cursor-pointer" style={{ background: selectedId === p.id ? "#dbeafe" : index % 2 ? "var(--color-surface-alt)" : "var(--color-surface)" }}>{[p.id,p.name,`${p.age || "—"} / ${p.gender || "—"}`,p.listType === "registered" ? "Registered" : p.listType?.toUpperCase(),p.status,p.doctor,p.complaint,p.listType === "ip" ? `${p.ward} / ${p.room}` : p.token,p.phone].map((value,i) => <td key={i} className="border-b px-3 py-2.5" style={{ borderColor: "var(--color-border)" }}>{value || "—"}</td>)}</tr>)}</tbody>
        </table>
        {!filtered.length && <p className="p-8 text-center text-sm">No matching patients</p>}
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}><span>{filtered.length} of {patients.length} patients · Double-click a row or press Enter to load</span><button disabled={!filtered.some(p => p.id === selectedId)} onClick={() => select(filtered.find(p => p.id === selectedId))} className="px-4 py-2 font-semibold text-white disabled:opacity-40" style={{ background: "var(--color-primary)" }}>Load Patient</button></div>
    </div>
  </div>;
}
