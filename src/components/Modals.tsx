import React, { useEffect, useState } from 'react';
import { X, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { STOCK_MEDIA_DEFAULTS, useSiteConfig } from '../config/siteConfig';

export const CookieSettingsModal: React.FC = () => {
  const { config, updateConfig, cookieModalOpen, setCookieModalOpen } = useSiteConfig();

  useEffect(() => {
    if (!cookieModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCookieModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cookieModalOpen, setCookieModalOpen]);

  if (!cookieModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07172F]/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
    >
      <div className="bg-white border border-[#E8EDF4] rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-[#E8EDF4] pb-4">
          <div>
            <h2 id="cookie-modal-title" className="font-display text-2xl font-semibold text-[#0B2348]">
              Cookie &amp; Map Settings
            </h2>
            <p className="text-xs text-[#667085] mt-1">
              Manage local preferences and optional Google Maps embeds.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCookieModalOpen(false)}
            aria-label="Close Cookie and Map Settings"
            className="p-2 rounded-md text-[#667085] hover:text-[#0B2348] hover:bg-[#F5F7FA] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-[#283548]">
          <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4]">
            <p className="font-semibold text-[#0B2348]">Strictly Necessary Site Storage</p>
            <p className="text-xs text-[#667085] mt-1 leading-relaxed">
              Used solely to remember your privacy choices and protect the quote form against duplicate or automated spam submissions. Always active.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-[#E8EDF4] flex items-start justify-between gap-4">
            <div>
              <label htmlFor="toggle-google-maps" className="font-semibold text-[#0B2348] cursor-pointer">
                Interactive Google Maps
              </label>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                Displays our verified Ipswich location (`3 Mersey Road, Ipswich, IP3 0QP`) using Google Maps Platform. Loading interactive maps connects your browser to Google servers.
              </p>
            </div>
            <input
              id="toggle-google-maps"
              type="checkbox"
              checked={config.mapsConsentEnabled}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  mapsConsentEnabled: e.target.checked,
                }))
              }
              className="mt-1 w-5 h-5 rounded border-[#667085] text-[#0B2348] focus:ring-[#0B2348] shrink-0"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setCookieModalOpen(false)}
            className="px-5 py-2.5 text-xs font-semibold tracking-wide bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors cursor-pointer"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const OwnerSettingsModal: React.FC = () => {
  const { config, updateConfig, resetConfig, ownerModalOpen, setOwnerModalOpen } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'contact' | 'services' | 'areas' | 'photos' | 'reviews'>('contact');
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewMove, setNewReviewMove] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewDate, setNewReviewDate] = useState('');

  useEffect(() => {
    if (!ownerModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOwnerModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ownerModalOpen, setOwnerModalOpen]);

  if (!ownerModalOpen) return null;

  const handleAddVerifiedReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    updateConfig((prev) => ({
      ...prev,
      verifiedReviews: [
        ...prev.verifiedReviews,
        {
          id: `rev-${Date.now()}`,
          customerName: newReviewName.trim(),
          moveSummary: newReviewMove.trim() || 'Verified Customer Move',
          quoteText: newReviewText.trim(),
          dateLabel: newReviewDate.trim() || new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
          approvedForLiveSite: true,
        },
      ],
    }));
    setNewReviewName('');
    setNewReviewMove('');
    setNewReviewText('');
    setNewReviewDate('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07172F]/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-modal-title"
    >
      <div className="bg-white border border-[#E8EDF4] rounded-xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8EDF4] flex items-center justify-between gap-4 bg-[#F5F7FA]">
          <div>
            <h2 id="owner-modal-title" className="font-display text-2xl font-semibold text-[#0B2348]">
              Client Content &amp; Media Configuration
            </h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Update business email, confirm proposed services &amp; surrounding Suffolk areas, swap stock photos for company vehicle photos, or publish genuine customer reviews.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOwnerModalOpen(false)}
            aria-label="Close Client Content Settings"
            className="p-2 rounded-md text-[#667085] hover:text-[#0B2348] hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-[#E8EDF4] flex flex-wrap gap-2 bg-white">
          {(
            [
              { id: 'contact', label: 'Contact & Social' },
              { id: 'services', label: 'Services' },
              { id: 'areas', label: 'Coverage Areas' },
              { id: 'photos', label: 'Replaceable Photos' },
              { id: 'reviews', label: 'Verified Reviews' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#0B2348] text-[#0B2348]'
                  : 'border-transparent text-[#667085] hover:text-[#283548]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="owner-email" className="block text-xs font-semibold text-[#283548] mb-1">
                  Quote Notification &amp; Public Email Address
                </label>
                <input
                  id="owner-email"
                  type="email"
                  value={config.email}
                  onChange={(e) => updateConfig((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-md border border-[#E8EDF4] px-3.5 py-2 text-sm text-[#283548]"
                />
              </div>
              <div>
                <label htmlFor="owner-fb" className="block text-xs font-semibold text-[#283548] mb-1">
                  Verified Facebook Page URL (leave blank to hide icon)
                </label>
                <input
                  id="owner-fb"
                  type="url"
                  placeholder="https://www.facebook.com/..."
                  value={config.socialLinks.facebookUrl}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, facebookUrl: e.target.value },
                    }))
                  }
                  className="w-full rounded-md border border-[#E8EDF4] px-3.5 py-2 text-sm text-[#283548]"
                />
              </div>
              <div>
                <label htmlFor="owner-ig" className="block text-xs font-semibold text-[#283548] mb-1">
                  Verified Instagram Profile URL (leave blank to hide icon)
                </label>
                <input
                  id="owner-ig"
                  type="url"
                  placeholder="https://www.instagram.com/..."
                  value={config.socialLinks.instagramUrl}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagramUrl: e.target.value },
                    }))
                  }
                  className="w-full rounded-md border border-[#E8EDF4] px-3.5 py-2 text-sm text-[#283548]"
                />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-3">
              <p className="text-xs text-[#667085]">
                Toggle which proposed moving and transport services are active across the website and Quote Form dropdown:
              </p>
              {config.services.map((svc) => (
                <label
                  key={svc.id}
                  className="flex items-start justify-between gap-4 p-3.5 rounded-lg border border-[#E8EDF4] hover:bg-[#F5F7FA] cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0B2348]">{svc.title}</p>
                    <p className="text-xs text-[#667085] mt-0.5">{svc.shortSummary}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={svc.confirmedByOwner}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        services: prev.services.map((item) =>
                          item.id === svc.id ? { ...item, confirmedByOwner: e.target.checked } : item
                        ),
                      }))
                    }
                    className="mt-1 w-4 h-4 rounded text-[#0B2348]"
                  />
                </label>
              ))}
            </div>
          )}

          {activeTab === 'areas' && (
            <div className="space-y-3">
              <p className="text-xs text-[#667085]">
                Only confirmed areas are listed publicly on the Areas We Cover page. Surrounding Suffolk towns remain unpublished until confirmed here:
              </p>
              {config.surroundingAreas.map((area) => (
                <label
                  key={area.id}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-lg border border-[#E8EDF4] hover:bg-[#F5F7FA] cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0B2348]">{area.name}</p>
                    <p className="text-xs text-[#667085]">{area.countyOrNote}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={area.confirmedByOwner}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        surroundingAreas: prev.surroundingAreas.map((item) =>
                          item.id === area.id
                            ? {
                                ...item,
                                confirmedByOwner: e.target.checked,
                                countyOrNote: e.target.checked ? 'Confirmed Coverage Area' : 'Awaiting owner confirmation',
                              }
                            : item
                        ),
                      }))
                    }
                    className="w-4 h-4 rounded text-[#0B2348]"
                  />
                </label>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <p className="text-xs text-[#667085]">
                Every stock photograph on this website can be replaced with MK Man And Van Removals Services’ own vehicle or job photography by pasting an image URL below:
              </p>
              {Object.entries(STOCK_MEDIA_DEFAULTS).map(([key, info]) => (
                <div key={key} className="p-3.5 rounded-lg border border-[#E8EDF4] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#0B2348]">{key}</span>
                    <span className="text-[11px] text-[#667085]">{info.source}</span>
                  </div>
                  <input
                    type="url"
                    placeholder={`Custom photo URL to replace ${info.src}`}
                    value={config.mediaOverrides[key] || ''}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        mediaOverrides: {
                          ...prev.mediaOverrides,
                          [key]: e.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-md border border-[#E8EDF4] px-3 py-1.5 text-xs text-[#283548]"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <p className="text-xs text-[#667085]">
                No fake or sample customer reviews are published by default. Add only genuine, customer-approved testimonials below:
              </p>

              <form onSubmit={handleAddVerifiedReview} className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Customer Name"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="rounded-md border border-[#E8EDF4] bg-white px-3 py-2 text-xs text-[#283548]"
                  />
                  <input
                    type="text"
                    placeholder="Move Type (e.g. Ipswich IP3 House Move)"
                    value={newReviewMove}
                    onChange={(e) => setNewReviewMove(e.target.value)}
                    className="rounded-md border border-[#E8EDF4] bg-white px-3 py-2 text-xs text-[#283548]"
                  />
                  <input
                    type="text"
                    placeholder="Month / Year (e.g. Oct 2026)"
                    value={newReviewDate}
                    onChange={(e) => setNewReviewDate(e.target.value)}
                    className="rounded-md border border-[#E8EDF4] bg-white px-3 py-2 text-xs text-[#283548]"
                  />
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Verbatim customer feedback…"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full rounded-md border border-[#E8EDF4] bg-white px-3 py-2 text-xs text-[#283548]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Publish Genuine Review</span>
                </button>
              </form>

              {config.verifiedReviews.length > 0 && (
                <div className="space-y-2">
                  {config.verifiedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-lg border border-[#E8EDF4] flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#0B2348]">
                          {rev.customerName} · {rev.moveSummary} ({rev.dateLabel})
                        </p>
                        <p className="text-xs text-[#283548] mt-1">“{rev.quoteText}”</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            verifiedReviews: prev.verifiedReviews.filter((r) => r.id !== rev.id),
                          }))
                        }
                        aria-label={`Remove review by ${rev.customerName}`}
                        className="p-1.5 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8EDF4] bg-[#F5F7FA] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={resetConfig}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#0B2348] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset to Verified Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => setOwnerModalOpen(false)}
            className="px-5 py-2.5 text-xs font-semibold bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
