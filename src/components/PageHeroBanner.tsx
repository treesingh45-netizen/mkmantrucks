import React from 'react';
import { motion } from 'motion/react';
import { SmartImage } from './SmartImage';

interface PageHeroBannerProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageKey?: string;
  imageAlt?: string;
  objectPositionClass?: string;
  children?: React.ReactNode;
}

export const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  eyebrow,
  title,
  subtitle,
  imageKey = 'heroVanMain',
  imageAlt = 'White removal van prepared for moving and transport in Ipswich',
  objectPositionClass = 'object-[center_52%]',
  children,
}) => {
  return (
    <section className="relative w-full min-h-[430px] sm:min-h-[470px] flex items-end overflow-hidden bg-[#07172F] text-white border-b border-white/10">
      {/* Full-bleed genuine truck / removal van background photograph */}
      <div className="absolute inset-0">
        <SmartImage
          imageKey={imageKey}
          alt={imageAlt}
          priority={true}
          objectPositionClass={objectPositionClass}
          className="w-full h-full"
        />
        {/* Layered directional deep-navy scrim: crisp contrast for header & left copy while keeping the background van/truck clearly visible */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#07172F]/86 via-[#07172F]/68 to-[#07172F]/46"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#07172F]/72 via-transparent to-[#07172F]/68"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="max-w-3xl space-y-4 sm:space-y-5">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-xs font-semibold tracking-[0.22em] uppercase text-white/85"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.05, ease: 'easeOut' }}
            className="font-display text-4xl sm:text-6xl font-semibold text-white leading-[1.08]"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.1, ease: 'easeOut' }}
            className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>
        </div>

        {children}
      </div>
    </section>
  );
};
