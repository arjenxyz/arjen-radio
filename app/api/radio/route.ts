import { NextResponse } from 'next/server';
import { fetchRadioStations } from '@/lib/radio-browser-client';
import {
  isStationAllowed,
  mapRadioBrowserStation,
  type RadioBrowserStation,
  type RadioStation,
} from '@/lib/radio';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BASE = 'codec=MP3&is_https=true&order=clickcount&reverse=true&hidebroken=true';

const STATION_QUERIES = [
  `tag=pop&language=english&${BASE}&limit=50`,
  `tag=pop&language=turkish&${BASE}&limit=50`,
  `tag=rock&language=english&${BASE}&limit=40`,
  `tag=rock&language=turkish&${BASE}&limit=30`,
  `tag=lofi&language=english&${BASE}&limit=30`,
  `tag=jazz&language=english&${BASE}&limit=25`,
  `tag=jazz&language=turkish&${BASE}&limit=25`,
  `countrycode=TR&tag=pop&${BASE}&limit=50`,
  `countrycode=TR&tag=rock&${BASE}&limit=40`,
  `countrycode=TR&tag=arabesk&${BASE}&limit=30`,
  `countrycode=TR&tag=turkish%20pop&${BASE}&limit=40`,
  `countrycode=TR&tag=music&${BASE}&limit=40`,
];

async function fetchAllStationBatches(): Promise<RadioBrowserStation[]> {
  const merged: RadioBrowserStation[] = [];

  // Radio Browser rate-limits parallel requests; fetch sequentially instead.
  for (const query of STATION_QUERIES) {
    const batch = await fetchRadioStations(query);
    merged.push(...batch);
  }

  return merged;
}

let cache: RadioStation[] | null = null;

function buildStationList(merged: RadioBrowserStation[]): RadioStation[] {
  const seen = new Set<string>();
  const english: RadioStation[] = [];
  const turkish: RadioStation[] = [];

  for (const station of merged) {
    if (seen.has(station.stationuuid)) continue;
    seen.add(station.stationuuid);
    if (!isStationAllowed(station)) continue;

    const mapped = mapRadioBrowserStation(station);
    if (!mapped) continue;

    if (mapped.artist.startsWith('Türkçe')) {
      turkish.push(mapped);
    } else {
      english.push(mapped);
    }
  }

  const interleaved: RadioStation[] = [];
  const maxLen = Math.max(english.length, turkish.length);

  for (let i = 0; i < maxLen; i += 1) {
    if (english[i]) interleaved.push(english[i]);
    if (turkish[i]) interleaved.push(turkish[i]);
  }

  return interleaved;
}

export async function GET() {
  try {
    const merged = await fetchAllStationBatches();
    const stations = buildStationList(merged);

    if (stations.length > 0) {
      cache = stations;
      return NextResponse.json({ success: true, stations });
    }

    if (cache?.length) {
      return NextResponse.json({ success: true, stations: cache });
    }

    return NextResponse.json(
      { success: false, error: 'Radio stations could not be loaded. Please try again.' },
      { status: 500 }
    );
  } catch {
    if (cache?.length) {
      return NextResponse.json({ success: true, stations: cache });
    }

    return NextResponse.json(
      { success: false, error: 'Radio stations could not be loaded. Please try again.' },
      { status: 500 }
    );
  }
}
