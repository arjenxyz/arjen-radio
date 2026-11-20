import React, { useEffect, useRef } from 'react';
import { Scene } from '../constants/constants';
import SceneImage from '../etc/SceneImage';
import { FaTimes, FaCheckCircle, FaLayerGroup } from 'react-icons/fa';
import { useDraggable, getCenteredPanelPosition } from '@/components/arjen/hooks/useDraggable';
import { getChromeTheme } from '@/lib/chrome-theme';

interface SceneMenuProps {
  scenes: Scene[];
  currentSceneIndex: number;
  isOpen: boolean;
  onSelectScene: (index: number) => void;
  onClose: () => void;
  isDayMode?: boolean;
}

const SceneMenu: React.FC<SceneMenuProps> = ({
  scenes,
  currentSceneIndex,
  isOpen,
  onSelectScene,
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
            <FaLayerGroup size={14} />
          </div>
          <div>
            <h3 className={`text-sm font-bold tracking-wide ${chrome.text}`}>Atmosphere</h3>
            <p className={`font-mono text-[10px] ${chrome.muted}`}>Select an atmosphere</p>
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

      <div className="custom-scrollbar relative max-h-[min(420px,55vh)] space-y-3 overflow-y-auto p-4">
        {scenes.map((scene, index) => {
          const isSelected = index === currentSceneIndex;

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(index)}
              className={`group relative h-28 w-full cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ${
                isSelected
                  ? `${chrome.itemSelected} scale-[1.02] opacity-100`
                  : `${chrome.itemBorderIdle} opacity-50 hover:scale-[1.01] hover:opacity-100`
              }`}
            >
              <SceneImage
                src={scene.bgDay}
                alt={scene.name}
                themeColor={scene.themeColor}
                className="transition-transform duration-700 group-hover:scale-110"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
                  isSelected ? 'opacity-40' : 'opacity-55 group-hover:opacity-35'
                }`}
              />

              {isSelected && (
                <div className="absolute right-2 top-2 animate-fade-in-up rounded-full bg-white p-1 text-black shadow-md">
                  <FaCheckCircle size={14} />
                </div>
              )}

              <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-3">
                <div>
                  <p
                    className={`text-base font-bold leading-none text-white drop-shadow-md transition-colors`}
                  >
                    {scene.name}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-gray-200">
                    {isSelected ? '● ACTIVE' : '○ SELECT'}
                  </p>
                </div>
              </div>
            </div>
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
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.35); border-radius: 4px; }
      `,
        }}
      />
    </div>
  );
};

export default SceneMenu;
