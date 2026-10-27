import React, { useEffect, useState } from 'react';
import {
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';

interface LocationApiResponse {
  status: 'OK' | 'UNAVAILABLE' | 'QUOTA_EXCEEDED';
  formattedAddress: string;
  location: { lat: number; lng: number } | null;
}

// Module-level shared promise so navigating between Areas We Cover and Contact never triggers a duplicate geocoding request
let sharedLocationPromise: Promise<LocationApiResponse> | null = null;

function fetchSharedIpswichLocation(): Promise<LocationApiResponse> {
  if (!sharedLocationPromise) {
    sharedLocationPromise = fetch('/api/location')
      .then(async (res) => {
        if (res.status === 429) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          return {
            status: 'QUOTA_EXCEEDED' as const,
            formattedAddress: '3 Mersey Road, Ipswich, IP3 0QP, United Kingdom',
            location: null,
          };
        }
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          return {
            status: 'UNAVAILABLE' as const,
            formattedAddress: '3 Mersey Road, Ipswich, IP3 0QP, United Kingdom',
            location: null,
          };
        }
        const data = (await res.json()) as LocationApiResponse;
        if (data.status === 'QUOTA_EXCEEDED') {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        return data;
      })
      .catch(() => ({
        status: 'UNAVAILABLE' as const,
        formattedAddress: '3 Mersey Road, Ipswich, IP3 0QP, United Kingdom',
        location: null,
      }));
  }
  return sharedLocationPromise;
}

interface BusinessMapSectionProps {
  heading?: string;
  subheading?: string;
  compact?: boolean;
}

export const BusinessMapSection: React.FC<BusinessMapSectionProps> = ({
  heading = 'Our Ipswich Base Location',
  subheading = 'MK Man And Van Removals Services operates from Ipswich, Suffolk. Please arrange all moving enquiries in advance by phone, email, WhatsApp, or online quote request.',
  compact = false,
}) => {
  const { config, setCookieModalOpen } = useSiteConfig();
  const [geoData, setGeoData] = useState<LocationApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const hasApiKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    let active = true;
    fetchSharedIpswichLocation().then((data) => {
      if (!active) return;
      setGeoData(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const canRenderInteractiveMap =
    config.mapsConsentEnabled &&
    hasApiKey &&
    geoData?.status === 'OK' &&
    Boolean(geoData.location);

  return (
    <section
      aria-labelledby="ipswich-map-heading"
      className={compact ? 'py-12 bg-white' : 'py-20 bg-[#F5F7FA] border-y border-[#E8EDF4]'}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Address & Directions Card */}
          <div className="lg:col-span-5 bg-white border border-[#E8EDF4] rounded-xl p-7 sm:p-9 flex flex-col justify-between">
            <div className="space-y-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#0B2348]">
                Ipswich · Suffolk · UK
              </p>
              <h2
                id="ipswich-map-heading"
                className="font-display text-3xl sm:text-4xl font-semibold text-[#0B2348] leading-tight"
              >
                {heading}
              </h2>
              <p className="text-[15px] text-[#667085] leading-relaxed">
                {subheading}
              </p>

              <div className="pt-3 border-t border-[#E8EDF4] space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0B2348] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#0B2348]">Registered Business Location</p>
                    <p className="text-[15px] text-[#283548] mt-0.5">{config.fullAddress}</p>
                    <p className="text-xs text-[#667085] mt-1">Google Maps</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-7 mt-7 border-t border-[#E8EDF4] space-y-3">
              <a
                href={config.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold tracking-wide bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" aria-hidden="true" />
                <span>GET DIRECTIONS</span>
              </a>

              <a
                href={config.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold tracking-wide border border-[#E8EDF4] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors whitespace-nowrap"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Interactive Google Maps Container */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-[#E8EDF4] bg-[#E8EDF4] min-h-[380px] sm:min-h-[450px] relative">
            {!config.mapsConsentEnabled ? (
              <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-8 text-center bg-white">
                <MapPin className="w-9 h-9 text-[#0B2348] mb-3" aria-hidden="true" />
                <h3 className="font-display text-2xl font-semibold text-[#0B2348] mb-2">
                  External Google Maps Disabled
                </h3>
                <p className="text-sm text-[#667085] max-w-md mb-5">
                  Interactive map tiles are currently turned off in your Cookie &amp; Map Settings. You can enable them below or open directions directly in Google Maps.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCookieModalOpen(true)}
                    className="px-5 py-2.5 text-xs font-semibold bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
                  >
                    Enable Interactive Map
                  </button>
                  <a
                    href={config.googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-xs font-semibold border border-[#0B2348] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            ) : loading ? (
              <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-8 text-center bg-[#F5F7FA]">
                <div className="w-8 h-8 border-2 border-[#0B2348]/25 border-t-[#0B2348] rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-[#283548]">Loading verified Ipswich location map…</p>
              </div>
            ) : canRenderInteractiveMap && geoData?.location ? (
              <div className="w-full h-full min-h-[380px] sm:min-h-[450px]" style={{ height: '100%', minHeight: '420px' }}>
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={geoData.location}
                  defaultZoom={15}
                  gestureHandling="cooperative"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%', minHeight: '420px' }}
                >
                  <AdvancedMarker
                    ref={markerRef}
                    position={geoData.location}
                    title={config.businessName}
                    onClick={() => setInfoOpen((prev) => !prev)}
                  >
                    <Pin background="#0B2348" borderColor="#07172F" glyphColor="#FFFFFF" scale={1.15} />
                  </AdvancedMarker>

                  {infoOpen && marker && (
                    <InfoWindow
                      anchor={marker}
                      maxWidth={260}
                      onCloseClick={() => setInfoOpen(false)}
                    >
                      <div className="p-1 text-[#283548]">
                        <p className="font-semibold text-xs text-[#0B2348]">
                          {config.businessName}
                        </p>
                        <p className="text-xs text-[#667085] mt-1">
                          {geoData.formattedAddress}
                        </p>
                        <p className="text-[11px] text-[#667085] mt-1">Google Maps</p>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>
            ) : hasApiKey ? (
              <iframe
                title={`Google Maps location for ${config.fullAddress}`}
                width="100%"
                height="450"
                style={{ border: 0, minHeight: '420px', width: '100%', height: '100%' }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/search?key=${encodeURIComponent(
                  import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                )}&solution_id=gmp_mcp_codeassist_v1_aistudio&q=${encodeURIComponent(
                  config.fullAddress
                )}&region=GB&language=en-GB`}
              />
            ) : (
              <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-8 text-center bg-white">
                <MapPin className="w-9 h-9 text-[#0B2348] mb-3" aria-hidden="true" />
                <h3 className="font-display text-2xl font-semibold text-[#0B2348] mb-2">
                  {config.fullAddress}
                </h3>
                <p className="text-sm text-[#667085] max-w-md mb-5">
                  Open interactive turn-by-turn directions or inspect the street location directly in Google Maps.
                </p>
                <a
                  href={config.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  <span>GET DIRECTIONS</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
