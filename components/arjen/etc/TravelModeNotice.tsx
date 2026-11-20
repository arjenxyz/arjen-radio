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

const IDLE_STOPS = [
  { x: 18, label: 'IST' },
  { x: 50, label: 'ANK' },
  { x: 82, label: 'IZM' },
] as const;

/** Thin corridor hero — road vanishing into the horizon, not a big icon badge. */
const TravelIdleHero: React.FC<{ isDayMode: boolean; accent: string }> = ({
  isDayMode,
  accent,
}) => {
  const ink = isDayMode ? 'rgba(30,45,75,0.55)' : 'rgba(255,255,255,0.28)';
  const inkSoft = isDayMode ? 'rgba(30,45,75,0.18)' : 'rgba(255,255,255,0.1)';

  return (
    <div
      className="relative h-[96px] w-full overflow-hidden"
      style={{
        background: isDayMode
          ? 'linear-gradient(180deg, #cfd9ec 0%, #e8eef8 42%, #d5deee 100%)'
          : 'linear-gradient(180deg, #0b1018 0%, #141c28 38%, #0e141d 100%)',
      }}
    >
      {/* Horizon glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[34%] h-16 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{ background: accent, opacity: isDayMode ? 0.22 : 0.28 }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 300 96"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Soft contour lines */}
        <path
          d="M0 28 C70 22, 140 34, 300 24"
          fill="none"
          stroke={inkSoft}
          strokeWidth="1"
        />
        <path
          d="M0 36 C90 30, 160 42, 300 32"
          fill="none"
          stroke={inkSoft}
          strokeWidth="1"
        />

        {/* Horizon */}
        <line x1="24" y1="40" x2="276" y2="40" stroke={inkSoft} strokeWidth="1" />

        {/* Perspective road */}
        <path
          d="M118 96 L148 42 L152 42 L182 96"
          fill={isDayMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
        />
        <path
          d="M150 42 L128 96"
          fill="none"
          stroke={ink}
          strokeWidth="1.25"
        />
        <path
          d="M150 42 L172 96"
          fill="none"
          stroke={ink}
          strokeWidth="1.25"
        />
        <path
          d="M150 48 L150 96"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeDasharray="3 7"
          strokeLinecap="round"
          className="animate-travel-route"
          opacity="0.9"
        />

        {/* Vanishing point */}
        <circle cx="150" cy="42" r="3.5" fill={accent} />
        <circle
          cx="150"
          cy="42"
          r="8"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          opacity="0.45"
          className="animate-travel-pulse"
        />
      </svg>

      {/* City rail */}
      <div className="absolute inset-x-4 bottom-2.5 flex items-center justify-between">
        {IDLE_STOPS.map((stop, i) => (
          <div key={stop.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: i === 1 ? accent : ink }}
              />
              <span
                className="text-[8px] font-bold tracking-[0.16em]"
                style={{ color: i === 1 ? accent : ink }}
              >
                {stop.label}
              </span>
            </div>
            {i < IDLE_STOPS.length - 1 && (
              <div
                className="mx-2 h-px flex-1"
                style={{ backgroundColor: inkSoft }}
              />
            )}
          </div>
        ))}
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
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
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
            @keyframes travelRouteDash {
              to { stroke-dashoffset: -48; }
            }
            .animate-travel-route {
              animation: travelRouteDash 1.8s linear infinite;
            }
            @keyframes travelPulse {
              0%, 100% { opacity: 0.35; transform: scale(1); }
              50% { opacity: 0.75; transform: scale(1.35); }
            }
            .animate-travel-pulse {
              transform-origin: 150px 42px;
              animation: travelPulse 2.4s ease-in-out infinite;
            }
          `,
        }}
      />
    </div>
  );
};

export default TravelModeNotice;
