import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const BASE_START_YEAR = 2020;

function formatPeriod(startYear) {
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

function getCurrentPeriod() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();
  const fyStartYear = month >= 4 ? year : year - 1; // Indian financial year: Apr–Mar
  return formatPeriod(fyStartYear);
}

function buildFinancialPeriods(currentPeriod) {
  const currentStartYear = Number(currentPeriod.slice(0, 4));
  const periods = [];
  for (let y = BASE_START_YEAR; y <= currentStartYear; y++) {
    periods.push(formatPeriod(y));
  }
  return periods;
}

const CURRENT_PERIOD = getCurrentPeriod();
const FINANCIAL_PERIODS = buildFinancialPeriods(CURRENT_PERIOD);

function withCurrentPeriod(periods) {
  const base = periods && periods.length ? periods : [];
  const next = base.includes(CURRENT_PERIOD) ? base : [...base, CURRENT_PERIOD];
  return next
    .filter(period => FINANCIAL_PERIODS.includes(period))
    .sort((left, right) => FINANCIAL_PERIODS.indexOf(left) - FINANCIAL_PERIODS.indexOf(right));
}

function PeriodPanel({ patient, panelHeight, appliedPeriods = FINANCIAL_PERIODS.slice(-2), onRun }) {
  // selectedStack keeps insertion order: last item = most recently added = the only one poppable next.
  const [selectedStack, setSelectedStack] = useState(() => withCurrentPeriod(appliedPeriods));
  const [isRunning, setIsRunning] = useState(false);
  const firstVisit = patient?.todaysVisit?.firstVisit || String(patient?.docDate || "").split(" ")[0] || "—";

  const firstVisitPeriodIndex = (() => {
    const [day, month, year] = firstVisit.split("/").map(Number);
    if (!day || !month || !year) return 0;
    const financialStartYear = month >= 4 ? year : year - 1;
    const index = FINANCIAL_PERIODS.findIndex(period => Number(period.slice(0, 4)) === financialStartYear);
    return index < 0 ? (financialStartYear > Number(CURRENT_PERIOD.slice(0, 4)) ? FINANCIAL_PERIODS.length : 0) : index;
  })();

  useEffect(() => {
    setSelectedStack(withCurrentPeriod(appliedPeriods));
  }, [appliedPeriods]);

  // Chronological view, used for rendering order / passing out to onRun.
  const selectedPeriods = FINANCIAL_PERIODS.filter(period => selectedStack.includes(period));

  const canAdd = (period) => {
    const idx = FINANCIAL_PERIODS.indexOf(period);
    if (selectedStack.length === 0) return true;
    const indices = selectedStack.map(p => FINANCIAL_PERIODS.indexOf(p));
    const min = Math.min(...indices);
    const max = Math.max(...indices);
    return idx === min - 1 || idx === max + 1; // only extend one step at either edge — no jumping
  };

  const togglePeriod = (period) => {
    const idx = FINANCIAL_PERIODS.indexOf(period);
    if (idx < firstVisitPeriodIndex) return;

    if (selectedStack.includes(period)) {
      // Deselecting: only the most recently added edge can be removed, and the
      // current financial year can never be removed.
      if (period === CURRENT_PERIOD) return;
      const top = selectedStack[selectedStack.length - 1];
      if (period !== top) return;
      setSelectedStack(current => current.slice(0, -1));
    } else {
      // Selecting: must be immediately adjacent to the existing block, no jumping ahead.
      if (!canAdd(period)) return;
      setSelectedStack(current => [...current, period]);
    }
  };

  const handleRun = async () => {
    if (isRunning || selectedPeriods.length === 0) return;
    setIsRunning(true);
    try {
      await onRun?.(selectedPeriods);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}
    >
      <div
        className="flex h-[50px] shrink-0 items-center border-b px-3 py-2"
        style={{ background: "#0c324a", borderColor: "var(--color-border)" }}
      >
        <span className="text-md font-bold text-white">Data Period</span>
      </div>

      <div className="overflow-y-auto p-3">
        <section className="flex items-center justify-between gap-3 pb-3">
          <div className="text-xs font-bold" style={{ color: "#0c324a" }}>First Visit</div>
          <div className="text-right text-sm" style={{ color: "var(--color-text-base)" }}>{firstVisit}</div>
        </section>

        <section className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold" style={{ color: "#0c324a" }}>Financial Years</h3>
            <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Add/remove one adjacent year at a time</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FINANCIAL_PERIODS.map(period => {
              const isCurrent = period === CURRENT_PERIOD;
              const isBeforeFirstVisit = FINANCIAL_PERIODS.indexOf(period) < firstVisitPeriodIndex;
              const isSelected = selectedStack.includes(period);
              const isTopOfStack = selectedStack[selectedStack.length - 1] === period;
              const canInteract = isBeforeFirstVisit
                ? false
                : isSelected
                  ? (!isCurrent && isTopOfStack) // can only remove the most-recently-added edge
                  : canAdd(period); // can only add a year adjacent to the current block
              return (
                <label
                  key={period}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm"
                  style={{ background: "var(--color-surface-alt)", color: "var(--color-text-base)", cursor: canInteract ? "pointer" : "default" }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={!canInteract}
                    onChange={() => togglePeriod(period)}
                    className="h-4 w-4 accent-[#0c324a]"
                  />
                  <span style={{ opacity: isBeforeFirstVisit ? 0.4 : 1 }}>
                    {period}
                    {isCurrent && (
                      <span className="ml-1 text-[0.6rem] font-semibold" style={{ color: "#0c324a" }}>(Current)</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleRun}
            disabled={selectedPeriods.length === 0 || isRunning}
            className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100"
            style={{ background: "#0c324a" }}
          >
            {isRunning ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Running...
              </>
            ) : (
              "Run Selected Years"
            )}
          </button>
        </section>
      </div>
    </div>
  );
}

export default PeriodPanel;