import { useRef } from "react";
import { Info, X } from "lucide-react";
import { serviceFeeBreakdown } from "../serviceFees";

export default function ServiceFeeField({ services = [], fieldStyle }) {
  const dialogRef = useRef(null);
  const { rows, total } = serviceFeeBreakdown(services);
  const hasSample = rows.some(row => row.sample);
  const money = amount => amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });
  return <>
    <div className="grid grid-cols-[44px_minmax(0,1fr)] min-h-7 items-center text-xs font-semibold">
      <span style={{ color: "var(--color-text-muted)" }}>Service</span>
      <div className="flex min-w-0 items-center justify-between px-1 h-7">
        <span className="truncate tabular-nums" title={`${money(total)}${hasSample ? " (includes sample prices)" : ""}`}>{money(total)}{hasSample && <span className="ml-1 text-[9px]">Demo</span>}</span>
        <button type="button" aria-label="View service fee breakdown" onClick={() => dialogRef.current?.showModal()} className="shrink-0 p-1"><Info size={15} /></button>
      </div>
    </div>
    <dialog ref={dialogRef} aria-labelledby="service-fee-title" className="m-auto w-[420px] max-w-[calc(100vw-32px)] border p-4 shadow-xl backdrop:bg-black/40"
      style={fieldStyle} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }}>
      <div className="mb-3 flex items-center justify-between"><h2 id="service-fee-title" className="font-semibold">Included services</h2>
        <button type="button" aria-label="Close service breakdown" onClick={() => dialogRef.current.close()}><X size={18} /></button></div>
      <div className="max-h-[50vh] overflow-y-auto">
        {hasSample && <p className="mb-2 text-xs" style={{ color: "var(--color-text-muted)" }}>Sample prices for demonstration only.</p>}
        {rows.length ? rows.map((row, index) => <div key={index} className="flex justify-between gap-4 border-b py-2 text-sm" style={{ borderColor: "var(--color-border)" }}>
          <span>{row.name}{row.sample && <span className="ml-1 text-xs">(sample)</span>}</span><span className="shrink-0 tabular-nums">{money(row.price)}</span>
        </div>) : <p className="py-3 text-sm">No services added.</p>}
      </div>
      <div className="mt-3 flex justify-between gap-4 text-sm font-semibold"><span>Total service fee</span><span>{money(total)}</span></div>
    </dialog>
  </>;
}
