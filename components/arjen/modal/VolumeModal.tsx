// components/arjen/modal/VolumeModal.tsx
import React from 'react';
import { FaTimes, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import { ARJEN_COLORS } from '@/lib/branding';

interface VolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterVolume: number;
  setMasterVolume: (val: number) => void;
  musicVolume?: number;
  setMusicVolume?: (val: number) => void;
}

/**
 * VolumeModal
 *
 * Compact volume panel anchored above the control bar on the right,
 * aligned with the volume / utility icon cluster.
 */
const VolumeModal: React.FC<VolumeModalProps> = ({
  isOpen,
  onClose,
  masterVolume,
  setMasterVolume,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="volume-modal pointer-events-auto fixed right-4 z-[9999] w-[260px] origin-bottom-right animate-fade-in-up md:right-8"
      style={{
        bottom: 'calc(5.75rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-[0_12px_40px_rgba(0,0,0,0.75)]">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white">
            Volume
          </h3>
          <button
            onClick={onClose}
            aria-label="Close volume"
            className="text-white/70 transition-colors hover:text-white"
          >
            <FaTimes size={12} />
          </button>
        </div>

        <div className="px-5 pb-6 pt-2">
          <div className="mb-3 flex justify-end">
            <span
              className="font-mono text-xs font-bold"
              style={{ color: ARJEN_COLORS.accent }}
            >
              {Math.round(masterVolume * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <FaVolumeDown className="text-[10px] text-white/60" />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 transition-colors hover:bg-white/30"
              style={{ accentColor: ARJEN_COLORS.accent }}
            />

            <FaVolumeUp className="text-[10px] text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeModal;
