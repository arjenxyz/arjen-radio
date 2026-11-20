'use client';

import React, { useEffect, useState } from 'react';
import { getChromeTheme } from '@/lib/chrome-theme';
import { t, type LocaleCode } from '@/lib/locale';
import TravelMap from './TravelMap';

export interface TravelDockPanelProps {
  enabled: boolean;
  locating: boolean;
  cityName: string | null;
  regionName: string | null;
  tripCities: string[];
  coords: { lat: number; lng: number; accuracyM?: number | null } | null;
  error: string | null;
  onAllow: () => void;
  onDisable: () => void;
  isDayMode?: boolean;
  locale?: LocaleCode;
  /** When false, idle hero pauses (panel closed). */
  active?: boolean;
}

type CarPhase = 'enter' | 'cruise';

/** Horizon strip: endless road, car rushes in then holds mid-frame while road scrolls. */
const TravelIdleHero: React.FC<{ isDayMode: boolean; accent: string; active: boolean }> = ({
  isDayMode,
  accent,
  active,
}) => {
  const [carPhase, setCarPhase] = useState<CarPhase>('enter');

  useEffect(() => {
    if (!active) {
      setCarPhase('enter');
      return;
    }
    setCarPhase('enter');
    const id = window.setTimeout(() => setCarPhase('cruise'), 900);
    return () => window.clearTimeout(id);
  }, [active]);

  const sky = isDayMode
    ? 'linear-gradient(180deg, #9eb6d8 0%, #c5d4ea 48%, #dfe7f4 72%, #c8d2e0 100%)'
    : 'linear-gradient(180deg, #0a1018 0%, #152033 46%, #1a2433 70%, #121820 100%)';
  const road = isDayMode ? '#3a4454' : '#1c222c';
  const shoulder = isDayMode ? '#6b7588' : '#2a313c';
  const dash = isDayMode ? 'rgba(255,255,255,0.75)' : 'rgba(255,230,160,0.7)';
  const bird = isDayMode ? 'rgba(40,55,80,0.55)' : 'rgba(255,255,255,0.55)';

  return (
    <div className="relative h-[88px] w-full overflow-hidden" style={{ background: sky }}>
      <div
        className="pointer-events-none absolute left-1/2 top-[46%] h-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{ background: accent, opacity: isDayMode ? 0.35 : 0.22 }}
      />

      <div
        className="absolute inset-x-0 top-[52%] h-px"
        style={{ background: isDayMode ? 'rgba(60,80,110,0.25)' : 'rgba(255,255,255,0.12)' }}
      />

      <svg
        className="pointer-events-none absolute animate-travel-bird-far"
        style={{ top: 8, left: 0 }}
        width="28"
        height="10"
        viewBox="0 0 28 10"
        aria-hidden
      >
        <g fill="none" stroke={bird} strokeWidth="1" strokeLinecap="round" opacity="0.45">
          <path d="M2 6 q4 -3.5 8 0" />
          <path d="M10 6 q4 -3.5 8 0" />
        </g>
      </svg>

      <svg
        className="pointer-events-none absolute animate-travel-bird-mid"
        style={{ top: 20, left: 0 }}
        width="32"
        height="12"
        viewBox="0 0 32 12"
        aria-hidden
      >
        <g fill="none" stroke={bird} strokeWidth="1.15" strokeLinecap="round" opacity="0.65">
          <path d="M2 7 q5 -4 10 0" />
          <path d="M12 7 q5 -4 10 0" />
        </g>
      </svg>

      <svg
        className="pointer-events-none absolute animate-travel-bird-near"
        style={{ top: 34, left: 0 }}
        width="40"
        height="14"
        viewBox="0 0 40 14"
        aria-hidden
      >
        <g fill="none" stroke={bird} strokeWidth="1.45" strokeLinecap="round" opacity="0.9">
          <path d="M2 8 q6 -5 12 0" />
          <path d="M14 8 q6 -5 12 0" />
        </g>
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-[34px]" style={{ background: road }}>
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: shoulder }} />
        <div className="absolute left-0 top-1/2 w-[200%] -translate-y-1/2 overflow-hidden">
          <div
            className="h-[2px] w-full animate-travel-road"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${dash} 0 16px, transparent 16px 34px)`,
            }}
          />
        </div>

        <div
          className={`absolute bottom-[7px] ${
            carPhase === 'enter' ? 'animate-travel-car-enter' : 'animate-travel-car-cruise'
          }`}
        >
          <svg width="28" height="12" viewBox="0 0 28 12" aria-hidden>
            <rect x="3" y="4" width="20" height="5" rx="1.5" fill={accent} />
            <path d="M8 4 L11 1.2 H17 L20 4 Z" fill={accent} opacity="0.9" />
            <rect
              x="11.5"
              y="1.6"
              width="5"
              height="2.2"
              rx="0.4"
              fill={isDayMode ? '#dce6f5' : '#0d1420'}
              opacity="0.85"
            />
            <circle cx="8" cy="9.5" r="2" fill="#1a1a1a" />
            <circle cx="8" cy="9.5" r="0.8" fill="#666" />
            <circle cx="19" cy="9.5" r="2" fill="#1a1a1a" />
            <circle cx="19" cy="9.5" r="0.8" fill="#666" />
            <rect x="22.5" y="5" width="2" height="1.4" rx="0.3" fill="#ffe08a" opacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const TRAVEL_DOCK_STYLES = `
  @keyframes travelRoadScroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .animate-travel-road {
    animation: travelRoadScroll 2.6s linear infinite;
  }

  @keyframes travelCarEnter {
    0% { left: -16%; }
    100% { left: 42%; }
  }
  .animate-travel-car-enter {
    animation: travelCarEnter 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes travelCarCruise {
    0%, 100% { left: 42%; transform: translateY(0); }
    50% { left: 44%; transform: translateY(-0.5px); }
  }
  .animate-travel-car-cruise {
    animation: travelCarCruise 2.8s ease-in-out infinite;
  }

  @keyframes travelFly {
    0% { transform: translateX(-12vw); opacity: 0; }
    8% { opacity: 1; }
    92% { opacity: 1; }
    100% { transform: translateX(108vw); opacity: 0; }
  }
  .animate-travel-bird-far {
    animation: travelFly 22s linear infinite;
    animation-delay: 1.5s;
  }
  .animate-travel-bird-mid {
    animation: travelFly 14s linear infinite;
    animation-delay: 4s;
  }
  .animate-travel-bird-near {
    animation: travelFly 7.5s linear infinite;
    animation-delay: 0.4s;
  }
`;

/** Inline Travel panel for the options dock (same pattern as Volume). */
export const TravelDockPanel: React.FC<TravelDockPanelProps> = ({
  enabled,
  locating,
  cityName,
  regionName,
  tripCities,
  coords,
  error,
  onAllow,
  onDisable,
  isDayMode = false,
  locale = 'en',
  active = true,
}) => {
  const chrome = getChromeTheme(isDayMode);

  const title =
    locating && !cityName
      ? t(locale, 'travelLocating')
      : cityName
        ? cityName
        : t(locale, 'travelIdleTitle');

  const showLiveMap = enabled && Boolean(coords);
  const showIdleHero = !showLiveMap;

  return (
    <div className={chrome.header}>
      <div className="relative overflow-hidden">
        {showLiveMap && coords ? (
          <TravelMap
            lat={coords.lat}
            lng={coords.lng}
            accuracyM={coords.accuracyM ?? null}
            className="h-[88px] w-full"
          />
        ) : (
          <TravelIdleHero
            isDayMode={isDayMode}
            accent={chrome.accentOnPanel}
            active={active && showIdleHero}
          />
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-7"
          style={{
            background: `linear-gradient(to top, ${chrome.panelBg}, transparent)`,
          }}
        />
      </div>

      <div className="space-y-2.5 px-4 pb-3 pt-2">
        <div className="min-w-0">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: chrome.accentOnPanel }}
          >
            {t(locale, 'travel')}
          </p>
          <p className={`mt-0.5 truncate text-[16px] font-semibold tracking-tight ${chrome.text}`}>
            {title}
            {regionName && cityName ? (
              <span className={`font-medium ${chrome.muted}`}> · {regionName}</span>
            ) : null}
          </p>
        </div>

        {enabled && tripCities.length > 1 && (
          <p
            className={`truncate text-[11px] leading-relaxed tracking-wide ${chrome.faint}`}
            title={tripCities.join(' → ')}
          >
            {tripCities.join(' → ')}
          </p>
        )}

        {!enabled && (
          <p className={`text-[12px] leading-relaxed ${chrome.soft}`}>
            {t(locale, 'travelIntro')}
          </p>
        )}

        {error && <p className={`text-[12px] ${chrome.soft}`}>{error}</p>}

        {enabled ? (
          <button
            type="button"
            onClick={onDisable}
            className={`w-full rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors active:scale-[0.98] ${chrome.border} ${chrome.text}`}
          >
            {t(locale, 'travelTurnOff')}
          </button>
        ) : (
          <button
            type="button"
            onClick={onAllow}
            className="w-full rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white transition-opacity active:scale-[0.98] hover:opacity-90"
            style={{ backgroundColor: chrome.accentOnPanel }}
          >
            {t(locale, 'travelAllow')}
          </button>
        )}

        <p className={`text-center text-[10px] font-medium leading-snug ${chrome.faint}`}>
          {t(locale, 'travelDisclaimer')}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: TRAVEL_DOCK_STYLES }} />
    </div>
  );
};

export default TravelDockPanel;
