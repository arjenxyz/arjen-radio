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
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ imageRendering: 'auto' }}
      onError={() => setFailed(true)}
    />
  );
};

const Background: React.FC<BackgroundProps> = ({ dayImage, nightImage, isDayMode }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden select-none">
      <BackgroundLayer src={nightImage} alt="Night Atmosphere" visible={!isDayMode} />
      <BackgroundLayer src={dayImage} alt="Day Atmosphere" visible={isDayMode} />

      <div
        className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
          isDayMode ? 'bg-amber-200/5' : 'bg-indigo-900/10'
        }`}
      />

      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
    </div>
  );
};

export default Background;
