import React from 'react';
import { FaRoute, FaTimes } from 'react-icons/fa';
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

/** Soft route preview shown before GPS is granted. */
const TravelIdleHero: React.FC<{ isDayMode: boolean; accent: string }> = ({
  isDayMode,
  accent,
}) => (
  <div
    className="relative h-40 w-full overflow-hidden"
    style={{
      background: isDayMode
        ? 'linear-gradient(160deg, #dbe4f5 0%, #c5d2ea 45%, #aebfdc 100%)'
        : 'linear-gradient(160deg, #1a2230 0%, #121820 48%, #0c1018 100%)',
    }}
  >
    <svg
      className="absolute inset-0 h-full w-full opacity-70"
      viewBox="0 0 300 160"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M-10 120 C40 90, 70 140, 110 100 S170 40, 210 70 S270 130, 320 90"
        fill="none"
        stroke={isDayMode ? 'rgba(40,60,100,0.22)' : 'rgba(255,255,255,0.14)'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M-10 120 C40 90, 70 140, 110 100 S170 40, 210 70 S270 130, 320 90"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 10"
        className="animate-travel-route"
      />
      <circle cx="110" cy="100" r="4" fill={accent} opacity="0.9" />
      <circle cx="210" cy="70" r="4" fill={accent} opacity="0.9" />
    </svg>

    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
        style={{
          backgroundColor: isDayMode ? 'rgba(255,255,255,0.88)' : 'rgba(12,16,24,0.78)',
          borderColor: isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
          color: accent,
        }}
      >
        <FaRoute size={16} />
      </div>
    </div>
  </div>
);

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
      <div className="pointer-events-auto flex w-full max-w-[300px] flex-col items-stretch gap-3 animate-fade-in">
        <div
          className={`overflow-hidden rounded-2xl border ${chrome.panelSolid} ${
            isDayMode ? '' : 'shadow-[0_20px_50px_rgba(0,0,0,0.55)]'
          }`}
        >
          <div className="relative">
            {showLiveMap && coords ? (
              <TravelMap
                lat={coords.lat}
                lng={coords.lng}
                accuracyM={coords.accuracyM ?? null}
                className="h-40 w-full"
              />
            ) : (
              <TravelIdleHero isDayMode={isDayMode} accent={chrome.accentOnPanel} />
            )}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{
                background: `linear-gradient(to top, ${chrome.panelBg}, transparent)`,
              }}
            />

            <button
              type="button"
              onClick={onDismiss}
              aria-label={t(locale, 'close')}
              className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
                isDayMode
                  ? 'bg-white/80 text-neutral-700 hover:bg-white'
                  : 'bg-black/45 text-white/80 hover:bg-black/60 hover:text-white'
              }`}
            >
              <FaTimes size={11} />
            </button>
          </div>

          <div className="space-y-3.5 px-4 pb-4 pt-1">
            <div className="min-w-0 pr-1">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ color: chrome.accentOnPanel }}
              >
                {t(locale, 'travel')}
              </p>
              <p className={`mt-1.5 truncate text-[20px] font-semibold tracking-tight ${chrome.text}`}>
                {title}
                {regionName && cityName ? (
                  <span className={`font-medium ${chrome.muted}`}> · {regionName}</span>
                ) : null}
              </p>
            </div>

            {enabled && tripCities.length > 1 && (
              <div
                className={`rounded-xl border px-3 py-2 ${chrome.borderSubtle} ${chrome.surface}`}
              >
                <p
                  className={`truncate text-[11px] leading-relaxed tracking-wide ${chrome.soft}`}
                  title={tripCities.join(' → ')}
                >
                  {tripCities.join(' → ')}
                </p>
              </div>
            )}

            {!enabled && (
              <p className={`text-[13px] leading-relaxed ${chrome.soft}`}>
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
                className="w-full rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-opacity active:scale-[0.98] hover:opacity-90"
                style={{ backgroundColor: chrome.accentOnPanel }}
              >
                {t(locale, 'travelAllow')}
              </button>
            )}
          </div>
        </div>

        <div
          className={`mx-auto max-w-[280px] rounded-full border px-3.5 py-1.5 text-center backdrop-blur-sm ${
            isDayMode
              ? 'border-black/10 bg-white/70 text-black/60'
              : 'border-white/10 bg-black/45 text-white/60'
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
              to { stroke-dashoffset: -64; }
            }
            .animate-travel-route {
              animation: travelRouteDash 2.8s linear infinite;
            }
          `,
        }}
      />
    </div>
  );
};

export default TravelModeNotice;
