import React from 'react';
import Image from 'next/image';

interface BackgroundProps {
  dayImage: string;
  nightImage: string;
  isDayMode: boolean;
}

/**
 * Background component responsible for rendering layered background images
 * with smooth cross-fade transitions between day and night modes.
 * Additional overlay layers are used for atmospheric tint and vignette effects.
 */
const Background: React.FC<BackgroundProps> = ({ dayImage, nightImage, isDayMode }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden select-none">

      {/* 
        Base Layer: Night Image
        - Serves as the foundational background.
        - Opacity transitions to create a cross-fade effect when switching modes.
      */}
      <Image
        src={nightImage}
        alt="Night Atmosphere"
        draggable={false}
        fill
        className={`object-cover transition-opacity duration-1000 ${
          isDayMode ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ imageRendering: 'pixelated' }}
        priority
        unoptimized
      />

      {/* 
        Overlay Layer: Day Image
        - Positioned above the night image.
        - Fades in or out based on the isDayMode prop to achieve a smooth transition.
      */}
      <Image
        src={dayImage}
        alt="Day Atmosphere"
        draggable={false}
        fill
        className={`object-cover transition-opacity duration-1000 ${
          isDayMode ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ imageRendering: 'pixelated' }}
        priority
        unoptimized
      />

      {/* 
        Atmospheric Tint Layer
        - Applies a subtle color overlay to enhance the visual integration of the background with UI elements.
        - The tint color and opacity are adjusted according to the current mode.
      */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
          isDayMode ? 'bg-orange-500/10' : 'bg-black/40'
        }`}
      />

      {/* 
        Vignette Layer
        - Adds a global contrast vignette to slightly darken the scene.
        - Improves text readability and overall contrast.
      */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

    </div>
  );
};

export default Background;