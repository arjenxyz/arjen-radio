import React, { useEffect, useRef } from 'react';
import { FaCog, FaInfoCircle, FaHome, FaCode, FaEllipsisH } from 'react-icons/fa'; 

/**
 * Props for the OptionsMenu component.
 */
interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenWelcome: () => void;
  onOpenInfo: () => void;
  onOpenDev: () => void;
}

/**
 * =========================
 * OptionsMenu Component
 * =========================
 * 
 * Renders a contextual options menu with various actions.
 * Handles closing the menu when clicking outside its bounds.
 */
const OptionsMenu: React.FC<OptionsMenuProps> = ({ 
  isOpen, 
  onClose, 
  onOpenSettings, 
  onOpenWelcome, 
  onOpenInfo,
  onOpenDev 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * ---------------------------------
   * UI Logic: Outside Click Handling
   * ---------------------------------
   * 
   * Attaches a mouse event listener when the menu is open.
   * If a click occurs outside the menu container, triggers onClose.
   * Cleans up the event listener on unmount or when the menu closes.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /**
   * ---------------------
   * UI Layer: Menu Layout
   * ---------------------
   * 
   * Renders the menu container, header, grouped menu items, and animation styles.
   */
  return (
    <div 
      ref={menuRef}
      className="absolute bottom-14 right-0 w-56 bg-[#121212]/95 backdrop-blur-xl border border-[#333] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,1)] overflow-hidden z-[60] origin-bottom-right animate-scale-in"
    >
      {/* Menu Header */}
      <div className="px-4 py-3 border-b border-[#222] bg-[#161616]">
        <div className="flex items-center gap-2 text-gray-500">
            <FaEllipsisH size={12} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Menu</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2 space-y-1">
        {/* Group 1: Application Settings */}
        <div>
            <MenuItem 
                icon={<FaCog size={13} />} 
                label="Settings" 
                onClick={() => { onOpenSettings(); onClose(); }} 
            />
            <MenuItem 
                icon={<FaHome size={13} />} 
                label="Show Intro" 
                onClick={() => { onOpenWelcome(); onClose(); }} 
            />
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#222] my-1 mx-2"></div>

        {/* Group 2: Information */}
        <div>
            <MenuItem 
                icon={<FaCode size={13} />} 
                label="Developer" 
                onClick={() => { onOpenDev(); onClose(); }} 
            />
            <MenuItem 
                icon={<FaInfoCircle size={13} />} 
                label="About Radio" 
                onClick={() => { onOpenInfo(); onClose(); }} 
            />
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .animate-scale-in { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
};

/**
 * =========================
 * MenuItem Subcomponent
 * =========================
 * 
 * Renders a single menu item with an icon and label.
 * Handles click events for menu actions.
 */
interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="group w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 hover:bg-[#222] active:scale-95"
    >
        {/* Icon */}
        <div className="text-gray-500 group-hover:text-white transition-colors duration-200">
            {icon}
        </div>
        {/* Label */}
        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-100 transition-colors duration-200">
            {label}
        </span>
    </button>
);

export default OptionsMenu;