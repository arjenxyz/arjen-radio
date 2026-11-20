import React from 'react';
import { FaRoute } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';
import { TRAVEL_CITY_RADIUS_KM } from '@/lib/travel-mode';

interface TravelModeNoticeProps {
  visible: boolean;
  enabled: boolean;
  locating: boolean;
  cityName: string | null;
  distanceKm: number | null;
  mapUrl: string | null;
  error: string | null;
  onAllow: () => void;
  onDisable: () => void;
  onDismiss: () => void;
  isDayMode?: boolean;
}

const TravelModeNotice: React.FC<TravelModeNoticeProps> = ({
  visible,
  enabled,
  locating,
  cityName,
  distanceKm,
  mapUrl,
  error,
  onAllow,
  onDisable,
  onDismiss,
  isDayMode = false,
}) => {
  const chrome = getChromeTheme(isDayMode);

  if (!visible) return null;

  const farAway =
    typeof distanceKm === 'number' && distanceKm > TRAVEL_CITY_RADIUS_KM;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-5 md:hidden"
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`pointer-events-auto w-full max-w-[320px] space-y-3 overflow-hidden rounded-2xl border ${chrome.panelSolid}`}
      >
        <div className="space-y-3 px-4 pt-4">
          <div className="flex items-center gap-2">
            <FaRoute size={12} style={{ color: chrome.accentOnPanel }} />
            <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${chrome.muted}`}>
              Travel mode
            </p>
          </div>

          {enabled ? (
            <>
              <p className={`text-[14px] leading-relaxed ${chrome.text}`}>
                {locating && !cityName
                  ? 'Finding your position…'
                  : cityName
                    ? `Nearest city: ${cityName}${
                        typeof distanceKm === 'number'
                          ? ` · ${Math.round(distanceKm)} km`
                          : ''
                      }`
                    : 'Waiting for GPS…'}
              </p>
              {farAway && (
                <p className={`text-[12px] ${chrome.soft}`}>
                  You are a bit far from the city center — still snapping to the nearest match.
                </p>
              )}
              {error && <p className={`text-[12px] ${chrome.soft}`}>{error}</p>}
            </>
          ) : (
            <>
              <p className={`text-[14px] leading-relaxed ${chrome.text}`}>
                Allow location for car/bus trips. We show your spot on the map and retune to nearby
                Turkish cities.
              </p>
              {error && <p className={`text-[12px] ${chrome.soft}`}>{error}</p>}
            </>
          )}
        </div>

        {enabled && mapUrl && (
          <div className={`mx-4 overflow-hidden rounded-xl border ${chrome.border}`}>
            <iframe
              title="Travel map"
              src={mapUrl}
              className="h-36 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <div className="flex gap-2 px-4 pb-4">
          {enabled ? (
            <>
              <button
                type="button"
                onClick={onDisable}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-[13px] font-semibold ${chrome.border} ${chrome.text}`}
              >
                Turn off
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-[13px] font-semibold ${chrome.border} ${chrome.muted}`}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onDismiss}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-[13px] font-semibold ${chrome.border} ${chrome.text}`}
              >
                Not now
              </button>
              <button
                type="button"
                onClick={onAllow}
                className="flex-1 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white"
                style={{ backgroundColor: chrome.accentOnPanel }}
              >
                Allow
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelModeNotice;
