import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { QuoteForm } from '../components/QuoteForm';
import { ComplexMovePlanner } from '../components/ComplexMovePlanner';
import { BusinessMapSection } from '../components/BusinessMapSection';

export const ContactPage: React.FC = () => {
  const { config } = useSiteConfig();
  const [searchParams] = useSearchParams();

  const initialServiceParam = searchParams.get('service') || '';
  const initialItemsParam = searchParams.get('items') || '';
  const initialNotesParam = searchParams.get('notes') || '';

  const [plannerPrefill, setPlannerPrefill] = useState<{
    serviceType?: string;
    itemsSummary?: string;
    accessNotes?: string;
    nonce?: number;
  } | null>(() => {
    if (initialItemsParam || initialNotesParam) {
      return {
        serviceType: initialServiceParam || undefined,
        itemsSummary: initialItemsParam || undefined,
        accessNotes: initialNotesParam || undefined,
        nonce: 1,
      };
    }
    return null;
  });

  const resolvedInitialService = useMemo(() => initialServiceParam, [initialServiceParam]);

  return (
    <div>
      {/* CONTACT PAGE HERO WITH BACKGROUND REMOVAL VAN */}
      <PageHeroBanner
        eyebrow="DIRECT ENQUIRIES · IPSWICH, SUFFOLK"
        title="Let’s Talk About Your Move"
        subtitle="Share your moving details and contact MK Man And Van Removals Services Ipswich."
        imageKey="heroVanMain"
        imageAlt="White high-roof removal van parked curbside for moving and transport enquiries"
        objectPositionClass="object-[center_52%]"
      />

      {/* QUICK DIRECT CONTACT OPTIONS + QUOTE REQUEST FORM */}
      <section className="py-16 sm:py-24 bg-[#F5F7FA]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3 Clear Direct Contact Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <a
              href={config.phoneTelHref}
              className="group bg-white border border-[#E8EDF4] rounded-xl p-6 sm:p-7 flex items-start gap-4 hover:border-[#0B2348] transition-colors"
            >
              <span className="w-11 h-11 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4] flex items-center justify-center text-[#0B2348] shrink-0 group-hover:bg-[#0B2348] group-hover:text-white transition-colors">
                <Phone className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                  Call Us Directly
                </p>
                <p className="font-display text-2xl font-semibold text-[#0B2348] mt-1 tabular-nums">
                  {config.phoneDisplay}
                </p>
                <p className="text-xs text-[#667085] mt-1">
                  Tap to call and discuss your move
                </p>
              </div>
            </a>

            <a
              href={`mailto:${config.email}`}
              className="group bg-white border border-[#E8EDF4] rounded-xl p-6 sm:p-7 flex items-start gap-4 hover:border-[#0B2348] transition-colors"
            >
              <span className="w-11 h-11 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4] flex items-center justify-center text-[#0B2348] shrink-0 group-hover:bg-[#0B2348] group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                  Email Us
                </p>
                <p className="font-display text-2xl font-semibold text-[#0B2348] mt-1 break-all">
                  {config.email}
                </p>
                <p className="text-xs text-[#667085] mt-1">
                  Send item lists or moving questions
                </p>
              </div>
            </a>

            <a
              href={config.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-[#E8EDF4] rounded-xl p-6 sm:p-7 flex items-start gap-4 hover:border-[#0B2348] transition-colors"
            >
              <span className="w-11 h-11 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4] flex items-center justify-center text-[#0B2348] shrink-0 group-hover:bg-[#0B2348] group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                  Message on WhatsApp
                </p>
                <p className="font-display text-2xl font-semibold text-[#0B2348] mt-1">
                  WhatsApp Enquiry
                </p>
                <p className="text-xs text-[#667085] mt-1">
                  Message +44 7708 632170 directly
                </p>
              </div>
            </a>
          </div>

          {/* Main Grid: Verified Business Sidebar + Quote Request Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Verified Business Details & Helpful Enquiry Tips */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#E8EDF4] rounded-xl p-7 space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E8EDF4]">
                  <span className="w-11 h-11 rounded-full bg-[#F5F7FA] p-1 border border-[#E8EDF4] shrink-0">
                    <img
                      src={config.logoUrl}
                      alt="MK Man And Van Removals Services emblem"
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-[#0B2348] leading-snug">
                      {config.businessName}
                    </h2>
                  </div>
                </div>

                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                      Telephone
                    </dt>
                    <dd className="mt-1 font-semibold text-[#0B2348] tabular-nums">
                      <a href={config.phoneTelHref} className="hover:underline">
                        {config.phoneDisplay}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                      Email
                    </dt>
                    <dd className="mt-1 font-semibold text-[#0B2348] break-all">
                      <a href={`mailto:${config.email}`} className="hover:underline">
                        {config.email}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                      Business Address
                    </dt>
                    <dd className="mt-1 text-[#283548] leading-relaxed flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#0B2348] mt-1 shrink-0" aria-hidden="true" />
                      <span>{config.fullAddress}</span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                      Google Maps
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={config.googleMapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2348] hover:underline"
                      >
                        <span>View 3 Mersey Road on Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white border border-[#E8EDF4] rounded-xl p-7 space-y-3">
                <h3 className="font-display text-2xl font-semibold text-[#0B2348]">
                  Helpful Details to Share
                </h3>
                <ul className="space-y-2 text-xs text-[#667085] leading-relaxed list-disc pl-4">
                  <li>Collection and destination postcodes (or outward codes if still house-hunting).</li>
                  <li>Floor levels, internal stairs, or lift access at both addresses.</li>
                  <li>Any street parking restrictions or loading bay notes outside either property.</li>
                  <li>Approximate box count and any heavy or oversized furniture pieces.</li>
                </ul>
              </div>
            </aside>

            {/* Right Column: Optional Complex Move Organiser + Validated Quote Form */}
            <div className="lg:col-span-8 space-y-6">
              <ComplexMovePlanner
                onApplyToQuote={({ serviceType, itemsSummary, accessNotes }) => {
                  setPlannerPrefill({
                    serviceType,
                    itemsSummary,
                    accessNotes,
                    nonce: Date.now(),
                  });
                }}
              />

              <QuoteForm
                initialServiceType={resolvedInitialService}
                externalPrefill={plannerPrefill}
              />
            </div>
          </div>
        </div>
      </section>

      {/* REUSABLE INTERACTIVE GOOGLE MAPS SECTION */}
      <BusinessMapSection
        compact={true}
        heading="Find Our Ipswich Base on Google Maps"
        subheading="3 Mersey Road, Ipswich, IP3 0QP, United Kingdom. Please contact us first to arrange your moving quote or scheduled collection."
      />
    </div>
  );
};
