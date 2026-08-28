import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

/**
 * Pointer-based dragging for floating panels.
 * Listeners are attached synchronously on pointerdown so the first
 * touch-move is not missed (useEffect would be too late on mobile).
 */
export function useDraggable() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!panelRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return;

    const rect = panelRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    draggingRef.current = true;
    setIsDragging(true);

    const moveTo = (clientX: number, clientY: number) => {
      if (!draggingRef.current) return;
      setPosition({
        x: clientX - offsetRef.current.x,
        y: clientY - offsetRef.current.y,
      });
    };

    const handlePointerMove = (ev: PointerEvent) => {
      moveTo(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (!touch) return;
      ev.preventDefault();
      moveTo(touch.clientX, touch.clientY);
    };

    const endDrag = () => {
      draggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', endDrag);
      window.removeEventListener('touchcancel', endDrag);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Some mobile browsers reject capture; window listeners still handle the drag.
    }
  }, []);

  return {
    panelRef,
    position,
    setPosition,
    isDragging,
    dragHandleProps: {
      onPointerDown,
      style: { touchAction: 'none' as const },
    },
  };
}
