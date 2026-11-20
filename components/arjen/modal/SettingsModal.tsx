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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onLocaleChange('en')}
              aria-label="English"
              aria-pressed={locale === 'en'}
              className={`rounded-md p-0.5 transition-opacity active:scale-95 ${
                locale === 'en' ? 'opacity-100 ring-2 ring-white/80' : 'opacity-45 hover:opacity-80'
              }`}
            >
              <FlagEn className="h-5 w-7 overflow-hidden rounded-[3px]" />
            </button>
            <button
              type="button"
              onClick={() => onLocaleChange('tr')}
              aria-label="Türkçe"
              aria-pressed={locale === 'tr'}
              className={`rounded-md p-0.5 transition-opacity active:scale-95 ${
                locale === 'tr' ? 'opacity-100 ring-2 ring-white/80' : 'opacity-45 hover:opacity-80'
              }`}
            >
              <FlagTr className="h-5 w-7 overflow-hidden rounded-[3px]" />
            </button>
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

/** Compact UK flag — English locale. */
const FlagEn = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 40" className={className} aria-hidden>
    <rect width="60" height="40" fill="#012169" />
    <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
    <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="5" />
    <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="12" />
    <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="7" />
  </svg>
);

/** Compact Turkish flag. */
const FlagTr = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 40" className={className} aria-hidden>
    <rect width="60" height="40" fill="#E30A17" />
    <circle cx="24" cy="20" r="10" fill="#fff" />
    <circle cx="28" cy="20" r="8" fill="#E30A17" />
    <polygon
      fill="#fff"
      points="36.2,20 40.8,21.5 37.4,24.6 41.5,27.2 37,27.1 36.2,31.5 34.1,27.5 29.6,28.8 32.3,25.1 29.1,22 33.5,22.2"
    />
  </svg>
);

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
