import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Mail, MessageCircle } from 'lucide-react';
import { GALLERY_CATALOG, GalleryItem, useSiteConfig } from '../data/siteConfig';
import { SmartImage } from '../components/SmartImage';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { PageCtaSection } from '../components/PageCtaSection';

type FilterCategory = 'all' | GalleryItem['category'];

const CATEGORY_TABS: Array<{ id: FilterCategory; label: string }> = [
  { id: 'all', label: 'All Photographs' },
  { id: 'vehicles', label: 'Transport & Vans' },
  { id: 'residential', label: 'Furniture & Rooms' },
  { id: 'packing', label: 'Boxes & Preparation' },
  { id: 'local', label: 'Ipswich Location' },
];

export const GalleryReviewsPage: React.FC = () => {
  const { config, resolveMediaSrc, setOwnerModalOpen } = useSiteConfig();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? GALLERY_CATALOG
      : GALLERY_CATALOG.filter((item) => item.category === activeCategory);

  const approvedReviews = config.verifiedReviews.filter((r) => r.approvedForLiveSite);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const activeLightboxItem =
    lightboxIndex !== null && filteredItems[lightboxIndex]
      ? filteredItems[lightboxIndex]
      : null;

  return (
    <div>
      {/* GALLERY & REVIEWS HERO WITH BACKGROUND REMOVAL VAN */}
      <PageHeroBanner
        eyebrow="GALLERY & CUSTOMER FEEDBACK"
        title="Our Moving and Transport Gallery"
        subtitle="Visual examples of moving, packing, furniture handling, and transport scenes."
        imageKey="vanChecklistTeam"
        imageAlt="Open rear doors of a white removal van loaded with moving cartons"
        objectPositionClass="object-[center_38%]"
      />

      {/* FILTERABLE EDITORIAL PHOTO GALLERY */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Filter Bar + Honest Photography Notice */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E8EDF4]">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Gallery Categories">
              {CATEGORY_TABS.map((tab) => {
                const selected = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setLightboxIndex(null);
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#0B2348] text-white'
                        : 'bg-[#F5F7FA] text-[#283548] hover:bg-[#E8EDF4]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[#667085] max-w-md lg:text-right">
              Showing <span className="font-semibold text-[#0B2348] tabular-nums">{filteredItems.length}</span>{' '}
              {filteredItems.length === 1 ? 'photograph' : 'photographs'} · Licensed illustrative &amp; local Ipswich photography (replaceable with company photos).
            </p>
          </div>

          {/* Editorial Masonry / Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const resolved = resolveMediaSrc(item.imageKey);
              return (
                <figure
                  key={item.id}
                  className={`group relative rounded-xl overflow-hidden border border-[#E8EDF4] bg-[#F5F7FA] flex flex-col justify-between ${
                    activeCategory === 'all' ? item.aspectClass : 'aspect-[4/3]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Inspect photograph: ${item.title}`}
                    className="relative w-full h-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2348]"
                  >
                    <SmartImage
                      imageKey={item.imageKey}
                      alt={item.alt}
                      className="w-full h-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07172F]/85 via-[#07172F]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 sm:p-6 text-white">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/75">
                            {item.categoryLabel}
                          </p>
                          <p className="font-display text-xl sm:text-2xl font-semibold text-white mt-0.5">
                            {item.title}
                          </p>
                          <p className="text-xs text-white/80 mt-1 line-clamp-2">
                            {resolved.isCustom ? 'Company-supplied photograph' : item.caption}
                          </p>
                        </div>
                        <span className="w-9 h-9 rounded-md bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
                          <Maximize2 className="w-4 h-4 text-white" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </button>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACCESSIBLE LIGHTBOX VIEWER */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-photo-title"
          className="fixed inset-0 z-50 bg-[#07172F]/95 backdrop-blur-xs flex flex-col justify-between p-4 sm:p-8 text-white"
        >
          {/* Top Bar */}
          <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between gap-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/75 tabular-nums">
              {lightboxIndex + 1} / {filteredItems.length} · {activeLightboxItem.categoryLabel}
            </p>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery viewer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Center Image + Next / Previous Controls */}
          <div className="max-w-[1160px] w-full mx-auto my-4 flex-1 min-h-0 flex items-center justify-between gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
                )
              }
              aria-label="Previous photograph"
              className="w-11 h-11 rounded-full bg-white/12 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
            </button>

            <div className="flex-1 h-full max-h-[68vh] flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={resolveMediaSrc(activeLightboxItem.imageKey).src}
                alt={activeLightboxItem.alt}
                className="max-h-[68vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredItems.length)}
              aria-label="Next photograph"
              className="w-11 h-11 rounded-full bg-white/12 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div className="max-w-[920px] w-full mx-auto text-center space-y-1">
            <h2 id="lightbox-photo-title" className="font-display text-2xl font-semibold text-white">
              {activeLightboxItem.title}
            </h2>
            <p className="text-sm text-white/80">{activeLightboxItem.caption}</p>
            <p className="text-[11px] text-white/55">{activeLightboxItem.sourceAttribution}</p>
          </div>
        </div>
      )}

      {/* CUSTOMER FEEDBACK SECTION — ZERO FAKE REVIEWS ON LIVE SITE */}
      <section aria-labelledby="customer-feedback-heading" className="py-20 sm:py-28 bg-[#F5F7FA] border-t border-[#E8EDF4]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0B2348]">
              Genuine Testimonials Only
            </p>
            <h2
              id="customer-feedback-heading"
              className="font-display text-3xl sm:text-5xl font-semibold text-[#0B2348]"
            >
              Customer Feedback
            </h2>
          </div>

          {approvedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {approvedReviews.map((review) => (
                <blockquote
                  key={review.id}
                  className="bg-white border border-[#E8EDF4] rounded-xl p-8 space-y-4 flex flex-col justify-between"
                >
                  <p className="font-display text-xl sm:text-2xl text-[#0B2348] leading-relaxed">
                    “{review.quoteText}”
                  </p>
                  <footer className="pt-4 border-t border-[#E8EDF4] text-xs text-[#667085]">
                    <strong className="text-[#0B2348] font-semibold">{review.customerName}</strong>
                    {' · '}
                    <span>{review.moveSummary}</span>
                    {' · '}
                    <span className="tabular-nums">{review.dateLabel}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E8EDF4] rounded-xl p-8 sm:p-11 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B2348]">
                  Have We Helped With Your Move in Ipswich?
                </h3>
                <p className="text-[15px] text-[#283548] leading-relaxed">
                  We never publish sample, stock, or unverified star ratings. Only genuine feedback submitted and approved by real customers of MK Man And Van Removals Services Ipswich is displayed here.
                </p>
                <p className="text-sm text-[#667085] leading-relaxed">
                  If we recently assisted you with a house move, flat relocation, or item delivery, we would welcome your honest feedback by email or WhatsApp.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <a
                  href={`mailto:${config.email}?subject=${encodeURIComponent('Customer Feedback — MK Man And Van Removals Services Ipswich')}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Send Feedback by Email</span>
                </a>
                <a
                  href={config.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold tracking-wider uppercase border border-[#0B2348] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Share via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setOwnerModalOpen(true)}
                  className="text-xs text-[#667085] hover:text-[#0B2348] underline underline-offset-4 pt-1 cursor-pointer"
                >
                  Business Owner: Publish Verified Customer Review
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GALLERY PAGE CTA */}
      <PageCtaSection
        heading="Planning a Move of Your Own?"
        signatureAccent="Request a tailored Ipswich quote"
        supportingText="Tell us your pickup and destination postcodes and the items you need moved."
        buttonLabel="REQUEST A QUOTE"
        buttonTo="/contact#quote-form"
      />
    </div>
  );
};
