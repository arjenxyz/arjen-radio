import React, { useEffect, useRef } from 'react';
import { FaCog, FaCode, FaEllipsisH } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  isDayMode?: boolean;
}

const DEVELOPER_URL = 'https://arjenofficial.com';

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  isDayMode = false,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const chrome = getChromeTheme(isDayMode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute bottom-14 right-0 z-[60] w-56 origin-bottom-right overflow-hidden rounded-xl border backdrop-blur-xl animate-scale-in transition-colors duration-500 ${chrome.panelSolid}`}
    >
      <div className={`border-b px-4 py-3 ${chrome.header}`}>
        <div className={`flex items-center gap-2 ${chrome.muted}`}>
          <FaEllipsisH size={12} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
        </div>
      </div>

      <div className="space-y-1 p-2">
        <MenuItem
          icon={<FaCog size={13} />}
          label="Settings"
          isDayMode={isDayMode}
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
        />

        <div className={`mx-2 my-1 h-px ${chrome.divider}`} />

        <MenuItem
          icon={<FaCode size={13} />}
          label="Developer"
          isDayMode={isDayMode}
          onClick={() => {
            window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
            onClose();
          }}
        />
      </div>

      <style jsx>{`
        .animate-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isDayMode: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, isDayMode }) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 active:scale-95 ${
      isDayMode ? 'hover:bg-black/5' : 'hover:bg-[#222]'
    }`}
  >
    <div
      className={`transition-colors duration-200 ${
        isDayMode
          ? 'text-neutral-500 group-hover:text-neutral-900'
          : 'text-gray-500 group-hover:text-white'
      }`}
    >
      {icon}
    </div>
    <span
      className={`text-sm font-medium transition-colors duration-200 ${
        isDayMode
          ? 'text-neutral-600 group-hover:text-neutral-900'
          : 'text-gray-400 group-hover:text-gray-100'
      }`}
    >
      {label}
    </span>
  </button>
);

export default OptionsMenu;
