// components/merky/etc/CenterOverlay.tsx
import React from 'react';

interface CenterOverlayProps {
  isPlaying: boolean;
  isVisible: boolean;
}

const CenterOverlay: React.FC<CenterOverlayProps> = ({ isPlaying, isVisible }) => {
  return (
    <div 
      className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        text-center z-10 flex flex-col items-center w-full px-4
        transition-all duration-1000 ease-in-out pointer-events-none
        ${isVisible ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-95'}
      `}
    >
        {/* 1. ANA MARKA: MERKY (Monochrome & Elegant) */}
        <div className="w-full flex justify-center animate-fade-in-up">
          <h1 
            className="leading-none font-black text-white tracking-tighter drop-shadow-2xl select-none mix-blend-overlay opacity-90"
            style={{ 
                fontSize: 'clamp(60px, 15vw, 180px)', 
                whiteSpace: 'nowrap',
                textShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            MERKY
          </h1>
        </div>
        
        {/* 2. ALT KİMLİK: ART HIVE (Minimalist) */}
        <div className="flex items-center gap-4 mt-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="h-[1px] w-12 bg-white/30"></div>
            <h2 
                className="text-white/80 font-bold tracking-[0.6em] select-none text-center" 
                style={{ fontSize: 'clamp(14px, 2.5vw, 24px)', whiteSpace: 'nowrap' }}
            >
                RADIO
            </h2>
            <div className="h-[1px] w-12 bg-white/30"></div>
        </div>

        {/* 3. DURUM METNİ (Terminal Style) */}
        <div 
             className="bg-black/30 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full animate-fade-in-up"
             style={{ animationDelay: '0.4s' }}
        >
            <p 
                className="text-gray-300 tracking-[0.2em] uppercase font-mono font-medium flex items-center gap-3"
                style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', whiteSpace: 'nowrap' }}
            >
                {isPlaying ? (
                    <>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Live Broadcast</span>
                    </>
                ) : (
                    <>
                         <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></span>
                         <span>Paused • Click to Start</span>
                    </>
                )}
            </p>
        </div>

        {/* Global CSS for Animations (Safe way without styled-jsx error) */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }
        `}} />
    </div>
  );
};

export default CenterOverlay;