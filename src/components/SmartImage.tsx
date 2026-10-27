import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';

interface SmartImageProps {
  imageKey: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  objectPositionClass?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  imageKey,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  objectPositionClass = 'object-center',
}) => {
  const { resolveMediaSrc } = useSiteConfig();
  const { src } = resolveMediaSrc(imageKey);
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#E8EDF4] text-[#0B2348] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Truck className="w-8 h-8 mb-2 opacity-70" aria-hidden="true" />
        <span className="text-xs font-medium text-[#283548] max-w-xs">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[#E8EDF4] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover ${objectPositionClass} ${imgClassName}`}
      />
    </div>
  );
};
