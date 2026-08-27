import https from 'https';
import type { RadioBrowserStation } from '@/lib/radio';

const USER_AGENT = 'ArjenRadio/1.0';
const API_BASE = 'https://de1.api.radio-browser.info';

export function fetchRadioStations(query: string, timeoutMs = 20_000): Promise<RadioBrowserStation[]> {
  const url = `${API_BASE}/json/stations/search?${query}`;

  return new Promise((resolve) => {
    const request = https.get(
      url,
      { headers: { 'User-Agent': USER_AGENT } },
      (response) => {
        let body = '';

        response.on('data', (chunk) => {
          body += chunk;
        });

        response.on('end', () => {
          if (response.statusCode !== 200) {
            resolve([]);
            return;
          }

          try {
            const data = JSON.parse(body) as RadioBrowserStation[];
            resolve(Array.isArray(data) ? data : []);
          } catch {
            resolve([]);
          }
        });
      }
    );

    request.on('error', () => resolve([]));
    request.setTimeout(timeoutMs, () => {
      request.destroy();
      resolve([]);
    });
  });
}
