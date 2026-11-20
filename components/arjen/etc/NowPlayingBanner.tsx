import React from 'react';
import { FaBroadcastTower } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';
import type { RadioStation } from '@/lib/radio';

interface NowPlayingBannerProps {
  station: RadioStation;
  isDayMode: boolean;
  visible: boolean;
}

const NowPlayingBanner: React.FC<NowPlayingBannerProps> = ({
  station,
  isDayMode,
  visible,
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
        className={`mx-auto flex max-w-[1200px] flex-col items-center gap-2.5 rounded-2xl border px-3 py-3 text-center ${chrome.panelSolid}`}
      >
        <img
          src={station.cover}
          alt={station.title}
          className="h-14 max-h-14 w-auto max-w-[min(100%,11rem)] object-contain"
          onError={(e) => {
            e.currentTarget.src = '/covers/melodydance.gif';
          }}
        />

        <div className="min-w-0 w-full">
          <div className="mb-0.5 flex items-center justify-center gap-1.5">
            <FaBroadcastTower size={9} style={{ color: chrome.accentOnPanel }} />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.22em]"
              style={{ color: chrome.accentOnPanel }}
            >
              Now Playing
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
