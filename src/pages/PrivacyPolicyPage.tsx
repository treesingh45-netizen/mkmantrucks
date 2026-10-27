import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../data/siteConfig';
import { PageHeroBanner } from '../components/PageHeroBanner';

export const PrivacyPolicyPage: React.FC = () => {
  const { config, setCookieModalOpen } = useSiteConfig();

  return (
    <div>
      <PageHeroBanner
        eyebrow="DATA PROTECTION & PRIVACY"
        title="Privacy & Cookie Policy"
        subtitle={`How ${config.businessName} handles customer quote enquiries and website preferences.`}
        imageKey="heroVanMain"
        imageAlt="White removal van parked curbside in Ipswich"
        objectPositionClass="object-[center_52%]"
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-sm sm:text-[15px] text-[#283548] leading-relaxed">
          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B2348]">
              1. Business Contact Details
            </h2>
            <p>
              This website is operated for <strong>{config.businessName}</strong>, located at{' '}
              <strong>{config.fullAddress}</strong>. For any privacy or enquiry data questions, you can contact us directly at{' '}
              <a href={`mailto:${config.email}`} className="font-semibold text-[#0B2348] underline">
                {config.email}
              </a>{' '}
              or by telephone on{' '}
              <a href={config.phoneTelHref} className="font-semibold text-[#0B2348] underline">
                {config.phoneDisplay}
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B2348]">
              2. Information We Collect When You Request a Quote
            </h2>
            <p>
              When you submit our online Quote Request Form, we collect only the practical details required to review your move and respond to you: your full name, telephone number, optional email address, collection postcode, destination postcode, optional preferred moving date, selected service type, optional property type, items to move, and any additional access notes you choose to share.
            </p>
            <p>
              Enquiry records are stored privately on the server and are never published publicly, sold, or used for unsolicited marketing lists.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B2348]">
              3. Lawful Basis &amp; Retention
            </h2>
            <p>
              Under UK GDPR, we process quote enquiry data on the basis of taking pre-contractual steps at your request (reviewing your moving requirements and discussing availability) and your explicit acknowledgement on the quote form. We also apply temporary server-side rate limiting and duplicate-submission checks to protect the website from automated spam.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B2348]">
              4. Interactive Google Maps &amp; Cookie Settings
            </h2>
            <p>
              Our Areas We Cover and Contact pages include an interactive location map powered by Google Maps Platform showing our Ipswich base (`3 Mersey Road, Ipswich, IP3 0QP`). When interactive maps are enabled, your browser connects to Google servers and your use of map features is subject to the{' '}
              <a
                href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0B2348] underline"
              >
                Google Maps/Google Earth Additional Terms of Service
              </a>{' '}
              and the{' '}
              <a
                href="https://policies.google.com/privacy?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0B2348] underline"
              >
                Google Privacy Policy
              </a>
              .
            </p>
            <p>
              You can disable or re-enable external interactive Google Maps tiles at any time via{' '}
              <button
                type="button"
                onClick={() => setCookieModalOpen(true)}
                className="font-semibold text-[#0B2348] underline cursor-pointer"
              >
                Cookie &amp; Map Settings
              </button>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B2348]">
              5. Your Data Rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of any personal enquiry details you have submitted to us by emailing{' '}
              <a href={`mailto:${config.email}`} className="font-semibold text-[#0B2348] underline">
                {config.email}
              </a>
              .
            </p>
          </div>

          <div className="pt-4 border-t border-[#E8EDF4]">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
            >
              Return to Contact &amp; Quote Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
