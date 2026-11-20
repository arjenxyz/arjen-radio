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
  /** Mobile dock sheet that expands from the control bar */
  variant?: 'dock' | 'popover';
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
  variant = 'popover',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const chrome = getChromeTheme(isDayMode);
  const isDock = variant === 'dock';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Dock variant: ignore clicks on the control dock (⋯ lives there)
        if (isDock) {
          const dock = (event.target as Element | null)?.closest?.('[data-control-dock]');
          if (dock) return;
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isDock]);

  if (isDock) {
    return (
      <div
        ref={menuRef}
        aria-hidden={!isOpen}
        className={`pointer-events-none absolute inset-x-0 bottom-full z-[90] origin-bottom overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? 'max-h-[320px] translate-y-0 opacity-100'
            : 'max-h-0 translate-y-3 opacity-0'
        }`}
      >
        <div
          className={`pointer-events-auto mb-2 overflow-hidden rounded-xl border backdrop-blur-md ${chrome.panelSolid} ${
            isOpen ? 'options-dock-in' : ''
          }`}
        >
          <div className={`flex items-center justify-between border-b px-4 py-2.5 ${chrome.header}`}>
            <div className={`flex items-center gap-2 ${chrome.muted}`}>
              <FaEllipsisH size={10} />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]">Menu</span>
            </div>
            <span className={`text-[10px] font-mono ${chrome.faint}`}>swipe · tap</span>
          </div>

          <div className="grid grid-cols-2 gap-1 p-2 sm:grid-cols-3">
            {onOpenVolume && (
              <MenuTile
                icon={<FaVolumeUp size={14} />}
                label="Volume"
                isDayMode={isDayMode}
                onClick={() => {
                  onOpenVolume();
                  onClose();
                }}
              />
            )}
            {onOpenAtmosphere && (
              <MenuTile
                icon={<FaImages size={14} />}
                label="Atmosphere"
                isDayMode={isDayMode}
                onClick={() => {
                  onOpenAtmosphere();
                  onClose();
                }}
              />
            )}
            {onToggleMode && (
              <MenuTile
                icon={isDayMode ? <FaMoon size={14} /> : <FaSun size={14} />}
                label={isDayMode ? 'Night' : 'Day'}
                isDayMode={isDayMode}
                onClick={() => onToggleMode()}
              />
            )}
            <MenuTile
              icon={<FaCog size={14} />}
              label="Settings"
              isDayMode={isDayMode}
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
            />
            <MenuTile
              icon={<FaCode size={14} />}
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
  }

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute bottom-14 right-0 z-[100] w-52 origin-bottom-right overflow-hidden rounded-xl border animate-fade-in ${chrome.panelSolid}`}
    >
      <div className={`flex items-center gap-2 border-b px-3 py-2 ${chrome.header}`}>
        <FaEllipsisH size={10} className={chrome.muted} />
        <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${chrome.muted}`}>
          Menu
        </span>
      </div>

      <div className="space-y-0.5 p-1">
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

const MenuTile: React.FC<MenuItemProps> = ({ icon, label, onClick, isDayMode }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 transition-all duration-200 active:scale-95 ${
      isDayMode
        ? 'bg-black/[0.04] text-neutral-800 hover:bg-black/[0.08]'
        : 'bg-white/[0.06] text-white/90 hover:bg-white/[0.1]'
    }`}
  >
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
        isDayMode ? 'bg-black/[0.06] text-neutral-700' : 'bg-white/10 text-white'
      }`}
    >
      {icon}
    </div>
    <span className="text-[11px] font-medium tracking-wide">{label}</span>
  </button>
);

export default OptionsMenu;
