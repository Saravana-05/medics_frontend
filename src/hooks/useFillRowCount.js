import { useEffect, useState } from "react";

/**
 * Computes how many additional blank rows are needed to fill the visible height
 * of a scrollable rows container, given a fixed row height and how many real
 * data rows are already rendered. Re-measures on container resize so the grid
 * always fills whatever space is available — no hardcoded row count.
 */
export default function useFillRowCount(containerRef, rowHeightPx, dataLength, reservedHeightPx = 0) {
  const [fillCount, setFillCount] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const available = Math.max(0, el.clientHeight - reservedHeightPx);
      const needed = Math.max(0, Math.ceil(available / rowHeightPx) - dataLength);
      setFillCount(needed);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, rowHeightPx, dataLength, reservedHeightPx]);

  return fillCount;
}
