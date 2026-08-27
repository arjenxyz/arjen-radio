// components/merky/modal/InfoModal.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaDiscord, FaHeart, FaCode } from 'react-icons/fa';

interface InfoModalProps {
   isOpen: boolean;
   onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
   const [active, setActive] = useState(false);

   useEffect(() => {
      if (isOpen) {
         Promise.resolve().then(() => setActive(true));
         document.body.style.overflow = 'hidden';
      } else {
         const timer = setTimeout(() => setActive(false), 300);
         document.body.style.overflow = 'unset';
         return () => clearTimeout(timer);
      }

      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
   }, [isOpen, onClose]);

   if (!isOpen && !active) return null;

   return (
      <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         
         {/* Backdrop */}
         <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
         ></div>

         {/* Modal Card */}
         <div 
            className={`
               relative w-full max-w-sm bg-[#121212] border border-[#333] rounded-2xl overflow-hidden shadow-2xl
               transition-all duration-300 transform
               ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}
         >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#222] bg-[#161616]">
               <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">System Online</span>
               </div>
               <button 
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#222] text-gray-400 hover:bg-white hover:text-black transition-all"
               >
                  <FaTimes size={12} />
               </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
                
                {/* Identity */}
                <div className="flex items-center gap-4">
                     <div className="relative w-16 h-16 shrink-0 bg-[#0a0a0a] rounded-xl border border-[#333] flex items-center justify-center p-2">
                         <Image 
                            src="/intro-avatar/arjenmarka.png" 
                            alt="Logo" 
                            width={64} 
                            height={64} 
                            className="object-contain opacity-90"
                         />
                     </div>
                     <div>
                         <h3 className="text-lg font-bold text-white tracking-tight">Merky Radio</h3>
                         <p className="text-xs text-gray-500 font-medium">Lofi Station & Focus Tool</p>
                         <div className="flex gap-1 mt-2">
                             <Tag label="Focus" />
                             <Tag label="No Ads" />
                             <Tag label="Free" />
                         </div>
                     </div>
                </div>

               
                <div className="p-4 rounded-xl bg-[#181818] border border-[#222] space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <FaHeart className="text-[#FF7626] text-xs" />
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Passion Project
                        </h4>
                    </div>
                    
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                        Merky Radio is a non-profit <span className="text-white font-semibold">hobby project</span> crafted for deep work and relaxation. 
                        <br /><br />
                        No ads, no algorithms—just a curated audio-visual atmosphere designed to help you stay in the flow. Built with love to share the vibe.
                    </p>
                </div>
                {/* ------------------------------------- */}

                {/* Community Link */}
                <a href="https://discord.gg/Vsmd5rSAJ" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-[#222] hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2] transition-all group">
                     <div className="flex items-center gap-3">
                         <FaDiscord size={16} className="text-[#5865F2] group-hover:text-white" />
                         <span className="text-xs font-bold text-gray-300 group-hover:text-white">Join Community</span>
                     </div>
                     <span className="text-[10px] text-gray-600 group-hover:text-white/80 font-mono">DISCORD</span>
                </a>
            </div>

            {/* Footer / Credits */}
            <div className="px-5 py-3 border-t border-[#222] bg-[#161616] flex justify-between items-center">
               <span className="text-[9px] text-gray-600 font-mono uppercase tracking-wider flex items-center gap-1">
                 <FaCode size={8} /> v2.4.0
               </span>
               <span className="text-[9px] text-gray-500 font-medium">Engineered by <span className="text-white">Arjen</span></span>
            </div>

         </div>
      </div>
   );
};

// --- Sub Components ---

const Tag = ({ label }: { label: string }) => (
    <span className="px-1.5 py-0.5 rounded bg-[#222] border border-[#333] text-[9px] text-gray-400 font-medium uppercase tracking-wide">
        {label}
    </span>
);

export default InfoModal;
