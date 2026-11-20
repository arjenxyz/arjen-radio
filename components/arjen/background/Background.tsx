import React, { useEffect, useState } from 'react';
import { SCENE_FALLBACK_GRADIENT } from '../constants/constants';

interface BackgroundProps {
  dayImage: string;
  nightImage: string;
  isDayMode: boolean;
}

interface ScenePair {
  day: string;
  night: string;
}

const BackgroundLayer: React.FC<{
  src: string;
  alt: string;
  visible: boolean;
}> = ({ src, alt, visible }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: SCENE_FALLBACK_GRADIENT }}
        aria-hidden={!visible}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ imageRendering: 'auto' }}
      onError={() => setFailed(true)}
    />
  );
};

const SceneStack: React.FC<{
  pair: ScenePair;
  isDayMode: boolean;
  visible: boolean;
}> = ({ pair, isDayMode, visible }) => (
  <div
    className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}
    aria-hidden={!visible}
  >
    <BackgroundLayer src={pair.night} alt="Night Atmosphere" visible={!isDayMode} />
    <BackgroundLayer src={pair.day} alt="Day Atmosphere" visible={isDayMode} />
  </div>
);

const Background: React.FC<BackgroundProps> = ({ dayImage, nightImage, isDayMode }) => {
  const [front, setFront] = useState<ScenePair>({ day: dayImage, night: nightImage });
  const [back, setBack] = useState<ScenePair | null>(null);
  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    const current = showFront ? front : back ?? front;
    if (current.day === dayImage && current.night === nightImage) return;

    const next: ScenePair = { day: dayImage, night: nightImage };
    if (showFront) {
      setBack(next);
      // Allow paint of the incoming layer before flipping opacity.
      const id = window.requestAnimationFrame(() => setShowFront(false));
      return () => window.cancelAnimationFrame(id);
    }

    setFront(next);
    const id = window.requestAnimationFrame(() => setShowFront(true));
    return () => window.cancelAnimationFrame(id);
    // Intentionally keyed only to image URLs — flip buffer on scene change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayImage, nightImage]);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black select-none">
      <SceneStack pair={front} isDayMode={isDayMode} visible={showFront} />
      {back && <SceneStack pair={back} isDayMode={isDayMode} visible={!showFront} />}

      <div
        className={`pointer-events-none absolute inset-0 transition-colors duration-1000 ${
          isDayMode ? 'bg-amber-200/5' : 'bg-indigo-900/10'
        }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/5" />
    </div>
  );
};

export default Background;
