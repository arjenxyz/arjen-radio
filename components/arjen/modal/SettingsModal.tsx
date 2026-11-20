import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ARJEN_COLORS } from '@/lib/branding';
import { getChromeTheme } from '@/lib/chrome-theme';
import { t, type LocaleCode } from '@/lib/locale';
import { useDraggable, getCenteredPanelPosition } from '@/components/arjen/hooks/useDraggable';

export interface AppSettings {
  hideElements: boolean;
  showClock: boolean;
  shortcuts: boolean;
  showTitles: boolean;
  hideTime: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  isDayMode?: boolean;
  locale: LocaleCode;
  onLocaleChange: (locale: LocaleCode) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isDayMode = false,
  locale,
  onLocaleChange,
}) => {
  const { panelRef: modalRef, position, setPosition, dragHandleProps } = useDraggable();
  const isInitialized = useRef(false);
  const chrome = getChromeTheme(isDayMode);

  useEffect(() => {
    if (isOpen && modalRef.current && !isInitialized.current) {
      setPosition(getCenteredPanelPosition(modalRef.current));
      isInitialized.current = true;
    }

    if (!isOpen) {
      isInitialized.current = false;
    }
  }, [isOpen, modalRef, setPosition]);

  if (!isOpen) return null;

  const update = (key: keyof AppSettings, value: boolean | number) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 5;
    val = Math.max(1, Math.min(10, val));
    update('hideTime', val);
  };

  return (
    <div
      ref={modalRef}
      className={`fixed z-[9999] flex w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border animate-scale-in transition-colors duration-500 ${chrome.panelSolid}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div
        className="flex cursor-move touch-none select-none items-center justify-between px-6 pb-2 pt-6"
        {...dragHandleProps}
      >
        <h2 className={`pointer-events-none text-lg font-bold ${chrome.text}`}>
          {t(locale, 'settings')}
        </h2>
        <button
          onClick={onClose}
          className={`cursor-pointer transition-colors ${chrome.muted}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaTimes size={16} />
        </button>
      </div>

      <div className="space-y-7 p-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-[15px] font-medium ${chrome.text}`}>{t(locale, 'language')}</h3>
          <div className={`flex rounded-lg border p-0.5 ${chrome.borderSubtle}`}>
            {(['en', 'tr'] as const).map((code) => {
              const active = locale === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onLocaleChange(code)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors ${
                    active
                      ? isDayMode
                        ? 'bg-neutral-950 text-white'
                        : 'bg-white text-black'
                      : chrome.muted
                  }`}
                >
                  {t(locale, code === 'en' ? 'languageEn' : 'languageTr')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <h3 className={`mb-1 text-[15px] font-medium ${chrome.text}`}>
                {t(locale, 'hideElements')}
              </h3>
              <p className={`text-[13px] leading-snug ${chrome.muted}`}>
                {t(locale, 'hideElementsDesc')}
              </p>
            </div>
            <AccentSwitch
              checked={settings.hideElements}
              onChange={() => update('hideElements', !settings.hideElements)}
              isDayMode={isDayMode}
            />
          </div>
          {settings.hideElements && (
            <div className="animate-fade-in">
              <div
                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${chrome.surfaceStrong} ${chrome.borderSubtle}`}
              >
                <span className={`text-[14px] font-medium ${chrome.muted}`}>
                  {t(locale, 'hideAfter')}
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={settings.hideTime}
                    onChange={handleTimeInput}
                    className={`w-6 appearance-none bg-transparent text-right text-[14px] font-bold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${chrome.text}`}
                    min={1}
                    max={10}
                  />
                  <span
                    className="ml-0.5 text-[14px] font-bold"
                    style={{ color: ARJEN_COLORS.accent }}
                  >
                    {t(locale, 'sec')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <SettingItem
            label={t(locale, 'showTitles')}
            desc={t(locale, 'showTitlesDesc')}
            checked={settings.showTitles}
            onChange={() => update('showTitles', !settings.showTitles)}
            isDayMode={isDayMode}
          />
          <SettingItem
            label={t(locale, 'showClock')}
            checked={settings.showClock}
            onChange={() => update('showClock', !settings.showClock)}
            isDayMode={isDayMode}
          />
          <div className="hidden md:block">
            <SettingItem
              label={t(locale, 'shortcuts')}
              desc={t(locale, 'shortcutsDesc')}
              checked={settings.shortcuts}
              onChange={() => update('shortcuts', !settings.shortcuts)}
              isDayMode={isDayMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({
  label,
  desc,
  checked,
  onChange,
  isDayMode,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: () => void;
  isDayMode: boolean;
}) => {
  const chrome = getChromeTheme(isDayMode);
  return (
    <div className="flex items-start justify-between">
      <div className="pr-4">
        <h3 className={`mb-1 text-[15px] font-medium ${chrome.text}`}>{label}</h3>
        {desc && <p className={`text-[13px] leading-snug ${chrome.muted}`}>{desc}</p>}
      </div>
      <AccentSwitch checked={checked} onChange={onChange} isDayMode={isDayMode} />
    </div>
  );
};

const AccentSwitch = ({
  checked,
  onChange,
  isDayMode,
}: {
  checked: boolean;
  onChange: () => void;
  isDayMode: boolean;
}) => (
  <button
    onClick={onChange}
    className={`relative h-[28px] w-[50px] shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
      checked ? '' : isDayMode ? 'bg-neutral-300' : 'bg-[#3f3f46]'
    }`}
    style={checked ? { backgroundColor: ARJEN_COLORS.accent } : undefined}
  >
    <div
      className={`absolute left-[2px] top-[2px] h-[24px] w-[24px] rounded-full bg-white shadow-md transition-transform duration-200 ${
        checked ? 'translate-x-[22px]' : 'translate-x-0'
      }`}
    />
  </button>
);

export default SettingsModal;
