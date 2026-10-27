/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { SiteConfigProvider } from './data/siteConfig';
import { SeoHead } from './components/SeoHead';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieSettingsModal, OwnerSettingsModal } from './components/Modals';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AreasPage } from './pages/AreasPage';
import { WhyChooseUsPage } from './pages/WhyChooseUsPage';
import { GalleryReviewsPage } from './pages/GalleryReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function AppRoutesShell() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuota);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#283548]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0B2348] focus:text-white focus:rounded-md focus:text-xs focus:font-semibold"
      >
        Skip to main content
      </a>

      {quotaExceeded && (
        <div
          role="alert"
          className="sticky top-0 z-50 border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <strong>Maps demo key quota reached.</strong> Switch to your own Google Maps Platform API key in{' '}
          <code>.env</code> (<code>VITE_GOOGLE_MAPS_API_KEY</code>) to lift the shared limit —{' '}
          <a
            href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            create &amp; configure a key
          </a>
          .
        </div>
      )}

      <SeoHead />
      <Header />

      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/areas-we-cover" element={<AreasPage />} />
          <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
          <Route path="/gallery-reviews" element={<GalleryReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <CookieSettingsModal />
      <OwnerSettingsModal />
    </div>
  );
}

export default function App() {
  const content = (
    <SiteConfigProvider>
      <BrowserRouter>
        <AppRoutesShell />
      </BrowserRouter>
    </SiteConfigProvider>
  );

  if (MAPS_API_KEY) {
    return (
      <APIProvider
        apiKey={MAPS_API_KEY}
        region="GB"
        language="en-GB"
        libraries={['marker']}
      >
        {content}
      </APIProvider>
    );
  }

  return content;
}
