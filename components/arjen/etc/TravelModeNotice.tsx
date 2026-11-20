import React from 'react';
import { FaRoute } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';

interface TravelModeNoticeProps {
  visible: boolean;
  enabled: boolean;
  cityName: string | null;
  error: string | null;
  onAllow: () => void;
  onDisable: () => void;
  onDismiss: () => void;
  isDayMode?: boolean;
}

const TravelModeNotice: React.FC<TravelModeNoticeProps> = ({
  visible,
  enabled,
  cityName,
  error,
  onAllow,
  onDisable,
  onDismiss,
  isDayMode = false,
}) => {
  const chrome = getChromeTheme(isDayMode);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-5 md:hidden"
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`pointer-events-auto w-full max-w-[320px] space-y-3 rounded-2xl border px-4 py-4 ${chrome.panelSolid}`}
      >
        <div className="flex items-center gap-2">
          <FaRoute size={12} style={{ color: chrome.accentOnPanel }} />
          <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${chrome.muted}`}>
            Travel mode
          </p>
        </div>

        {enabled ? (
          <>
            <p className={`text-[14px] leading-relaxed ${chrome.text}`}>
              {cityName
                ? `Near ${cityName}. Stations follow your route.`
                : 'Looking for the nearest Turkish city…'}
            </p>
            {error && <p className={`text-[12px] ${chrome.soft}`}>{error}</p>}
            <div className="flex gap-2">
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
            </div>
          </>
        ) : (
          <>
            <p className={`text-[14px] leading-relaxed ${chrome.text}`}>
              For car or bus trips, allow location so Arjen can switch to stations that fit nearby
              Turkish cities.
            </p>
            {error && <p className={`text-[12px] ${chrome.soft}`}>{error}</p>}
            <div className="flex gap-2">
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
                className={`flex-1 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white`}
                style={{ backgroundColor: chrome.accentOnPanel }}
              >
                Allow
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TravelModeNotice;
