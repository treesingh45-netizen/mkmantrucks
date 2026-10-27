import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Phone, MapPin, Check } from 'lucide-react';
import { useSiteConfig } from '../config/siteConfig';
import { SmartImage } from '../components/SmartImage';
import { PageCtaSection } from '../components/PageCtaSection';

export const HomePage: React.FC = () => {
  const { config } = useSiteConfig();
  const confirmedServices = config.services.filter((s) => s.confirmedByOwner);

  return (
    <div>
      {/* SECTION A — FULL-SCREEN REAL TRUCK/VAN HERO (~100vh) */}
      <section
        aria-label="Hero introduction"
        className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#07172F]"
      >
        {/* Full-bleed genuine licensed removal van photograph */}
        <div className="absolute inset-0">
          <SmartImage
            imageKey="heroVanMain"
            alt="High-roof white removal van parked curbside with cardboard moving cartons ready for loading"
            priority={true}
            objectPositionClass="object-[center_52%]"
            className="w-full h-full"
          />
          {/* Balanced deep-navy scrim so white text stays crisp while the centered van remains clearly visible */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#07172F]/72 via-[#07172F]/52 to-[#07172F]/78"
          />
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-xs sm:text-[13px] font-semibold tracking-[0.24em] uppercase text-white/90"
          >
            MK MAN AND VAN REMOVALS SERVICES
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.05, ease: 'easeOut' }}
            className="mt-5 font-display text-[clamp(1.85rem,5.4vw,4.35rem)] font-semibold text-white leading-[1.14] tracking-[-0.015em] max-w-none mx-auto"
          >
            <span className="block whitespace-nowrap">Moving Made Simple.</span>
            <span className="block whitespace-nowrap mt-1 sm:mt-1.5">Moving Made Right.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.1, ease: 'easeOut' }}
            className="mt-6 text-base sm:text-lg lg:text-[19px] text-white/90 leading-relaxed max-w-[62ch] mx-auto font-normal"
          >
            “Looking for a man and van or removals service in Ipswich? Tell us about your move and let’s discuss the right transport solution for your requirements.”
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: 'easeOut' }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/contact#quote-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-white text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors whitespace-nowrap"
            >
              <span>GET A FREE QUOTE</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href={config.phoneTelHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase border border-white/75 text-white rounded-md hover:bg-white/12 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>CALL US — 07708 632170</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-10 text-xs text-white/75 tracking-wide"
          >
            Ipswich, Suffolk · 3 Mersey Road, IP3 0QP · Direct Quote Enquiries
          </motion.p>
        </div>
      </section>

      {/* SECTION B — BRAND INTRODUCTION ("A Better Way to Move") */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[#E8EDF4] shadow-[0_12px_36px_rgba(7,23,47,0.06)]">
                <SmartImage
                  imageKey="vanChecklistTeam"
                  alt="Reviewing moving box checklist at the rear doors of a white transport van"
                  className="aspect-[4/3] w-full"
                />
              </div>
              <p className="mt-2.5 text-xs text-[#667085]">
                Illustrative moving &amp; van loading photography · Replaceable with company photography
              </p>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                Ipswich Removals &amp; Transport
              </p>

              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348] leading-[1.12]">
                A Better Way to Move
              </h2>

              <p className="font-signature text-2xl sm:text-3xl text-[#0B2348]/80 -mt-2">
                Clear plans before moving day
              </p>

              <p className="text-base text-[#283548] leading-relaxed">
                Arranging a move works best when every detail is discussed openly from the beginning. Based at 3 Mersey Road in Ipswich, MK Man And Van Removals Services welcomes residential moving, flat relocation, furniture transport, and point-to-point collection enquiries.
              </p>

              <p className="text-base text-[#667085] leading-relaxed">
                Rather than offering one-size-fits-all assumptions, we ask about your collection postcode, destination postcode, property access, and the specific items you need moved so you can discuss suitable arrangements directly before confirming your plans.
              </p>

              <div className="pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
                >
                  <span>DISCOVER OUR SERVICES</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C — SERVICES PREVIEW */}
      <section className="py-20 sm:py-28 bg-[#F5F7FA] border-y border-[#E8EDF4]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E8EDF4]">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                Proposed Moving &amp; Transport Services
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348] leading-tight">
                Practical Support for Big &amp; Small Moves
              </h2>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#0B2348] hover:underline underline-offset-4 shrink-0"
            >
              <span>VIEW ALL SERVICES</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {confirmedServices.map((service) => (
              <article
                key={service.id}
                className="group bg-white border border-[#E8EDF4] rounded-xl overflow-hidden flex flex-col justify-between transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(7,23,47,0.06)]"
              >
                <div>
                  <SmartImage
                    imageKey={service.imageKey}
                    alt={service.imageAlt}
                    className="aspect-[16/10] w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="p-6 sm:p-7 space-y-3">
                    <p className="text-xs font-semibold tracking-widest text-[#667085] tabular-nums">
                      {service.indexLabel} · ENQUIRY CATEGORY
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#0B2348]">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#667085] leading-relaxed">
                      {service.shortSummary}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-[#F5F7FA] flex items-center justify-between">
                  <Link
                    to={`/services#${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#0B2348] group-hover:underline underline-offset-4"
                  >
                    <span>Service Details</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    to={`/contact?service=${encodeURIComponent(service.title)}#quote-form`}
                    className="text-xs font-medium text-[#667085] hover:text-[#0B2348]"
                  >
                    Enquire
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
            >
              <span>VIEW ALL SERVICES</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION D — WHY CONTACT US (Practical, Verifiable Benefits Only) */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                Why Contact Us
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348] leading-tight">
                Direct Communication From First Enquiry to Moving Day
              </h2>
              <p className="text-base text-[#667085] leading-relaxed">
                Every property, staircase, parking bay, and furniture list is different. Talking through your actual requirements first keeps the moving process calm and well-organised.
              </p>
              <div className="pt-2">
                <Link
                  to="/why-choose-us"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#0B2348] hover:underline underline-offset-4"
                >
                  <span>Read How We Work &amp; FAQs</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {[
                {
                  num: '01',
                  title: 'Speak Directly With Us',
                  body: 'Reach MK Man And Van Removals Services Ipswich directly by telephone on +44 7708 632170, WhatsApp, email, or online quote request.',
                },
                {
                  num: '02',
                  title: 'Tailored to Your Item List',
                  body: 'Whether you are relocating household rooms, a flat, or a single bulky item, we review what needs moving before confirming arrangements.',
                },
                {
                  num: '03',
                  title: 'Access & Route Checked Early',
                  body: 'Sharing postcodes, floor levels, lift access, and street parking details upfront helps prevent avoidable surprises on collection day.',
                },
                {
                  num: '04',
                  title: 'Based Locally in Ipswich',
                  body: 'Operating from 3 Mersey Road, Ipswich, IP3 0QP, we are well placed for local Ipswich collections, deliveries, and residential moves.',
                },
              ].map((benefit) => (
                <div key={benefit.num} className="pt-5 border-t border-[#E8EDF4] space-y-2.5">
                  <span className="text-xs font-semibold tracking-widest text-[#667085] tabular-nums">
                    {benefit.num}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[#0B2348]">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#667085] leading-relaxed">{benefit.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E — SERVICE AREA PREVIEW (IPSWICH, SUFFOLK) */}
      <section className="py-20 sm:py-24 bg-[#E8EDF4]/65 border-t border-[#E8EDF4]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                Local Coverage · Suffolk
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348] leading-tight">
                Serving Ipswich From IP3 0QP
              </h2>
              <p className="text-base text-[#283548] leading-relaxed">
                Our primary service location is <strong>Ipswich, Suffolk, United Kingdom</strong>, based at{' '}
                <strong>{config.fullAddress}</strong>.
              </p>
              <ul className="space-y-2.5 text-sm text-[#283548]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B2348] mt-1 shrink-0" aria-hidden="true" />
                  <span>Enquiries welcomed across IP1, IP2, IP3, and IP4 residential neighbourhoods</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B2348] mt-1 shrink-0" aria-hidden="true" />
                  <span>Moving to or from Ipswich? Share both postcodes so we can confirm route suitability</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0B2348] mt-1 shrink-0" aria-hidden="true" />
                  <span>Interactive location map and Google Maps directions available online</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/areas-we-cover"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
                >
                  <span>Explore Areas We Cover</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden border border-[#E8EDF4] bg-white shadow-[0_12px_36px_rgba(7,23,47,0.06)]">
                <SmartImage
                  imageKey="ipswichWaterfront"
                  alt="Boats and waterfront buildings at Ipswich Marina in Suffolk, United Kingdom"
                  className="aspect-[16/10] w-full"
                />
              </div>
              <p className="mt-2.5 text-xs text-[#667085]">
                Ipswich Waterfront, Suffolk · Primary local service area
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F — FULL-WIDTH DEEP NAVY CALL TO ACTION */}
      <PageCtaSection
        heading="Planning Your Next Move?"
        signatureAccent="Let’s talk through the details"
        supportingText="Share your moving details with us and request a quote tailored to your journey."
        buttonLabel="REQUEST A FREE QUOTE"
        buttonTo="/contact#quote-form"
      />
    </div>
  );
};
