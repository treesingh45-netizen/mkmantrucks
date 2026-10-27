import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

interface QuoteRequestPayload {
  fullName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  collectionPostcode?: string;
  destinationPostcode?: string;
  preferredMovingDate?: string;
  serviceType?: string;
  propertyType?: string;
  itemsToMove?: string;
  additionalInformation?: string;
  privacyAccepted?: boolean;
  companyWebsiteHoneypot?: string;
  targetBusinessEmail?: string;
}

interface ServerlessRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: QuoteRequestPayload | string;
  socket?: { remoteAddress?: string };
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
}

const UK_POSTCODE_FULL_REGEX = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;
const UK_POSTCODE_OUTWARD_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const recentFingerprints = new Map<string, { reference: string; timestamp: number }>();
const ipRateWindow = new Map<string, number[]>();
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_QUOTES_PER_WINDOW = 8;

function normalizeUkPostcode(raw: string): string {
  const cleaned = (raw || '').trim().replace(/\s+/g, '').toUpperCase();
  const match = cleaned.match(UK_POSTCODE_FULL_REGEX);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return (raw || '').trim().toUpperCase().replace(/\s+/g, ' ');
}

function isValidUkPostcodeOrArea(raw: string): boolean {
  const cleaned = (raw || '').trim();
  if (cleaned.length < 2 || cleaned.length > 12) return false;
  const compact = cleaned.replace(/\s+/g, '');
  return UK_POSTCODE_FULL_REGEX.test(compact) || UK_POSTCODE_OUTWARD_REGEX.test(compact);
}

function isValidPhone(raw: string): boolean {
  const cleaned = (raw || '').trim();
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return false;
  return /^[+\d][\d\s().-]{8,22}$/.test(cleaned);
}

function generateQuoteReference(date = new Date()): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `MK-${yyyy}${mm}${dd}-${suffix}`;
}

function persistServerlessQuote(record: unknown): void {
  try {
    const tmpDir = path.join(os.tmpdir(), 'mk-removals-data');
    fs.mkdirSync(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, 'quotes.private.json');
    let existing: unknown[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (Array.isArray(parsed)) existing = parsed;
      } catch {
        existing = [];
      }
    }
    existing.push(record);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), { mode: 0o600 });
  } catch {
    // Ephemeral read-only environment: continue without crashing request
  }
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  const forwarded = req.headers?.['x-forwarded-for'];
  const clientIp =
    (typeof forwarded === 'string'
      ? forwarded.split(',')[0]?.trim()
      : Array.isArray(forwarded)
        ? forwarded[0]
        : req.socket?.remoteAddress) || 'local';

  const now = Date.now();
  const recentTimestamps = (ipRateWindow.get(clientIp) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= MAX_QUOTES_PER_WINDOW) {
    res.status(429).json({
      ok: false,
      error:
        'Too many quote requests have been sent recently from this connection. Please wait a few minutes or call us directly on +44 7708 632170.',
    });
    return;
  }

  let payload: QuoteRequestPayload = {};
  if (typeof req.body === 'string') {
    try {
      payload = JSON.parse(req.body) as QuoteRequestPayload;
    } catch {
      payload = {};
    }
  } else if (req.body && typeof req.body === 'object') {
    payload = req.body;
  }

  if (payload.companyWebsiteHoneypot && String(payload.companyWebsiteHoneypot).trim().length > 0) {
    res.status(400).json({
      ok: false,
      error: 'Unable to process automated submission.',
    });
    return;
  }

  const fullName = String(payload.fullName || '').trim();
  const phoneNumber = String(payload.phoneNumber || '').trim();
  const emailAddress = String(payload.emailAddress || '').trim();
  const collectionPostcode = normalizeUkPostcode(String(payload.collectionPostcode || ''));
  const destinationPostcode = normalizeUkPostcode(String(payload.destinationPostcode || ''));
  const preferredMovingDate = String(payload.preferredMovingDate || '').trim();
  const serviceType = String(payload.serviceType || '').trim();
  const propertyType = String(payload.propertyType || '').trim();
  const itemsToMove = String(payload.itemsToMove || '').trim();
  const additionalInformation = String(payload.additionalInformation || '').trim();
  const privacyAccepted = Boolean(payload.privacyAccepted);

  const errors: Record<string, string> = {};

  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name must be 100 characters or fewer.';
  }

  if (!phoneNumber) {
    errors.phoneNumber = 'Please enter a contact telephone number so we can discuss your move.';
  } else if (!isValidPhone(phoneNumber)) {
    errors.phoneNumber =
      'Please enter a valid UK or international telephone number (e.g. 07708 632170).';
  }

  if (emailAddress && !EMAIL_REGEX.test(emailAddress)) {
    errors.emailAddress = 'Please enter a valid email address or leave this field blank.';
  }

  if (!collectionPostcode) {
    errors.collectionPostcode = 'Please enter the collection postcode (e.g. IP3 0QP).';
  } else if (!isValidUkPostcodeOrArea(collectionPostcode)) {
    errors.collectionPostcode =
      'Please enter a valid UK postcode or outward area code (e.g. IP3 0QP or IP3).';
  }

  if (!destinationPostcode) {
    errors.destinationPostcode = 'Please enter the destination postcode (e.g. IP1 2AA).';
  } else if (!isValidUkPostcodeOrArea(destinationPostcode)) {
    errors.destinationPostcode =
      'Please enter a valid UK postcode or outward area code (e.g. IP1 2AA or CO1).';
  }

  if (preferredMovingDate && Number.isNaN(Date.parse(preferredMovingDate))) {
    errors.preferredMovingDate = 'Please select a valid date or leave blank if flexible.';
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

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      ok: false,
      error: 'Please review the highlighted fields before submitting your quote request.',
      fieldErrors: errors,
    });
    return;
  }

  const normalized = {
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
  };

  const fingerprint = `${phoneNumber.replace(/\D/g, '')}|${collectionPostcode}|${destinationPostcode}|${serviceType.toLowerCase()}|${itemsToMove.toLowerCase().replace(/\s+/g, ' ').slice(0, 120)}`;
  const existingDuplicate = recentFingerprints.get(fingerprint);
  if (existingDuplicate && now - existingDuplicate.timestamp < DUPLICATE_WINDOW_MS) {
    res.status(409).json({
      ok: false,
      duplicate: true,
      reference: existingDuplicate.reference,
      error: `This moving enquiry has already been received (Reference ${existingDuplicate.reference}). You do not need to send it again.`,
    });
    return;
  }

  const reference = generateQuoteReference(new Date());
  const destinationEmail =
    (typeof payload.targetBusinessEmail === 'string' && payload.targetBusinessEmail.includes('@')
      ? payload.targetBusinessEmail.trim()
      : process.env.BUSINESS_NOTIFICATION_EMAIL) || 'SERVICES@gmail.com';

  let webhookDelivered = false;
  const webhookUrl = process.env.QUOTE_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.startsWith('https://')) {
    try {
      const whRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          destinationEmail,
          submittedAt: new Date(now).toISOString(),
          enquiry: normalized,
        }),
      });
      webhookDelivered = whRes.ok;
    } catch {
      webhookDelivered = false;
    }
  }

  persistServerlessQuote({
    reference,
    submittedAt: new Date(now).toISOString(),
    destinationEmail,
    fingerprint,
    enquiry: normalized,
    webhookDelivered,
  });

  recentFingerprints.set(fingerprint, { reference, timestamp: now });
  recentTimestamps.push(now);
  ipRateWindow.set(clientIp, recentTimestamps);

  res.status(201).json({
    ok: true,
    reference,
    submittedAt: new Date(now).toISOString(),
    destinationEmail,
    summary: {
      fullName,
      collectionPostcode,
      destinationPostcode,
      serviceType,
      preferredMovingDate,
    },
  });
}
