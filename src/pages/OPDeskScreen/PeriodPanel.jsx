import { useEffect, useState } from "react";

const FINANCIAL_PERIODS = ["2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"];

function PeriodPanel({ patient, panelHeight, appliedPeriods = FINANCIAL_PERIODS.slice(-2), onRun }) {
  const [selectedPeriods, setSelectedPeriods] = useState(appliedPeriods);
  const firstVisit = patient?.todaysVisit?.firstVisit || String(patient?.docDate || "").split(" ")[0] || "—";

  const firstVisitPeriodIndex = (() => {
    const [day, month, year] = firstVisit.split("/").map(Number);
    if (!day || !month || !year) return 0;
    const financialStartYear = month >= 4 ? year : year - 1;
    const index = FINANCIAL_PERIODS.findIndex(period => Number(period.slice(0, 4)) === financialStartYear);
    return index < 0 ? (financialStartYear > 2025 ? FINANCIAL_PERIODS.length : 0) : index;
  })();

  useEffect(() => {
    setSelectedPeriods(appliedPeriods);
  }, [appliedPeriods]);

  const togglePeriod = (period) => {
    const clickedIndex = FINANCIAL_PERIODS.indexOf(period);
    if (clickedIndex < firstVisitPeriodIndex) return;
    setSelectedPeriods(current => {
      if (current.includes(period)) return current.filter(item => item !== period);
      if (current.length >= 2) return current;
      if (current.length === 1) {
        const selectedIndex = FINANCIAL_PERIODS.indexOf(current[0]);
        if (Math.abs(clickedIndex - selectedIndex) !== 1) return current;
      }
      return [...current, period].sort((left, right) => FINANCIAL_PERIODS.indexOf(left) - FINANCIAL_PERIODS.indexOf(right));
    });
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
            <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Select up to 2 consecutive years</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FINANCIAL_PERIODS.map(period => (
              <label
                key={period}
                className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm"
                style={{ background: "var(--color-surface-alt)", color: "var(--color-text-base)" }}
              >
                <input
                  type="checkbox"
                  checked={selectedPeriods.includes(period)}
                  disabled={FINANCIAL_PERIODS.indexOf(period) < firstVisitPeriodIndex}
                  onChange={() => togglePeriod(period)}
                  className="h-4 w-4 accent-[#0c324a]"
                />
                <span style={{ opacity: FINANCIAL_PERIODS.indexOf(period) < firstVisitPeriodIndex ? 0.4 : 1 }}>{period}</span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onRun?.(selectedPeriods)}
            disabled={selectedPeriods.length === 0}
            className="mt-3 flex h-8 w-full items-center justify-center text-xs font-semibold text-white"
            style={{ background: "#0c324a", borderRadius: 0, opacity: selectedPeriods.length ? 1 : 0.45 }}
          >
            Run Selected Years
          </button>
        </section>
      </div>
    </div>
  );
}

export default PeriodPanel;
