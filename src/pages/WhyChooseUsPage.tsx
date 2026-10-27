import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { useSiteConfig } from '../config/siteConfig';
import { SmartImage } from '../components/SmartImage';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { PageCtaSection } from '../components/PageCtaSection';

export const WhyChooseUsPage: React.FC = () => {
  const { config } = useSiteConfig();
  const [openFaqId, setOpenFaqId] = useState<string | null>(config.faqs[0]?.id ?? null);

  const benefits = [
    {
      index: '01',
      title: 'Clear Communication',
      description:
        'Discuss your moving dates, access arrangements, and item list in plain, practical terms before any collection is scheduled.',
    },
    {
      index: '02',
      title: 'Straightforward Enquiries',
      description:
        'Use our online quote form or get in touch directly by phone, email, or WhatsApp without navigating complicated automated menus.',
    },
    {
      index: '03',
      title: 'Discuss Your Requirements',
      description:
        'From multi-room house moves and apartment relocations to single bulky items, every enquiry is reviewed around what you actually need moved.',
    },
    {
      index: '04',
      title: 'Local Ipswich Location',
      description:
        'Operating from 3 Mersey Road, Ipswich, IP3 0QP, we are well positioned for local residential collections and deliveries across Ipswich.',
    },
    {
      index: '05',
      title: 'Direct Contact',
      description:
        'Reach MK Man And Van Removals Services directly on +44 7708 632170 or SERVICES@gmail.com whenever you need to clarify details.',
    },
    {
      index: '06',
      title: 'A Clear Booking Process',
      description:
        'Submitting an enquiry carries no obligation — transport arrangements are only finalised once route, items, timing, and quote details are agreed directly.',
    },
  ];

  return (
    <div>
      {/* WHY CHOOSE US HERO WITH BACKGROUND REMOVAL VAN */}
      <PageHeroBanner
        eyebrow="PRACTICAL MOVING SUPPORT · IPSWICH"
        title="A Straightforward Approach to Moving"
        subtitle="Why customers contact MK Man And Van Removals Services Ipswich."
        imageKey="heroVanMain"
        imageAlt="White high-roof removal van parked curbside ready for loading"
        objectPositionClass="object-[center_52%]"
      />

      {/* SIX EDITORIAL BENEFIT BLOCKS */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
              What You Can Expect
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348]">
              Practical Reasons to Enquire With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div
                key={b.index}
                className="p-7 sm:p-8 rounded-xl bg-[#F5F7FA] border border-[#E8EDF4] space-y-3.5"
              >
                <p className="text-xs font-semibold tracking-widest text-[#667085] tabular-nums">
                  {b.index}
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#0B2348]">
                  {b.title}
                </h3>
                <p className="text-sm text-[#283548] leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE + REAL TRANSPORT PHOTOGRAPHY */}
      <section className="py-20 sm:py-24 bg-[#F5F7FA] border-y border-[#E8EDF4]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                  Step-by-Step Clarity
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348]">
                  How Your Enquiry Moves Forward
                </h2>
              </div>

              <ol className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'Share Your Route & Item List',
                    detail:
                      'Tell us your collection postcode, destination postcode, preferred date, floor access, and the furniture or boxes you need moved.',
                  },
                  {
                    step: '02',
                    title: 'Direct Review & Conversation',
                    detail:
                      'We look over your requirements and speak with you directly to clarify any bulky items, stairs, lift access, or parking notes.',
                  },
                  {
                    step: '03',
                    title: 'Confirm Your Arrangement',
                    detail:
                      'Once timing, suitability, and quote terms are agreed clearly, your collection and delivery details are scheduled.',
                  },
                ].map((s) => (
                  <li
                    key={s.step}
                    className="p-6 rounded-xl bg-white border border-[#E8EDF4] flex items-start gap-4"
                  >
                    <span className="font-display text-2xl font-semibold text-[#0B2348] tabular-nums shrink-0">
                      {s.step}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#0B2348]">{s.title}</h3>
                      <p className="text-sm text-[#667085] leading-relaxed">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-xl overflow-hidden border border-[#E8EDF4] bg-white shadow-[0_12px_36px_rgba(7,23,47,0.06)]">
                <SmartImage
                  imageKey="fragileBoxFloor"
                  alt="Labelled fragile cardboard moving carton prepared carefully on wooden flooring"
                  className="aspect-[4/3] w-full"
                />
              </div>
              <div className="p-6 rounded-xl bg-white border border-[#E8EDF4] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#283548]">
                <a href={config.phoneTelHref} className="inline-flex items-center gap-2 font-semibold text-[#0B2348] hover:underline">
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{config.phoneDisplay}</span>
                </a>
                <a href={`mailto:${config.email}`} className="inline-flex items-center gap-2 font-semibold text-[#0B2348] hover:underline break-all">
                  <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{config.email}</span>
                </a>
                <a
                  href={config.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-[#0B2348] hover:underline"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>WhatsApp Direct</span>
                </a>
                <span className="inline-flex items-center gap-2 text-[#667085]">
                  <MapPin className="w-4 h-4 shrink-0 text-[#0B2348]" aria-hidden="true" />
                  <span>IP3 0QP · Ipswich</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section aria-labelledby="faq-section-heading" className="py-20 sm:py-28 bg-white">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
              Common Enquiries
            </p>
            <h2
              id="faq-section-heading"
              className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348]"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-[#667085]">
              Helpful answers before submitting your moving or transport enquiry.
            </p>
          </div>

          <div className="divide-y divide-[#E8EDF4] border-y border-[#E8EDF4]">
            {config.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const panelId = `faq-panel-${faq.id}`;
              return (
                <div key={faq.id} className="py-5">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full flex items-center justify-between gap-4 text-left py-1.5 cursor-pointer group"
                    >
                      <span className="font-display text-xl sm:text-2xl font-semibold text-[#0B2348] group-hover:text-[#07172F]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#0B2348] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  {isOpen && (
                    <div id={panelId} className="pt-3 pr-8 text-sm sm:text-[15px] text-[#283548] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US CTA */}
      <PageCtaSection
        heading="Have Questions About Your Move?"
        signatureAccent="Speak directly with us in Ipswich"
        supportingText="Reach out by phone, WhatsApp, email, or online quote form and tell us about your moving plans."
        buttonLabel="CONTACT US"
        buttonTo="/contact"
      />
    </div>
  );
};
