import React, { useEffect, useRef } from 'react';
import { RadioStation } from '@/lib/radio';
import { FaTimes, FaCheckCircle, FaBroadcastTower } from 'react-icons/fa';
import { useDraggable } from '@/components/arjen/hooks/useDraggable';

interface StationMenuProps {
  stations: RadioStation[];
  currentStationIndex: number;
  isOpen: boolean;
  onSelectStation: (index: number) => void;
  onClose: () => void;
}

const StationMenu: React.FC<StationMenuProps> = ({
  stations,
  currentStationIndex,
  isOpen,
  onSelectStation,
  onClose,
}) => {
  const { panelRef: menuRef, position, setPosition, dragHandleProps } = useDraggable();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isOpen && menuRef.current && !isInitialized.current) {
      const startX = window.innerWidth - 380;
      const startY = window.innerHeight - 520;
      setTimeout(() => {
        setPosition({ x: Math.max(20, startX), y: Math.max(20, startY) });
        isInitialized.current = true;
      }, 0);
    }

    if (!isOpen) {
      isInitialized.current = false;
    }
  }, [isOpen, menuRef, setPosition]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[9999] w-80 flex flex-col rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 animate-scale-in"
    >
      <div className="absolute inset-0 bg-[#121212]/90 backdrop-blur-xl pointer-events-none" />

      <div
        className="relative flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5 cursor-move group select-none touch-none"
        {...dragHandleProps}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400 group-hover:text-white transition-colors">
            <FaBroadcastTower size={14} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">Stations</h3>
            <p className="text-[10px] text-gray-500 font-mono">Pick a live stream</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaTimes size={12} />
        </button>
      </div>

      <div className="relative p-4 space-y-2 max-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {stations.map((station, index) => {
          const isSelected = index === currentStationIndex;

          return (
            <button
              key={station.uuid}
              onClick={() => onSelectStation(index)}
              className={`
                group relative w-full rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 text-left
                ${isSelected
                  ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.15)] opacity-100 scale-[1.02]'
                  : 'border-white/5 opacity-70 hover:opacity-100 hover:border-white/20 hover:scale-[1.01]'
                }
              `}
            >
              <div className="flex items-center gap-3 p-3 bg-white/5">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 relative">
                  <img
                    src={station.cover}
                    alt={station.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/covers/melodydance.gif';
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {station.title}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate mt-1">
                    {station.artist}
                  </p>
                </div>

                {isSelected && (
                  <div className="text-white flex-shrink-0">
                    <FaCheckCircle size={14} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-scale-in { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
};

export default StationMenu;
