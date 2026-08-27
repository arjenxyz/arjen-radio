import React from 'react';
import { ARJEN_AVATAR_SRC } from '@/lib/branding';

/**
 * IntroScreen
 * -----------
 * Displays an animated introduction screen with branding, atmospheric effects,
 * and a live session indicator. Uses custom CSS animations for visual polish.
 */
const IntroScreen: React.FC = () => {
  return (
    <>
      {/* 
        ===========================
        Global Animation Definitions
        ===========================
        Defines keyframes and utility classes for custom animation effects.
      */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes music-bar {
          0%, 100% { height: 10%; opacity: 0.3; }
          50% { height: 100%; opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes reveal-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine-pass {
          0% { left: -100%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 200%; opacity: 0; }
        }

        .shimmer-effect { position: relative; overflow: hidden; display: inline-block; }
        .shimmer-effect::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          transform: skewX(-20deg); pointer-events: none;
          animation: shine-pass 2.5s ease-in-out forwards 1.8s;
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite 3s; }
        .animate-breathe { animation: breathe 8s ease-in-out infinite; }
        .animate-slide-left { animation: slide-in-left 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-right { animation: slide-in-right 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-reveal { animation: reveal-up 1s ease-out forwards 0.5s; opacity: 0; }
      `}</style>

      {/* 
        ===========================
        UI Layers & Visual Effects
        ===========================
        - Background color and typography
        - Atmospheric blurred lights
        - Noise overlay for texture
        - Vignette for edge darkening
      */}
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black text-white overflow-hidden font-sans selection:bg-arjen-accent/30">
        
        {/* Atmospheric blurred blue light (top left) */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#5865F2] rounded-full blur-[180px] opacity-10 pointer-events-none animate-breathe"></div>
        {/* Atmospheric blurred violet light (bottom right) */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-700 rounded-full blur-[180px] opacity-10 pointer-events-none animate-breathe" style={{ animationDelay: '4s' }}></div>
        
        {/* Noise texture overlay for subtle grain effect */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Vignette overlay for edge darkening */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>

        {/* 
          ===========================
          Main Content
          ===========================
          Contains branding, animated icons, and session info.
        */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-10 md:gap-16">
            
            {/* Live session indicator badge */}
            <div
              className="flex items-center gap-3 border border-white/5 bg-white/5 px-6 py-2 rounded-full shadow-lg backdrop-blur-md animate-reveal"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-2.5 h-2.5 bg-arjen-accent rounded-full animate-pulse shadow-[0_0_15px_rgba(107,143,217,0.8)]"></div>
              <span className="text-xs md:text-sm font-medium tracking-[0.3em] text-white/90 uppercase">
                Live Session
              </span>
            </div>

            {/* 
              ===========================
              Animated Branding Row
              ===========================
              - Discord logo (left)
              - Animated equalizer (center)
              - Arjen avatar (right)
            */}
            <div className="flex items-center justify-center gap-8 md:gap-16 scale-110 md:scale-125">
                
                {/* Discord logo with floating animation */}
                <div className="flex flex-col items-center gap-4 group cursor-default animate-slide-left">
                   <div className="w-24 h-24 md:w-36 md:h-36 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 animate-float">
                      <svg viewBox="0 0 127 96" className="w-20 h-20 md:w-28 md:h-28 fill-[#5865F2] drop-shadow-[0_0_40px_rgba(88,101,242,0.5)]">
                         <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                      </svg>
                   </div>
                   <span className="text-xs uppercase tracking-widest text-gray-500 font-bold animate-reveal" style={{ animationDelay: '1s' }}>DISCORD</span>
                </div>

                {/* Animated equalizer bars (center) */}
                <div className="flex gap-2 h-16 items-center opacity-90 mx-2 animate-reveal" style={{ animationDelay: '0.5s' }}>
                   <div className="w-1.5 bg-gradient-to-t from-gray-800 to-gray-500 rounded-full h-full" style={{ animation: 'music-bar 0.8s ease-in-out infinite' }}></div>
                   <div className="w-1.5 bg-gradient-to-t from-gray-800 to-white rounded-full h-[60%]" style={{ animation: 'music-bar 1.2s ease-in-out infinite 0.1s' }}></div>
                   <div className="w-1.5 bg-gradient-to-t from-gray-800 to-gray-400 rounded-full h-[80%]" style={{ animation: 'music-bar 0.5s ease-in-out infinite 0.2s' }}></div>
                   <div className="w-1.5 bg-gradient-to-t from-gray-800 to-white rounded-full h-[40%]" style={{ animation: 'music-bar 1.0s ease-in-out infinite 0.3s' }}></div>
                   <div className="w-1.5 bg-gradient-to-t from-gray-800 to-gray-500 rounded-full h-full" style={{ animation: 'music-bar 0.7s ease-in-out infinite 0.4s' }}></div>
                </div>

                {/* Arjen avatar with floating animation */}
                <div className="flex flex-col items-center gap-4 group cursor-default animate-slide-right">
                   <div className="relative w-24 h-24 md:w-36 md:h-36 transition-transform duration-500 group-hover:scale-110 animate-float-delayed">
                      <img
                        src={ARJEN_AVATAR_SRC}
                        alt="Arjen"
                        className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_40px_rgba(107,143,217,0.45)]"
                        draggable={false}
                      />
                   </div>
                   <span className="text-xs uppercase tracking-widest text-arjen-accent-light/90 font-bold animate-reveal" style={{ animationDelay: '1s' }}>ARJEN</span>
                </div>

            </div>

            {/* 
              ===========================
              Title and Attribution
              ===========================
              - Main title with shimmer animation
              - Attribution text
            */}
            <div className="flex flex-col items-center gap-2 text-center mt-4 animate-reveal" style={{ animationDelay: '1.2s' }}>
               <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight drop-shadow-2xl">
                 <span className="shimmer-effect">
                   Arjen <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-arjen-accent-light to-arjen-violet">Radio</span>
                 </span>
               </h1>
               <p className="text-[10px] md:text-xs text-gray-500 tracking-[0.4em] uppercase font-medium">
                 <span className="shimmer-effect">
                   Coded & Designed by Arjen
                 </span>
               </p>
            </div>

        </div>

      </div>
    </>
  );
};

export default IntroScreen;