import React, { useMemo } from 'react';

const ZOOM = 10;
const TILE = 256;

function latLngToWorld(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom;
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y, n };
}

interface TravelMapProps {
  lat: number;
  lng: number;
  className?: string;
}

/** Lightweight OSM tile mosaic with a center pin — no third-party staticmap host. */
const TravelMap: React.FC<TravelMapProps> = ({ lat, lng, className }) => {
  const mosaic = useMemo(() => {
    const world = latLngToWorld(lat, lng, ZOOM);
    const centerTileX = Math.floor(world.x);
    const centerTileY = Math.floor(world.y);
    const cols = [-1, 0, 1];
    const rows = [-1, 0];

    const tiles = rows.flatMap((dy) =>
      cols.map((dx) => {
        const tx = centerTileX + dx;
        const ty = centerTileY + dy;
        const wrappedX = ((tx % world.n) + world.n) % world.n;
        return {
          key: `${tx}:${ty}`,
          left: (dx + 1) * TILE,
          top: (dy + 1) * TILE,
          src: `https://tile.openstreetmap.org/${ZOOM}/${wrappedX}/${ty}.png`,
        };
      })
    );

    // Pin sits at the fractional position within the 3x2 mosaic.
    const pinLeft = (world.x - (centerTileX - 1)) * TILE;
    const pinTop = (world.y - (centerTileY - 1)) * TILE;

    return {
      width: cols.length * TILE,
      height: rows.length * TILE,
      tiles,
      pinLeft,
      pinTop,
    };
  }, [lat, lng]);

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${className ?? ''}`}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: mosaic.width,
          height: mosaic.height,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {mosaic.tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            draggable={false}
            className="absolute max-w-none"
            style={{ left: tile.left, top: tile.top, width: TILE, height: TILE }}
          />
        ))}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-full"
          style={{ left: mosaic.pinLeft, top: mosaic.pinTop }}
        >
          <div className="flex flex-col items-center">
            <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#6B8FD9] shadow-[0_0_0_3px_rgba(107,143,217,0.35)]" />
            <div className="h-2 w-0.5 bg-white/90" />
          </div>
        </div>
      </div>
      <p className="absolute bottom-1.5 right-2 z-10 text-[9px] text-black/50">
        © OSM
      </p>
    </div>
  );
};

export default TravelMap;
