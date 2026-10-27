export interface QuoteRequestPayload {
  fullName: string;
  phoneNumber: string;
  emailAddress?: string;
  collectionPostcode: string;
  destinationPostcode: string;
  preferredMovingDate?: string;
  serviceType: string;
  propertyType?: string;
  itemsToMove: string;
  additionalInformation?: string;
  privacyAccepted: boolean;
  companyWebsiteHoneypot?: string;
}

export interface QuoteValidationErrors {
  fullName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  collectionPostcode?: string;
  destinationPostcode?: string;
  preferredMovingDate?: string;
  serviceType?: string;
  itemsToMove?: string;
  privacyAccepted?: string;
}

export interface QuoteValidationResult {
  valid: boolean;
  isSpam: boolean;
  errors: QuoteValidationErrors;
  normalized: {
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    collectionPostcode: string;
    destinationPostcode: string;
    preferredMovingDate: string;
    serviceType: string;
    propertyType: string;
    itemsToMove: string;
    additionalInformation: string;
    privacyAccepted: boolean;
  };
}

// Standard UK postcode format (e.g. IP3 0QP, IP1 1AA, SW1A 1AA, CO1 1JG) or outward postcode (e.g. IP3, IP1)
const UK_POSTCODE_FULL_REGEX = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;
const UK_POSTCODE_OUTWARD_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeUkPostcode(raw: string): string {
  const cleaned = (raw || '').trim().replace(/\s+/g, '').toUpperCase();
  const match = cleaned.match(UK_POSTCODE_FULL_REGEX);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return (raw || '').trim().toUpperCase().replace(/\s+/g, ' ');
}

export function isValidUkPostcodeOrArea(raw: string): boolean {
  const cleaned = (raw || '').trim();
  if (cleaned.length < 2 || cleaned.length > 12) return false;
  const compact = cleaned.replace(/\s+/g, '');
  return UK_POSTCODE_FULL_REGEX.test(compact) || UK_POSTCODE_OUTWARD_REGEX.test(compact);
}

export function isValidPhone(raw: string): boolean {
  const cleaned = (raw || '').trim();
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return false;
  return /^[+\d][\d\s().-]{8,22}$/.test(cleaned);
}

export function validateQuotePayload(payload: Partial<QuoteRequestPayload>): QuoteValidationResult {
  const isSpam = Boolean(payload.companyWebsiteHoneypot && payload.companyWebsiteHoneypot.trim().length > 0);

  const fullName = (payload.fullName || '').trim();
  const phoneNumber = (payload.phoneNumber || '').trim();
  const emailAddress = (payload.emailAddress || '').trim();
  const collectionPostcode = normalizeUkPostcode(payload.collectionPostcode || '');
  const destinationPostcode = normalizeUkPostcode(payload.destinationPostcode || '');
  const preferredMovingDate = (payload.preferredMovingDate || '').trim();
  const serviceType = (payload.serviceType || '').trim();
  const propertyType = (payload.propertyType || '').trim();
  const itemsToMove = (payload.itemsToMove || '').trim();
  const additionalInformation = (payload.additionalInformation || '').trim();
  const privacyAccepted = Boolean(payload.privacyAccepted);

  const errors: QuoteValidationErrors = {};

  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name must be 100 characters or fewer.';
  }

  if (!phoneNumber) {
    errors.phoneNumber = 'Please enter a contact telephone number so we can discuss your move.';
  } else if (!isValidPhone(phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid UK or international telephone number (e.g. 07708 632170).';
  }

  if (emailAddress && !EMAIL_REGEX.test(emailAddress)) {
    errors.emailAddress = 'Please enter a valid email address or leave this field blank.';
  }

  if (!collectionPostcode) {
    errors.collectionPostcode = 'Please enter the collection postcode (e.g. IP3 0QP).';
  } else if (!isValidUkPostcodeOrArea(collectionPostcode)) {
    errors.collectionPostcode = 'Please enter a valid UK postcode or outward area code (e.g. IP3 0QP or IP3).';
  }

  if (!destinationPostcode) {
    errors.destinationPostcode = 'Please enter the destination postcode (e.g. IP1 2AA).';
  } else if (!isValidUkPostcodeOrArea(destinationPostcode)) {
    errors.destinationPostcode = 'Please enter a valid UK postcode or outward area code (e.g. IP1 2AA or CO1).';
  }

  if (preferredMovingDate) {
    const parsed = Date.parse(preferredMovingDate);
    if (Number.isNaN(parsed)) {
      errors.preferredMovingDate = 'Please select a valid date or leave blank if flexible.';
    }
  }

  if (!serviceType) {
    errors.serviceType = 'Please select the type of moving or transport service you are enquiring about.';
  }

  if (itemsToMove.length < 5) {
    errors.itemsToMove = 'Please briefly list the main items or approximate room contents to move.';
  } else if (itemsToMove.length > 3000) {
    errors.itemsToMove = 'Items description must be 3,000 characters or fewer.';
  }

  if (!privacyAccepted) {
    errors.privacyAccepted = 'Please confirm that you understand how your enquiry details will be used.';
  }

  return {
    valid: Object.keys(errors).length === 0 && !isSpam,
    isSpam,
    errors,
    normalized: {
      fullName,
      phoneNumber,
      emailAddress,
      collectionPostcode,
      destinationPostcode,
      preferredMovingDate,
      serviceType,
      propertyType,
      itemsToMove,
      additionalInformation,
      privacyAccepted,
    },
  };
}

export function buildSubmissionFingerprint(input: {
  phoneNumber: string;
  collectionPostcode: string;
  destinationPostcode: string;
  serviceType: string;
  itemsToMove: string;
}): string {
  const digits = (input.phoneNumber || '').replace(/\D/g, '');
  const col = normalizeUkPostcode(input.collectionPostcode || '');
  const dst = normalizeUkPostcode(input.destinationPostcode || '');
  const svc = (input.serviceType || '').trim().toLowerCase();
  const items = (input.itemsToMove || '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
  return `${digits}|${col}|${dst}|${svc}|${items}`;
}

export function generateQuoteReference(date = new Date(), randomSeed?: number): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const suffix =
    typeof randomSeed === 'number'
      ? String(Math.abs(Math.floor(randomSeed)) % 10000).padStart(4, '0')
      : String(Math.floor(1000 + Math.random() * 9000));
  return `MK-${yyyy}${mm}${dd}-${suffix}`;
}

export interface PageSeoMeta {
  path: string;
  title: string;
  description: string;
}

export const PAGE_SEO_MAP: Record<string, PageSeoMeta> = {
  '/': {
    path: '/',
    title: 'MK Man And Van Removals Services Ipswich | Removals & Transport',
    description:
      'Looking for a man and van or removals service in Ipswich? Discuss your moving requirements, collection postcode, and transport options with MK Man And Van Removals Services.',
  },
  '/about': {
    path: '/about',
    title: 'About Us | MK Man And Van Removals Services Ipswich',
    description:
      'Learn about MK Man And Van Removals Services in Ipswich, our straightforward approach to moving enquiries, and how to arrange transport for your belongings.',
  },
  '/services': {
    path: '/services',
    title: 'Moving & Transport Services | MK Man And Van Removals Ipswich',
    description:
      'Explore house removals, flat moves, man and van enquiries, furniture transportation, single-item moves, and collection and delivery in Ipswich.',
  },
  '/areas-we-cover': {
    path: '/areas-we-cover',
    title: 'Areas We Cover | Man and Van Services in Ipswich, IP3 0QP',
    description:
      'Based at 3 Mersey Road, Ipswich, IP3 0QP, MK Man And Van Removals Services welcomes local moving and transport enquiries in Ipswich and confirmed nearby areas.',
  },
  '/why-choose-us': {
    path: '/why-choose-us',
    title: 'Why Contact Us | Straightforward Moving Enquiries in Ipswich',
    description:
      'Direct communication, a clear quote process, and local Ipswich contact details. Read frequently asked questions about arranging your move.',
  },
  '/gallery-reviews': {
    path: '/gallery-reviews',
    title: 'Gallery & Customer Feedback | MK Man And Van Removals Ipswich',
    description:
      'Browse moving and transport photography and learn how MK Man And Van Removals Services Ipswich publishes verified customer feedback.',
  },
  '/contact': {
    path: '/contact',
    title: 'Contact & Free Quote | MK Man And Van Removals Services Ipswich',
    description:
      'Request a tailored moving quote or contact MK Man And Van Removals Services Ipswich on +44 7708 632170, email, or WhatsApp.',
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy | MK Man And Van Removals Services Ipswich',
    description:
      'Read how MK Man And Van Removals Services Ipswich handles customer quote enquiries, contact information, and optional Google Maps embeds.',
  },
};

export function getPageSeoMeta(pathname: string): PageSeoMeta {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return PAGE_SEO_MAP[normalizedPath] || PAGE_SEO_MAP['/'];
}
