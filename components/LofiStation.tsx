// components/LofiStation.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

import Background from './arjen/background/Background';
import CenterOverlay from './arjen/etc/CenterOverlay';
import ControlBar from './arjen/etc/ControlBar';
import DigitalClock from './arjen/etc/DigitalClock';
import SceneMenu from './arjen/menu/SceneMenu';
import StationMenu from './arjen/menu/StationMenu';

import SettingsModal, { AppSettings } from './arjen/modal/SettingsModal';
import VolumeModal from './arjen/modal/VolumeModal';

import { SCENES, type Scene } from './arjen/constants/constants';
import { RadioStation } from '@/lib/radio';
import { ARJEN_AVATAR_SRC } from '@/lib/branding';

const FALLBACK_STATION: RadioStation = {
  uuid: 'fallback',
  title: 'Connecting...',
  artist: 'Arjen Radio',
  url: '',
  cover: ARJEN_AVATAR_SRC,
};

export default function LofiStation() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDayMode, setIsDayMode] = useState(false);

  const [appSettings, setAppSettings] = useState<AppSettings>({
    hideElements: true,
    showTitles: true,
    showClock: true,
    shortcuts: true,
    hideTime: 5,
  });
  const [showControls, setShowControls] = useState(() => !appSettings.hideElements);
  const [scale, setScale] = useState(1);

  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false);
  const [isStationMenuOpen, setIsStationMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [musicVolume, setMusicVolume] = useState(0.5);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantsToPlayRef = useRef(false);
  const failedStationIdsRef = useRef<Set<string>>(new Set());
  const stationsRef = useRef<RadioStation[]>([]);
  const stationIndexRef = useRef(0);

  const scenes: Scene[] = SCENES;
  const currentStation = stations.length > 0 ? stations[currentStationIndex] : FALLBACK_STATION;
  const currentScene = scenes[currentSceneIndex] ?? scenes[0];
  const effectiveVolume = musicVolume * masterVolume;
  const isAnyModalOpen = isSceneMenuOpen || isStationMenuOpen || isSettingsOpen || isVolumeOpen;

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

  useEffect(() => {
    stationIndexRef.current = currentStationIndex;
  }, [currentStationIndex]);

  useEffect(() => {
    let isMounted = true;

    async function initData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await fetch('/api/radio', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'API Failed');

        if (isMounted && result.stations?.length) {
          setStations(result.stations);
          setCurrentStationIndex(0);
          setShowControls(true);
        }
      } catch (error) {
        console.error('Radio Fetch Error:', error);
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load stations');
        }
      } finally {
        if (isMounted) {
          setTimeout(() => setIsLoading(false), 1500);
        }
      }
    }

    initData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const targetRatio = 1920 / 1080;
      const newScale = (width / height > targetRatio) ? width / 1920 : height / 1080;
      setScale(newScale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = effectiveVolume;
  }, [effectiveVolume]);

  const findNextPlayableIndex = useCallback((startIndex: number) => {
    const list = stationsRef.current;
    if (list.length === 0) return startIndex;

    for (let step = 1; step <= list.length; step += 1) {
      const index = (startIndex + step) % list.length;
      if (!failedStationIdsRef.current.has(list[index].uuid)) {
        return index;
      }
    }

    return startIndex;
  }, []);

  const playCurrentStation = useCallback(async () => {
    const audio = audioRef.current;
    const station = stationsRef.current[stationIndexRef.current];
    if (!audio || !station?.url) return false;

    audio.volume = effectiveVolume;
    if (audio.src !== station.url) {
      audio.src = station.url;
      audio.load();
    }

    try {
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch (error) {
      console.error('Playback failed:', error);
      setIsPlaying(false);
      return false;
    }
  }, [effectiveVolume]);

  const skipToNextStation = useCallback(async () => {
    const current = stationsRef.current[stationIndexRef.current];
    if (current) failedStationIdsRef.current.add(current.uuid);

    const nextIndex = findNextPlayableIndex(stationIndexRef.current);
    if (nextIndex === stationIndexRef.current) return;

    wantsToPlayRef.current = true;
    setCurrentStationIndex(nextIndex);
  }, [findNextPlayableIndex]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!currentStation.url || !audio) return;

    if (isPlaying) {
      wantsToPlayRef.current = false;
      audio.pause();
      setIsPlaying(false);
      return;
    }

    wantsToPlayRef.current = true;
    const played = await playCurrentStation();
    if (!played) {
      await skipToNextStation();
    }
  }, [currentStation.url, isPlaying, playCurrentStation, skipToNextStation]);

  const changeStation = useCallback((direction: 'next' | 'prev') => {
    if (stations.length === 0) return;
    let newIndex = currentStationIndex + (direction === 'next' ? 1 : -1);

    if (newIndex >= stations.length) newIndex = 0;
    if (newIndex < 0) newIndex = stations.length - 1;

    setCurrentStationIndex(newIndex);
    wantsToPlayRef.current = true;
  }, [currentStationIndex, stations.length]);

  const selectStation = useCallback((index: number) => {
    failedStationIdsRef.current.delete(stationsRef.current[index]?.uuid ?? '');
    setCurrentStationIndex(index);
    wantsToPlayRef.current = true;
    setIsStationMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!appSettings.shortcuts) return;
      if (isSettingsOpen || isVolumeOpen || isStationMenuOpen) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'KeyM') {
        setMasterVolume((prev) => (prev === 0 ? 0.8 : 0));
      }
      if (e.code === 'ArrowRight') {
        changeStation('next');
      }
      if (e.code === 'ArrowLeft') {
        changeStation('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appSettings.shortcuts, isSettingsOpen, isVolumeOpen, isStationMenuOpen, togglePlay, changeStation]);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (appSettings.hideElements && !isSceneMenuOpen && !isStationMenuOpen && !isSettingsOpen && !isVolumeOpen) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, appSettings.hideTime * 1000);
      }
    };

    if (!appSettings.hideElements) setShowControls(true);
    else if (!isSceneMenuOpen && !isStationMenuOpen && !isSettingsOpen && !isVolumeOpen) handleMouseMove();

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isSceneMenuOpen, isStationMenuOpen, isSettingsOpen, isVolumeOpen, appSettings.hideElements, appSettings.hideTime]);

  useEffect(() => {
    if (!wantsToPlayRef.current || !currentStation.url) return;

    let cancelled = false;

    const startPlayback = async () => {
      const played = await playCurrentStation();
      if (!cancelled && !played) {
        await skipToNextStation();
      }
    };

    startPlayback();

    return () => {
      cancelled = true;
    };
  }, [currentStationIndex, currentStation.url, playCurrentStation, skipToNextStation]);

  const handleAudioError = useCallback(() => {
    if (wantsToPlayRef.current) {
      skipToNextStation();
    }
  }, [skipToNextStation]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white space-y-4 z-[9999] select-none">
        <div className="w-12 h-12 border-4 border-arjen-accent/30 border-t-arjen-accent rounded-full animate-spin" />
        <p className="font-mono text-sm tracking-widest animate-pulse">
          TUNING LIVE STATIONS...
        </p>
      </div>
    );
  }

  if (loadError || stations.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white space-y-4 z-[9999] select-none px-6 text-center">
        <p className="font-mono text-sm text-arjen-accent-light">Could not load radio stations</p>
        <p className="text-xs text-gray-500">{loadError ?? 'No stations available'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded-lg bg-arjen-accent text-white text-sm font-bold hover:bg-arjen-accent-light transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none font-sans text-white bg-black"
      style={{ backgroundColor: '#000000' }}
    >
      <div
        className="absolute top-1/2 left-1/2 origin-center pointer-events-none"
        style={{ width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <Background
          dayImage={currentScene.bgDay}
          nightImage={currentScene.bgNight}
          isDayMode={isDayMode}
        />
      </div>

      {appSettings.showClock && <DigitalClock />}

      {isAnyModalOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-xl md:hidden"
          style={{ WebkitBackdropFilter: 'blur(20px)', backdropFilter: 'blur(20px)' }}
          onPointerDown={() => {
            setIsSceneMenuOpen(false);
            setIsStationMenuOpen(false);
            setIsSettingsOpen(false);
            setIsVolumeOpen(false);
          }}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={appSettings}
        onUpdateSettings={setAppSettings}
      />

      <VolumeModal
        isOpen={isVolumeOpen}
        onClose={() => setIsVolumeOpen(false)}
        masterVolume={masterVolume}
        setMasterVolume={setMasterVolume}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
      />

      <StationMenu
        stations={stations}
        currentStationIndex={currentStationIndex}
        isOpen={isStationMenuOpen}
        onSelectStation={selectStation}
        onClose={() => setIsStationMenuOpen(false)}
      />

      <SceneMenu
        scenes={scenes}
        currentSceneIndex={currentSceneIndex}
        isOpen={isSceneMenuOpen}
        onSelectScene={(index) => setCurrentSceneIndex(index)}
        onClose={() => setIsSceneMenuOpen(false)}
      />

      {appSettings.showTitles && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <CenterOverlay
            isPlaying={isPlaying}
            isVisible={true}
            onTogglePlay={togglePlay}
          />
        </div>
      )}

      <div className={`absolute inset-0 z-50 transition-opacity duration-700 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
        <div
          className={`absolute inset-0 ${isSceneMenuOpen || isStationMenuOpen || isVolumeOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          onClick={(e) => {
            if (isSceneMenuOpen && e.target === e.currentTarget) setIsSceneMenuOpen(false);
            if (isStationMenuOpen && e.target === e.currentTarget) setIsStationMenuOpen(false);
            if (isVolumeOpen && !((e.target as Element).closest('.volume-modal'))) setIsVolumeOpen(false);
          }}
        >
          <div className="absolute bottom-0 left-0 w-full pointer-events-auto">
            <ControlBar
              currentStation={currentStation}
              themeColor={currentScene.themeColor}
              isPlaying={isPlaying}
              volume={masterVolume > 0 ? musicVolume : 0}
              isDayMode={isDayMode}
              isVisible={showControls || isSceneMenuOpen || isStationMenuOpen || isSettingsOpen || isVolumeOpen}
              onTogglePlay={togglePlay}
              onChangeStation={changeStation}
              onToggleMode={() => setIsDayMode(!isDayMode)}
              onToggleSceneMenu={() => setIsSceneMenuOpen(!isSceneMenuOpen)}
              onToggleStationMenu={() => setIsStationMenuOpen(!isStationMenuOpen)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onVolumeClick={() => setIsVolumeOpen(!isVolumeOpen)}
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="none"
        onError={handleAudioError}
      />
    </div>
  );
}
