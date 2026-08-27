import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Types
 */
export interface AppSettings {
  hideElements: boolean;
  showClock: boolean;
  shortcuts: boolean;
  showTitles: boolean;
  hideTime: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

/**
 * SettingsModal Component
 * 
 * Provides a draggable modal for updating application settings.
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  /**
   * -------------------------------
   * State & Refs
   * -------------------------------
   */
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  /**
   * -------------------------------
   * Modal Positioning Logic
   * -------------------------------
   * On initial open, center the modal on the screen.
   * Only runs once per open to avoid repositioning during drag.
   */
  useEffect(() => {
    if (isOpen && modalRef.current && !isInitialized.current) {
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = modalRef.current;
      setPosition({
        x: (innerWidth - offsetWidth) / 2,
        y: (innerHeight - offsetHeight) / 2,
      });
      isInitialized.current = true;
    }
  }, [isOpen]);

  /**
   * -------------------------------
   * Drag & Drop Logic
   * -------------------------------
   * Handles mouse events to allow the modal to be dragged.
   * Mouse down on the header starts dragging and records the offset.
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  /**
   * Handles mousemove and mouseup events globally while dragging.
   * Updates modal position based on cursor movement.
   * Cleans up event listeners on unmount or when dragging ends.
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  /**
   * -------------------------------
   * Settings Update Logic
   * -------------------------------
   * Utility to update a specific setting key.
   */
  const update = (key: keyof AppSettings, value: boolean | number) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  /**
   * Handles numeric input for hideTime, constraining value between 1 and 10.
   */
  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 5;
    val = Math.max(1, Math.min(10, val));
    update('hideTime', val);
  };

  /**
   * -------------------------------
   * UI Rendering
   * -------------------------------
   */
  return (
    <div
      ref={modalRef}
      className="fixed z-[9999] w-full max-w-[360px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-white/10 animate-scale-in"
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: 'rgba(20, 20, 21, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Modal Header: Drag handle and close button */}
      <div
        className="flex items-center justify-between px-6 pt-6 pb-2 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-white font-bold text-lg pointer-events-none">Settings</h2>
        <button
          onClick={onClose}
          className="text-[#71717a] hover:text-white transition-colors cursor-pointer"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking close
        >
          <FaTimes size={16} />
        </button>
      </div>

      {/* Modal Content: Settings controls */}
      <div className="p-6 space-y-7">
        {/* Hide Elements Toggle and Timeout */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <h3 className="text-white font-medium text-[15px] mb-1">Hide Elements</h3>
              <p className="text-[#a1a1aa] text-[13px] leading-snug">
                Hide the interface after a period of inactivity.
              </p>
            </div>
            <OrangeSwitch
              checked={settings.hideElements}
              onChange={() => update('hideElements', !settings.hideElements)}
            />
          </div>
          {/* Hide After Timeout Input */}
          {settings.hideElements && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-3 border border-white/5">
                <span className="text-[#a1a1aa] text-[14px] font-medium">Hide After</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={settings.hideTime}
                    onChange={handleTimeInput}
                    className="w-6 bg-transparent text-right text-white font-bold text-[14px] focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min={1}
                    max={10}
                  />
                  <span className="text-[#f97316] font-bold text-[14px] ml-0.5">sec</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Settings Toggles */}
        <div className="space-y-6">
          <SettingItem
            label="Show Titles"
            desc="Toggle main headers visibility."
            checked={settings.showTitles}
            onChange={() => update('showTitles', !settings.showTitles)}
          />
          <SettingItem
            label="Show Clock"
            checked={settings.showClock}
            onChange={() => update('showClock', !settings.showClock)}
          />
          <SettingItem
            label="Keyboard Shortcuts"
            desc="Use [SPACE] to pause and [M] to mute."
            checked={settings.shortcuts}
            onChange={() => update('shortcuts', !settings.shortcuts)}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * SettingItem
 * 
 * Renders a labeled toggle switch with optional description.
 */
const SettingItem = ({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-start justify-between">
    <div className="pr-4">
      <h3 className="text-white font-medium text-[15px] mb-1">{label}</h3>
      {desc && <p className="text-[#a1a1aa] text-[13px] leading-snug">{desc}</p>}
    </div>
    <OrangeSwitch checked={checked} onChange={onChange} />
  </div>
);

/**
 * OrangeSwitch
 * 
 * Custom toggle switch component styled with orange accent.
 */
const OrangeSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative w-[50px] h-[28px] rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
      checked ? 'bg-[#f97316]' : 'bg-[#3f3f46]'
    }`}
  >
    <div
      className={`absolute top-[2px] left-[2px] w-[24px] h-[24px] bg-white rounded-full shadow-md transition-transform duration-200 ${
        checked ? 'translate-x-[22px]' : 'translate-x-0'
      }`}
    ></div>
  </button>
);

export default SettingsModal;