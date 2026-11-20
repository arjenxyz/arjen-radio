import type { RadioStation } from '@/lib/radio';

export const TRAVEL_MODE_KEY = 'arjen-travel-mode';

/** Soft warning radius; we still snap to the nearest mapped city beyond this. */
export const TRAVEL_CITY_RADIUS_KM = 180;

export interface TurkeyCity {
  id: string;
  name: string;
  /** Lowercase tokens matched against station title/artist. */
  aliases: string[];
  lat: number;
  lng: number;
  /** Preferred atmosphere scene id when no station match exists. */
  sceneId: string;
}

export const TURKEY_CITIES: TurkeyCity[] = [
  {
    id: 'istanbul',
    name: 'İstanbul',
    aliases: ['istanbul', 'istanbul', 'bosphorus', 'boğaz', 'bogaz'],
    lat: 41.0082,
    lng: 28.9784,
    sceneId: 'lock-in',
  },
  {
    id: 'ankara',
    name: 'Ankara',
    aliases: ['ankara'],
    lat: 39.9334,
    lng: 32.8597,
    sceneId: 'pixel-hills',
  },
  {
    id: 'izmir',
    name: 'İzmir',
    aliases: ['izmir', 'ege'],
    lat: 38.4192,
    lng: 27.1287,
    sceneId: 'minecraft-coast',
  },
  {
    id: 'antalya',
    name: 'Antalya',
    aliases: ['antalya', 'alanya', 'side'],
    lat: 36.8969,
    lng: 30.7133,
    sceneId: 'rick-sunset',
  },
  {
    id: 'bursa',
    name: 'Bursa',
    aliases: ['bursa'],
    lat: 40.1885,
    lng: 29.061,
    sceneId: 'shrek-forest',
  },
  {
    id: 'adana',
    name: 'Adana',
    aliases: ['adana'],
    lat: 37.0,
    lng: 35.3213,
    sceneId: 'pony-party',
  },
  {
    id: 'gaziantep',
    name: 'Gaziantep',
    aliases: ['gaziantep', 'antep'],
    lat: 37.0662,
    lng: 37.3833,
    sceneId: 'rick-lab',
  },
  {
    id: 'konya',
    name: 'Konya',
    aliases: ['konya'],
    lat: 37.8746,
    lng: 32.4932,
    sceneId: 'school-of-athens',
  },
  {
    id: 'trabzon',
    name: 'Trabzon',
    aliases: ['trabzon', 'karadeniz'],
    lat: 41.0027,
    lng: 39.7168,
    sceneId: 'mountain-cat',
  },
  {
    id: 'samsun',
    name: 'Samsun',
    aliases: ['samsun'],
    lat: 41.2867,
    lng: 36.33,
    sceneId: 'adventure-stars',
  },
  {
    id: 'eskisehir',
    name: 'Eskişehir',
    aliases: ['eskişehir', 'eskisehir'],
    lat: 39.7767,
    lng: 30.5206,
    sceneId: 'serio-bunito',
  },
  {
    id: 'diyarbakir',
    name: 'Diyarbakır',
    aliases: ['diyarbakır', 'diyarbakir'],
    lat: 37.9144,
    lng: 40.2306,
    sceneId: 'tablet-screen',
  },
  {
    id: 'mersin',
    name: 'Mersin',
    aliases: ['mersin', 'içel', 'icel'],
    lat: 36.8121,
    lng: 34.6415,
    sceneId: 'patrick-moon',
  },
  {
    id: 'kayseri',
    name: 'Kayseri',
    aliases: ['kayseri'],
    lat: 38.7312,
    lng: 35.4787,
    sceneId: 'space-cats',
  },
  {
    id: 'canakkale',
    name: 'Çanakkale',
    aliases: ['çanakkale', 'canakkale', 'gökçeada', 'gokceada'],
    lat: 40.1553,
    lng: 26.4142,
    sceneId: 'minecraft-coast',
  },
];

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

/** OpenStreetMap embed centered on the user (no API key). */
export function buildTravelMapEmbedUrl(lat: number, lng: number, span = 0.12): string {
  const minLng = lng - span;
  const minLat = lat - span * 0.7;
  const maxLng = lng + span;
  const maxLat = lat + span * 0.7;
  const bbox = `${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function scoreStationForCity(station: RadioStation, city: TurkeyCity): number {
  const haystack = `${station.title} ${station.artist}`.toLocaleLowerCase('tr-TR');
  let score = 0;

  for (const alias of city.aliases) {
    if (haystack.includes(alias.toLocaleLowerCase('tr-TR'))) {
      score += alias.length >= 5 ? 5 : 3;
    }
  }

  // Soft preference for Turkish-labelled stations while traveling in TR.
  if (station.artist.toLocaleLowerCase('tr-TR').startsWith('türkçe')) {
    score += 1;
  }

  return score;
}

export function findBestStationIndexForCity(
  stations: RadioStation[],
  city: TurkeyCity
): number {
  let bestIndex = -1;
  let bestScore = 0;

  stations.forEach((station, index) => {
    const score = scoreStationForCity(station, city);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestScore > 0 ? bestIndex : -1;
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
