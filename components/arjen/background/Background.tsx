import React, { useState } from 'react';
import { SCENE_FALLBACK_GRADIENT } from '../constants/constants';

interface BackgroundProps {
  dayImage: string;
  nightImage: string;
  isDayMode: boolean;
}

const BackgroundLayer: React.FC<{
  src: string;
  alt: string;
  visible: boolean;
}> = ({ src, alt, visible }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`atmosphere-fallback absolute inset-0 transition-opacity duration-1000 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
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
      // Eager + high priority so the active scene stays sharp as soon as it paints.
      loading="eager"
      decoding="async"
      fetchPriority={visible ? 'high' : 'low'}
      sizes="100vw"
      className={`atmosphere-image absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onError={() => setFailed(true)}
    />
  );
};

const Background: React.FC<BackgroundProps> = ({ dayImage, nightImage, isDayMode }) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black select-none">
      <BackgroundLayer src={nightImage} alt="Night Atmosphere" visible={!isDayMode} />
      <BackgroundLayer src={dayImage} alt="Day Atmosphere" visible={isDayMode} />

      {/* Light atmospheric tint — keep overlays subtle so HD detail stays visible */}
      <div
        className={`pointer-events-none absolute inset-0 transition-colors duration-1000 ${
          isDayMode ? 'bg-amber-200/5' : 'bg-indigo-900/10'
        }`}
      />
    </div>
  );
};

export default Background;
