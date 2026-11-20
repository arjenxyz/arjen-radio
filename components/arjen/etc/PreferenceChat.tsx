import React, { useEffect, useState } from 'react';
import { getChromeTheme } from '@/lib/chrome-theme';
import {
  preferenceLabel,
  type ContentLanguage,
} from '@/lib/content-preference';

interface PreferenceChatProps {
  visible: boolean;
  preference: ContentLanguage;
  hasPreference: boolean;
  onChange: (value: ContentLanguage) => void;
  isDayMode?: boolean;
}

const OPTIONS: Array<{ value: ContentLanguage; label: string }> = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
  { value: 'both', label: 'Both' },
];

const PreferenceChat: React.FC<PreferenceChatProps> = ({
  visible,
  preference,
  hasPreference,
  onChange,
  isDayMode = false,
}) => {
  const chrome = getChromeTheme(isDayMode);
  const [choosing, setChoosing] = useState(!hasPreference);

  useEffect(() => {
    if (!visible) return;
    setChoosing(!hasPreference);
  }, [visible, hasPreference]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[55] flex items-center justify-center px-5 md:hidden"
      style={{
        top: 'calc(5.5rem + env(safe-area-inset-top))',
        bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`pointer-events-auto w-full max-w-[320px] space-y-3 rounded-2xl border px-4 py-4 ${chrome.panelSolid}`}
      >
        <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${chrome.muted}`}>
          Assistant
        </p>

        {choosing ? (
          <>
            <p className={`text-[14px] leading-relaxed ${chrome.text}`}>
              Which stations do you want to hear?
            </p>
            <div className="flex flex-wrap gap-2">
              {OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setChoosing(false);
                  }}
                  className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors active:scale-[0.98] ${
                    hasPreference && preference === option.value
                      ? isDayMode
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-white bg-white text-black'
                      : `${chrome.border} ${chrome.text} ${
                          isDayMode ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.06]'
                        }`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className={`text-[14px] leading-relaxed ${chrome.text}`}>
              Showing {preferenceLabel(preference)} stations. Saved for next visits.
            </p>
            <button
              type="button"
              onClick={() => setChoosing(true)}
              className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors active:scale-[0.98] ${chrome.border} ${chrome.text} ${
                isDayMode ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.06]'
              }`}
            >
              Change
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreferenceChat;
