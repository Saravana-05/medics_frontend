import { useEffect, useRef, useState } from "react";

export default function useWorkspaceModalLayout(verticalAnchorRef) {
  const modalRef = useRef(null);
  const [verticalBounds, setVerticalBounds] = useState({
    top: 32,
    height: Math.max(320, window.innerHeight - 40),
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef(null);

  useEffect(() => {
    const syncVerticalBounds = () => {
      const anchorTop = verticalAnchorRef?.current?.getBoundingClientRect().top;
      const top = anchorTop == null ? 32 : Math.max(0, Math.round(anchorTop) - 58);
      const gridBottom = document.querySelector("[data-prescription-view-grid]")?.getBoundingClientRect().bottom;
      const workspaceBottom = gridBottom ?? window.innerHeight - 8;
      setVerticalBounds({ top, height: Math.max(200, Math.round(workspaceBottom) - top) });
    };
    syncVerticalBounds();
    window.addEventListener("resize", syncVerticalBounds);
    return () => window.removeEventListener("resize", syncVerticalBounds);
  }, [verticalAnchorRef]);

  const handleDragStart = event => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button, input, select, textarea, a")) return;
    const modalRect = modalRef.current?.getBoundingClientRect();
    if (!modalRect) return;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: dragOffset,
      startRect: modalRect,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleDragMove = event => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rawX = event.clientX - drag.startX;
    const rawY = event.clientY - drag.startY;
    const nextLeft = Math.min(window.innerWidth - drag.startRect.width, Math.max(0, drag.startRect.left + rawX));
    const nextTop = Math.min(window.innerHeight - drag.startRect.height, Math.max(0, drag.startRect.top + rawY));
    setDragOffset({
      x: drag.startOffset.x + nextLeft - drag.startRect.left,
      y: drag.startOffset.y + nextTop - drag.startRect.top,
    });
  };

  const handleDragEnd = event => {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return {
    modalRef,
    verticalBounds,
    dragOffset,
    dragHandlers: {
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerCancel: handleDragEnd,
    },
  };
}
