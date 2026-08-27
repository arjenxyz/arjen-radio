// components/merky/modal/DevModal.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaGithub, FaLinkedin, FaGlobe, FaCode, FaPlane, FaMicrochip, FaTerminal } from 'react-icons/fa';

interface DevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevModal: React.FC<DevModalProps> = ({ isOpen, onClose }) => {
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
      <div className={`
          relative w-full max-w-sm bg-[#121212] border border-[#333] rounded-2xl overflow-hidden shadow-2xl
          transition-all duration-300 transform
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222] bg-[#161616]">
            <div className="flex items-center gap-2 text-gray-400">
                <FaTerminal size={12} />
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono">DEV_PROFILE</span>
            </div>
            <button 
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#222] text-gray-400 hover:bg-white hover:text-black transition-all"
            >
              <FaTimes size={12} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            
            {/* Identity Section */}
            <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 shrink-0 bg-[#0a0a0a] rounded-2xl border border-[#333] overflow-hidden group shadow-lg">
                    <Image 
                        src="/intro-avatar/arjen.jpeg" 
                        alt="Arjen" 
                        fill 
                        quality={100}
                        priority
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                </div>
                
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Arjen</h2>
                    <p className="text-xs text-gray-500 font-medium">I just say Hello!</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        <Tag icon={<FaPlane size={8} />} label="Aviation" />
                        <Tag icon={<FaCode size={8} />} label="Coding" />
                        <Tag icon={<FaMicrochip size={8} />} label="Electric-Electronics" />
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-xl bg-[#181818] border border-[#222] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FaCode size={40} />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-medium relative z-10">
                    <span className="text-[#FF7626] font-mono">&gt;</span> Coding is just a hobby; my true passion lies in exploring the mechanics of the world.
                    <br /><br />
                    Deeply interested in <span className="text-white">Electronics</span> and <span className="text-white">Aviation</span>. I am a curious mind diving into every field that sparks innovation.
                </p>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-3 gap-3">
                <SocialButton 
                    href="https://github.com/arjenxyz" 
                    icon={<FaGithub size={16} />} 
                    label="GitHub" 
                    hoverColor="hover:border-white hover:bg-white hover:text-black"
                />
                <SocialButton 
                    href="https://linkedin.com/in/arjendev" 
                    icon={<FaLinkedin size={16} />} 
                    label="LinkedIn" 
                    hoverColor="hover:border-[#0077B5] hover:bg-[#0077B5] hover:text-white"
                />
                <SocialButton 
                    href="https://arjenweb.vercel.app/" 
                    icon={<FaGlobe size={16} />} 
                    label="Website" 
                    hoverColor="hover:border-[#FF7626] hover:bg-[#FF7626] hover:text-white"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const Tag = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#222] border border-[#333] text-[10px] font-bold text-gray-400 uppercase tracking-wide">
       {icon} {label}
    </span>
);

interface SocialButtonProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    hoverColor: string;
}

const SocialButton = ({ href, icon, label, hoverColor }: SocialButtonProps) => (
    <a 
        href={href}
        target="_blank" 
        rel="noopener noreferrer"
        className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-[#181818] border border-[#222] text-gray-400 transition-all duration-300 group ${hoverColor}`}
    >
        <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </a>
);

export default DevModal;
