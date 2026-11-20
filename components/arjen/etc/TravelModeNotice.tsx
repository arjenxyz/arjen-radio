import React from 'react';
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

/** Horizon strip: endless horizontal road, tiny car, birds & planes in the sky. */
const TravelIdleHero: React.FC<{ isDayMode: boolean; accent: string }> = ({
  isDayMode,
  accent,
}) => {
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
      {/* Soft sun / moon glow on horizon */}
      <div
        className="pointer-events-none absolute left-1/2 top-[46%] h-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{ background: accent, opacity: isDayMode ? 0.35 : 0.22 }}
      />

      {/* Horizon line */}
      <div
        className="absolute inset-x-0 top-[52%] h-px"
        style={{ background: isDayMode ? 'rgba(60,80,110,0.25)' : 'rgba(255,255,255,0.12)' }}
      />

      {/* Birds */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <g className="animate-travel-bird-a" fill="none" stroke={bird} strokeWidth="1.2" strokeLinecap="round">
          <path d="M0 0 q4 -4 8 0" />
          <path d="M8 0 q4 -4 8 0" />
        </g>
        <g className="animate-travel-bird-b" fill="none" stroke={bird} strokeWidth="1.1" strokeLinecap="round">
          <path d="M0 0 q3.5 -3.5 7 0" />
          <path d="M7 0 q3.5 -3.5 7 0" />
        </g>
        <g className="animate-travel-bird-c" fill="none" stroke={bird} strokeWidth="1" strokeLinecap="round">
          <path d="M0 0 q3 -3 6 0" />
          <path d="M6 0 q3 -3 6 0" />
        </g>

        {/* Plane */}
        <g className="animate-travel-plane" fill={plane}>
          <ellipse cx="0" cy="0" rx="7" ry="1.4" />
          <path d="M-1 -1 L6 -5 L7 -4 L2 0 Z" opacity="0.9" />
          <path d="M-1 1 L5 4 L6 3 L2 0 Z" opacity="0.75" />
          <rect x="-9" y="-0.5" width="4" height="1" rx="0.4" opacity="0.5" />
        </g>
      </svg>

      {/* Endless road band */}
      <div className="absolute inset-x-0 bottom-0 h-[34px]" style={{ background: road }}>
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: shoulder }}
        />
        {/* Scrolling center dashes — endless loop */}
        <div className="absolute left-0 top-1/2 w-[200%] -translate-y-1/2 overflow-hidden">
          <div
            className="h-[2px] w-full animate-travel-road"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${dash} 0 14px, transparent 14px 28px)`,
            }}
          />
        </div>

        {/* Tiny car driving along the road */}
        <div className="absolute bottom-[7px] animate-travel-car">
          <svg width="28" height="12" viewBox="0 0 28 12" aria-hidden>
            <rect x="3" y="4" width="20" height="5" rx="1.5" fill={accent} />
            <path d="M8 4 L11 1.2 H17 L20 4 Z" fill={accent} opacity="0.9" />
            <rect x="11.5" y="1.6" width="5" height="2.2" rx="0.4" fill={isDayMode ? '#dce6f5' : '#0d1420'} opacity="0.85" />
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

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-5 md:hidden"
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div className="pointer-events-auto flex w-full max-w-[300px] flex-col items-stretch gap-2.5 animate-fade-in">
        <div
          className={`overflow-hidden rounded-2xl border ${chrome.panelSolid} ${
            isDayMode ? '' : 'shadow-[0_18px_44px_rgba(0,0,0,0.5)]'
          }`}
        >
          <div className="relative">
            {showLiveMap && coords ? (
              <TravelMap
                lat={coords.lat}
                lng={coords.lng}
                accuracyM={coords.accuracyM ?? null}
                className="h-[96px] w-full"
              />
            ) : (
              <TravelIdleHero isDayMode={isDayMode} accent={chrome.accentOnPanel} />
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
              animation: travelRoadScroll 1.05s linear infinite;
            }
            @keyframes travelCarDrive {
              0% { left: -14%; }
              100% { left: 108%; }
            }
            .animate-travel-car {
              animation: travelCarDrive 7.5s linear infinite;
            }
            @keyframes travelBirdA {
              0% { transform: translate(-20px, 18px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translate(310px, 10px); opacity: 0; }
            }
            .animate-travel-bird-a {
              animation: travelBirdA 11s linear infinite;
            }
            @keyframes travelBirdB {
              0% { transform: translate(-30px, 28px); opacity: 0; }
              12% { opacity: 0.9; }
              88% { opacity: 0.9; }
              100% { transform: translate(320px, 16px); opacity: 0; }
            }
            .animate-travel-bird-b {
              animation: travelBirdB 14s linear infinite;
              animation-delay: 3.5s;
            }
            @keyframes travelBirdC {
              0% { transform: translate(-24px, 14px); opacity: 0; }
              15% { opacity: 0.8; }
              85% { opacity: 0.8; }
              100% { transform: translate(315px, 22px); opacity: 0; }
            }
            .animate-travel-bird-c {
              animation: travelBirdC 16s linear infinite;
              animation-delay: 7s;
            }
            @keyframes travelPlane {
              0% { transform: translate(-40px, 22px) scale(0.85); opacity: 0; }
              8% { opacity: 1; }
              92% { opacity: 1; }
              100% { transform: translate(340px, 12px) scale(0.85); opacity: 0; }
            }
            .animate-travel-plane {
              animation: travelPlane 18s linear infinite;
              animation-delay: 2s;
            }
          `,
        }}
      />
    </div>
  );
};

export default TravelModeNotice;
