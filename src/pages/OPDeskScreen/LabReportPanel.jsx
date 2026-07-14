import { useRef } from "react";
import { FlaskConical } from "lucide-react";
import useFillRowCount from "../../hooks/useFillRowCount";

// RIGHT panel (Lab Result) grid: Observed Value | Unit | Bio Ref | Specimen
const RIGHT_GRID = "minmax(60px,1fr) 100px 200px 80px";

/* Row height (px) used to compute how many blank rows fill the remaining
   visible space — see useFillRowCount. Matches Previous Information's and
   Repeat Prescriptions' row height so all three sections' grids line up. */
const ROW_HEIGHT_PX = 42;

/* ── Empty placeholder row — shown to fill remaining space ── */
function EmptyLabResultRow({ index }) {
  return (
    <div
      className="grid border-b"
      style={{ gridTemplateColumns: RIGHT_GRID, borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}
    >
      <div className="px-3 py-2 min-w-0">&nbsp;</div>
      <div className="px-3 py-2 text-center">&nbsp;</div>
      <div className="px-3 py-2 min-w-0">&nbsp;</div>
      <div className="px-3 py-2 min-w-0">&nbsp;</div>
    </div>
  );
}

/* Self-contained panel — mirrors the lab tests entered on the Lab tab's left
   order list (same labs/struckIds/selectedRowId, lifted to OPDeskScreen), rendered
   as a top-level column so its top aligns with Previous Information. */
export default function LabReportPanel({ labs, struckIds, selectedRowId, onSelect }) {
  const rowsScrollRef = useRef(null);
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, labs.length);

  return (
    <div
      className="flex flex-col rounded-xs overflow-hidden shadow-lg"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Header — same layout as Previous Information / Repeat Prescriptions: icon chip + title + subtitle */}
      <div className="flex-shrink-0 px-4 py-[0.44rem] border-b flex justify-between items-center"
        style={{ background: "var(--color-lab-light)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg" style={{ background: "var(--color-lab)", color: "white" }}>
            <FlaskConical size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--color-lab)" }}>
              Lab Report
            </h3>
            <p className="text-[0.6rem] font-medium mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {labs.length} Test{labs.length !== 1 ? 's' : ''} Recorded
            </p>
          </div>
        </div>
      </div>

      {/* Table header — overflow:hidden + nowrap on the long label guarantees this
          row can never grow past the fixed row height, matching the left panel exactly. */}
      <div className="grid border-b flex-shrink-0" style={{ gridTemplateColumns: RIGHT_GRID, background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box", overflow: "hidden" }}>
        <div className="px-3 py-2.5 truncate" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>Observed Value</div>
        <div className="px-3 py-2.5 text-center truncate" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>Unit</div>
        <div className="px-3 py-2.5 truncate" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)", whiteSpace: "nowrap" }}>Biological Ref. - Interval</div>
        <div className="px-3 py-2.5 truncate" style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--color-lab)" }}>Specimen</div>
      </div>

      {/* Rows — one per lab, same count/order as the left order list */}
      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {labs.map((lab, index) => {
          const isStruck = struckIds.includes(lab.id);
          const isSelected = selectedRowId === lab.id;
          return (
            <div
              key={lab.id}
              onClick={() => onSelect(lab.id)}
              className="grid border-b transition-all duration-150 cursor-pointer"
              style={{
                gridTemplateColumns: RIGHT_GRID,
                borderColor: "var(--color-border)",
                background: isSelected
                  ? "var(--color-lab-light)"
                  : isStruck
                    ? "var(--color-surface-alt)"
                    : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
                opacity: isStruck ? 0.6 : 1,
                height: `${ROW_HEIGHT_PX}px`,
                boxSizing: "border-box",
              }}
            >
              <div className="px-3 py-2 flex items-center min-w-0">
                <span className="text-sm truncate" style={{ color: lab.observedValue ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>
                  {lab.observedValue || "—"}
                </span>
              </div>
              <div className="px-3 py-2 flex items-center justify-center">
                <span className="text-sm text-center" style={{ color: lab.unit ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>
                  {lab.unit || "—"}
                </span>
              </div>
              <div className="px-3 py-2 flex items-center min-w-0">
                <span className="text-sm truncate" style={{ color: lab.bioRef ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>
                  {lab.bioRef || "—"}
                </span>
              </div>
              <div className="px-3 py-2 flex items-center min-w-0">
                <span className="text-sm truncate" style={{ color: lab.specimen ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>
                  {lab.specimen || "—"}
                </span>
              </div>
            </div>
          );
        })}
        {Array.from({ length: fillRowCount }).map((_, i) => (
          <EmptyLabResultRow key={`empty-${i}`} index={labs.length + i} />
        ))}
      </div>
    </div>
  );
}
