import { useEffect, useRef, useState } from "react";

export default function useWorkspaceModalLayout(verticalAnchorRef, anchorOffset = 58, minimumViewportRatio = 0) {
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
      const top = anchorTop == null ? 32 : Math.max(0, Math.round(anchorTop) - anchorOffset);
      const gridBottom = document.querySelector("[data-prescription-view-grid]")?.getBoundingClientRect().bottom;
      const workspaceBottom = gridBottom ?? window.innerHeight - 8;
      const workspaceHeight = Math.max(200, Math.round(workspaceBottom) - top);
      const height = minimumViewportRatio
        ? Math.min(window.innerHeight - 16, Math.max(workspaceHeight, window.innerHeight * minimumViewportRatio))
        : workspaceHeight;
      const boundedTop = minimumViewportRatio ? Math.max(8, Math.min(top, window.innerHeight - height - 8)) : top;
      setVerticalBounds({ top: boundedTop, height });
    };
    syncVerticalBounds();
    window.addEventListener("resize", syncVerticalBounds);
    return () => window.removeEventListener("resize", syncVerticalBounds);
  }, [verticalAnchorRef, anchorOffset, minimumViewportRatio]);

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
