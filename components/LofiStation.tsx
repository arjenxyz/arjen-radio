// components/LofiStation.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

import Background from './arjen/background/Background';
import CenterOverlay from './arjen/etc/CenterOverlay';
import ControlBar from './arjen/etc/ControlBar';
import DigitalClock from './arjen/etc/DigitalClock';
import NowPlayingBanner from './arjen/etc/NowPlayingBanner';
import SceneMenu from './arjen/menu/SceneMenu';
import StationMenu from './arjen/menu/StationMenu';

import SettingsModal, { AppSettings } from './arjen/modal/SettingsModal';
import VolumeModal from './arjen/modal/VolumeModal';
import DeveloperRedirectNotice from './arjen/etc/DeveloperRedirectNotice';
import TravelModeNotice from './arjen/etc/TravelModeNotice';

import { SCENES, type Scene } from './arjen/constants/constants';
import { RadioStation } from '@/lib/radio';
import { ARJEN_AVATAR_SRC } from '@/lib/branding';
import {
  findBestStationIndexForCity,
  findNearestCity,
  loadTravelModeEnabled,
  saveTravelModeEnabled,
  type TurkeyCity,
} from '@/lib/travel-mode';

const FALLBACK_STATION: RadioStation = {
  uuid: 'fallback',
  title: 'Connecting...',
  artist: 'Arjen Radio',
  url: '',
  cover: ARJEN_AVATAR_SRC,
};

type PlayResult = 'played' | 'aborted' | 'failed';

function sameAudioUrl(a: string, b: string) {
  if (!a || !b) return false;
  if (a === b) return true;
  try {
    return new URL(a, window.location.href).href === new URL(b, window.location.href).href;
  } catch {
    return a.includes(b) || b.includes(a);
  }
}

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
  const [isDeveloperOpen, setIsDeveloperOpen] = useState(false);
  const [isTravelOpen, setIsTravelOpen] = useState(false);
  const [travelEnabled, setTravelEnabled] = useState(false);
  const [travelLocating, setTravelLocating] = useState(false);
  const [travelCity, setTravelCity] = useState<TurkeyCity | null>(null);
  const [travelCoords, setTravelCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [travelError, setTravelError] = useState<string | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [musicVolume, setMusicVolume] = useState(0.5);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantsToPlayRef = useRef(false);
  const failedStationIdsRef = useRef<Set<string>>(new Set());
  const stationsRef = useRef<RadioStation[]>([]);
  const catalogRef = useRef<RadioStation[]>([]);
  const stationIndexRef = useRef(0);
  /** Bumped on every play/station change so stale play() promises are ignored. */
  const playGenerationRef = useRef(0);
  /** Caps automatic skip chains so failed streams cannot loop setState forever. */
  const autoSkipBudgetRef = useRef(0);
  const [hasLoadedStations, setHasLoadedStations] = useState(false);
  const travelWatchIdRef = useRef<number | null>(null);
  const lastTravelCityIdRef = useRef<string | null>(null);

  const scenes: Scene[] = SCENES;
  const currentStation = stations.length > 0 ? stations[currentStationIndex] : FALLBACK_STATION;
  const currentScene = scenes[currentSceneIndex] ?? scenes[0];
  const effectiveVolume = musicVolume * masterVolume;
  const isPanelModalOpen =
    isSceneMenuOpen || isStationMenuOpen || isSettingsOpen || isVolumeOpen;

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

  useEffect(() => {
    stationIndexRef.current = currentStationIndex;
  }, [currentStationIndex]);

  const clearTravelWatch = useCallback(() => {
    if (travelWatchIdRef.current != null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(travelWatchIdRef.current);
      travelWatchIdRef.current = null;
    }
  }, []);

  const applyTravelCoords = useCallback((lat: number, lng: number) => {
    setTravelLocating(false);
    setTravelCoords({ lat, lng });

    const nearest = findNearestCity(lat, lng);
    setTravelError(null);
    setTravelCity(nearest.city);

    const sceneIndex = SCENES.findIndex((scene) => scene.id === nearest.city.sceneId);
    if (sceneIndex >= 0) {
      setCurrentSceneIndex(sceneIndex);
    }

    // Only retune when the city actually changes (route progress).
    if (lastTravelCityIdRef.current === nearest.city.id) return;
    lastTravelCityIdRef.current = nearest.city.id;

    const bestIndex = findBestStationIndexForCity(stationsRef.current, nearest.city);
    if (bestIndex >= 0 && bestIndex !== stationIndexRef.current) {
      setCurrentStationIndex(bestIndex);
      wantsToPlayRef.current = true;
    }
  }, []);

  const stopTravelMode = useCallback(() => {
    clearTravelWatch();
    saveTravelModeEnabled(false);
    setTravelEnabled(false);
    setTravelLocating(false);
    setTravelCity(null);
    setTravelCoords(null);
    setTravelError(null);
    lastTravelCityIdRef.current = null;
  }, [clearTravelWatch]);

  const startTravelMode = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setTravelError('Location is not available on this device.');
      return;
    }

    setTravelError(null);
    setTravelLocating(true);
    saveTravelModeEnabled(true);
    setTravelEnabled(true);

    const onFix = (position: GeolocationPosition) => {
      applyTravelCoords(position.coords.latitude, position.coords.longitude);
    };

    const onFail = (err: GeolocationPositionError) => {
      setTravelLocating(false);
      if (err.code === err.PERMISSION_DENIED) {
        saveTravelModeEnabled(false);
        setTravelEnabled(false);
        setTravelError('Location permission denied.');
        return;
      }
      setTravelError('GPS is slow or unavailable — retry from Travel.');
    };

    // Fast first fix (network/Wi‑Fi), then keep a low-cost watch while traveling.
    navigator.geolocation.getCurrentPosition(onFix, onFail, {
      enableHighAccuracy: false,
      maximumAge: 60_000,
      timeout: 8_000,
    });

    clearTravelWatch();
    travelWatchIdRef.current = navigator.geolocation.watchPosition(onFix, onFail, {
      enableHighAccuracy: false,
      maximumAge: 45_000,
      timeout: 15_000,
    });
  }, [applyTravelCoords, clearTravelWatch]);

  useEffect(() => {
    setTravelEnabled(loadTravelModeEnabled());
  }, []);

  useEffect(() => {
    if (!travelEnabled || stations.length === 0) return;
    if (travelWatchIdRef.current != null) return;
    startTravelMode();
    return () => clearTravelWatch();
  }, [travelEnabled, stations.length, startTravelMode, clearTravelWatch]);

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
          catalogRef.current = result.stations;
          stationsRef.current = result.stations;
          setStations(result.stations);
          setCurrentStationIndex(0);
          setHasLoadedStations(true);
          setLoadError(null);
          setShowControls(true);
        } else if (isMounted) {
          setLoadError('No stations available');
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
    const updateLayout = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      // Cover the full viewport so portrait/landscape never leave black bars.
      setScale(Math.max(width / 1920, height / 1080));
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('scroll', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('scroll', updateLayout);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = effectiveVolume;
  }, [effectiveVolume]);

  const findNextPlayableIndex = useCallback((startIndex: number, list: RadioStation[]) => {
    if (list.length === 0) return 0;

    for (let step = 1; step <= list.length; step += 1) {
      const index = (startIndex + step) % list.length;
      if (!failedStationIdsRef.current.has(list[index].uuid)) {
        return index;
      }
    }

    return Math.min(startIndex, list.length - 1);
  }, []);

  /** Drop a dead/unsupported stream from the playlist and jump to the next candidate. */
  const removeBrokenStation = useCallback(
    (failedUuid: string) => {
      if (!failedUuid) return;

      failedStationIdsRef.current.add(failedUuid);
      playGenerationRef.current += 1;

      const list = stationsRef.current;
      if (!list.some((station) => station.uuid === failedUuid)) return;

      const currentIdx = stationIndexRef.current;
      let filtered = list.filter((station) => station.uuid !== failedUuid);

      // Never wipe the playlist — rebuild from catalog if needed.
      if (filtered.length === 0) {
        const catalog = catalogRef.current;
        const remaining = catalog.filter(
          (station) => !failedStationIdsRef.current.has(station.uuid)
        );
        if (remaining.length > 0) {
          filtered = remaining;
        } else {
          // Exhausted every stream once — stop autoplay instead of looping.
          wantsToPlayRef.current = false;
          autoSkipBudgetRef.current = 0;
          const fallback = catalog.length > 0 ? catalog : list;
          stationsRef.current = fallback;
          stationIndexRef.current = 0;
          setStations(fallback);
          setCurrentStationIndex(0);
          setIsPlaying(false);
          return;
        }
      }

      // Keep the same station if a different one failed; otherwise advance.
      const current = list[currentIdx];
      let targetUuid =
        current && current.uuid !== failedUuid ? current.uuid : undefined;

      if (!targetUuid) {
        const nextIdx = findNextPlayableIndex(currentIdx, filtered);
        targetUuid = filtered[nextIdx]?.uuid ?? filtered[0]?.uuid;
      }

      const newIndex = Math.max(
        0,
        filtered.findIndex((station) => station.uuid === targetUuid)
      );

      // Avoid redundant updates that retrigger the playback effect.
      const sameList =
        filtered.length === list.length &&
        filtered.every((station, index) => station.uuid === list[index]?.uuid);
      if (sameList && newIndex === currentIdx) {
        wantsToPlayRef.current = false;
        setIsPlaying(false);
        return;
      }

      stationsRef.current = filtered;
      stationIndexRef.current = newIndex;
      setStations(filtered);
      setCurrentStationIndex(newIndex);
      wantsToPlayRef.current = true;
    },
    [findNextPlayableIndex]
  );

  const playCurrentStation = useCallback(async (): Promise<PlayResult> => {
    const audio = audioRef.current;
    const station = stationsRef.current[stationIndexRef.current];
    if (!audio || !station?.url) return 'failed';

    const generation = ++playGenerationRef.current;
    audio.volume = effectiveVolume;

    const loadedSrc = audio.currentSrc || audio.src;
    if (!sameAudioUrl(loadedSrc, station.url)) {
      // Pause first so an in-flight play() does not race the new load.
      audio.pause();
      audio.src = station.url;
      audio.load();
    }

    try {
      await audio.play();
      if (generation !== playGenerationRef.current) return 'aborted';
      setIsPlaying(true);
      return 'played';
    } catch (error) {
      if (generation !== playGenerationRef.current) return 'aborted';

      // Expected when station changes / load() interrupts a pending play().
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'aborted';
      }

      // Unsupported codec / empty source — treat as a dead station.
      if (error instanceof DOMException && error.name === 'NotSupportedError') {
        setIsPlaying(false);
        return 'failed';
      }

      console.error('Playback failed:', error);
      setIsPlaying(false);
      return 'failed';
    }
  }, [effectiveVolume]);

  const skipToNextStation = useCallback(async () => {
    const current = stationsRef.current[stationIndexRef.current];
    if (current) {
      removeBrokenStation(current.uuid);
      return;
    }

    const nextIndex = findNextPlayableIndex(stationIndexRef.current, stationsRef.current);
    if (nextIndex === stationIndexRef.current) return;

    wantsToPlayRef.current = true;
    setCurrentStationIndex(nextIndex);
  }, [findNextPlayableIndex, removeBrokenStation]);

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
    autoSkipBudgetRef.current = 0;
    const result = await playCurrentStation();
    if (result === 'failed') {
      await skipToNextStation();
    }
  }, [currentStation.url, isPlaying, playCurrentStation, skipToNextStation]);

  const changeStation = useCallback((direction: 'next' | 'prev') => {
    if (stations.length === 0) return;
    let newIndex = currentStationIndex + (direction === 'next' ? 1 : -1);

    if (newIndex >= stations.length) newIndex = 0;
    if (newIndex < 0) newIndex = stations.length - 1;

    autoSkipBudgetRef.current = 0;
    setCurrentStationIndex(newIndex);
    wantsToPlayRef.current = true;
  }, [currentStationIndex, stations.length]);

  const selectStation = useCallback((index: number) => {
    failedStationIdsRef.current.delete(stationsRef.current[index]?.uuid ?? '');
    autoSkipBudgetRef.current = 0;
    setCurrentStationIndex(index);
    wantsToPlayRef.current = true;
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
      if (
        appSettings.hideElements &&
        !isSceneMenuOpen &&
        !isStationMenuOpen &&
        !isSettingsOpen &&
        !isVolumeOpen &&
        !isOptionsOpen
      ) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, appSettings.hideTime * 1000);
      }
    };

    if (!appSettings.hideElements) setShowControls(true);
    else if (
      !isSceneMenuOpen &&
      !isStationMenuOpen &&
      !isSettingsOpen &&
      !isVolumeOpen &&
      !isOptionsOpen
    ) {
      handleMouseMove();
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [
    isSceneMenuOpen,
    isStationMenuOpen,
    isSettingsOpen,
    isVolumeOpen,
    isOptionsOpen,
    appSettings.hideElements,
    appSettings.hideTime,
  ]);

  useEffect(() => {
    if (!wantsToPlayRef.current || !currentStation.url) return;

    let cancelled = false;

    const startPlayback = async () => {
      const result = await playCurrentStation();
      if (cancelled) return;

      if (result === 'played') {
        autoSkipBudgetRef.current = 0;
        return;
      }

      // Only advance on real failures — AbortError means a newer load/play took over.
      if (result !== 'failed') return;

      const limit = Math.max(catalogRef.current.length, stationsRef.current.length, 1);
      autoSkipBudgetRef.current += 1;
      if (autoSkipBudgetRef.current > limit) {
        wantsToPlayRef.current = false;
        autoSkipBudgetRef.current = 0;
        setIsPlaying(false);
        return;
      }

      await skipToNextStation();
    };

    startPlayback();

    return () => {
      cancelled = true;
      playGenerationRef.current += 1;
    };
  }, [currentStationIndex, currentStation.url, playCurrentStation, skipToNextStation]);

  const handleAudioError = useCallback(() => {
    if (!wantsToPlayRef.current) return;

    const station = stationsRef.current[stationIndexRef.current];
    if (!station) return;

    const limit = Math.max(catalogRef.current.length, stationsRef.current.length, 1);
    autoSkipBudgetRef.current += 1;
    if (autoSkipBudgetRef.current > limit) {
      wantsToPlayRef.current = false;
      autoSkipBudgetRef.current = 0;
      setIsPlaying(false);
      return;
    }

    // Invalidate any in-flight play() so it resolves as aborted, not a second skip.
    playGenerationRef.current += 1;
    removeBrokenStation(station.uuid);
  }, [removeBrokenStation]);

  if (isLoading) {
    return (
      <div className="app-screen w-full bg-black flex flex-col items-center justify-center text-white space-y-4 z-[9999] select-none">
        <div className="w-12 h-12 border-4 border-arjen-accent/30 border-t-arjen-accent rounded-full animate-spin" />
        <p className="font-mono text-sm tracking-widest animate-pulse">
          TUNING LIVE STATIONS...
        </p>
      </div>
    );
  }

  if (!hasLoadedStations && (loadError || stations.length === 0)) {
    return (
      <div className="app-screen w-full bg-black flex flex-col items-center justify-center text-white space-y-4 z-[9999] select-none px-6 text-center">
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
      className="relative w-full app-screen overflow-hidden select-none font-sans text-white bg-black"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none md:hidden">
        <Background
          dayImage={currentScene.bgDay}
          nightImage={currentScene.bgNight}
          isDayMode={isDayMode}
        />
      </div>

      <div
        className="absolute top-1/2 left-1/2 origin-center pointer-events-none hidden md:block"
        style={{ width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <Background
          dayImage={currentScene.bgDay}
          nightImage={currentScene.bgNight}
          isDayMode={isDayMode}
        />
      </div>

      {appSettings.showClock && (
        <div
          className={`transition-[opacity,filter,transform] duration-500 ${
            isOptionsOpen
              ? 'pointer-events-none -translate-y-2 opacity-0 blur-[2px] md:opacity-40 md:blur-[2px]'
              : 'translate-y-0 opacity-100 blur-0'
          }`}
        >
          <DigitalClock isDayMode={isDayMode} />
        </div>
      )}

      {/* Top notification when mobile options menu is open */}
      <NowPlayingBanner
        station={currentStation}
        isDayMode={isDayMode}
        visible={isOptionsOpen}
      />

      {/* Frosted scene when options dock opens — close only via ✕ on the bar */}
      <div
        className={`pointer-events-none fixed inset-0 z-[45] transition-[opacity,backdrop-filter] duration-500 md:hidden ${
          isOptionsOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isDayMode ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.48)',
          backdropFilter: isOptionsOpen ? 'blur(18px) saturate(1.05)' : 'blur(0px)',
          WebkitBackdropFilter: isOptionsOpen ? 'blur(18px) saturate(1.05)' : 'blur(0px)',
        }}
        aria-hidden={!isOptionsOpen}
      />

      {isPanelModalOpen && (
        <div
          className={`fixed inset-0 z-[9998] min-h-[100dvh] w-full backdrop-blur-xl md:hidden ${
            isDayMode ? 'bg-white/25' : 'bg-black/30'
          }`}
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
        isDayMode={isDayMode}
      />

      <DeveloperRedirectNotice
        visible={isDeveloperOpen && !isTravelOpen}
        onCancel={() => setIsDeveloperOpen(false)}
        isDayMode={isDayMode}
      />

      <TravelModeNotice
        visible={isTravelOpen}
        enabled={travelEnabled}
        locating={travelLocating}
        cityName={travelCity?.name ?? null}
        coords={travelCoords}
        error={travelError}
        onAllow={startTravelMode}
        onDisable={stopTravelMode}
        onDismiss={() => setIsTravelOpen(false)}
        isDayMode={isDayMode}
      />

      <VolumeModal
        isOpen={isVolumeOpen}
        onClose={() => setIsVolumeOpen(false)}
        masterVolume={masterVolume}
        setMasterVolume={setMasterVolume}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        isDayMode={isDayMode}
      />

      <StationMenu
        stations={stations}
        currentStationIndex={currentStationIndex}
        isOpen={isStationMenuOpen}
        onSelectStation={selectStation}
        onClose={() => setIsStationMenuOpen(false)}
        isDayMode={isDayMode}
      />

      <SceneMenu
        scenes={scenes}
        currentSceneIndex={currentSceneIndex}
        isOpen={isSceneMenuOpen}
        onSelectScene={(index) => setCurrentSceneIndex(index)}
        onClose={() => setIsSceneMenuOpen(false)}
        isDayMode={isDayMode}
      />

      {appSettings.showTitles && (
        <div
          className={`absolute inset-0 z-40 flex items-center justify-center pointer-events-none transition-[opacity,filter] duration-500 ${
            isOptionsOpen ? 'opacity-35 blur-[3px]' : 'opacity-100 blur-0'
          }`}
        >
          <CenterOverlay
            isPlaying={isPlaying}
            isVisible={true}
            onTogglePlay={togglePlay}
            isDayMode={isDayMode}
          />
        </div>
      )}

      <div
        className={`absolute inset-0 z-50 transition-opacity duration-700 pointer-events-none ${
          showControls || isSceneMenuOpen || isStationMenuOpen || isSettingsOpen || isVolumeOpen || isOptionsOpen
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isSceneMenuOpen || isStationMenuOpen || isVolumeOpen
              ? 'pointer-events-auto'
              : 'pointer-events-none'
          }`}
          onClick={(e) => {
            if (isSceneMenuOpen && e.target === e.currentTarget) setIsSceneMenuOpen(false);
            if (isStationMenuOpen && e.target === e.currentTarget) setIsStationMenuOpen(false);
            if (isVolumeOpen && !((e.target as Element).closest('.volume-modal'))) setIsVolumeOpen(false);
          }}
        >
          {/* Options dock stays open until ✕ — no full-screen dismiss hit target */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-auto">
            <ControlBar
              currentStation={currentStation}
              themeColor={currentScene.themeColor}
              isPlaying={isPlaying}
              volume={masterVolume > 0 ? musicVolume : 0}
              isDayMode={isDayMode}
              isVisible={showControls || isSceneMenuOpen || isStationMenuOpen || isSettingsOpen || isVolumeOpen || isOptionsOpen}
              isOptionsOpen={isOptionsOpen}
              onOptionsOpenChange={(open) => {
                // Mobile dock: only the bar ✕/⋯ button toggles; ignore accidental closes elsewhere
                setIsOptionsOpen(open);
              }}
              onTogglePlay={togglePlay}
              onChangeStation={changeStation}
              onToggleMode={() => setIsDayMode(!isDayMode)}
              onToggleSceneMenu={() => setIsSceneMenuOpen(!isSceneMenuOpen)}
              onToggleStationMenu={() => setIsStationMenuOpen(!isStationMenuOpen)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenAtmosphere={() => setIsSceneMenuOpen(true)}
              onOpenDeveloper={() => {
                setIsTravelOpen(false);
                setIsDeveloperOpen(true);
              }}
              onOpenTravel={() => {
                setIsDeveloperOpen(false);
                setIsTravelOpen(true);
              }}
              isTravelActive={travelEnabled}
              onVolumeClick={() => setIsVolumeOpen(!isVolumeOpen)}
              masterVolume={masterVolume}
              onMasterVolumeChange={setMasterVolume}
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
