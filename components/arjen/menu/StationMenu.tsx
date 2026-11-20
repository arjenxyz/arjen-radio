import React, { useEffect, useRef } from 'react';
import { RadioStation } from '@/lib/radio';
import { FaTimes, FaCheckCircle, FaBroadcastTower } from 'react-icons/fa';
import { useDraggable, getCenteredPanelPosition } from '@/components/arjen/hooks/useDraggable';
import { getChromeTheme } from '@/lib/chrome-theme';

interface StationMenuProps {
  stations: RadioStation[];
  currentStationIndex: number;
  isOpen: boolean;
  onSelectStation: (index: number) => void;
  onClose: () => void;
  isDayMode?: boolean;
}

const StationMenu: React.FC<StationMenuProps> = ({
  stations,
  currentStationIndex,
  isOpen,
  onSelectStation,
  onClose,
  isDayMode = false,
}) => {
  const { panelRef: menuRef, position, setPosition, dragHandleProps } = useDraggable();
  const isInitialized = useRef(false);
  const chrome = getChromeTheme(isDayMode);

  useEffect(() => {
    if (isOpen && menuRef.current && !isInitialized.current) {
      setTimeout(() => {
        if (!menuRef.current) return;
        setPosition(getCenteredPanelPosition(menuRef.current));
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
      className={`fixed z-[9999] flex w-80 flex-col overflow-hidden rounded-2xl border animate-scale-in transition-colors duration-500 ${chrome.panelSolid}`}
    >
      <div
        className={`relative flex cursor-move touch-none select-none items-center justify-between border-b px-5 py-4 group ${chrome.header}`}
        {...dragHandleProps}
      >
        <div className="flex items-center gap-3">
          <div className={chrome.muted}>
            <FaBroadcastTower size={14} />
          </div>
          <div>
            <h3 className={`text-sm font-bold tracking-wide ${chrome.text}`}>Stations</h3>
            <p className={`font-mono text-[10px] ${chrome.muted}`}>Pick a live stream</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all ${chrome.close}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaTimes size={12} />
        </button>
      </div>

      <div className="relative max-h-[min(420px,55vh)] space-y-2 overflow-y-auto p-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stations.map((station, index) => {
          const isSelected = index === currentStationIndex;

          return (
            <button
              key={station.uuid}
              onClick={() => onSelectStation(index)}
              className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border text-left transition-all duration-300 ${
                isSelected
                  ? `${chrome.itemSelected} scale-[1.02] opacity-100`
                  : `${chrome.itemBorderIdle} opacity-70 hover:scale-[1.01] hover:opacity-100`
              }`}
            >
              <div className={`flex items-center gap-3 p-3 ${chrome.surface}`}>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/20">
                  <img
                    src={station.cover}
                    alt={station.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/covers/melodydance.gif';
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-bold ${
                      isSelected ? chrome.itemTitle : chrome.itemTitleIdle
                    }`}
                  >
                    {station.title}
                  </p>
                  <p className={`mt-1 truncate text-[10px] ${chrome.muted}`}>{station.artist}</p>
                </div>

                {isSelected && (
                  <div className={`shrink-0 ${chrome.text}`}>
                    <FaCheckCircle size={14} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-scale-in { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `,
        }}
      />
    </div>
  );
};

export default StationMenu;
