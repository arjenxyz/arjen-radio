import type { RadioStation } from '@/lib/radio';

export const TRAVEL_MODE_KEY = 'arjen-travel-mode';

/** Soft warning radius; we still snap to the nearest mapped city beyond this. */
export const TRAVEL_CITY_RADIUS_KM = 180;

/** Max cities kept on the in-session trip strip. */
export const TRAVEL_TRIP_MAX = 8;

export type TravelRegionId =
  | 'marmara'
  | 'ege'
  | 'akdeniz'
  | 'ic-anadolu'
  | 'karadeniz'
  | 'dogu';

export interface TravelRegion {
  id: TravelRegionId;
  name: string;
  /** Tokens matched against station title/artist/url for regional fallback. */
  aliases: string[];
  sceneId: string;
}

export interface TurkeyCity {
  id: string;
  name: string;
  /** Lowercase tokens matched against station title/artist. */
  aliases: string[];
  lat: number;
  lng: number;
  /** Preferred atmosphere scene id when no station match exists. */
  sceneId: string;
  regionId: TravelRegionId;
}

export type TravelStationMatch = 'city' | 'region' | 'none';

export interface TravelRetune {
  index: number;
  match: TravelStationMatch;
}

export interface TravelCrossingInfo {
  cityName: string;
  regionName: string;
  match: TravelStationMatch;
}

export const TRAVEL_REGIONS: Record<TravelRegionId, TravelRegion> = {
  marmara: {
    id: 'marmara',
    name: 'Marmara',
    aliases: ['marmara', 'istanbul', 'bursa', 'sakarya', 'çanakkale', 'canakkale', 'tekirdağ', 'tekirdag'],
    sceneId: 'lock-in',
  },
  ege: {
    id: 'ege',
    name: 'Ege',
    aliases: ['ege', 'izmir', 'hey radyo', 'radyoizmir', 'kuşadası', 'kusadasi', 'aydın', 'aydin'],
    sceneId: 'minecraft-coast',
  },
  akdeniz: {
    id: 'akdeniz',
    name: 'Akdeniz',
    aliases: ['akdeniz', 'antalya', 'mersin', 'adana', 'alanya', 'side'],
    sceneId: 'rick-sunset',
  },
  'ic-anadolu': {
    id: 'ic-anadolu',
    name: 'İç Anadolu',
    aliases: ['anadolu', 'ankara', 'konya', 'kayseri', 'eskişehir', 'eskisehir'],
    sceneId: 'pixel-hills',
  },
  karadeniz: {
    id: 'karadeniz',
    name: 'Karadeniz',
    aliases: [
      'karadeniz',
      'trabzon',
      'samsun',
      'sinop',
      'zonguldak',
      'bolu',
      'rize',
      'ordu',
      'giresun',
    ],
    sceneId: 'mountain-cat',
  },
  dogu: {
    id: 'dogu',
    name: 'Doğu',
    aliases: ['diyarbakır', 'diyarbakir', 'gaziantep', 'antep', 'urfa', 'van', 'erzurum'],
    sceneId: 'tablet-screen',
  },
};

export const TURKEY_CITIES: TurkeyCity[] = [
  {
    id: 'istanbul',
    name: 'İstanbul',
    aliases: ['istanbul', 'bosphorus', 'boğaz', 'bogaz'],
    lat: 41.0082,
    lng: 28.9784,
    sceneId: 'lock-in',
    regionId: 'marmara',
  },
  {
    id: 'ankara',
    name: 'Ankara',
    aliases: ['ankara'],
    lat: 39.9334,
    lng: 32.8597,
    sceneId: 'pixel-hills',
    regionId: 'ic-anadolu',
  },
  {
    id: 'izmir',
    name: 'İzmir',
    aliases: ['izmir', 'ege', 'hey radyo', 'radyoizmir'],
    lat: 38.4192,
    lng: 27.1287,
    sceneId: 'minecraft-coast',
    regionId: 'ege',
  },
  {
    id: 'antalya',
    name: 'Antalya',
    aliases: ['antalya', 'alanya', 'side'],
    lat: 36.8969,
    lng: 30.7133,
    sceneId: 'rick-sunset',
    regionId: 'akdeniz',
  },
  {
    id: 'bursa',
    name: 'Bursa',
    aliases: ['bursa'],
    lat: 40.1885,
    lng: 29.061,
    sceneId: 'shrek-forest',
    regionId: 'marmara',
  },
  {
    id: 'adana',
    name: 'Adana',
    aliases: ['adana'],
    lat: 37.0,
    lng: 35.3213,
    sceneId: 'pony-party',
    regionId: 'akdeniz',
  },
  {
    id: 'gaziantep',
    name: 'Gaziantep',
    aliases: ['gaziantep', 'antep'],
    lat: 37.0662,
    lng: 37.3833,
    sceneId: 'rick-lab',
    regionId: 'dogu',
  },
  {
    id: 'konya',
    name: 'Konya',
    aliases: ['konya'],
    lat: 37.8746,
    lng: 32.4932,
    sceneId: 'school-of-athens',
    regionId: 'ic-anadolu',
  },
  {
    id: 'trabzon',
    name: 'Trabzon',
    aliases: ['trabzon', 'karadeniz'],
    lat: 41.0027,
    lng: 39.7168,
    sceneId: 'mountain-cat',
    regionId: 'karadeniz',
  },
  {
    id: 'samsun',
    name: 'Samsun',
    aliases: ['samsun'],
    lat: 41.2867,
    lng: 36.33,
    sceneId: 'adventure-stars',
    regionId: 'karadeniz',
  },
  {
    id: 'eskisehir',
    name: 'Eskişehir',
    aliases: ['eskişehir', 'eskisehir'],
    lat: 39.7767,
    lng: 30.5206,
    sceneId: 'serio-bunito',
    regionId: 'ic-anadolu',
  },
  {
    id: 'diyarbakir',
    name: 'Diyarbakır',
    aliases: ['diyarbakır', 'diyarbakir'],
    lat: 37.9144,
    lng: 40.2306,
    sceneId: 'tablet-screen',
    regionId: 'dogu',
  },
  {
    id: 'mersin',
    name: 'Mersin',
    aliases: ['mersin', 'içel', 'icel'],
    lat: 36.8121,
    lng: 34.6415,
    sceneId: 'patrick-moon',
    regionId: 'akdeniz',
  },
  {
    id: 'kayseri',
    name: 'Kayseri',
    aliases: ['kayseri'],
    lat: 38.7312,
    lng: 35.4787,
    sceneId: 'space-cats',
    regionId: 'ic-anadolu',
  },
  {
    id: 'canakkale',
    name: 'Çanakkale',
    aliases: ['çanakkale', 'canakkale', 'gökçeada', 'gokceada'],
    lat: 40.1553,
    lng: 26.4142,
    sceneId: 'minecraft-coast',
    regionId: 'marmara',
  },
  {
    id: 'kastamonu',
    name: 'Kastamonu',
    aliases: ['kastamonu', 'daday'],
    lat: 41.3887,
    lng: 33.7827,
    sceneId: 'shrek-forest',
    regionId: 'karadeniz',
  },
  {
    id: 'sinop',
    name: 'Sinop',
    aliases: ['sinop'],
    lat: 42.0267,
    lng: 35.1551,
    sceneId: 'minecraft-coast',
    regionId: 'karadeniz',
  },
  {
    id: 'zonguldak',
    name: 'Zonguldak',
    aliases: ['zonguldak'],
    lat: 41.4564,
    lng: 31.7987,
    sceneId: 'mountain-cat',
    regionId: 'karadeniz',
  },
  {
    id: 'bolu',
    name: 'Bolu',
    aliases: ['bolu'],
    lat: 40.735,
    lng: 31.6061,
    sceneId: 'pixel-hills',
    regionId: 'karadeniz',
  },
  {
    id: 'sakarya',
    name: 'Sakarya',
    aliases: ['sakarya', 'adapazarı', 'adapazari'],
    lat: 40.7889,
    lng: 30.4053,
    sceneId: 'lock-in',
    regionId: 'marmara',
  },
];

/** Minimum score from a real name hit — never treat "Türkçe" alone as a match. */
const MIN_MATCH_SCORE = 3;

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestCity(
  lat: number,
  lng: number
): { city: TurkeyCity; distanceKm: number } {
  let best: { city: TurkeyCity; distanceKm: number } = {
    city: TURKEY_CITIES[0],
    distanceKm: distanceKm(lat, lng, TURKEY_CITIES[0].lat, TURKEY_CITIES[0].lng),
  };

  for (const city of TURKEY_CITIES) {
    const d = distanceKm(lat, lng, city.lat, city.lng);
    if (d < best.distanceKm) {
      best = { city, distanceKm: d };
    }
  }

  return best;
}

export function getCityRegion(city: TurkeyCity): TravelRegion {
  return TRAVEL_REGIONS[city.regionId];
}

function scoreAgainstAliases(station: RadioStation, aliases: string[]): number {
  const haystack = `${station.title} ${station.artist} ${station.url}`.toLocaleLowerCase('tr-TR');
  let score = 0;

  for (const alias of aliases) {
    const token = alias.toLocaleLowerCase('tr-TR');
    if (!token || token.length < 3) continue;
    if (haystack.includes(token)) {
      score += token.length >= 5 ? 5 : 3;
    }
  }

  return score;
}

export function scoreStationForCity(station: RadioStation, city: TurkeyCity): number {
  return scoreAgainstAliases(station, city.aliases);
}

export function scoreStationForRegion(station: RadioStation, region: TravelRegion): number {
  return scoreAgainstAliases(station, region.aliases);
}

function findBestIndexByScore(
  stations: RadioStation[],
  scoreFn: (station: RadioStation) => number
): number {
  let bestIndex = -1;
  let bestScore = 0;

  stations.forEach((station, index) => {
    const score = scoreFn(station);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestScore >= MIN_MATCH_SCORE ? bestIndex : -1;
}

export function findBestStationIndexForCity(
  stations: RadioStation[],
  city: TurkeyCity
): number {
  return findBestIndexByScore(stations, (station) => scoreStationForCity(station, city));
}

export function findBestStationIndexForRegion(
  stations: RadioStation[],
  region: TravelRegion
): number {
  return findBestIndexByScore(stations, (station) => scoreStationForRegion(station, region));
}

/** City hit first; otherwise regional vibe — never a random Turkish station. */
export function findTravelStationIndex(
  stations: RadioStation[],
  city: TurkeyCity
): TravelRetune {
  const cityIndex = findBestStationIndexForCity(stations, city);
  if (cityIndex >= 0) {
    return { index: cityIndex, match: 'city' };
  }

  const region = getCityRegion(city);
  const regionIndex = findBestStationIndexForRegion(stations, region);
  if (regionIndex >= 0) {
    return { index: regionIndex, match: 'region' };
  }

  return { index: -1, match: 'none' };
}

export function appendTripCity(trail: string[], cityId: string, max = TRAVEL_TRIP_MAX): string[] {
  if (trail[trail.length - 1] === cityId) return trail;
  const next = [...trail, cityId];
  return next.length > max ? next.slice(next.length - max) : next;
}

export function tripCityNames(trail: string[]): string[] {
  const byId = new Map(TURKEY_CITIES.map((city) => [city.id, city.name]));
  return trail.map((id) => byId.get(id)).filter((name): name is string => Boolean(name));
}

export function loadTravelModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(TRAVEL_MODE_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveTravelModeEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TRAVEL_MODE_KEY, enabled ? 'on' : 'off');
  } catch {
    // ignore
  }
}
