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

  const title = locating && !cityName ? t(locale, 'travelLocating') : cityName ?? t(locale, 'travel');

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-5 md:hidden"
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div className="pointer-events-auto flex w-full max-w-[300px] flex-col items-stretch gap-2.5">
        <div className={`overflow-hidden rounded-2xl border ${chrome.panelSolid}`}>
          {enabled && coords && (
            <div className="relative">
              <TravelMap
                lat={coords.lat}
                lng={coords.lng}
                accuracyM={coords.accuracyM ?? null}
                className="h-36 w-full"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
                style={{
                  background: `linear-gradient(to top, ${chrome.panelBg}, transparent)`,
                }}
              />
            </div>
          )}

          <div className="space-y-3 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${chrome.muted}`}>
                  {t(locale, 'travel')}
                </p>
                <p className={`mt-1 truncate text-[16px] font-semibold tracking-tight ${chrome.text}`}>
                  {title}
                  {regionName && cityName ? (
                    <span className={`font-medium ${chrome.muted}`}> · {regionName}</span>
                  ) : null}
                </p>
              </div>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Close"
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${chrome.close}`}
              >
                <FaTimes size={11} />
              </button>
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
                className="w-full rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white transition-opacity active:scale-[0.98] hover:opacity-90"
                style={{ backgroundColor: chrome.accentOnPanel }}
              >
                {t(locale, 'travelAllow')}
              </button>
            )}
          </div>
        </div>

        <p
          className={`px-1 text-center text-[11px] leading-snug ${
            isDayMode ? 'text-black/55' : 'text-white/55'
          }`}
        >
          {t(locale, 'travelDisclaimer')}
        </p>
      </div>
    </div>
  );
};

export default TravelModeNotice;
