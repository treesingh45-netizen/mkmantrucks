import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';
import { SmartImage } from '../components/SmartImage';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { BusinessMapSection } from '../components/BusinessMapSection';
import { PageCtaSection } from '../components/PageCtaSection';

export const AreasPage: React.FC = () => {
  const { config } = useSiteConfig();
  const confirmedAreas = config.surroundingAreas.filter((a) => a.confirmedByOwner);

  return (
    <div>
      {/* AREAS HERO WITH BACKGROUND TRANSPORT TRUCK */}
      <PageHeroBanner
        eyebrow="COVERAGE & LOCATION · SUFFOLK"
        title="Man and Van Services in Ipswich"
        subtitle="Based at 3 Mersey Road, Ipswich, IP3 0QP, United Kingdom."
        imageKey="highwayTransportTruck"
        imageAlt="White transport trucks travelling along an open highway"
        objectPositionClass="object-[center_52%]"
      />

      {/* PRIMARY LOCATION FOCUS — IPSWICH */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                Primary Service Location
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348] leading-tight">
                Local Ipswich Moving &amp; Transport Enquiries
              </h2>
              <p className="text-base text-[#283548] leading-relaxed">
                MK Man And Van Removals Services operates from{' '}
                <strong>{config.fullAddress}</strong>, welcoming residential moving, flat relocation, single-item transport, and collection-and-delivery enquiries throughout Ipswich.
              </p>
              <p className="text-sm text-[#667085] leading-relaxed">
                Please note that 3 Mersey Road is our registered operational base rather than a walk-in retail counter — all quotes, collections, and moving schedules are arranged in advance by telephone, email, WhatsApp, or online enquiry.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact#quote-form"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
                >
                  <span>Check Route Availability</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href={config.phoneTelHref}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase border border-[#0B2348] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>{config.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[#E8EDF4] shadow-[0_12px_36px_rgba(7,23,47,0.06)]">
                <SmartImage
                  imageKey="ipswichWaterfront"
                  alt="Boats moored along Ipswich Waterfront in Suffolk, United Kingdom"
                  className="aspect-[16/10] w-full"
                />
              </div>
              <p className="mt-2.5 text-xs text-[#667085]">
                Ipswich Waterfront, Suffolk · Local service base in IP3
              </p>
            </div>
          </div>

          {/* CONFIRMED COVERAGE AREAS LIST + SURROUNDING ROUTE ENQUIRIES */}
          <div className="mt-20 pt-16 border-t border-[#E8EDF4] grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                Confirmed Coverage Areas
              </p>
              <h3 className="font-display text-3xl font-semibold text-[#0B2348]">
                Ipswich Postcode Districts &amp; Neighbourhoods
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {confirmedAreas.map((area) => (
                  <div
                    key={area.id}
                    className="p-5 rounded-xl bg-[#F5F7FA] border border-[#E8EDF4] flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0B2348] mt-1 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[#0B2348]">{area.name}</p>
                      <p className="text-xs text-[#667085] mt-1">{area.countyOrNote}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F5F7FA] border border-[#E8EDF4] rounded-xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0B2348]">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>Journeys Beyond Central Ipswich</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B2348]">
                  Moving To or From Another Postcode?
                </h3>
                <p className="text-sm text-[#283548] leading-relaxed">
                  If your collection address is in Ipswich and your destination is further afield — or you are relocating into Ipswich from elsewhere — please include both postcodes in your quote request.
                </p>
                <p className="text-xs text-[#667085] leading-relaxed">
                  We confirm route suitability and scheduling individually based on distance, load size, and date availability.
                </p>
              </div>

              <Link
                to="/contact#quote-form"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
              >
                <span>ENQUIRE WITH YOUR POSTCODES</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE GOOGLE MAPS SECTION WITH "GET DIRECTIONS" */}
      <BusinessMapSection
        heading="3 Mersey Road, Ipswich, IP3 0QP"
        subheading="View our verified Ipswich location on Google Maps or open turn-by-turn directions. Please contact us in advance to discuss your moving enquiry."
      />

      {/* AREAS PAGE CTA */}
      <PageCtaSection
        heading="Moving To or From Ipswich?"
        signatureAccent="Tell us your route & preferred date"
        supportingText="Enter your pickup and drop-off postcodes for a straightforward conversation about your move."
        buttonLabel="DISCUSS YOUR MOVE"
        buttonTo="/contact#quote-form"
      />
    </div>
  );
};
