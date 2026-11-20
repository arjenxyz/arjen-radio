import { useState, useEffect } from 'react';
import { ARJEN_COLORS } from '@/lib/branding';
import { getChromeTheme } from '@/lib/chrome-theme';
import { dateLocaleTag, greetingForHour, type LocaleCode } from '@/lib/locale';

interface DigitalClockProps {
  isDayMode?: boolean;
  locale?: LocaleCode;
}

const DigitalClock = ({ isDayMode = false, locale = 'en' }: DigitalClockProps) => {
  const [time, setTime] = useState({ hours: '00', minutes: '00' });
  const [dateInfo, setDateInfo] = useState({ date: '', day: '' });
  const [greeting, setGreeting] = useState('');
  const chrome = getChromeTheme(isDayMode);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const tag = dateLocaleTag(locale);

      const dateStr = now
        .toLocaleDateString(tag, { day: 'numeric', month: 'short' })
        .toUpperCase();
      const dayStr = now
        .toLocaleDateString(tag, { weekday: 'long' })
        .toUpperCase();

      setGreeting(greetingForHour(locale, now.getHours()));
      setTime({ hours, minutes });
      setDateInfo({ date: dateStr, day: dayStr });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [locale]);

  if (typeof window === 'undefined') return null;

  const accent = isDayMode ? chrome.accentOnPanel : ARJEN_COLORS.accentLight;
  const glow = isDayMode ? 'transparent' : ARJEN_COLORS.glow;

  return (
    <div className="absolute top-[calc(2rem+env(safe-area-inset-top))] left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 select-none animate-fade-in md:left-8 md:top-8 md:w-auto md:max-w-none md:translate-x-0">
      {/* Soft dark veil only — keep the card itself as clear transparent black */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, transparent 70%)',
        }}
      />
      <div
        className={`flex flex-col items-center rounded-3xl border p-6 transition-all duration-500 hover:scale-105 md:items-start ${chrome.clockPanel}`}
      >
        <div className="mb-2 w-full animate-fade-in-up text-center md:text-left">
          <p
            className="text-[11px] font-bold tracking-[0.4em]"
            style={{
              color: accent,
              filter: isDayMode ? undefined : `drop-shadow(0 0 8px ${glow})`,
            }}
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
            style={{
              color: accent,
              filter: isDayMode ? undefined : `drop-shadow(0 0 10px ${glow})`,
            }}
          >
            :
          </span>
          <span
            className={`text-6xl font-black tracking-tighter drop-shadow-2xl sm:text-7xl md:text-8xl ${chrome.clockTime}`}
            style={{ fontFamily: "'Outfit', sans-serif", fontVariantNumeric: 'tabular-nums' }}
          >
            {time.minutes}
          </span>
        </div>

        <div className={`mt-3 flex gap-2 text-[11px] font-bold tracking-[0.2em] ${chrome.clockDate}`}>
          <span className={chrome.clockDateStrong}>{dateInfo.day}</span>
          <span className="opacity-40">·</span>
          <span>{dateInfo.date}</span>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
      `,
        }}
      />
    </div>
  );
};

export default DigitalClock;
