import { useState, useEffect } from 'react';
import { ARJEN_COLORS } from '@/lib/branding';
import { getChromeTheme } from '@/lib/chrome-theme';

interface DigitalClockProps {
  isDayMode?: boolean;
}

const DigitalClock = ({ isDayMode = false }: DigitalClockProps) => {
  const [time, setTime] = useState({ hours: '00', minutes: '00' });
  const [dateInfo, setDateInfo] = useState({ date: '', day: '' });
  const [greeting, setGreeting] = useState('');
  const chrome = getChromeTheme(isDayMode);

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

      const h = now.getHours();
      let greet = 'GOOD NIGHT';
      if (h >= 5 && h < 12) greet = 'GOOD MORNING';
      else if (h >= 12 && h < 17) greet = 'GOOD AFTERNOON';
      else if (h >= 17 && h < 22) greet = 'GOOD EVENING';

      setGreeting(greet);
      setTime({ hours, minutes });
      setDateInfo({ date: dateStr, day: dayStr });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (typeof window === 'undefined') return null;

  const accent = ARJEN_COLORS.accentLight;
  const glow = ARJEN_COLORS.glow;

  return (
    <div className="absolute top-[calc(2rem+env(safe-area-inset-top))] left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 select-none animate-fade-in md:left-8 md:top-8 md:w-auto md:max-w-none md:translate-x-0">
      <div
        className={`flex flex-col items-center rounded-3xl border p-6 backdrop-blur-md transition-all duration-500 hover:scale-105 md:items-start ${chrome.clockPanel}`}
      >
        <div className="mb-2 w-full animate-fade-in-up text-center md:text-left">
          <p
            className="text-[11px] font-bold tracking-[0.4em]"
            style={{ color: accent, filter: `drop-shadow(0 0 8px ${glow})` }}
          >
            {greeting}
          </p>
        </div>

        <div className="relative flex items-baseline leading-none">
          <span
            className={`text-6xl font-black tracking-tighter drop-shadow-2xl sm:text-7xl md:text-8xl ${chrome.clockTime}`}
            style={{ fontFamily: "'Outfit', sans-serif", fontVariantNumeric: 'tabular-nums' }}
          >
            {time.hours}
          </span>
          <span
            className="mx-2 -translate-y-2 animate-pulse text-5xl font-light sm:text-6xl md:text-7xl"
            style={{ color: accent, filter: `drop-shadow(0 0 10px ${glow})` }}
          >
            :
          </span>
          <span
            className={`text-6xl font-bold tracking-tighter opacity-90 drop-shadow-2xl sm:text-7xl md:text-8xl ${chrome.clockTime}`}
            style={{ fontFamily: "'Outfit', sans-serif", fontVariantNumeric: 'tabular-nums' }}
          >
            {time.minutes}
          </span>
        </div>

        <div className="mt-1 flex w-full items-center justify-center gap-3 opacity-80 md:justify-start md:pl-2">
          <span
            className={`text-sm font-medium tracking-[0.2em] ${chrome.clockDate}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {dateInfo.day}
          </span>
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 5px ${accent}` }}
          />
          <span
            className={`text-sm font-bold tracking-[0.2em] ${chrome.clockDateStrong}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {dateInfo.date}
          </span>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `,
        }}
      />
    </div>
  );
};

export default DigitalClock;
