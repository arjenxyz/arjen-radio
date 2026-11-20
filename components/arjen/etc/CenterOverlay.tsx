// components/arjen/etc/CenterOverlay.tsx
import React from 'react';

interface CenterOverlayProps {
  isPlaying: boolean;
  isVisible: boolean;
  onTogglePlay?: () => void;
  isDayMode?: boolean;
  locale?: string;
}

const CenterOverlay: React.FC<CenterOverlayProps> = ({ isVisible }) => {
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
        className="mt-2 flex items-center gap-4 animate-fade-in-up"
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
          `,
        }}
      />
    </div>
  );
};

export default CenterOverlay;
