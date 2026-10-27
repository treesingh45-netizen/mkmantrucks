import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, MessageCircle, Phone } from 'lucide-react';
import { useSiteConfig } from '../config/siteConfig';
import { SmartImage } from '../components/SmartImage';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { ComplexMovePlanner } from '../components/ComplexMovePlanner';
import { PageCtaSection } from '../components/PageCtaSection';

export const ServicesPage: React.FC = () => {
  const { config } = useSiteConfig();
  const navigate = useNavigate();
  const confirmedServices = config.services.filter((s) => s.confirmedByOwner);

  return (
    <div>
      {/* SERVICES HERO WITH BACKGROUND REMOVAL VAN */}
      <PageHeroBanner
        eyebrow="PROPOSED SERVICES · IPSWICH, SUFFOLK"
        title="Moving Services for Your Requirements"
        subtitle="Explore our proposed moving and transport services and tell us what you need moved."
        imageKey="vanRearLoading"
        imageAlt="White high-roof removal van being loaded with stacked fragile moving cartons"
        objectPositionClass="object-[center_40%]"
      >
        <nav
          aria-label="Service Sections"
          className="mt-10 pt-6 border-t border-white/20 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/90"
        >
          {confirmedServices.map((svc, idx) => (
            <React.Fragment key={svc.id}>
              <a href={`#${svc.slug}`} className="hover:text-white transition-colors">
                <span className="tabular-nums text-white/65 mr-1">{svc.indexLabel}</span>
                {svc.title}
              </a>
              {idx < confirmedServices.length - 1 && (
                <span aria-hidden="true" className="text-white/40">·</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </PageHeroBanner>

      {/* DETAILED ALTERNATING SERVICE SECTIONS */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 divide-y divide-[#E8EDF4]">
          {confirmedServices.map((svc, index) => {
            const imageOnLeft = index % 2 === 1;
            return (
              <article
                key={svc.id}
                id={svc.slug}
                className="py-14 sm:py-20 first:pt-4 last:pb-4 scroll-mt-24"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  <div className={`lg:col-span-6 ${imageOnLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="rounded-xl overflow-hidden border border-[#E8EDF4] shadow-[0_10px_30px_rgba(7,23,47,0.05)]">
                      <SmartImage
                        imageKey={svc.imageKey}
                        alt={svc.imageAlt}
                        className="aspect-[16/10] w-full"
                      />
                    </div>
                    <p className="mt-2 text-xs text-[#667085]">
                      Illustrative moving &amp; interior photography · Replaceable in Client Content Settings
                    </p>
                  </div>

                  <div className={`lg:col-span-6 space-y-6 ${imageOnLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold tracking-widest uppercase text-[#667085] tabular-nums">
                        {svc.indexLabel} · SERVICE ENQUIRY
                      </p>
                      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B2348]">
                        {svc.title}
                      </h2>
                    </div>

                    <p className="text-base text-[#283548] leading-relaxed">
                      {svc.detailedDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0B2348]">
                          Typical Enquiries
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#667085]">
                          {svc.idealFor.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[#0B2348] mt-0.5 shrink-0" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0B2348]">
                          Details to Include
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#667085]">
                          {svc.enquiryChecklist.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#0B2348] font-bold leading-none mt-1" aria-hidden="true">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/contact?service=${encodeURIComponent(svc.title)}#quote-form`}
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
                      >
                        <span>Request a Quote</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* "TELL US WHAT YOU NEED" SECTION + OPTIONAL CHECKLIST ORGANISER */}
      <section className="py-20 sm:py-24 bg-[#F5F7FA] border-t border-[#E8EDF4]">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white border border-[#E8EDF4] rounded-xl p-8 sm:p-11 space-y-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                Custom &amp; Mixed-Load Enquiries
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B2348]">
                Tell Us What You Need
              </h2>
              <p className="text-base text-[#283548] leading-relaxed">
                Not sure where your move fits? Contact MK Man And Van Removals Services Ipswich directly with the items you want transported, your collection and destination postcodes, and any timing preferences. We are happy to discuss whether your requirements can be accommodated.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/contact#quote-form"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
              >
                <span>Open Quote Form</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={config.phoneTelHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase border border-[#0B2348] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Call {config.phoneDisplay}</span>
              </a>
              <a
                href={config.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase border border-[#E8EDF4] text-[#283548] rounded-md hover:bg-[#F5F7FA] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>

          <ComplexMovePlanner
            onApplyToQuote={({ serviceType, itemsSummary, accessNotes }) => {
              const params = new URLSearchParams();
              if (serviceType) params.set('service', serviceType);
              if (itemsSummary) params.set('items', itemsSummary);
              if (accessNotes) params.set('notes', accessNotes);
              navigate(`/contact?${params.toString()}#quote-form`);
            }}
          />
        </div>
      </section>

      {/* SERVICES PAGE CTA */}
      <PageCtaSection
        heading="Need Help Planning a Move?"
        signatureAccent="Share your postcodes & item list"
        supportingText="Send us your moving details online or call directly to talk through the right transport arrangement."
        buttonLabel="GET A QUOTE"
        buttonTo="/contact#quote-form"
      />
    </div>
  );
};
