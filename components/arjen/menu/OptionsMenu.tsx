import React, { useEffect, useRef } from 'react';
import {
  FaCog,
  FaCode,
  FaEllipsisH,
  FaVolumeUp,
  FaSun,
  FaMoon,
  FaImages,
} from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenVolume?: () => void;
  onOpenAtmosphere?: () => void;
  onToggleMode?: () => void;
  isDayMode?: boolean;
}

const DEVELOPER_URL = 'https://arjenofficial.com';

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenVolume,
  onOpenAtmosphere,
  onToggleMode,
  isDayMode = false,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const chrome = getChromeTheme(isDayMode);

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

  return (
    <div
      ref={menuRef}
      className={`z-[100] w-[200px] origin-bottom-right animate-fade-in overflow-hidden rounded-xl border ${chrome.panelSolid} fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] right-4 md:absolute md:bottom-14 md:right-0`}
    >
      <div className={`flex items-center gap-2 border-b px-3 py-2 ${chrome.header}`}>
        <FaEllipsisH size={10} className={chrome.muted} />
        <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${chrome.muted}`}>
          Menu
        </span>
      </div>

      <div className="p-1">
        <div className="space-y-0.5 md:hidden">
          {onOpenVolume && (
            <MenuItem
              icon={<FaVolumeUp size={12} />}
              label="Volume"
              isDayMode={isDayMode}
              onClick={() => {
                onOpenVolume();
                onClose();
              }}
            />
          )}

          {onOpenAtmosphere && (
            <MenuItem
              icon={<FaImages size={12} />}
              label="Atmosphere"
              isDayMode={isDayMode}
              onClick={() => {
                onOpenAtmosphere();
                onClose();
              }}
            />
          )}

          {onToggleMode && (
            <MenuItem
              icon={isDayMode ? <FaMoon size={12} /> : <FaSun size={12} />}
              label={isDayMode ? 'Night' : 'Day'}
              isDayMode={isDayMode}
              onClick={() => onToggleMode()}
            />
          )}

          <div className={`mx-2 my-1 h-px ${chrome.divider}`} />
        </div>

        <div className="space-y-0.5">
          <MenuItem
            icon={<FaCog size={12} />}
            label="Settings"
            isDayMode={isDayMode}
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
          />

          <MenuItem
            icon={<FaCode size={12} />}
            label="Developer"
            isDayMode={isDayMode}
            onClick={() => {
              window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isDayMode: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, isDayMode }) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors duration-150 active:scale-[0.98] ${
      isDayMode ? 'hover:bg-black/[0.06]' : 'hover:bg-white/[0.08]'
    }`}
  >
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
        isDayMode
          ? 'bg-black/[0.05] text-neutral-600 group-hover:text-neutral-900'
          : 'bg-white/10 text-white/80 group-hover:text-white'
      }`}
    >
      {icon}
    </div>
    <span
      className={`truncate text-[13px] font-medium ${
        isDayMode
          ? 'text-neutral-800 group-hover:text-neutral-950'
          : 'text-white/90 group-hover:text-white'
      }`}
    >
      {label}
    </span>
  </button>
);

export default OptionsMenu;
