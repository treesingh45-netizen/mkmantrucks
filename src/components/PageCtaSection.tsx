import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';

interface PageCtaSectionProps {
  eyebrow?: string;
  heading: string;
  supportingText: string;
  buttonLabel: string;
  buttonTo?: string;
  signatureAccent?: string;
}

export const PageCtaSection: React.FC<PageCtaSectionProps> = ({
  eyebrow = 'MK MAN AND VAN REMOVALS SERVICES IPSWICH',
  heading,
  supportingText,
  buttonLabel,
  buttonTo = '/contact#quote-form',
  signatureAccent,
}) => {
  const { config } = useSiteConfig();

  return (
    <section className="bg-[#07172F] text-white py-20 sm:py-24 border-t border-white/10">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/70">
          {eyebrow}
        </p>

        <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white leading-tight max-w-2xl mx-auto">
          {heading}
        </h2>

        {signatureAccent && (
          <p className="font-signature text-2xl sm:text-3xl text-[#E8EDF4]/90 -mt-2">
            {signatureAccent}
          </p>
        )}

        <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
          {supportingText}
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={buttonTo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase bg-white text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors whitespace-nowrap"
          >
            <span>{buttonLabel}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <a
            href={config.phoneTelHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase border border-white/35 text-white rounded-md hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>CALL US — 07708 632170</span>
          </a>
        </div>
      </div>
    </section>
  );
};
