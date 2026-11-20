import React, { useState } from 'react';

interface SceneImageProps {
  src: string;
  alt: string;
  themeColor?: string;
  className?: string;
}

const SceneImage: React.FC<SceneImageProps> = ({ src, alt, themeColor = '#333', className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{ background: `linear-gradient(135deg, ${themeColor}88 0%, ${themeColor}33 100%)` }}
        aria-label={alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`atmosphere-image absolute inset-0 h-full w-full object-cover ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
};

export default SceneImage;
