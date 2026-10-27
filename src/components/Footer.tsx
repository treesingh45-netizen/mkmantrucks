import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';

export const Footer: React.FC = () => {
  const { config, setCookieModalOpen, setOwnerModalOpen } = useSiteConfig();
  const confirmedServices = config.services.filter((s) => s.confirmedByOwner);
  const currentYear = new Date().getFullYear();

  const hasFacebook = Boolean(config.socialLinks.facebookUrl.trim());
  const hasInstagram = Boolean(config.socialLinks.instagramUrl.trim());

  return (
    <footer className="bg-[#07172F] text-white border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-white/12">
          {/* Column 1: Brand & Description */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <span className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center shrink-0">
                <img
                  src={config.logoUrl}
                  alt="MK Man And Van Removals Services emblem"
                  className="w-full h-full object-contain"
                />
              </span>
              <span className="font-display text-xl font-semibold text-white leading-tight">
                {config.businessName}
              </span>
            </Link>

            <p className="text-sm text-white/75 leading-relaxed max-w-sm">
              Based in Ipswich, Suffolk, welcoming residential moving, man-and-van, furniture transport, and collection-and-delivery enquiries. Share your moving details directly to discuss suitable arrangements.
            </p>

            {/* Social profiles strictly hidden until genuine URLs are supplied */}
            {(hasFacebook || hasInstagram) && (
              <div className="flex items-center gap-4 pt-1">
                {hasFacebook && (
                  <a
                    href={config.socialLinks.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-white/80 hover:text-white underline underline-offset-4"
                  >
                    Facebook
                  </a>
                )}
                {hasInstagram && (
                  <a
                    href={config.socialLinks.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-white/80 hover:text-white underline underline-offset-4"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-sans text-xs font-semibold tracking-wider uppercase text-white/60">
              Pages
            </h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/areas-we-cover" className="hover:text-white transition-colors">Areas We Cover</Link></li>
              <li><Link to="/why-choose-us" className="hover:text-white transition-colors">Why Choose Us</Link></li>
              <li><Link to="/gallery-reviews" className="hover:text-white transition-colors">Gallery &amp; Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact &amp; Free Quote</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sans text-xs font-semibold tracking-wider uppercase text-white/60">
              Enquiry Categories
            </h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              {confirmedServices.map((svc) => (
                <li key={svc.id}>
                  <Link to={`/services#${svc.slug}`} className="hover:text-white transition-colors">
                    {svc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sans text-xs font-semibold tracking-wider uppercase text-white/60">
              Direct Contact
            </h2>
            <ul className="space-y-3 text-sm text-white/85">
              <li>
                <a
                  href={config.phoneTelHref}
                  className="inline-flex items-start gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-white/70 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">{config.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="inline-flex items-start gap-2.5 hover:text-white transition-colors break-all"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-white/70 shrink-0" aria-hidden="true" />
                  <span>{config.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={config.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2.5 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mt-0.5 text-white/70 shrink-0" aria-hidden="true" />
                  <span>Message on WhatsApp</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5 text-white/75">
                <MapPin className="w-4 h-4 mt-0.5 text-white/70 shrink-0" aria-hidden="true" />
                <span>{config.fullAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Settings Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/65">
          <p className="tabular-nums">
            &copy; {currentYear} {config.businessName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setCookieModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cookie &amp; Map Settings
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setOwnerModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Client Content Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
