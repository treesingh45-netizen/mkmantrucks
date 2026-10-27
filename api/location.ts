const VERIFIED_ADDRESS = '3 Mersey Road, Ipswich, IP3 0QP, United Kingdom';
const GMP_ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';
const GEOCODE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CachedGeocodeResult {
  status: 'OK' | 'UNAVAILABLE' | 'QUOTA_EXCEEDED';
  formattedAddress: string;
  location: { lat: number; lng: number } | null;
  placeId?: string;
  locationType?: string;
  fetchedAt: number;
}

interface ServerlessRequest {
  method?: string;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
}

let cachedIpswichGeocode: CachedGeocodeResult | null = null;

export default async function handler(
  _req: ServerlessRequest,
  res: ServerlessResponse
): Promise<void> {
  if (
    cachedIpswichGeocode &&
    cachedIpswichGeocode.status === 'OK' &&
    Date.now() - cachedIpswichGeocode.fetchedAt < GEOCODE_CACHE_TTL_MS
  ) {
    res.status(200).json(cachedIpswichGeocode);
    return;
  }

  const mapsApiKey =
    process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';

  if (!mapsApiKey) {
    res.status(200).json({
      status: 'UNAVAILABLE',
      formattedAddress: VERIFIED_ADDRESS,
      location: null,
      fetchedAt: Date.now(),
    } satisfies CachedGeocodeResult);
    return;
  }

  try {
    const geocodeUrl =
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(VERIFIED_ADDRESS)}` +
      `&region=gb&key=${encodeURIComponent(mapsApiKey)}&solution_id=${GMP_ATTRIBUTION_ID}`;

    const response = await fetch(geocodeUrl);
    if (response.status === 429) {
      res.status(429).json({
        status: 'QUOTA_EXCEEDED',
        formattedAddress: VERIFIED_ADDRESS,
        location: null,
        fetchedAt: Date.now(),
      } satisfies CachedGeocodeResult);
      return;
    }

    const data = (await response.json()) as {
      status?: string;
      results?: Array<{
        formatted_address?: string;
        place_id?: string;
        geometry?: {
          location?: { lat: number; lng: number };
          location_type?: string;
        };
      }>;
    };

    if (data.status === 'OVER_QUERY_LIMIT' || data.status === 'OVER_DAILY_LIMIT') {
      res.status(429).json({
        status: 'QUOTA_EXCEEDED',
        formattedAddress: VERIFIED_ADDRESS,
        location: null,
        fetchedAt: Date.now(),
      } satisfies CachedGeocodeResult);
      return;
    }

    const first = data.results?.[0];
    if (data.status === 'OK' && first?.geometry?.location) {
      cachedIpswichGeocode = {
        status: 'OK',
        formattedAddress: first.formatted_address || VERIFIED_ADDRESS,
        location: {
          lat: first.geometry.location.lat,
          lng: first.geometry.location.lng,
        },
        placeId: first.place_id,
        locationType: first.geometry.location_type,
        fetchedAt: Date.now(),
      };
      res.status(200).json(cachedIpswichGeocode);
      return;
    }

    res.status(200).json({
      status: 'UNAVAILABLE',
      formattedAddress: VERIFIED_ADDRESS,
      location: null,
      fetchedAt: Date.now(),
    } satisfies CachedGeocodeResult);
  } catch {
    res.status(200).json({
      status: 'UNAVAILABLE',
      formattedAddress: VERIFIED_ADDRESS,
      location: null,
      fetchedAt: Date.now(),
    } satisfies CachedGeocodeResult);
  }
}
