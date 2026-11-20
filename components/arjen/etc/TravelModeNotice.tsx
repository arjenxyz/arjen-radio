'use client';

import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';
import { t, type LocaleCode } from '@/lib/locale';
import TravelMap from './TravelMap';

interface TravelModeNoticeProps {
  visible: boolean;
  enabled: boolean;
  locating: boolean;
  cityName: string | null;
  regionName: string | null;
  tripCities: string[];
  coords: { lat: number; lng: number; accuracyM?: number | null } | null;
  error: string | null;
  onAllow: () => void;
  onDisable: () => void;
  onDismiss: () => void;
  isDayMode?: boolean;
  locale?: LocaleCode;
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
  const plane = isDayMode ? 'rgba(50,65,95,0.65)' : 'rgba(220,230,245,0.7)';

  return (
    <div className="relative h-[96px] w-full overflow-hidden" style={{ background: sky }}>
      <div
        className="pointer-events-none absolute left-1/2 top-[46%] h-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{ background: accent, opacity: isDayMode ? 0.35 : 0.22 }}
      />

      <div
        className="absolute inset-x-0 top-[52%] h-px"
        style={{ background: isDayMode ? 'rgba(60,80,110,0.25)' : 'rgba(255,255,255,0.12)' }}
      />

      {/* Distant slow plane (high) */}
      <div
        className="pointer-events-none absolute animate-travel-plane-far"
        style={{ top: 6, left: 0 }}
      >
        <svg width="22" height="10" viewBox="0 0 28 12" aria-hidden>
          <g fill={plane} opacity="0.55">
            <ellipse cx="14" cy="6" rx="7" ry="1.2" />
            <path d="M13 5 L20 1.5 L21 2.5 L15 6 Z" />
            <path d="M13 7 L19 10 L20 9 L15 6 Z" opacity="0.8" />
            <rect x="5" y="5.5" width="4" height="1" rx="0.4" opacity="0.45" />
          </g>
        </svg>
      </div>

      {/* Mid plane */}
      <div
        className="pointer-events-none absolute animate-travel-plane-mid"
        style={{ top: 16, left: 0 }}
      >
        <svg width="28" height="12" viewBox="0 0 28 12" aria-hidden>
          <g fill={plane} opacity="0.8">
            <ellipse cx="14" cy="6" rx="7" ry="1.4" />
            <path d="M13 5 L20 1 L21 2.2 L15 6 Z" />
            <path d="M13 7 L19 10.5 L20 9.2 L15 6 Z" opacity="0.75" />
            <rect x="4" y="5.5" width="4.5" height="1" rx="0.4" opacity="0.5" />
          </g>
        </svg>
      </div>

      {/* Far tiny birds (high, slow) */}
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

      {/* Mid birds */}
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

      {/* Near birds (low, fast, larger) */}
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

      {/* Endless road */}
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

const TravelModeNotice: React.FC<TravelModeNoticeProps> = ({
  visible,
  enabled,
  locating,
  cityName,
  regionName,
  tripCities,
  coords,
  error,
  onAllow,
  onDisable,
  onDismiss,
  isDayMode = false,
  locale = 'en',
}) => {
  const chrome = getChromeTheme(isDayMode);

  if (!visible) return null;

  const title =
    locating && !cityName
      ? t(locale, 'travelLocating')
      : cityName
        ? cityName
        : t(locale, 'travelIdleTitle');

  const showLiveMap = enabled && Boolean(coords);
  const showIdleHero = !showLiveMap;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-5 md:hidden"
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div className="pointer-events-auto flex w-full max-w-[300px] flex-col items-stretch gap-2.5 animate-fade-in">
        <div className={`overflow-hidden rounded-2xl border ${chrome.panelSolid}`}>
          <div className="relative">
            {showLiveMap && coords ? (
              <TravelMap
                lat={coords.lat}
                lng={coords.lng}
                accuracyM={coords.accuracyM ?? null}
                className="h-[96px] w-full"
              />
            ) : (
              <TravelIdleHero
                isDayMode={isDayMode}
                accent={chrome.accentOnPanel}
                active={visible && showIdleHero}
              />
            )}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
              style={{
                background: `linear-gradient(to top, ${chrome.panelBg}, transparent)`,
              }}
            />

            <button
              type="button"
              onClick={onDismiss}
              aria-label={t(locale, 'close')}
              className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
                isDayMode
                  ? 'bg-white/80 text-neutral-700 hover:bg-white'
                  : 'bg-black/40 text-white/75 hover:bg-black/55 hover:text-white'
              }`}
            >
              <FaTimes size={10} />
            </button>
          </div>

          <div className="space-y-3 px-4 pb-4 pt-1.5">
            <div className="min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ color: chrome.accentOnPanel }}
              >
                {t(locale, 'travel')}
              </p>
              <p className={`mt-1 truncate text-[18px] font-semibold tracking-tight ${chrome.text}`}>
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
          </div>
        </div>

        <div
          className={`mx-auto rounded-full border px-3 py-1 text-center backdrop-blur-sm ${
            isDayMode
              ? 'border-black/10 bg-white/65 text-black/55'
              : 'border-white/10 bg-black/40 text-white/55'
          }`}
        >
          <p className="text-[10px] font-medium leading-snug tracking-wide">
            {t(locale, 'travelDisclaimer')}
          </p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
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
            .animate-travel-plane-far {
              animation: travelFly 28s linear infinite;
            }
            .animate-travel-plane-mid {
              animation: travelFly 20s linear infinite;
              animation-delay: 6s;
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
          `,
        }}
      />
    </div>
  );
};

export default TravelModeNotice;
