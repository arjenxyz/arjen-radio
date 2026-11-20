// components/arjen/etc/CenterOverlay.tsx
import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';
import { t, type LocaleCode } from '@/lib/locale';

interface CenterOverlayProps {
  isPlaying: boolean;
  isVisible: boolean;
  onTogglePlay?: () => void;
  isDayMode?: boolean;
  locale?: LocaleCode;
}

const LiveMeters: React.FC<{ accent: string }> = ({ accent }) => (
  <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden>
    <span
      className="center-eq-bar w-[2.5px] rounded-full"
      style={{ backgroundColor: accent, animationDelay: '0ms', height: '40%' }}
    />
    <span
      className="center-eq-bar w-[2.5px] rounded-full"
      style={{ backgroundColor: accent, animationDelay: '140ms', height: '75%' }}
    />
    <span
      className="center-eq-bar w-[2.5px] rounded-full"
      style={{ backgroundColor: accent, animationDelay: '280ms', height: '55%' }}
    />
    <span
      className="center-eq-bar w-[2.5px] rounded-full"
      style={{ backgroundColor: accent, animationDelay: '90ms', height: '90%' }}
    />
  </span>
);

const CenterOverlay: React.FC<CenterOverlayProps> = ({
  isPlaying,
  isVisible,
  onTogglePlay,
  isDayMode = false,
  locale = 'en',
}) => {
  const chrome = getChromeTheme(isDayMode);

  return (
    <div
      className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        text-center z-10 flex flex-col items-center w-full px-4
        transition-all duration-1000 ease-in-out pointer-events-none
        ${isVisible ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-95'}
      `}
    >
      <div className="flex w-full justify-center animate-fade-in-up">
        <h1
          className="select-none font-black leading-none tracking-tighter text-white opacity-90 mix-blend-overlay drop-shadow-2xl"
          style={{
            fontSize: 'clamp(60px, 15vw, 180px)',
            whiteSpace: 'nowrap',
            textShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          ARJEN
        </h1>
      </div>

      <div
        className="mb-7 mt-2 flex items-center gap-4 animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="h-px w-12 bg-white/30" />
        <h2
          className="select-none text-center font-bold tracking-[0.6em] text-white/80"
          style={{ fontSize: 'clamp(14px, 2.5vw, 24px)', whiteSpace: 'nowrap' }}
        >
          RADIO
        </h2>
        <div className="h-px w-12 bg-white/30" />
      </div>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? t(locale, 'pause') : t(locale, 'play')}
        className={`group pointer-events-auto animate-fade-in-up cursor-pointer border px-3.5 py-2 backdrop-blur-md transition-all duration-300 active:scale-[0.97] ${
          isPlaying
            ? `${chrome.livePill} shadow-[0_8px_28px_rgba(0,0,0,0.28)]`
            : `${chrome.livePill} hover:scale-[1.02]`
        } rounded-full`}
        style={{ animationDelay: '0.4s' }}
      >
        <span
          className="flex items-center gap-2.5 font-mono font-medium uppercase tracking-[0.18em]"
          style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', whiteSpace: 'nowrap' }}
        >
          {isPlaying ? (
            <>
              <LiveMeters accent={chrome.accentOnPanel} />
              <span className={chrome.text}>{t(locale, 'tapToPause')}</span>
            </>
          ) : (
            <>
              <span
                className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-transform duration-500 group-hover:scale-105 ${chrome.border} ${
                  isDayMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950'
                }`}
              >
                <FaPlay size={8} className="ml-0.5" aria-hidden />
                <span
                  className={`pointer-events-none absolute inset-0 rounded-full opacity-40 ${
                    isDayMode ? 'bg-neutral-950' : 'bg-white'
                  } animate-center-ping`}
                  aria-hidden
                />
              </span>
              <span className={chrome.text}>{t(locale, 'tapToStart')}</span>
            </>
          )}
        </span>
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
              animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }

            @keyframes centerEq {
              0%, 100% { transform: scaleY(0.35); }
              50% { transform: scaleY(1); }
            }
            .center-eq-bar {
              display: block;
              transform-origin: bottom center;
              animation: centerEq 0.85s ease-in-out infinite;
            }

            @keyframes centerPing {
              0% { transform: scale(1); opacity: 0.35; }
              70% { transform: scale(1.85); opacity: 0; }
              100% { transform: scale(1.85); opacity: 0; }
            }
            .animate-center-ping {
              animation: centerPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
          `,
        }}
      />
    </div>
  );
};

export default CenterOverlay;
