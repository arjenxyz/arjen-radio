import { useState, useEffect } from 'react';
import { ARJEN_COLORS } from '@/lib/branding';

/**
 * DigitalClock Component
 * Displays a digital clock with dynamic greeting and date information.
 */
const DigitalClock = () => {
  /* ----------------------------- State Management ----------------------------- */
  // Holds the current time (hours and minutes)
  const [time, setTime] = useState({ hours: '00', minutes: '00' });
  // Holds the current date and day of the week
  const [dateInfo, setDateInfo] = useState({ date: '', day: '' });
  // Holds the current greeting message based on the time of day
  const [greeting, setGreeting] = useState('');

  /* ----------------------------- Time & Greeting Logic ----------------------------- */
  /**
   * useEffect hook to update time, date, and greeting every second.
   * - Formats hours and minutes with leading zeros.
   * - Formats date and day strings in uppercase.
   * - Determines greeting based on the current hour.
   */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      const dateStr = now
        .toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        .toUpperCase();
      const dayStr = now
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toUpperCase();

      // Greeting logic based on hour of day
      const h = now.getHours();
      let greet = 'GOOD NIGHT'; // Default greeting for late night hours

      if (h >= 5 && h < 12)       greet = 'GOOD MORNING';   // Morning: 05:00 - 11:59
      else if (h >= 12 && h < 17) greet = 'GOOD AFTERNOON'; // Afternoon: 12:00 - 16:59
      else if (h >= 17 && h < 22) greet = 'GOOD EVENING';   // Evening: 17:00 - 21:59

      setGreeting(greet);
      setTime({ hours, minutes });
      setDateInfo({ date: dateStr, day: dayStr });
    };

    updateTime(); // Initial call to set state immediately on mount
    const timer = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  // Prevent rendering on the server side (Next.js/SSR compatibility)
  if (typeof window === "undefined") return null;

  const accent = ARJEN_COLORS.accentLight;
  const glow = ARJEN_COLORS.glow;

  /* ----------------------------- UI Rendering ----------------------------- */
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-40 select-none animate-fade-in w-[calc(100%-2rem)] max-w-sm md:w-auto md:max-w-none">
      <div className="flex flex-col items-center md:items-start p-6 rounded-3xl transition-all duration-500 bg-[#0a0a0a]/20 backdrop-blur-md border border-white/5 shadow-2xl hover:bg-[#0a0a0a]/40 hover:scale-105">
        
        {/* Greeting Display */}
        <div className="mb-2 animate-fade-in-up text-center md:text-left w-full">
          <p
            className="text-[11px] font-bold tracking-[0.4em]"
            style={{ color: accent, filter: `drop-shadow(0 0 8px ${glow})` }}
          >
            {greeting}
          </p>
        </div>

        {/* Time Display */}
        <div className="flex items-baseline leading-none relative">
          <span
            className="text-white text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter drop-shadow-2xl"
            style={{ fontFamily: "'Outfit', sans-serif", fontVariantNumeric: 'tabular-nums' }}
          >
            {time.hours}
          </span>
          <span
            className="text-5xl sm:text-6xl md:text-7xl font-light mx-2 -translate-y-2 animate-pulse"
            style={{ color: accent, filter: `drop-shadow(0 0 10px ${glow})` }}
          >
            :
          </span>
          <span
            className="text-white text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter drop-shadow-2xl opacity-90"
            style={{ fontFamily: "'Outfit', sans-serif", fontVariantNumeric: 'tabular-nums' }}
          >
            {time.minutes}
          </span>
        </div>

        {/* Date and Day Display */}
        <div className="flex items-center gap-3 mt-1 md:pl-2 opacity-80 justify-center md:justify-start w-full">
          <span className="text-gray-300 text-sm font-medium tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {dateInfo.day}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 5px ${accent}` }}
          />
          <span className="text-white text-sm font-bold tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {dateInfo.date}
          </span>
        </div>
      </div>

      {/* Inline CSS for fade-in-up animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default DigitalClock;
