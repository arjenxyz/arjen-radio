import React, { useEffect, useRef, useState } from 'react';
import {
  FaCog,
  FaCode,
  FaEllipsisH,
  FaVolumeUp,
  FaVolumeDown,
  FaSun,
  FaMoon,
  FaImages,
} from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';
import { ARJEN_COLORS } from '@/lib/branding';
import type { Scene } from '../constants/constants';
import type { AppSettings } from '../modal/SettingsModal';
import SceneImage from '../etc/SceneImage';

export type DockPanel = 'idle' | 'volume' | 'atmosphere' | 'settings';

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenVolume?: () => void;
  onOpenAtmosphere?: () => void;
  onToggleMode?: () => void;
  isDayMode?: boolean;
  variant?: 'dock' | 'popover';
  /** Dock content */
  masterVolume?: number;
  onMasterVolumeChange?: (value: number) => void;
  scenes?: Scene[];
  currentSceneIndex?: number;
  onSelectScene?: (index: number) => void;
  settings?: AppSettings;
  onUpdateSettings?: (settings: AppSettings) => void;
}

const DEVELOPER_URL = 'https://arjenofficial.com';

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  isDayMode = false,
  variant = 'popover',
  masterVolume = 0.8,
  onMasterVolumeChange,
  scenes = [],
  currentSceneIndex = 0,
  onSelectScene,
  settings,
  onUpdateSettings,
  onToggleMode,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const chrome = getChromeTheme(isDayMode);
  const isDock = variant === 'dock';
  const [panel, setPanel] = useState<DockPanel>('idle');

  // Desktop popover closes on outside click. Dock never auto-closes (only ✕).
  // Skip while the popover is not laid out (e.g. still mounted under md:hidden on mobile),
  // otherwise every tap would call onClose and dismiss the mobile dock.
  useEffect(() => {
    if (isDock || !isOpen) return;

    const handlePointerOutside = (event: Event) => {
      const el = menuRef.current;
      if (!el || el.getClientRects().length === 0) return;
      if (!el.contains(event.target as Node)) {
        onClose();
      }
    };

    // Defer so the opening click does not immediately dismiss
    const timer = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerOutside, true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', handlePointerOutside, true);
    };
  }, [isOpen, onClose, isDock]);

  if (isDock) {
    const actions: Array<{
      key: string;
      icon: React.ReactNode;
      label: string;
      active?: boolean;
      onClick: () => void;
    }> = [
      {
        key: 'volume',
        icon: <FaVolumeUp size={15} />,
        label: 'Volume',
        active: panel === 'volume',
        onClick: () => setPanel('volume'),
      },
      {
        key: 'atmosphere',
        icon: <FaImages size={15} />,
        label: 'Atmosphere',
        active: panel === 'atmosphere',
        onClick: () => setPanel('atmosphere'),
      },
      {
        key: 'mode',
        icon: isDayMode ? <FaMoon size={15} /> : <FaSun size={15} />,
        label: isDayMode ? 'Night' : 'Day',
        onClick: () => onToggleMode?.(),
      },
      {
        key: 'settings',
        icon: <FaCog size={15} />,
        label: 'Settings',
        active: panel === 'settings',
        onClick: () => setPanel('settings'),
      },
      {
        key: 'developer',
        icon: <FaCode size={15} />,
        label: 'Developer',
        onClick: () => {
          window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
        },
      },
    ];

    return (
      <div
        ref={menuRef}
        aria-hidden={!isOpen}
        className={`pointer-events-none absolute inset-x-0 bottom-full z-[90] origin-bottom overflow-hidden transition-[max-height,opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? 'max-h-[380px] translate-y-0 opacity-100'
            : 'max-h-0 translate-y-6 opacity-0'
        }`}
      >
        <div
          className={`pointer-events-auto mb-2 overflow-hidden rounded-xl border backdrop-blur-md ${chrome.panelSolid} ${
            isOpen ? 'options-dock-in' : ''
          }`}
        >
          {/* Inline panels — Now Playing lives in the top notification banner */}
          {(panel === 'volume' || panel === 'atmosphere' || panel === 'settings') && (
          <div className="px-3 pb-2 pt-3">
            {panel === 'volume' && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${chrome.muted}`}>
                    Volume
                  </span>
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: ARJEN_COLORS.accent }}
                  >
                    {Math.round(masterVolume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaVolumeDown className={`text-[11px] ${chrome.muted}`} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => onMasterVolumeChange?.(parseFloat(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20"
                    style={{ accentColor: ARJEN_COLORS.accent }}
                  />
                  <FaVolumeUp className={`text-[11px] ${chrome.muted}`} />
                </div>
              </div>
            )}

            {panel === 'atmosphere' && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
                <p className={`mb-2 px-1 text-[10px] font-bold uppercase tracking-widest ${chrome.muted}`}>
                  Atmosphere
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {scenes.map((scene, index) => {
                    const selected = index === currentSceneIndex;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => onSelectScene?.(index)}
                        className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border transition-all ${
                          selected
                            ? 'border-white scale-[1.02] opacity-100'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <SceneImage
                          src={scene.bgDay}
                          alt={scene.name}
                          themeColor={scene.themeColor}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <span className="absolute bottom-1.5 left-1.5 right-1.5 truncate text-left text-[10px] font-semibold text-white">
                          {scene.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {panel === 'settings' && settings && onUpdateSettings && (
              <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                {(
                  [
                    ['showTitles', 'Show Titles'],
                    ['showClock', 'Show Clock'],
                    ['hideElements', 'Auto Hide'],
                    ['shortcuts', 'Shortcuts'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ ...settings, [key]: !settings[key] })
                    }
                    className="flex w-full items-center justify-between gap-3"
                  >
                    <span className={`text-[13px] font-medium ${chrome.text}`}>{label}</span>
                    <span
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        settings[key] ? '' : isDayMode ? 'bg-neutral-300' : 'bg-zinc-600'
                      }`}
                      style={
                        settings[key] ? { backgroundColor: ARJEN_COLORS.accent } : undefined
                      }
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings[key] ? 'translate-x-[22px]' : 'translate-x-0.5'
                        }`}
                      />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          )}

          <div className={`flex items-center gap-2 px-4 py-2 ${panel !== 'idle' ? `border-t ${chrome.header}` : chrome.header}`}>
            <FaEllipsisH size={10} className={chrome.muted} />
            <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${chrome.muted}`}>
              Menu
            </span>
          </div>

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
                    action.active
                      ? isDayMode
                        ? 'text-neutral-950'
                        : 'text-white'
                      : isDayMode
                        ? 'text-neutral-500 hover:text-neutral-900'
                        : 'text-white/55 hover:text-white'
                  }`}
                  style={
                    isOpen ? { animationDelay: `${120 + index * 70}ms` } : undefined
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
