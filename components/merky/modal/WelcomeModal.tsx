import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * WelcomeModal displays a modal overlay introducing Merky Radio.
 * It features animated transitions, a decorative background, and a call-to-action button.
 */
const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  /* ----------------------------- State Management -----------------------------
   * `show` controls the visibility of the modal for smooth fade/scale transitions.
   * It is decoupled from `isOpen` to allow for exit animations before unmounting.
   */
  const [show, setShow] = useState(false);

  /* ----------------------------- Modal Visibility Effect -----------------------------
   * When `isOpen` becomes true, `show` is set to true immediately to mount the modal.
   * When `isOpen` becomes false, `show` is set to false after a delay (300ms) to allow
   * exit animations to complete before unmounting the modal from the DOM.
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => setShow(true), 0);
    } else {
      timer = setTimeout(() => setShow(false), 300);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Prevent rendering when modal is neither open nor animating out.
  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-500 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ----------------------------- Overlay Layer -----------------------------
       * Semi-transparent dark background with blur effect.
       * Clicking this layer triggers the modal close handler.
       */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* ----------------------------- Modal Container -----------------------------
       * Contains all modal content and handles entry/exit animations.
       * Click events are stopped from propagating to the overlay.
       */}
      <div
        className={`relative w-full max-w-md bg-[#080808] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 transform ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ----------------------------- Decorative Effects -----------------------------
         * Includes blurred colored circles and a subtle SVG noise overlay for visual depth.
         */}
        <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] bg-[#5865F2] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-20%] w-[300px] h-[300px] bg-orange-600 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* ----------------------------- Modal Header -----------------------------
         * Displays the Merky Radio label with animated status indicator.
         */}
        <div className="relative flex items-center justify-center pt-8 pb-2">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(249,115,22,0.2)] backdrop-blur-xl">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-white/80 uppercase">
              MERKY RADIO
            </span>
          </div>
        </div>

        {/* ----------------------------- Modal Content -----------------------------
         * Shows the avatar, welcome message, and a brief description.
         */}
        <div className="relative p-8 flex flex-col items-center text-center gap-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <Image
              src="/intro-avatar/arjenmarka.png"
              alt="Merky"
              width={128}
              height={128}
              className="relative object-contain drop-shadow-2xl"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-light text-white">
              Welcome to{' '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Merky Radio
              </span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Experience high-fidelity lo-fi beats curated for deep focus, relaxation, and coding sessions.
            </p>
          </div>
        </div>

        {/* ----------------------------- Modal Footer -----------------------------
         * Contains the primary action button and a credits note.
         */}
        <div className="relative p-6 border-t border-white/5 bg-black/20">
          <button
            onClick={onClose}
            className="group relative w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold tracking-widest uppercase text-xs overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Listening <FaHeart className="text-white/80 group-hover:text-white" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          <p className="mt-4 text-[10px] text-center text-gray-600 tracking-wider">
            CODED & DESIGNED BY ARJEN
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;