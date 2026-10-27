import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface ServiceItem {
  id: string;
  slug: string;
  indexLabel: string;
  title: string;
  shortSummary: string;
  detailedDescription: string;
  idealFor: string[];
  enquiryChecklist: string[];
  imageKey: string;
  imageAlt: string;
  confirmedByOwner: boolean;
}

export interface CoverageAreaItem {
  id: string;
  name: string;
  countyOrNote: string;
  confirmedByOwner: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface VerifiedReviewItem {
  id: string;
  customerName: string;
  moveSummary: string;
  quoteText: string;
  dateLabel: string;
  approvedForLiveSite: boolean;
}

export interface GalleryItem {
  id: string;
  imageKey: string;
  category: 'vehicles' | 'residential' | 'packing' | 'local';
  categoryLabel: string;
  title: string;
  caption: string;
  alt: string;
  sourceAttribution: string;
  aspectClass: string;
}

export interface SiteConfig {
  businessName: string;
  phoneDisplay: string;
  phoneTelHref: string;
  whatsappHref: string;
  email: string;
  fullAddress: string;
  logoUrl: string;
  googleMapsDirectionsUrl: string;
  googleMapsSearchUrl: string;
  mapsConsentEnabled: boolean;
  socialLinks: {
    facebookUrl: string;
    instagramUrl: string;
  };
  services: ServiceItem[];
  surroundingAreas: CoverageAreaItem[];
  faqs: FaqItem[];
  mediaOverrides: Record<string, string>;
  verifiedReviews: VerifiedReviewItem[];
}

export const STOCK_MEDIA_DEFAULTS: Record<string, { src: string; source: string }> = {
  heroVanMain: {
    src: '/images/stock/hero-van-main.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  vanChecklistTeam: {
    src: '/images/stock/van-checklist-team.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  vanLoadingTrolley: {
    src: '/images/stock/van-loading-trolley.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  vanRearLoading: {
    src: '/images/stock/van-rear-loading.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  highwayTransportTruck: {
    src: '/images/stock/highway-transport-truck.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  clipboardStreetSunset: {
    src: '/images/stock/clipboard-street-sunset.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  moversRoomBoxes: {
    src: '/images/stock/movers-room-boxes.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  houseLivingStairs: {
    src: '/images/stock/house-living-stairs.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  apartmentLivingModern: {
    src: '/images/stock/apartment-living-modern.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  furnitureSofaCarry: {
    src: '/images/stock/furniture-sofa-carry.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  fragileBoxFloor: {
    src: '/images/stock/fragile-box-floor.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  packingTapeBox: {
    src: '/images/stock/packing-tape-box.jpg',
    source: 'Licensed Commercial Stock Photography (Unsplash)',
  },
  ipswichWaterfront: {
    src: '/images/stock/ipswich-waterfront.jpg',
    source: 'Genuine Ipswich Location Photography (Licensed)',
  },
};

export const GALLERY_CATALOG: GalleryItem[] = [
  {
    id: 'gal-1',
    imageKey: 'heroVanMain',
    category: 'vehicles',
    categoryLabel: 'Transport & Vans',
    title: 'Curbside Removal Van Loading',
    caption: 'Illustrative removal van scene — replaceable with company vehicle photography.',
    alt: 'White high-roof removal van parked curbside with moving boxes prepared for loading',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'md:col-span-2 aspect-[16/10]',
  },
  {
    id: 'gal-2',
    imageKey: 'vanLoadingTrolley',
    category: 'vehicles',
    categoryLabel: 'Transport & Vans',
    title: 'Rear Van Compartment & Trolley Handling',
    caption: 'Illustrative van loading arrangement for stacked cartons and household items.',
    alt: 'Open rear doors of a white high-roof removal van with boxes stacked on a hand trolley',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-3',
    imageKey: 'ipswichWaterfront',
    category: 'local',
    categoryLabel: 'Ipswich Location',
    title: 'Ipswich Waterfront & Marina, Suffolk',
    caption: 'Primary service location: Ipswich, Suffolk, operating from 3 Mersey Road, IP3 0QP.',
    alt: 'Boats and waterfront apartments along Ipswich Marina in Suffolk, United Kingdom',
    sourceAttribution: 'Genuine Ipswich location photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-4',
    imageKey: 'vanRearLoading',
    category: 'vehicles',
    categoryLabel: 'Transport & Vans',
    title: 'Organised Carton Loading',
    caption: 'Illustrative loading of labelled fragile boxes into a high-roof removal van.',
    alt: 'White removal van rear compartment being loaded with fragile-labelled moving cartons',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-5',
    imageKey: 'furnitureSofaCarry',
    category: 'residential',
    categoryLabel: 'Furniture & Rooms',
    title: 'Bulky Domestic Furniture Handling',
    caption: 'Illustrative sofa and living-room furniture movement during a residential relocation.',
    alt: 'Moving household sofa carefully across a residential living room',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-6',
    imageKey: 'houseLivingStairs',
    category: 'residential',
    categoryLabel: 'Furniture & Rooms',
    title: 'Multi-Room Residential Properties',
    caption: 'Illustrative home interior representing house removals and internal stair access planning.',
    alt: 'Bright residential living area and staircase prepared for household moving',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-7',
    imageKey: 'packingTapeBox',
    category: 'packing',
    categoryLabel: 'Boxes & Preparation',
    title: 'Sealed Cartons Ready for Collection',
    caption: 'Illustrative carton preparation — clear labelling helps keep unloading organised.',
    alt: 'Sealing cardboard moving boxes securely with packing tape prior to transport',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-8',
    imageKey: 'fragileBoxFloor',
    category: 'packing',
    categoryLabel: 'Boxes & Preparation',
    title: 'Clearly Marked Fragile Items',
    caption: 'Illustrative fragile box labelling for delicate household belongings.',
    alt: 'Cardboard moving carton marked fragile resting on wooden flooring',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-9',
    imageKey: 'highwayTransportTruck',
    category: 'vehicles',
    categoryLabel: 'Transport & Vans',
    title: 'Point-to-Point Road Transport',
    caption: 'Illustrative UK & road transport scene for planned collection and delivery routes.',
    alt: 'White commercial transport trucks travelling along a multi-lane road',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'md:col-span-2 aspect-[16/10]',
  },
  {
    id: 'gal-10',
    imageKey: 'apartmentLivingModern',
    category: 'residential',
    categoryLabel: 'Furniture & Rooms',
    title: 'Flat & Apartment Relocations',
    caption: 'Illustrative apartment interior for studio, ground-floor, and upper-floor flat enquiries.',
    alt: 'Modern apartment living space with furniture ready for relocation planning',
    sourceAttribution: 'Illustrative licensed stock photography · Replaceable in Client Content Settings',
    aspectClass: 'aspect-[4/3]',
  },
];

const DEFAULT_SITE_CONFIG: SiteConfig = {
  businessName: 'MK Man And Van Removals Services Ipswich',
  phoneDisplay: '+44 7708 632170',
  phoneTelHref: 'tel:+447708632170',
  whatsappHref: 'https://wa.me/447708632170',
  email: 'SERVICES@gmail.com',
  fullAddress: '3 Mersey Road, Ipswich, IP3 0QP, United Kingdom',
  logoUrl: '/assets/aistudio/Navy_MK_Transport_Emblem_e929ba87.png',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=3+Mersey+Road%2C+Ipswich%2C+IP3+0QP%2C+United+Kingdom',
  googleMapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=3+Mersey+Road%2C+Ipswich%2C+IP3+0QP%2C+United+Kingdom',
  mapsConsentEnabled: true,
  socialLinks: {
    facebookUrl: '',
    instagramUrl: '',
  },
  services: [
    {
      id: 'svc-house-removals',
      slug: 'house-removals',
      indexLabel: '01',
      title: 'House Removals',
      shortSummary:
        'Discuss room-by-room residential moves in Ipswich, tailored around your property access, furniture list, and preferred moving date.',
      detailedDescription:
        'Moving from one house to another requires clear coordination around access, parking, bulky furniture, and boxed household belongings. Share your collection and destination postcodes along with a summary of your rooms so we can discuss the most practical transport arrangement for your move.',
      idealFor: [
        'Terraced, semi-detached, and detached residential moves in Ipswich',
        'Household furniture, white goods, and stacked moving cartons',
        'Planned moving dates where clear arrival and access notes matter',
      ],
      enquiryChecklist: [
        'Collection and destination postcodes',
        'Approximate number of rooms or boxes',
        'Driveway or street parking availability at both properties',
      ],
      imageKey: 'houseLivingStairs',
      imageAlt: 'Residential living room and staircase prepared for a household move',
      confirmedByOwner: true,
    },
    {
      id: 'svc-flat-moves',
      slug: 'flat-and-apartment-moves',
      indexLabel: '02',
      title: 'Flat and Apartment Moves',
      shortSummary:
        'Practical moving enquiries for studio flats, waterfront apartments, and multi-storey residential buildings across Ipswich.',
      detailedDescription:
        'Apartment and flat relocations often involve communal entrances, stairwell turns, lift dimensions, or timed loading bays. Let us know which floor you are moving from and to, whether a lift is available, and what furniture and boxes need transporting.',
      idealFor: [
        'Studio, one-bedroom, and two-bedroom flat relocations',
        'Ipswich Waterfront, town-centre, and residential apartment buildings',
        'Tenants moving between rental properties with fixed handover dates',
      ],
      enquiryChecklist: [
        'Floor level and whether passenger or goods lift access exists',
        'Any parking permits, loading bays, or courtyard restrictions',
        'List of main furniture pieces and approximate carton count',
      ],
      imageKey: 'apartmentLivingModern',
      imageAlt: 'Modern apartment living room representing flat and apartment relocation enquiries',
      confirmedByOwner: true,
    },
    {
      id: 'svc-man-and-van',
      slug: 'man-and-van',
      indexLabel: '03',
      title: 'Man and Van',
      shortSummary:
        'Flexible van-based transport for smaller domestic moves, part-loads, student relocations, and straightforward point-to-point journeys.',
      detailedDescription:
        'When your move does not require a multi-lorry fleet, a dedicated man-and-van enquiry offers a direct, practical way to transport boxed belongings and key furniture pieces. Tell us what needs moving and your route postcodes so we can confirm suitability.',
      idealFor: [
        'Part-house loads, room moves, and compact domestic relocations',
        'Moving boxed belongings into or out of self-storage units',
        'Direct point-to-point transport starting or finishing in Ipswich',
      ],
      enquiryChecklist: [
        'Pickup and drop-off postcodes',
        'Preferred date and time window',
        'Brief list of boxes, bags, and furniture items',
      ],
      imageKey: 'vanLoadingTrolley',
      imageAlt: 'White high-roof removal van with rear doors open and moving boxes on a trolley',
      confirmedByOwner: true,
    },
    {
      id: 'svc-furniture-transport',
      slug: 'furniture-transportation',
      indexLabel: '04',
      title: 'Furniture Transportation',
      shortSummary:
        'Dedicated transport enquiries for sofas, dining tables, wardrobes, bed frames, and household furnishings.',
      detailedDescription:
        'Transporting bulky domestic furniture safely starts with knowing approximate dimensions, doorway clearances, and whether large frames dismantle into sections. Share the pieces you need moved so we can discuss handling and vehicle space before collection.',
      idealFor: [
        'Sofas, armchairs, dining sets, chests of drawers, and bed frames',
        'Moving furniture between family addresses or into a new home',
        'Pre-assembled or dismantled domestic furnishings',
      ],
      enquiryChecklist: [
        'Furniture item names and approximate measurements if oversized',
        'Whether items are already dismantled or one-piece',
        'Ground-floor or upstairs room access details',
      ],
      imageKey: 'furnitureSofaCarry',
      imageAlt: 'Domestic sofa being carried carefully during a residential furniture move',
      confirmedByOwner: true,
    },
    {
      id: 'svc-single-item',
      slug: 'single-item-moves',
      indexLabel: '05',
      title: 'Single-Item Moves',
      shortSummary:
        'Need just one heavy or awkward item moved across Ipswich? Enquire directly for individual furniture or appliance transport.',
      detailedDescription:
        'Standard cars rarely fit a full-length sofa, tall bookcase, dining table, or freestanding appliance. If you have a single bulky item that needs moving from A to B in Ipswich, send us the item details and both postcodes for a straightforward quote conversation.',
      idealFor: [
        'One-off bulky items that will not fit into a standard car',
        'Individual appliances, mattresses, desks, or armchairs',
        'Local Ipswich address-to-address single-item transfers',
      ],
      enquiryChecklist: [
        'Description and rough size/weight of the single item',
        'Collection and delivery postcodes',
        'Any steps, narrow hallways, or upper-floor access at either end',
      ],
      imageKey: 'fragileBoxFloor',
      imageAlt: 'Prepared household item and carton ready for individual transport',
      confirmedByOwner: true,
    },
    {
      id: 'svc-collection-delivery',
      slug: 'collection-and-delivery',
      indexLabel: '06',
      title: 'Collection and Delivery',
      shortSummary:
        'Pre-arranged pickup and delivery for pre-purchased furniture, marketplace finds, or stored items in and around Ipswich.',
      detailedDescription:
        'Bought a piece of furniture locally or arranging collection from a storage unit or private seller? Share the pickup location, seller readiness window, and delivery postcode so we can discuss scheduling a convenient collection and drop-off.',
      idealFor: [
        'Private seller or second-hand furniture pickups in Ipswich',
        'Collecting boxed or household items from local storage facilities',
        'Scheduled point-to-point residential deliveries',
      ],
      enquiryChecklist: [
        'Collection postcode and agreed seller/storage pickup window',
        'Delivery postcode and recipient contact details',
        'Exact list of items to be collected',
      ],
      imageKey: 'packingTapeBox',
      imageAlt: 'Sealed cardboard cartons prepared for scheduled collection and delivery',
      confirmedByOwner: true,
    },
  ],
  surroundingAreas: [
    {
      id: 'area-ip3',
      name: 'Ipswich East & IP3 (Mersey Road Base)',
      countyOrNote: 'Primary Ipswich Operational Base · IP3 0QP',
      confirmedByOwner: true,
    },
    {
      id: 'area-ip1',
      name: 'Ipswich Town Centre & IP1',
      countyOrNote: 'Confirmed Local Ipswich Coverage',
      confirmedByOwner: true,
    },
    {
      id: 'area-ip2',
      name: 'Ipswich South-West, Stoke Park & IP2',
      countyOrNote: 'Confirmed Local Ipswich Coverage',
      confirmedByOwner: true,
    },
    {
      id: 'area-ip4',
      name: 'Ipswich Waterfront, Rushmere & IP4',
      countyOrNote: 'Confirmed Local Ipswich Coverage',
      confirmedByOwner: true,
    },
    {
      id: 'area-kesgrave',
      name: 'Kesgrave & Martlesham',
      countyOrNote: 'Awaiting owner confirmation',
      confirmedByOwner: false,
    },
    {
      id: 'area-felixstowe',
      name: 'Felixstowe',
      countyOrNote: 'Awaiting owner confirmation',
      confirmedByOwner: false,
    },
    {
      id: 'area-woodbridge',
      name: 'Woodbridge',
      countyOrNote: 'Awaiting owner confirmation',
      confirmedByOwner: false,
    },
    {
      id: 'area-stowmarket',
      name: 'Stowmarket',
      countyOrNote: 'Awaiting owner confirmation',
      confirmedByOwner: false,
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'How do I request a moving or man-and-van quote?',
      answer:
        'You can complete the online Quote Request Form on our Contact page, call us directly on +44 7708 632170, message us on WhatsApp, or email SERVICES@gmail.com. Sharing your collection postcode, destination postcode, preferred date, and item list helps us review your enquiry accurately.',
    },
    {
      id: 'faq-2',
      question: 'What details should I include when describing my move?',
      answer:
        'Please include both postcodes, the main furniture pieces and approximate number of boxes, property types, floor levels, whether lift access is available, and any parking or loading notes outside either address.',
    },
    {
      id: 'faq-3',
      question: 'Can I enquire about moving a single item rather than a full house?',
      answer:
        'Yes. Alongside house and flat moves, we welcome enquiries for single bulky items, individual furniture pieces, and point-to-point collections and deliveries in Ipswich.',
    },
    {
      id: 'faq-4',
      question: 'Which areas do you cover?',
      answer:
        'MK Man And Van Removals Services is based at 3 Mersey Road, Ipswich, IP3 0QP, serving Ipswich as our primary location. If you are moving to or from an address outside central Ipswich, include both postcodes in your enquiry so we can confirm route suitability and availability.',
    },
    {
      id: 'faq-5',
      question: 'What if my preferred moving date is not yet finalised?',
      answer:
        'You can still get in touch early. Simply leave the Preferred Moving Date field blank or mention your provisional timeframe in the Additional Information box so we can discuss your plans.',
    },
    {
      id: 'faq-6',
      question: 'Is submitting the online quote form a binding booking?',
      answer:
        'No. Submitting a quote request carries no obligation. Moving arrangements are only scheduled once we have discussed your requirements directly and both sides have agreed the details.',
    },
  ],
  mediaOverrides: {},
  verifiedReviews: [],
};

const STORAGE_KEY = 'mk_ipswich_site_config_v1';

interface SiteConfigContextValue {
  config: SiteConfig;
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  resetConfig: () => void;
  resolveMediaSrc: (imageKey: string) => { src: string; isCustom: boolean; source: string };
  cookieModalOpen: boolean;
  setCookieModalOpen: (open: boolean) => void;
  ownerModalOpen: boolean;
  setOwnerModalOpen: (open: boolean) => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_SITE_CONFIG;
      const parsed = JSON.parse(saved) as Partial<SiteConfig>;
      return {
        ...DEFAULT_SITE_CONFIG,
        ...parsed,
        socialLinks: {
          ...DEFAULT_SITE_CONFIG.socialLinks,
          ...(parsed.socialLinks || {}),
        },
        mediaOverrides: {
          ...DEFAULT_SITE_CONFIG.mediaOverrides,
          ...(parsed.mediaOverrides || {}),
        },
        services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_SITE_CONFIG.services,
        surroundingAreas: Array.isArray(parsed.surroundingAreas)
          ? parsed.surroundingAreas
          : DEFAULT_SITE_CONFIG.surroundingAreas,
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_SITE_CONFIG.faqs,
        verifiedReviews: Array.isArray(parsed.verifiedReviews)
          ? parsed.verifiedReviews
          : DEFAULT_SITE_CONFIG.verifiedReviews,
      };
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  });

  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors in restricted browsing modes
    }
  }, [config]);

  const updateConfig = (updater: (prev: SiteConfig) => SiteConfig) => {
    setConfig((prev) => updater(prev));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_SITE_CONFIG);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const resolveMediaSrc = (imageKey: string) => {
    const customUrl = config.mediaOverrides[imageKey]?.trim();
    const fallback = STOCK_MEDIA_DEFAULTS[imageKey];
    if (customUrl) {
      return {
        src: customUrl,
        isCustom: true,
        source: 'Supplied by MK Man And Van Removals Services Ipswich',
      };
    }
    return {
      src: fallback?.src || '',
      isCustom: false,
      source: fallback?.source || 'Licensed Stock Photography',
    };
  };

  const value = useMemo<SiteConfigContextValue>(
    () => ({
      config,
      updateConfig,
      resetConfig,
      resolveMediaSrc,
      cookieModalOpen,
      setCookieModalOpen,
      ownerModalOpen,
      setOwnerModalOpen,
    }),
    [config, cookieModalOpen, ownerModalOpen]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
};

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return ctx;
}
