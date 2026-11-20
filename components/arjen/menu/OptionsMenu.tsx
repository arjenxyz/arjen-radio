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
    const actions = [
      onOpenVolume
        ? {
            key: 'volume',
            icon: <FaVolumeUp size={15} />,
            label: 'Volume',
            onClick: () => {
              onOpenVolume();
              onClose();
            },
          }
        : null,
      onOpenAtmosphere
        ? {
            key: 'atmosphere',
            icon: <FaImages size={15} />,
            label: 'Atmosphere',
            onClick: () => {
              onOpenAtmosphere();
              onClose();
            },
          }
        : null,
      onToggleMode
        ? {
            key: 'mode',
            icon: isDayMode ? <FaMoon size={15} /> : <FaSun size={15} />,
            label: isDayMode ? 'Night' : 'Day',
            onClick: () => onToggleMode(),
          }
        : null,
      {
        key: 'settings',
        icon: <FaCog size={15} />,
        label: 'Settings',
        onClick: () => {
          onOpenSettings();
          onClose();
        },
      },
      {
        key: 'developer',
        icon: <FaCode size={15} />,
        label: 'Developer',
        onClick: () => {
          window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
    ].filter(Boolean) as Array<{
      key: string;
      icon: React.ReactNode;
      label: string;
      onClick: () => void;
    }>;

    return (
      <div
        ref={menuRef}
        aria-hidden={!isOpen}
        className={`pointer-events-none absolute inset-x-0 bottom-full z-[90] origin-bottom overflow-hidden transition-[max-height,opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? 'max-h-28 translate-y-0 opacity-100'
            : 'max-h-0 translate-y-6 opacity-0'
        }`}
      >
        <div
          className={`pointer-events-auto mb-2 overflow-hidden rounded-xl border backdrop-blur-md ${chrome.panelSolid} ${
            isOpen ? 'options-dock-in' : ''
          }`}
        >
          <div className={`flex items-center gap-2 border-b px-4 py-2 ${chrome.header}`}>
            <FaEllipsisH size={10} className={chrome.muted} />
            <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${chrome.muted}`}>
              Menu
            </span>
          </div>

          {/* Horizontal flat row — no card tiles */}
          <div className="flex items-stretch justify-between gap-0 px-1 py-1.5">
            {actions.map((action, index) => (
              <React.Fragment key={action.key}>
                {index > 0 && (
                  <div className={`my-2 w-px shrink-0 ${chrome.divider}`} aria-hidden />
                )}
                <button
                  type="button"
                  onClick={action.onClick}
                  className={`options-dock-item group flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 px-1 py-2.5 transition-colors active:scale-95 ${
                    isDayMode
                      ? 'text-neutral-700 hover:text-neutral-950'
                      : 'text-white/75 hover:text-white'
                  }`}
                  style={
                    isOpen
                      ? { animationDelay: `${120 + index * 70}ms` }
                      : undefined
                  }
                >
                  <span className="text-base leading-none transition-transform duration-300 group-hover:-translate-y-0.5">
                    {action.icon}
                  </span>
                  <span className="max-w-full truncate text-[10px] font-medium tracking-wide">
                    {action.label}
                  </span>
                </button>
              </React.Fragment>
            ))}
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

export default OptionsMenu;
