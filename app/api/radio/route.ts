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
  `tag=rock&language=english&${BASE}&limit=40`,
  `tag=lofi&language=english&${BASE}&limit=30`,
  `tag=jazz&language=english&${BASE}&limit=25`,
  `tag=pop&language=turkish&${BASE}&limit=50`,
  `tag=rock&language=turkish&${BASE}&limit=30`,
  `countrycode=TR&tag=pop&${BASE}&limit=50`,
  `countrycode=TR&tag=music&${BASE}&limit=40`,
];

let cache: RadioStation[] | null = null;

function buildStationList(merged: RadioBrowserStation[]): RadioStation[] {
  const seen = new Set<string>();

  return merged
    .filter((station) => {
      if (seen.has(station.stationuuid)) return false;
      seen.add(station.stationuuid);
      return isStationAllowed(station);
    })
    .map(mapRadioBrowserStation)
    .filter((station): station is RadioStation => station !== null);
}

export async function GET() {
  try {
    const batches = await Promise.all(STATION_QUERIES.map(fetchRadioStations));
    const merged = batches.flat();
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
