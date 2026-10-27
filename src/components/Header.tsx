import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Our Services' },
  { to: '/areas-we-cover', label: 'Areas We Cover' },
  { to: '/why-choose-us', label: 'Why Choose Us' },
  { to: '/gallery-reviews', label: 'Gallery & Reviews' },
  { to: '/contact', label: 'Contact' },
];

export const Header: React.FC = () => {
  const { config } = useSiteConfig();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const useTransparentHeroBar = !scrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        useTransparentHeroBar
          ? 'bg-gradient-to-b from-[#07172F]/80 via-[#07172F]/40 to-transparent border-b border-white/15'
          : 'bg-white/98 backdrop-blur-md border-b border-[#E8EDF4] shadow-[0_1px_3px_rgba(7,23,47,0.05)]'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-3 lg:gap-6">
        {/* Zone 1: MK Logo & Brand Lockup */}
        <Link
          to="/"
          aria-label={`${config.businessName} — Home`}
          className="flex items-center gap-2.5 lg:gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B2348]"
        >
          <span className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 ring-1 ring-[#0B2348]/15">
            <img
              src={config.logoUrl}
              alt="MK Man And Van Removals Services truck emblem"
              className="w-full h-full object-contain"
            />
          </span>
          <span
            className={`font-display text-[17px] lg:text-[19px] font-semibold tracking-tight transition-colors duration-200 ${
              useTransparentHeroBar ? 'text-white' : 'text-[#0B2348]'
            }`}
          >
            <span className="inline min-[820px]:hidden min-[1180px]:inline">
              MK Man &amp; Van Removals
            </span>
            <span className="hidden min-[1000px]:inline min-[1180px]:hidden">
              MK Removals
            </span>
          </span>
        </Link>

        {/* Zone 2: Seven-Page Top Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden min-[820px]:flex items-center justify-center gap-3 min-[940px]:gap-4 min-[1060px]:gap-5 xl:gap-7"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative py-1.5 text-[12px] min-[940px]:text-[13px] min-[1080px]:text-[13.5px] xl:text-[14px] tracking-[0.01em] whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  useTransparentHeroBar
                    ? isActive
                      ? 'text-white font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-white'
                      : 'text-white/90 font-medium hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-white/0 hover:after:bg-white/50 after:transition-colors'
                    : isActive
                      ? 'text-[#0B2348] font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#0B2348]'
                      : 'text-[#283548] font-medium hover:text-[#0B2348] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-transparent hover:after:bg-[#0B2348]/35 after:transition-colors'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Single Primary Quote CTA + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/contact#quote-form"
            className={`hidden sm:inline-flex items-center justify-center px-3.5 min-[1080px]:px-5 py-2 min-[1080px]:py-2.5 text-[12px] min-[1080px]:text-[13px] font-semibold tracking-wide rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              useTransparentHeroBar
                ? 'bg-white text-[#0B2348] hover:bg-[#F5F7FA] focus-visible:outline-white'
                : 'bg-[#0B2348] text-white hover:bg-[#07172F] focus-visible:outline-[#0B2348]'
            }`}
          >
            Get a Free Quote
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-panel"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`min-[820px]:hidden inline-flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              useTransparentHeroBar
                ? 'text-white hover:bg-white/10 focus-visible:outline-white'
                : 'text-[#0B2348] hover:bg-[#F5F7FA] focus-visible:outline-[#0B2348]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer (<820px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-panel"
          className="min-[820px]:hidden bg-white border-b border-[#E8EDF4] shadow-lg"
        >
          <nav aria-label="Mobile Navigation" className="max-w-[1360px] mx-auto px-4 sm:px-6 py-5 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-3 rounded-md text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F5F7FA] text-[#0B2348] font-semibold'
                      : 'text-[#283548] hover:bg-[#F5F7FA] hover:text-[#0B2348]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-4 pt-4 border-t border-[#E8EDF4] flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact#quote-form"
                className="flex-1 inline-flex items-center justify-center px-5 py-3 text-sm font-semibold bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] transition-colors"
              >
                Get a Free Quote
              </Link>
              <a
                href={config.phoneTelHref}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold border border-[#0B2348] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Call 07708 632170</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
