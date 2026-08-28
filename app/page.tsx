'use client';

import React, { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import LofiStation from '@/components/LofiStation';
/**
 * Home page component.
 * Handles initial loading and main application UI.
 */
export default function Home() {
  /* ---------------------- State Management ---------------------- */
  // Controls visibility of the loading screen on initial render.
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------------- Event Handlers ------------------------ */
  const handleIntroFinish = () => {
    setIsLoading(false);
  };

  /* ---------------------- UI Rendering -------------------------- */
  return (
    <main className="app-screen w-screen overflow-hidden bg-black relative">
      {isLoading ? (
        /* Loading Screen Layer: Displayed while the application is initializing. */
        <LoadingScreen onFinished={handleIntroFinish} />
      ) : (
        /* Main Application Layer: Displayed after loading completes. */
        <LofiStation />
      )}
    </main>
  );
}