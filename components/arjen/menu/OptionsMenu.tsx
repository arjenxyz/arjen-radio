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
      className={`absolute bottom-14 right-0 z-[60] w-52 origin-bottom-right overflow-hidden rounded-xl border backdrop-blur-xl animate-scale-in transition-colors duration-500 ${chrome.panelSolid}`}
    >
      <div className={`border-b px-3.5 py-2.5 ${chrome.header}`}>
        <div className={`flex items-center gap-2 ${chrome.muted}`}>
          <FaEllipsisH size={11} />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Menu</span>
        </div>
      </div>

      <div className="p-1.5">
        {/* Mobile controls: sound → scene → theme */}
        <div className="space-y-0.5 md:hidden">
          {onOpenVolume && (
            <MenuItem
              icon={<FaVolumeUp size={12} />}
              label="Volume"
              hint="Sound"
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
              hint="Scene"
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
              hint={isDayMode ? 'Dark UI' : 'Light UI'}
              isDayMode={isDayMode}
              onClick={() => onToggleMode()}
            />
          )}

          <div className={`mx-2 my-1.5 h-px ${chrome.divider}`} />
        </div>

        <div className="space-y-0.5">
          <MenuItem
            icon={<FaCog size={12} />}
            label="Settings"
            hint="Prefs"
            isDayMode={isDayMode}
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
          />

          <MenuItem
            icon={<FaCode size={12} />}
            label="Developer"
            hint="About"
            isDayMode={isDayMode}
            onClick={() => {
              window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
              onClose();
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .animate-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
  isDayMode: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, hint, onClick, isDayMode }) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors duration-150 active:scale-[0.98] ${
      isDayMode ? 'hover:bg-black/[0.06]' : 'hover:bg-white/[0.1]'
    }`}
  >
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
        isDayMode
          ? 'bg-black/[0.05] text-neutral-600 group-hover:text-neutral-900'
          : 'bg-white/10 text-white/80 group-hover:text-white'
      }`}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1 leading-tight">
      <span
        className={`block truncate text-[13px] font-semibold tracking-tight ${
          isDayMode
            ? 'text-neutral-800 group-hover:text-neutral-950'
            : 'text-white group-hover:text-white'
        }`}
      >
        {label}
      </span>
      <span
        className={`mt-0.5 block truncate text-[10px] tracking-wide ${
          isDayMode ? 'text-neutral-400' : 'text-white/55'
        }`}
      >
        {hint}
      </span>
    </div>
  </button>
);

export default OptionsMenu;
