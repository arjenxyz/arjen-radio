export interface RadioStation {
  uuid: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export interface RadioBrowserStation {
  stationuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  country: string;
  tags: string;
  language?: string;
  countrycode?: string;
}

export const DEFAULT_STATION_COVER = '/covers/melodydance.gif';

const BLOCKED_STREAM_PATTERNS = [
  '.m3u8',
  '.pls',
  '.asx',
  '.xspf',
  '.flac',
  '/ogg',
  '.opus',
  'application/vnd.apple.mpegurl',
];

const MUSIC_MARKERS = [
  'lofi',
  'lo-fi',
  'lo fi',
  'chillhop',
  'chill hop',
  'lofi beats',
  'study beats',
  'pop',
  'rock',
  'jazz',
  'hip hop',
  'hip-hop',
  'hiphop',
  'rnb',
  'r&b',
  'soul',
  'funk',
  'disco',
  'indie',
  'alternative',
  'metal',
  'punk',
  'blues',
  'country',
  'reggae',
  'latin',
  'electronic',
  'dance',
  'house',
  'techno',
  'edm',
  'hits',
  'top 40',
  'top40',
  'chart',
  'charts',
  'music',
  'turkish',
  'turkce',
  'türkçe',
  'arabesk',
  'slow',
  'romantic',
  'oldies',
  'classic',
  'acoustic',
  'instrumental',
  'chill',
  'beats',
  'turkish pop',
  'turkish rock',
  'turkish rap',
  'arabesk',
  'türkü',
  'turku',
  'slow',
  'nostalji',
  'hits',
  'top 40',
  'top40',
  'müzik',
  'muzik',
  'şarkı',
  'sarki',
];

const NON_MUSIC_TAGS = [
  'news',
  'haber',
  'talk',
  'podcast',
  'sport',
  'drama',
  'dizi',
  'series',
  'serial',
  'christian',
  'religious',
  'gospel',
  'interview',
  'documentary',
  'weather',
  'traffic',
  'politics',
];

const HARD_BLOCKED_KEYWORDS = [
  'news',
  'haber',
  'haberler',
  'franceinfo',
  'talk radio',
  'talk show',
  'podcast',
  'sport',
  'spor',
  'football',
  'futbol',
  'drama',
  'dizi',
  'series',
  'serial',
  'television',
  'bollywood',
  'hindi',
  'tamil',
  'malayali',
  'anime',
  'documentary',
  'belgesel',
  'politics',
  'politik',
  'weather',
  'traffic',
  'sermon',
  'bible',
  'debate',
  'interview',
  'radio drama',
  'hikaye',
  'masal',
  'reklam',
];

const ALLOWED_LANGUAGE_KEYWORDS = [
  'english',
  'turkish',
  'türkçe',
  'turkce',
];

function stationHaystack(station: RadioBrowserStation): string {
  return `${station.name} ${station.tags} ${station.language ?? ''}`.toLowerCase();
}

function tagList(station: RadioBrowserStation): string[] {
  return (station.tags ?? '')
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function isTurkishStation(station: RadioBrowserStation): boolean {
  const language = (station.language ?? '').toLowerCase();
  const haystack = stationHaystack(station);

  return (
    (station.countrycode ?? '').toUpperCase() === 'TR' ||
    ALLOWED_LANGUAGE_KEYWORDS.filter((keyword) => keyword.includes('turk')).some(
      (keyword) => language.includes(keyword) || haystack.includes(keyword)
    )
  );
}

function isEnglishStation(station: RadioBrowserStation): boolean {
  const language = (station.language ?? '').toLowerCase();
  const haystack = stationHaystack(station);
  return language.includes('english') || haystack.includes('english');
}

export function isPlayableStreamUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return !BLOCKED_STREAM_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function isAllowedLanguage(station: RadioBrowserStation): boolean {
  return isTurkishStation(station) || isEnglishStation(station);
}

export function isMusicStation(station: RadioBrowserStation): boolean {
  const name = (station.name ?? '').toLowerCase();
  const tags = tagList(station);
  const haystack = `${name} ${tags.join(' ')}`;

  if (NON_MUSIC_TAGS.some((tag) => tags.includes(tag))) {
    return false;
  }

  return MUSIC_MARKERS.some((marker) => haystack.includes(marker));
}

export function isBlockedContent(station: RadioBrowserStation): boolean {
  const haystack = stationHaystack(station);
  const tags = tagList(station);

  if (tags.some((tag) => NON_MUSIC_TAGS.includes(tag))) {
    return true;
  }

  return HARD_BLOCKED_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

export function isStationAllowed(station: RadioBrowserStation): boolean {
  if (!isPlayableStreamUrl(station.url_resolved ?? '')) return false;
  if (!isAllowedLanguage(station)) return false;
  if (isBlockedContent(station)) return false;
  if (!isMusicStation(station)) return false;
  return true;
}

export function mapRadioBrowserStation(station: RadioBrowserStation): RadioStation | null {
  if (!isStationAllowed(station)) return null;

  const url = station.url_resolved?.trim();
  if (!url) return null;

  const tags = station.tags
    ? station.tags.split(',').slice(0, 2).map((tag) => tag.trim()).filter(Boolean).join(' · ')
    : 'Music';

  const languageLabel = isTurkishStation(station) ? 'Türkçe' : 'English';

  return {
    uuid: station.stationuuid,
    title: station.name || 'Unknown Station',
    artist: `${languageLabel} · ${tags || 'Music'}`,
    url,
    cover: station.favicon?.trim() || DEFAULT_STATION_COVER,
  };
}
