import React, { useEffect, useState } from 'react';
import { FaCode, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { getChromeTheme } from '@/lib/chrome-theme';
import { ARJEN_COLORS } from '@/lib/branding';

export const DEVELOPER_URL = 'https://arjenofficial.com';
const REDIRECT_SECONDS = 5;

interface DeveloperRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDayMode?: boolean;
}

const DeveloperRedirectModal: React.FC<DeveloperRedirectModalProps> = ({
  isOpen,
  onClose,
  isDayMode = false,
}) => {
  const chrome = getChromeTheme(isDayMode);
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(REDIRECT_SECONDS);
      return;
    }

    setSecondsLeft(REDIRECT_SECONDS);
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || secondsLeft > 0) return;

    window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
    onClose();
  }, [isOpen, secondsLeft, onClose]);

  if (!isOpen) return null;

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 backdrop-blur-md ${
          isDayMode ? 'bg-white/30' : 'bg-black/50'
        }`}
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="developer-redirect-title"
        className={`relative z-10 w-full max-w-[340px] overflow-hidden rounded-2xl border animate-scale-in ${chrome.panelSolid}`}
      >
        <div className={`flex items-center justify-between border-b px-5 py-4 ${chrome.header}`}>
          <div className="flex items-center gap-2">
            <FaCode size={12} className={chrome.muted} />
            <span
              id="developer-redirect-title"
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${chrome.muted}`}
            >
              Developer
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel redirect"
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${chrome.close}`}
          >
            <FaTimes size={11} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <p className={`text-[14px] leading-relaxed ${chrome.text}`}>
            You are leaving Arjen Radio and will open the developer site in a new tab.
          </p>

          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${chrome.border} ${chrome.surface}`}
          >
            <FaExternalLinkAlt size={11} style={{ color: chrome.accentOnPanel }} />
            <span
              className="min-w-0 truncate font-mono text-[12px] font-medium"
              style={{ color: chrome.accentOnPanel }}
            >
              {DEVELOPER_URL.replace(/^https?:\/\//, '')}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[12px] ${chrome.muted}`}>Redirecting in</span>
              <span className={`font-mono text-[13px] font-bold ${chrome.text}`}>
                {secondsLeft}s
              </span>
            </div>
            <div
              className={`h-1.5 overflow-hidden rounded-full ${
                isDayMode ? 'bg-neutral-200' : 'bg-white/10'
              }`}
            >
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                style={{
                  width: `${progress}%`,
                  backgroundColor: ARJEN_COLORS.accent,
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors active:scale-[0.98] ${chrome.border} ${chrome.text} ${
                isDayMode ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.06]'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
                onClose();
              }}
              className="flex-1 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white transition-opacity active:scale-[0.98] hover:opacity-90"
              style={{ backgroundColor: ARJEN_COLORS.accent }}
            >
              Open now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperRedirectModal;
