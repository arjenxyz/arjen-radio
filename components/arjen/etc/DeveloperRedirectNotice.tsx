import React, { useEffect, useState } from 'react';
import { getChromeTheme } from '@/lib/chrome-theme';

export const DEVELOPER_URL = 'https://arjenofficial.com';
const REDIRECT_SECONDS = 5;

interface DeveloperRedirectNoticeProps {
  visible: boolean;
  onCancel: () => void;
  isDayMode?: boolean;
}

const DeveloperRedirectNotice: React.FC<DeveloperRedirectNoticeProps> = ({
  visible,
  onCancel,
  isDayMode = false,
}) => {
  const chrome = getChromeTheme(isDayMode);
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(REDIRECT_SECONDS);
      return;
    }

    setSecondsLeft(REDIRECT_SECONDS);
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible || secondsLeft > 0) return;
    window.open(DEVELOPER_URL, '_blank', 'noopener,noreferrer');
    onCancel();
  }, [visible, secondsLeft, onCancel]);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-3 opacity-0'
      }`}
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
      aria-hidden={!visible}
    >
      <div
        role="status"
        className={`pointer-events-auto w-full max-w-[300px] rounded-2xl border px-5 py-5 text-center ${chrome.panelSolid} ${
          visible ? '' : 'pointer-events-none'
        }`}
      >
        <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${chrome.muted}`}>
          Leaving Arjen Radio
        </p>
        <p
          className="mt-3 font-mono text-[15px] font-semibold underline underline-offset-4"
          style={{ color: chrome.accentOnPanel }}
        >
          arjenofficial.com
        </p>
        <p className={`mt-2 text-[13px] ${chrome.soft}`}>
          Opens in {secondsLeft}s
        </p>
        <button
          type="button"
          onClick={onCancel}
          className={`mt-5 w-full rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors active:scale-[0.98] ${chrome.border} ${chrome.text} ${
            isDayMode ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.06]'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeveloperRedirectNotice;
