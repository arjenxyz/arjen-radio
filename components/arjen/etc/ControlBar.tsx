// components/arjen/etc/ControlBar.tsx
import React, { useEffect, useState } from 'react';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaSun,
  FaMoon,
  FaImages,
  FaEllipsisH,
  FaTimes,
  FaBroadcastTower,
} from 'react-icons/fa';
import { RadioStation } from '@/lib/radio';
import { ARJEN_COLORS } from '@/lib/branding';
import { getChromeTheme } from '@/lib/chrome-theme';
import OptionsMenu from '../menu/OptionsMenu';
import type { Scene } from '../constants/constants';
import type { AppSettings } from '../modal/SettingsModal';

interface ControlBarProps {
  currentStation: RadioStation;
  themeColor: string;
  isPlaying: boolean;
  volume: number;
  isDayMode: boolean;
  isVisible: boolean;
  isOptionsOpen: boolean;
  onOptionsOpenChange: (open: boolean) => void;
  onTogglePlay: () => void;
  onChangeStation: (direction: 'next' | 'prev') => void;
  onToggleMode: () => void;
  onToggleSceneMenu: () => void;
  onToggleStationMenu: () => void;
  onOpenSettings: () => void;
  onVolumeClick: () => void;
  masterVolume: number;
  onMasterVolumeChange: (value: number) => void;
  scenes: Scene[];
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  currentStation,
  themeColor,
  isPlaying,
  volume,
  isDayMode,
  isVisible,
  isOptionsOpen,
  onOptionsOpenChange,
  onTogglePlay,
  onChangeStation,
  onToggleMode,
  onToggleSceneMenu,
  onToggleStationMenu,
  onOpenSettings,
  onVolumeClick,
  masterVolume,
  onMasterVolumeChange,
  scenes,
  currentSceneIndex,
  onSelectScene,
  settings,
  onUpdateSettings,
}) => {
  const theme = themeColor || ARJEN_COLORS.defaultTheme;
  const chrome = getChromeTheme(isDayMode);
  // Mount only one OptionsMenu — the hidden desktop popover was still
  // attaching document outside-click listeners and closing the mobile dock.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div
      className={`z-50 flex w-full justify-center px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] transition-transform duration-500 md:px-8 ${
        isVisible ? 'translate-y-0' : 'translate-y-24'
      }`}
    >
      <div data-control-dock className="relative w-full max-w-[1200px]">
        {!isDesktop && (
          <OptionsMenu
            key={isOptionsOpen ? 'dock-open' : 'dock-closed'}
            variant="dock"
            isOpen={isOptionsOpen}
            onClose={() => onOptionsOpenChange(false)}
            onOpenSettings={onOpenSettings}
            onToggleMode={onToggleMode}
            isDayMode={isDayMode}
            masterVolume={masterVolume}
            onMasterVolumeChange={onMasterVolumeChange}
            scenes={scenes}
            currentSceneIndex={currentSceneIndex}
            onSelectScene={onSelectScene}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        <div
          className={`relative flex w-full items-center justify-between gap-1 overflow-visible rounded-xl border px-2 py-2.5 backdrop-blur-md transition-all duration-300 sm:px-3 md:gap-4 md:px-4 md:py-2 ${chrome.panel}`}
        >
          <div className="flex min-w-0 shrink-0 basis-auto items-center gap-3 md:w-1/3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-black/20 md:h-12 md:w-12">
              <img
                src={currentStation.cover}
                alt="Station cover"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/covers/melodydance.gif';
                }}
              />
            </div>

            <div className="hidden min-w-0 flex-col justify-center overflow-hidden sm:flex">
              <h3 className={`truncate text-sm font-bold ${chrome.text}`}>
                {currentStation.title}
              </h3>
              <p
                className="truncate text-[10px] font-medium opacity-80 md:text-xs"
                style={{ color: theme }}
              >
                {currentStation.artist}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5 md:gap-5">
            <button
              onClick={() => onChangeStation('prev')}
              aria-label="Previous station"
              className={`flex h-11 w-10 shrink-0 items-center justify-center transition-colors hover:scale-110 active:scale-95 md:h-auto md:w-auto ${chrome.iconIdle}`}
            >
              <FaStepBackward size={14} />
            </button>

            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 md:h-10 md:w-10"
              style={{ backgroundColor: theme, color: '#fff' }}
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
            </button>

            <button
              onClick={() => onChangeStation('next')}
              aria-label="Next station"
              className={`flex h-11 w-10 shrink-0 items-center justify-center transition-colors hover:scale-110 active:scale-95 md:h-auto md:w-auto ${chrome.iconIdle}`}
            >
              <FaStepForward size={14} />
            </button>
          </div>

          <div className="relative flex shrink-0 items-center justify-end gap-0.5 md:w-1/3 md:gap-4">
            <button
              type="button"
              onClick={onToggleMode}
              aria-label={isDayMode ? 'Switch to night mode' : 'Switch to day mode'}
              className={`hidden items-center rounded-full border p-1 transition-all md:flex ${chrome.toggleTrack}`}
            >
              <div
                className={`rounded-full p-1 transition-all ${
                  isDayMode ? chrome.toggleActive : chrome.toggleIdle
                }`}
              >
                <FaSun size={10} />
              </div>
              <div
                className={`rounded-full p-1 transition-all ${
                  !isDayMode ? chrome.toggleActive : chrome.toggleIdle
                }`}
              >
                <FaMoon size={10} />
              </div>
            </button>

            <button
              onClick={onToggleStationMenu}
              aria-label="Change station"
              className={`flex h-11 w-10 shrink-0 items-center justify-center transition-colors active:scale-95 hover:scale-110 md:h-8 md:w-8 ${chrome.icon}`}
              title="Change Station"
            >
              <FaBroadcastTower size={16} />
            </button>

            <button
              onClick={onToggleSceneMenu}
              aria-label="Change scene"
              className={`hidden h-8 w-8 shrink-0 items-center justify-center transition-colors hover:scale-110 md:flex ${chrome.icon}`}
              title="Change Scene"
            >
              <FaImages size={16} />
            </button>

            <button
              onClick={onVolumeClick}
              aria-label="Volume"
              className={`hidden h-8 w-8 items-center justify-center transition-colors hover:scale-110 md:flex ${chrome.icon}`}
              title="Volume Mixer"
            >
              {volume === 0 ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
            </button>

            <div className="relative shrink-0">
              {isDesktop && (
                <OptionsMenu
                  variant="popover"
                  isOpen={isOptionsOpen}
                  onClose={() => onOptionsOpenChange(false)}
                  onOpenSettings={onOpenSettings}
                  isDayMode={isDayMode}
                />
              )}

              <button
                type="button"
                onClick={() => onOptionsOpenChange(!isOptionsOpen)}
                aria-label={isOptionsOpen ? 'Close menu' : 'More options'}
                aria-expanded={isOptionsOpen}
                className={`flex h-11 w-10 shrink-0 items-center justify-center transition-colors active:scale-95 md:h-8 md:w-8 ${
                  isOptionsOpen ? chrome.iconActive : chrome.icon
                }`}
                title={isOptionsOpen ? 'Close' : 'More'}
              >
                {isOptionsOpen ? <FaTimes size={15} /> : <FaEllipsisH size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
