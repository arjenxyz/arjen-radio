export type LocaleCode = 'en' | 'tr';

export const LOCALE_PREF_KEY = 'arjen-locale';

const MESSAGES = {
  en: {
    // Clock
    goodMorning: 'GOOD MORNING',
    goodAfternoon: 'GOOD AFTERNOON',
    goodEvening: 'GOOD EVENING',
    goodNight: 'GOOD NIGHT',

    // Center / brand status
    liveBroadcast: 'Live Broadcast',
    pausedStart: 'Paused · Tap to Start',

    // Now playing
    nowPlaying: 'Now Playing',

    // Menus
    menu: 'Menu',
    volume: 'Volume',
    atmosphere: 'Atmosphere',
    atmosphereHint: 'Pick a scene',
    stations: 'Stations',
    stationsHint: 'Pick a stream',
    travel: 'Travel',
    day: 'Day',
    night: 'Night',
    settings: 'Settings',
    developer: 'Developer',
    more: 'More',
    close: 'Close',

    // Settings
    language: 'Language',
    hideElements: 'Hide Elements',
    hideElementsDesc: 'Hide UI after inactivity.',
    hideAfter: 'Hide After',
    sec: 'sec',
    showTitles: 'Show Titles',
    showTitlesDesc: 'Show or hide main titles.',
    showClock: 'Show Clock',
    shortcuts: 'Keyboard Shortcuts',
    shortcutsDesc: '[SPACE] pause · [M] mute',

    // Travel
    travelLocating: 'Locating…',
    travelIdleTitle: 'On the road',
    travelIntro: 'Share location to retune as you pass Turkish cities.',
    travelAllow: 'Allow location',
    travelTurnOff: 'Turn off location',
    travelDisclaimer: 'Preview — matching may be imprecise.',
    travelPermissionDenied: 'Location permission denied.',
    travelUnavailable: 'Location is not available on this device.',
    travelGpsSlow: 'GPS is slow or unavailable — retry from Travel.',
    travelEntering: 'ENTERING',
    travelLocalStation: 'Local station',
    travelRegionalVibe: 'Regional vibe',

    // Developer redirect
    leavingArjen: 'Leaving Arjen Radio',
    opensIn: 'Opens in {s}s',
    cancel: 'Cancel',

    // Control / a11y
    previousStation: 'Previous station',
    nextStation: 'Next station',
    play: 'Play',
    pause: 'Pause',
    switchDay: 'Switch to day mode',
    switchNight: 'Switch to night mode',
    changeStation: 'Change station',
    closeMenu: 'Close menu',
    moreOptions: 'More options',
    closeVolume: 'Close volume',

    // Load states
    connecting: 'Connecting…',
    tuningStations: 'TUNING LIVE STATIONS…',
    loadStationsFailed: 'Could not load radio stations',
    noStations: 'No stations available',
    failedStations: 'Failed to load stations',
    retry: 'Retry',
  },
  tr: {
    goodMorning: 'GÜNAYDIN',
    goodAfternoon: 'İYİ GÜNLER',
    goodEvening: 'İYİ AKŞAMLAR',
    goodNight: 'İYİ GECELER',

    liveBroadcast: 'Canlı Yayın',
    pausedStart: 'Durdu · Başlat',

    nowPlaying: 'Çalıyor',

    menu: 'Menü',
    volume: 'Ses',
    atmosphere: 'Atmosfer',
    atmosphereHint: 'Sahne seç',
    stations: 'İstasyonlar',
    stationsHint: 'Yayın seç',
    travel: 'Travel',
    day: 'Gündüz',
    night: 'Gece',
    settings: 'Ayarlar',
    developer: 'Geliştirici',
    more: 'Diğer',
    close: 'Kapat',

    language: 'Dil',
    hideElements: 'Öğeleri Gizle',
    hideElementsDesc: 'Hareketsizlikte arayüzü gizle.',
    hideAfter: 'Süre',
    sec: 'sn',
    showTitles: 'Başlıklar',
    showTitlesDesc: 'Ana başlıkları göster/gizle.',
    showClock: 'Saat',
    shortcuts: 'Kısayollar',
    shortcutsDesc: '[SPACE] duraklat · [M] sessiz',

    travelLocating: 'Konum…',
    travelIdleTitle: 'Yolda',
    travelIntro: 'Türkiye şehirlerinden geçerken istasyon ve atmosferi otomatik güncelle.',
    travelAllow: 'Konuma izin ver',
    travelTurnOff: 'Konumu kapat',
    travelDisclaimer: 'Önizleme — eşleşme her zaman doğru olmayabilir.',
    travelPermissionDenied: 'Konum izni reddedildi.',
    travelUnavailable: 'Bu cihazda konum yok.',
    travelGpsSlow: 'GPS yavaş — Travel’dan yeniden dene.',
    travelEntering: 'GİRİŞ',
    travelLocalStation: 'Yerel istasyon',
    travelRegionalVibe: 'Bölge hissi',

    leavingArjen: 'Arjen Radio’dan çıkış',
    opensIn: '{s} sn içinde açılır',
    cancel: 'İptal',

    previousStation: 'Önceki istasyon',
    nextStation: 'Sonraki istasyon',
    play: 'Oynat',
    pause: 'Duraklat',
    switchDay: 'Gündüz moduna geç',
    switchNight: 'Gece moduna geç',
    changeStation: 'İstasyon değiştir',
    closeMenu: 'Menüyü kapat',
    moreOptions: 'Diğer seçenekler',
    closeVolume: 'Sesi kapat',

    connecting: 'Bağlanıyor…',
    tuningStations: 'CANLI YAYIN AYARLANIYOR…',
    loadStationsFailed: 'Radyo istasyonları yüklenemedi',
    noStations: 'İstasyon yok',
    failedStations: 'İstasyonlar yüklenemedi',
    retry: 'Yenile',
  },
} as const;

/** Short scene titles — kept compact so atmosphere cards don’t wrap. */
const SCENE_NAMES: Record<LocaleCode, Record<string, string>> = {
  en: {
    'mountain-cat': 'Mountain Cat',
    'adventure-stars': 'Adventure Stars',
    'space-cats': 'Space Cats',
    'patrick-moon': 'Patrick Moon',
    'rick-lab': "Rick's Lab",
    'pony-party': 'Pony Party',
    'pixel-hills': 'Pixel Hills',
    'shrek-forest': 'Shrek Forest',
    'lock-in': 'Lock In',
    'minecraft-coast': 'Minecraft Coast',
    'rick-sunset': "Rick's Sunset",
    'tablet-screen': 'Tablet Screen',
    'school-of-athens': 'School of Athens',
    'serio-bunito': 'Serio e Bunito',
  },
  tr: {
    'mountain-cat': 'Dağ Kedisi',
    'adventure-stars': 'Macera Yıldızları',
    'space-cats': 'Uzay Kedileri',
    'patrick-moon': 'Patrick Ayı',
    'rick-lab': "Rick'in Labı",
    'pony-party': 'Pony Partisi',
    'pixel-hills': 'Piksel Tepeler',
    'shrek-forest': 'Shrek Ormanı',
    'lock-in': 'Odaklan',
    'minecraft-coast': 'Minecraft Sahili',
    'rick-sunset': 'Rick Günbatımı',
    'tablet-screen': 'Tablet Ekranı',
    'school-of-athens': 'Atina Okulu',
    'serio-bunito': 'Serio e Bunito',
  },
};

export type MessageKey = keyof typeof MESSAGES.en;

export function sceneDisplayName(
  locale: LocaleCode,
  sceneId: string,
  fallback: string
): string {
  return SCENE_NAMES[locale][sceneId] ?? SCENE_NAMES.en[sceneId] ?? fallback;
}

export function detectDeviceLocale(): LocaleCode {
  if (typeof navigator === 'undefined') return 'en';
  const raw = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  return raw.startsWith('tr') ? 'tr' : 'en';
}

export function dateLocaleTag(locale: LocaleCode): string {
  return locale === 'tr' ? 'tr-TR' : 'en-US';
}

export function t(locale: LocaleCode, key: MessageKey): string {
  return MESSAGES[locale][key] ?? MESSAGES.en[key];
}

export function tf(
  locale: LocaleCode,
  key: MessageKey,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    t(locale, key)
  );
}

export function greetingForHour(locale: LocaleCode, hour: number): string {
  if (hour >= 5 && hour < 12) return t(locale, 'goodMorning');
  if (hour >= 12 && hour < 17) return t(locale, 'goodAfternoon');
  if (hour >= 17 && hour < 22) return t(locale, 'goodEvening');
  return t(locale, 'goodNight');
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
