// components/merky/ControlBar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FaPlay, FaPause, FaStepForward, FaStepBackward, 
  FaVolumeUp, FaVolumeMute, FaSun, FaMoon, 
  FaImages, FaEllipsisH 
} from 'react-icons/fa';
import { Track } from '../constants/constants';
import OptionsMenu from '../menu/OptionsMenu';

/**
 * Props for the ControlBar component.
 */
interface ControlBarProps {
  currentTrack: Track;
  themeColor: string;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isDayMode: boolean;
  isVisible: boolean;
  onTogglePlay: () => void;
  onChangeTrack: (direction: 'next' | 'prev') => void;
  onToggleMode: () => void;
  onToggleSceneMenu: () => void;
  onOpenSettings: () => void;
  onOpenWelcome: () => void;
  onVolumeClick: () => void;
  onOpenInfo: () => void;
  onOpenDev: () => void;
}

/**
 * ControlBar component
 * 
 * Provides playback controls, track information, theme toggling, scene selection,
 * volume control, and access to additional options.
 */
const ControlBar: React.FC<ControlBarProps> = ({
  currentTrack,
  themeColor,
  isPlaying,
  progress,
  volume,
  isDayMode,
  isVisible,
  onTogglePlay,
  onChangeTrack,
  onToggleMode,
  onToggleSceneMenu,
  onOpenSettings,
  onOpenWelcome,
  onVolumeClick,
  onOpenInfo,
  onOpenDev
}) => {
  /**
   * -------------------------------
   * State Management
   * -------------------------------
   */
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const theme = themeColor || "#FF6B4A";

  /**
   * -------------------------------
   * UI Rendering
   * -------------------------------
   */
  return (
    <div 
      className={`w-full px-4 md:px-8 pb-6 transition-transform duration-500 flex justify-center z-50 ${isVisible ? 'translate-y-0' : 'translate-y-24'}`}
    >
      <div className="w-full max-w-[1200px] bg-[#121212]/90 backdrop-blur-md border border-white/10 rounded-xl py-2 px-4 shadow-2xl relative overflow-visible group flex items-center justify-between gap-2 md:gap-4">
          
          {/* ===============================
              Progress Bar
              Displays current playback progress.
              The bar color is set by the theme.
          =============================== */}
          <div className="absolute top-0 left-2 right-2 h-[2px] bg-white/5 cursor-pointer group-hover:h-[4px] transition-all rounded-full overflow-hidden">
             <div 
               className="h-full transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
               style={{ width: `${progress}%`, backgroundColor: theme }}
             ></div>
          </div>

          {/* ===============================
              Track Information Section
              Shows album cover, track title, and artist.
          =============================== */}
          <div className="flex items-center gap-3 flex-shrink-0 min-w-0 w-1/3">
              <div className="w-12 h-12 relative flex-shrink-0">
                  <Image
                    src={currentTrack.cover}
                    alt="Cover"
                    fill
                    className="object-cover"
                    sizes="48px"
                    priority
                  />
              </div>
              
              <div className="hidden sm:flex flex-col justify-center overflow-hidden">
                  <h3 className="text-white font-bold text-sm truncate">{currentTrack.title}</h3>
                  <p className="text-[10px] md:text-xs font-medium opacity-60 truncate" style={{ color: theme }}>
                    {currentTrack.artist}
                  </p>
              </div>
          </div>

          {/* ===============================
              Playback Controls
              Includes previous, play/pause, and next buttons.
          =============================== */}
          <div className="flex items-center justify-center gap-3 md:gap-5 flex-1">
              <button onClick={() => onChangeTrack('prev')} className="text-white/40 hover:text-white transition-colors hover:scale-110 active:scale-95">
                <FaStepBackward size={14}/>
              </button>
              
              <button 
                  onClick={onTogglePlay}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                  style={{ backgroundColor: theme, color: '#000' }}
              >
                  {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
              </button>
              
              <button onClick={() => onChangeTrack('next')} className="text-white/40 hover:text-white transition-colors hover:scale-110 active:scale-95">
                <FaStepForward size={14}/>
              </button>
          </div>

          {/* ===============================
              Utility Controls & Menus
              Includes theme toggle, scene selection, volume, and options menu.
          =============================== */}
          <div className="flex items-center justify-end gap-2 md:gap-4 flex-shrink-0 w-1/3 relative">
              
              {/* Theme Mode Toggle (Day/Night) */}
              <div onClick={onToggleMode} className="hidden md:flex items-center bg-black/30 rounded-full p-1 cursor-pointer border border-white/5 hover:border-white/20 transition-all">
                 <div className={`p-1 rounded-full transition-all ${isDayMode ? 'bg-white text-black' : 'text-gray-500'}`}><FaSun size={10} /></div>
                 <div className={`p-1 rounded-full transition-all ${!isDayMode ? 'bg-white text-black' : 'text-gray-500'}`}><FaMoon size={10} /></div>
              </div>

              {/* Scene Selection Menu */}
              <button 
                onClick={onToggleSceneMenu} 
                className="text-white/60 hover:text-white transition-colors hover:scale-110"
                title="Change Scene"
              >
                 <FaImages size={16} />
              </button>

              {/* Volume Control Button */}
              <button 
                onClick={onVolumeClick}
                className="hidden md:flex items-center justify-center text-white/60 hover:text-white transition-colors hover:scale-110 w-8 h-8"
                title="Volume Mixer"
              >
                  {volume === 0 ? <FaVolumeMute size={16}/> : <FaVolumeUp size={16}/>}
              </button>

              {/* Options Dropdown Menu */}
              <div className="relative">
                <OptionsMenu 
                  isOpen={isOptionsOpen} 
                  onClose={() => setIsOptionsOpen(false)}
                  onOpenSettings={onOpenSettings}
                  onOpenWelcome={onOpenWelcome}
                  onOpenInfo={onOpenInfo}
                  onOpenDev={onOpenDev}
                />
                
                <button 
                  onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                  className={`text-white/40 hover:text-white transition-colors ml-1 md:ml-2 ${isOptionsOpen ? 'text-white' : ''}`}
                >
                  <FaEllipsisH size={16} />
                </button>
              </div>

          </div>
      </div>
    </div>
  );
};

export default ControlBar;