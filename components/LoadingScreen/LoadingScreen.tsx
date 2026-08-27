// components/LoadingScreen/LoadingScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import IntroScreen from './IntroScreen';

/**
 * Props for LoadingScreen component.
 * @property onFinished - Callback invoked when the loading screen finishes.
 */
interface LoadingScreenProps {
  onFinished: () => void;
}

/**
 * LoadingScreen displays an animated intro overlay and calls onFinished when complete.
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  /* ----------------------------- State Section ----------------------------- */
  /**
   * Controls the fade-in and fade-out animation of the loading screen.
   */
  const [fade, setFade] = useState(false);

  /* ---------------------------- Animation Logic ---------------------------- */
  /**
   * Triggers the fade-in animation shortly after mount.
   */
  useEffect(() => {
    const fadeInTimer = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(fadeInTimer);
  }, []);

  /**
   * Handles the timing for fade-out and invokes the onFinished callback.
   * - After 3 seconds, triggers fade-out.
   * - After fade-out duration (800ms), calls onFinished.
   */
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFade(false);
      const finishTimer = setTimeout(onFinished, 800);
      return () => clearTimeout(finishTimer);
    }, 4000);

    return () => clearTimeout(fadeOutTimer);
  }, [onFinished]);

  /* ------------------------------- UI Layer ------------------------------- */
  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center font-sans select-none overflow-hidden transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}
    >
      <IntroScreen />
    </div>
  );
};

export default LoadingScreen;
