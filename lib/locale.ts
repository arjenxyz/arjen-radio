export type LocaleCode = 'en' | 'tr';

export const LOCALE_PREF_KEY = 'arjen-locale';

const MESSAGES = {
  en: {
    travel: 'Travel',
    travelLocating: 'Locating…',
    travelIntro: 'Share location on the road to follow nearby Turkish cities.',
    travelAllow: 'Allow location',
    travelTurnOff: 'Turn off',
    travelDisclaimer:
      'In development — location and station matching may not always be accurate.',
    travelPermissionDenied: 'Location permission denied.',
    travelUnavailable: 'Location is not available on this device.',
    travelGpsSlow: 'GPS is slow or unavailable — retry from Travel.',
    settings: 'Settings',
    language: 'Language',
    languageEn: 'EN',
    languageTr: 'TR',
    hideElements: 'Hide Elements',
    hideElementsDesc: 'Hide the interface after a period of inactivity.',
    hideAfter: 'Hide After',
    sec: 'sec',
    showTitles: 'Show Titles',
    showTitlesDesc: 'Toggle main headers visibility.',
    showClock: 'Show Clock',
    shortcuts: 'Keyboard Shortcuts',
    shortcutsDesc: 'Use [SPACE] to pause and [M] to mute.',
  },
  tr: {
    travel: 'Travel',
    travelLocating: 'Konum alınıyor…',
    travelIntro: 'Yolda yakındaki Türkiye şehirlerini takip etmek için konumunu paylaş.',
    travelAllow: 'Konuma izin ver',
    travelTurnOff: 'Kapat',
    travelDisclaimer:
      'Geliştirme aşamasında — konum ve istasyon eşleşmesi henüz her zaman doğru olmayabilir.',
    travelPermissionDenied: 'Konum izni reddedildi.',
    travelUnavailable: 'Bu cihazda konum kullanılamıyor.',
    travelGpsSlow: 'GPS yavaş veya yok — Travel’dan yeniden dene.',
    settings: 'Ayarlar',
    language: 'Dil',
    languageEn: 'EN',
    languageTr: 'TR',
    hideElements: 'Öğeleri Gizle',
    hideElementsDesc: 'Hareketsizlikten sonra arayüzü gizle.',
    hideAfter: 'Gizleme süresi',
    sec: 'sn',
    showTitles: 'Başlıkları Göster',
    showTitlesDesc: 'Ana başlıkların görünürlüğünü aç/kapat.',
    showClock: 'Saati Göster',
    shortcuts: 'Klavye Kısayolları',
    shortcutsDesc: '[SPACE] ile duraklat, [M] ile sessize al.',
  },
} as const;

export type MessageKey = keyof typeof MESSAGES.en;

export function detectDeviceLocale(): LocaleCode {
  if (typeof navigator === 'undefined') return 'en';
  const raw = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  return raw.startsWith('tr') ? 'tr' : 'en';
}

export function t(locale: LocaleCode, key: MessageKey): string {
  return MESSAGES[locale][key] ?? MESSAGES.en[key];
}

/** Saved choice, or device language on first visit. */
export function loadLocale(): LocaleCode {
  if (typeof window === 'undefined') return 'en';
  try {
    const raw = window.localStorage.getItem(LOCALE_PREF_KEY);
    if (raw === 'en' || raw === 'tr') return raw;
  } catch {
    // ignore
  }
  return detectDeviceLocale();
}

export function saveLocale(locale: LocaleCode) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCALE_PREF_KEY, locale);
  } catch {
    // ignore
  }
}
