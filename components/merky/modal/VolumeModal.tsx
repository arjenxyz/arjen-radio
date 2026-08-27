// components/merky/VolumeModal.tsx
import React from 'react';
import { FaTimes, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';

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
 * Modal component for controlling the master volume.
 * Renders a slider and percentage indicator for volume adjustment.
 * 
 * Props:
 * - isOpen: Controls modal visibility.
 * - onClose: Callback to close the modal.
 * - masterVolume: Current master volume value (0-1).
 * - setMasterVolume: Setter for master volume.
 * - musicVolume, setMusicVolume: Optional props for music-specific volume control.
 */
const VolumeModal: React.FC<VolumeModalProps> = ({
  isOpen, onClose,
  masterVolume, setMasterVolume
}) => {

  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    /**
     * ===========================
     * Modal Container Layer
     * ===========================
     * 
     * Positioned absolutely near the bottom right of the viewport.
     * Uses high z-index to overlay above other content.
     * Includes fade-in animation and origin for scaling.
     */
    <div className="absolute bottom-28 right-20 md:right-44 z-[9999] animate-fade-in-up origin-bottom-right volume-modal">
      
      {/**
       * ===========================
       * Modal Panel
       * ===========================
       * 
       * Semi-transparent background with blur effect.
       * Rounded corners, subtle border, and shadow for visual separation.
       * Uses flex layout for vertical stacking of header and content.
       */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 w-[260px] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden flex flex-col transition-all hover:bg-black/30">
        
        {/**
         * ===========================
         * Modal Header
         * ===========================
         * 
         * Displays the title and a close button.
         * Close button triggers the onClose callback.
         */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h3 className="text-white font-bold text-xs tracking-widest uppercase opacity-100 drop-shadow-md">Volume</h3>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                <FaTimes size={12} />
            </button>
        </div>

        {/**
         * ===========================
         * Modal Content
         * ===========================
         * 
         * Contains the volume percentage indicator and the slider control.
         */}
        <div className="px-5 pb-6 pt-2">
            
            {/* Volume Percentage Display */}
            <div className="flex justify-end mb-3">
                <span className="text-[#FF6B4A] text-xs font-mono font-bold drop-shadow-md">
                    {Math.round(masterVolume * 100)}%
                </span>
            </div>

            {/* Volume Slider Control */}
            <div className="flex items-center gap-3">
                <FaVolumeDown className="text-white/60 text-[10px] drop-shadow-md"/>
                
                <input 
                    type="range" min="0" max="1" step="0.01" value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/30 rounded-full cursor-pointer appearance-none hover:bg-white/40 transition-colors"
                    style={{ accentColor: '#FF6B4A' }}
                />
                
                <FaVolumeUp className="text-white/60 text-[10px] drop-shadow-md"/>
            </div>

        </div>
      </div>
    </div>
  );
};

export default VolumeModal;