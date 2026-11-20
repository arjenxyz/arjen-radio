import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';

interface TravelModeNoticeProps {
  visible: boolean;
  enabled: boolean;
  locating: boolean;
  cityName: string | null;
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
  mapUrl,
  error,
  onAllow,
  onDisable,
  onDismiss,
  isDayMode = false,
}) => {
  const chrome = getChromeTheme(isDayMode);

  if (!visible) return null;

  const title = locating && !cityName ? 'Locating…' : cityName ?? 'Travel';

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-5 md:hidden"
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`pointer-events-auto w-full max-w-[300px] overflow-hidden rounded-2xl border ${chrome.panelSolid}`}
      >
        {enabled && mapUrl && (
          <div className="relative h-36 w-full overflow-hidden">
            <img src={mapUrl} alt="" className="h-full w-full object-cover" />
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
                Travel
              </p>
              <p className={`mt-1 truncate text-[16px] font-semibold tracking-tight ${chrome.text}`}>
                {title}
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

          {!enabled && (
            <p className={`text-[13px] leading-relaxed ${chrome.soft}`}>
              Share location on the road to follow nearby Turkish cities.
            </p>
          )}

          {error && <p className={`text-[12px] ${chrome.soft}`}>{error}</p>}

          {enabled ? (
            <button
              type="button"
              onClick={onDisable}
              className={`w-full rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors active:scale-[0.98] ${chrome.border} ${chrome.text}`}
            >
              Turn off
            </button>
          ) : (
            <button
              type="button"
              onClick={onAllow}
              className="w-full rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white transition-opacity active:scale-[0.98] hover:opacity-90"
              style={{ backgroundColor: chrome.accentOnPanel }}
            >
              Allow location
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelModeNotice;
