import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Scene } from '../constants/constants';
import { FaTimes, FaCheckCircle, FaLayerGroup } from 'react-icons/fa';

interface SceneMenuProps {
  scenes: Scene[];
  currentSceneIndex: number;
  isOpen: boolean;
  onSelectScene: (index: number) => void;
  onClose: () => void;
}

/**
 * SceneMenu Component
 * 
 * A draggable, glassmorphic menu for selecting different background scenes.
 * Features:
 * - Draggable window with initial positioning
 * - Scene selection with visual feedback
 * - Responsive and animated UI
 */
const SceneMenu: React.FC<SceneMenuProps> = ({
  scenes,
  currentSceneIndex,
  isOpen,
  onSelectScene,
  onClose,
}) => {
  /* ----------------------------- State Management ----------------------------- */
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  /* --------------------------- Initial Positioning ---------------------------- */
  /**
   * On menu open, position the menu near the bottom-right of the viewport.
   * This effect runs only once per open event to avoid resetting position on re-renders.
   */
  useEffect(() => {
    if (isOpen && menuRef.current && !isInitialized.current) {
      const startX = window.innerWidth - 380;
      const startY = window.innerHeight - 500;
      setTimeout(() => {
        setPosition({ x: Math.max(20, startX), y: Math.max(20, startY) });
        isInitialized.current = true;
      }, 0);
    }
  }, [isOpen]);

  /* ----------------------------- Drag Handlers ------------------------------- */
  /**
   * When the header is pressed, enable dragging and record the offset between
   * the mouse position and the menu's top-left corner.
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (menuRef.current) {
      setIsDragging(true);
      const rect = menuRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  /**
   * While dragging, update the menu's position based on mouse movement.
   * Remove event listeners when dragging ends.
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  /* ----------------------------- Render Section ------------------------------ */
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[9999] w-80 flex flex-col rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 animate-scale-in"
    >
      {/* --------------------------- Glassmorphic Background --------------------------- */}
      <div className="absolute inset-0 bg-[#121212]/90 backdrop-blur-xl pointer-events-none"></div>

      {/* ----------------------------- Header (Draggable) ----------------------------- */}
      <div 
        className="relative flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5 cursor-move group select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400 group-hover:text-white transition-colors">
            <FaLayerGroup size={14} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">Atmosphere</h3>
            <p className="text-[10px] text-gray-500 font-mono">Select an atmosphere</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking close
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* ----------------------------- Scene List UI ----------------------------- */}
      <div className="relative p-4 space-y-3 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {scenes.map((scene, index) => {
          const isSelected = index === currentSceneIndex;

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(index)}
              className={`
                group relative w-full h-28 rounded-xl overflow-hidden cursor-pointer border transition-all duration-300
                ${isSelected
                  ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.15)] opacity-100 scale-[1.02]'
                  : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20 hover:scale-[1.01]'
                }
              `}
            >
              {/* Scene Preview Image */}
              <Image
                src={scene.bgDay}
                alt={scene.name}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ imageRendering: 'pixelated' }}
                sizes="320px"
              />

              {/* Gradient Overlay for Readability */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-60' : 'opacity-80 group-hover:opacity-50'}`}></div>

              {/* Active Scene Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-white text-black rounded-full p-1 shadow-md animate-fade-in-up">
                  <FaCheckCircle size={14} />
                </div>
              )}

              {/* Scene Name and Status */}
              <div className="absolute bottom-0 left-0 w-full p-3 flex justify-between items-end">
                <div>
                  <p className={`font-bold text-base leading-none drop-shadow-md transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {scene.name}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1 font-mono uppercase tracking-wider">
                    {isSelected ? '● ACTIVE' : '○ SELECT'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------------------- Animation Styles ----------------------------- */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-scale-in { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn { 
            from { opacity: 0; transform: scale(0.95); } 
            to { opacity: 1; transform: scale(1); } 
        }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default SceneMenu;