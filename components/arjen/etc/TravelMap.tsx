'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

const ZOOM = 12;
const TILE = 256;

function latLngToWorld(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom;
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y, n };
}

function metersPerPixel(lat: number, zoom: number) {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;
}

interface TravelMapProps {
  lat: number;
  lng: number;
  /** GPS accuracy in meters — draws a soft confidence ring when known. */
  accuracyM?: number | null;
  className?: string;
}

/** Live OSM mosaic: map pans under a fixed center “you are here” pulse. */
const TravelMap: React.FC<TravelMapProps> = ({
  lat,
  lng,
  accuracyM = null,
  className,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 300, h: 144 });

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      setSize({ w: el.clientWidth || 300, h: el.clientHeight || 144 });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const view = useMemo(() => {
    const world = latLngToWorld(lat, lng, ZOOM);
    const worldPxX = world.x * TILE;
    const worldPxY = world.y * TILE;

    const pad = TILE;
    const left = worldPxX - size.w / 2 - pad;
    const top = worldPxY - size.h / 2 - pad;
    const right = worldPxX + size.w / 2 + pad;
    const bottom = worldPxY + size.h / 2 + pad;

    const minTx = Math.floor(left / TILE);
    const maxTx = Math.floor(right / TILE);
    const minTy = Math.max(0, Math.floor(top / TILE));
    const maxTy = Math.min(world.n - 1, Math.floor(bottom / TILE));

    const tiles: { key: string; left: number; top: number; src: string }[] = [];
    for (let ty = minTy; ty <= maxTy; ty += 1) {
      for (let tx = minTx; tx <= maxTx; tx += 1) {
        const wrappedX = ((tx % world.n) + world.n) % world.n;
        tiles.push({
          key: `${ZOOM}:${wrappedX}:${ty}`,
          left: tx * TILE,
          top: ty * TILE,
          src: `https://tile.openstreetmap.org/${ZOOM}/${wrappedX}/${ty}.png`,
        });
      }
    }

    const accuracyPx =
      accuracyM != null && accuracyM > 0
        ? Math.min(90, Math.max(18, accuracyM / metersPerPixel(lat, ZOOM)))
        : 28;

    return {
      tiles,
      transform: `translate(${size.w / 2 - worldPxX}px, ${size.h / 2 - worldPxY}px)`,
      accuracyPx,
    };
  }, [lat, lng, accuracyM, size.w, size.h]);

  return (
    <div
      ref={viewportRef}
      className={`relative overflow-hidden bg-neutral-900 ${className ?? ''}`}
    >
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          transform: view.transform,
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {view.tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            draggable={false}
            className="absolute max-w-none"
            style={{ left: tile.left, top: tile.top, width: TILE, height: TILE }}
          />
        ))}
      </div>

      {/* Fixed live location — map slides underneath */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full bg-[#4A90E2]/25"
            style={{ width: view.accuracyPx * 2, height: view.accuracyPx * 2 }}
          />
          <div className="absolute h-10 w-10 animate-travel-live-ring rounded-full border-2 border-[#4A90E2]/55" />
          <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#4A90E2] shadow-[0_0_0_3px_rgba(74,144,226,0.35)]" />
        </div>
      </div>

      <p className="absolute bottom-1.5 right-2 z-10 text-[9px] text-black/50">
        © OSM
      </p>
    </div>
  );
};

export default TravelMap;
