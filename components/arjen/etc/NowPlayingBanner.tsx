import React from 'react';
import { FaBroadcastTower } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';
import { t, type LocaleCode } from '@/lib/locale';
import type { RadioStation } from '@/lib/radio';

interface NowPlayingBannerProps {
  station: RadioStation;
  isDayMode: boolean;
  visible: boolean;
  locale?: LocaleCode;
}

const NowPlayingBanner: React.FC<NowPlayingBannerProps> = ({
  station,
  isDayMode,
  visible,
  locale = 'en',
}) => {
  const chrome = getChromeTheme(isDayMode);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-6 opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <div
        className={`mx-auto flex max-w-[1200px] items-center gap-3 rounded-2xl border px-3 py-2.5 ${chrome.panelSolid}`}
      >
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
          <img
            src={station.cover}
            alt={station.title}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/covers/melodydance.gif';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <FaBroadcastTower size={9} style={{ color: chrome.accentOnPanel }} />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.22em]"
              style={{ color: chrome.accentOnPanel }}
            >
              {t(locale, 'nowPlaying')}
            </span>
          </div>
          <h3 className={`truncate text-[13px] font-bold leading-tight ${chrome.text}`}>
            {station.title}
          </h3>
          <p className={`mt-0.5 truncate text-[11px] font-medium ${chrome.soft}`}>
            {station.artist}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBanner;
