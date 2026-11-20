'use client';

import React, { useEffect, useState } from 'react';
import { t, type LocaleCode } from '@/lib/locale';
import type { TravelCrossingInfo, TravelStationMatch } from '@/lib/travel-mode';

const CROSSING_MS = 3400;

interface TravelCrossingProps {
  info: TravelCrossingInfo | null;
  onDone: () => void;
  locale?: LocaleCode;
}

function matchHint(locale: LocaleCode, match: TravelStationMatch): string | null {
  if (match === 'city') return t(locale, 'travelLocalStation');
  if (match === 'region') return t(locale, 'travelRegionalVibe');
  return null;
}

const TravelCrossing: React.FC<TravelCrossingProps> = ({
  info,
  onDone,
  locale = 'en',
}) => {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<TravelCrossingInfo | null>(null);

  useEffect(() => {
    if (!info) {
      setVisible(false);
      setPayload(null);
      return;
    }

    setPayload(info);
    const showId = window.requestAnimationFrame(() => setVisible(true));
    const hideId = window.setTimeout(() => setVisible(false), CROSSING_MS - 480);
    const doneId = window.setTimeout(() => {
      setPayload(null);
      onDone();
    }, CROSSING_MS);

    return () => {
      window.cancelAnimationFrame(showId);
      window.clearTimeout(hideId);
      window.clearTimeout(doneId);
    };
  }, [info, onDone]);

  if (!payload) return null;

  const hint = matchHint(locale, payload.match);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[58] flex items-center justify-center px-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 55%, transparent 78%)',
        }}
      />

      <div
        className={`relative max-w-[320px] text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">
          {t(locale, 'travelEntering')}
        </p>
        <p className="mt-2 text-[26px] font-semibold tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
          {payload.cityName}
          <span className="font-normal text-white/55"> · </span>
          <span className="font-medium text-white/80">{payload.regionName}</span>
        </p>
        {hint && (
          <p className="mt-2 text-[12px] tracking-wide text-white/50">{hint}</p>
        )}
      </div>
    </div>
  );
};

export default TravelCrossing;
