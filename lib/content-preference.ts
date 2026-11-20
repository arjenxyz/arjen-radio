import type { RadioStation } from '@/lib/radio';

export type ContentLanguage = 'tr' | 'en' | 'both';

export const CONTENT_LANGUAGE_KEY = 'arjen-content-language';

export function hasStoredContentLanguage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const value = window.localStorage.getItem(CONTENT_LANGUAGE_KEY);
    return value === 'tr' || value === 'en' || value === 'both';
  } catch {
    return false;
  }
}

export function loadContentLanguage(): ContentLanguage {
  if (typeof window === 'undefined') return 'both';
  try {
    const value = window.localStorage.getItem(CONTENT_LANGUAGE_KEY);
    if (value === 'tr' || value === 'en' || value === 'both') return value;
  } catch {
    // ignore storage failures
  }
  return 'both';
}

export function saveContentLanguage(value: ContentLanguage) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONTENT_LANGUAGE_KEY, value);
  } catch {
    // ignore storage failures
  }
}

export function isTurkishStationLabel(station: RadioStation): boolean {
  return station.artist.toLowerCase().startsWith('türkçe')
    || station.artist.toLowerCase().startsWith('turkce');
}

export function filterStationsByLanguage(
  stations: RadioStation[],
  preference: ContentLanguage
): RadioStation[] {
  if (preference === 'both') return stations;
  return stations.filter((station) => {
    const isTr = isTurkishStationLabel(station);
    return preference === 'tr' ? isTr : !isTr;
  });
}

export function preferenceLabel(preference: ContentLanguage): string {
  switch (preference) {
    case 'tr':
      return 'Türkçe';
    case 'en':
      return 'English';
    default:
      return 'Türkçe + English';
  }
}
