import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';
import { SmartImage } from '../components/SmartImage';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { PageCtaSection } from '../components/PageCtaSection';

export const AboutPage: React.FC = () => {
  const { config } = useSiteConfig();

  return (
    <div>
      {/* ABOUT PAGE HERO WITH BACKGROUND REMOVAL VAN */}
      <PageHeroBanner
        eyebrow="IPSWICH · SUFFOLK · UNITED KINGDOM"
        title="About MK Man And Van Removals Services"
        subtitle="A local Ipswich removals and man-and-van business focused on clear communication and practical moving support."
        imageKey="vanLoadingTrolley"
        imageAlt="White high-roof removal van with open rear doors and moving cartons on a trolley"
        objectPositionClass="object-[center_42%]"
      />

      {/* SUBSECTION 1 & 2 — WHO WE ARE + OUR APPROACH TO MOVING */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {/* 1. Who We Are */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                01 · Who We Are
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B2348] leading-tight">
                Local Moving &amp; Van Transport Enquiries in Ipswich
              </h2>
              <p className="text-base text-[#283548] leading-relaxed">
                MK Man And Van Removals Services Ipswich is based at{' '}
                <strong>{config.fullAddress}</strong>. We provide a direct point of contact for residents, tenants, homeowners, and individuals looking to arrange moving or van-based transport in and around Ipswich.
              </p>
              <p className="text-base text-[#667085] leading-relaxed">
                Whether you are relocating between houses, moving out of an apartment, transporting household furniture, or arranging collection and delivery for a bulky item, our aim is to make discussing your move straightforward and transparent.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[#E8EDF4]">
                <SmartImage
                  imageKey="clipboardStreetSunset"
                  alt="Transport coordinator reviewing moving schedule notes beside a removal vehicle"
                  className="aspect-[16/11] w-full"
                />
              </div>
              <p className="mt-2 text-xs text-[#667085]">
                Illustrative transport coordination photography · Replaceable in Client Content Settings
              </p>
            </div>
          </div>

          {/* 2. Our Approach to Moving */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden border border-[#E8EDF4]">
                <SmartImage
                  imageKey="moversRoomBoxes"
                  alt="Movers handling stacked household moving cartons inside a bright residential room"
                  className="aspect-[16/11] w-full"
                />
              </div>
              <p className="mt-2 text-xs text-[#667085]">
                Illustrative household moving photography · Replaceable in Client Content Settings
              </p>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                02 · Our Approach to Moving
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B2348] leading-tight">
                Practical Planning Around Your Actual Belongings
              </h2>
              <p className="text-base text-[#283548] leading-relaxed">
                No two moves involve the exact same combination of furniture, stairs, parking access, and timing. Instead of relying on vague estimates, we encourage customers to share a clear picture of what needs moving before any booking is finalised.
              </p>
              <p className="text-base text-[#667085] leading-relaxed">
                Reviewing collection and destination postcodes, property floor levels, and item dimensions upfront allows both sides to confirm whether the transport solution is right for your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSECTION 3 & 4 — HOW WE HELP CUSTOMERS + CLEAR COMMUNICATION */}
      <section className="py-20 sm:py-24 bg-[#F5F7FA] border-y border-[#E8EDF4]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="bg-white border border-[#E8EDF4] rounded-xl p-8 sm:p-10 space-y-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                03 · How We Help Customers
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#0B2348]">
                Support Across Varied Domestic Moves
              </h2>
              <p className="text-[15px] text-[#283548] leading-relaxed">
                Not every move requires the same scale of transport. Customers contact us for full household room moves, studio and apartment relocations, single-item pickups, and furniture transfers between addresses in Ipswich.
              </p>
              <p className="text-sm text-[#667085] leading-relaxed">
                If you are unsure which category best describes your move, simply list the items you need transported and both postcodes — we will review your enquiry directly with you.
              </p>
              <div className="pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0B2348] hover:underline underline-offset-4"
                >
                  <span>Browse Proposed Services</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[#E8EDF4] rounded-xl p-8 sm:p-10 space-y-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
                04 · Our Commitment to Clear Communication
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#0B2348]">
                Honest Answers &amp; Direct Contact Details
              </h2>
              <p className="text-[15px] text-[#283548] leading-relaxed">
                Moving home or arranging furniture collection comes with deadlines. Having a direct phone number, email address, and WhatsApp contact means you know how to reach us to discuss dates, access notes, or updates.
              </p>
              <div className="pt-3 border-t border-[#E8EDF4] flex flex-wrap items-center gap-5 text-sm">
                <a
                  href={config.phoneTelHref}
                  className="inline-flex items-center gap-2 font-semibold text-[#0B2348] hover:underline"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span className="tabular-nums">{config.phoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${config.email}`}
                  className="inline-flex items-center gap-2 font-semibold text-[#0B2348] hover:underline"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>{config.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3-STEP SEQUENCE */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
              Simple Enquiry Process
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348]">
              How It Works
            </h2>
            <p className="text-base text-[#667085]">
              Three clear steps from initial enquiry to arranging your move.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                step: 'Step 01',
                title: 'Share Your Moving Details',
                description:
                  'Send us your collection postcode, destination postcode, preferred moving date, property access notes, and a list of the items or boxes you need moved.',
              },
              {
                step: 'Step 02',
                title: 'Discuss Your Requirements',
                description:
                  'We review your enquiry and discuss suitability, timing, access considerations, and transport options directly with you by phone, WhatsApp, or email.',
              },
              {
                step: 'Step 03',
                title: 'Arrange Your Move',
                description:
                  'Once all details, scheduling, and quote terms are agreed between both sides, your collection and delivery plan is confirmed clearly for moving day.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-7 sm:p-8 rounded-xl bg-[#F5F7FA] border border-[#E8EDF4] space-y-3"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0B2348] tabular-nums">
                  {item.step}
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#0B2348]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#667085] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PAGE CTA */}
      <PageCtaSection
        heading="Let’s Discuss Your Move"
        signatureAccent="Direct, practical moving support"
        supportingText="Tell us where you are moving from, where you are heading, and what needs transporting."
        buttonLabel="CONTACT OUR TEAM"
        buttonTo="/contact"
      />
    </div>
  );
};
