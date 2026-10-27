import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeUkPostcode,
  isValidUkPostcodeOrArea,
  isValidPhone,
  validateQuotePayload,
  buildSubmissionFingerprint,
  generateQuoteReference,
  getPageSeoMeta,
  PAGE_SEO_MAP,
} from './quoteValidation';

test('normalizeUkPostcode formats standard UK postcodes cleanly', () => {
  assert.equal(normalizeUkPostcode('ip30qp'), 'IP3 0QP');
  assert.equal(normalizeUkPostcode('  ip1   2aa '), 'IP1 2AA');
  assert.equal(normalizeUkPostcode('SW1A1AA'), 'SW1A 1AA');
});

test('isValidUkPostcodeOrArea accepts full UK postcodes and outward codes and rejects invalid strings', () => {
  assert.equal(isValidUkPostcodeOrArea('IP3 0QP'), true);
  assert.equal(isValidUkPostcodeOrArea('IP4'), true);
  assert.equal(isValidUkPostcodeOrArea('CO1 1JG'), true);
  assert.equal(isValidUkPostcodeOrArea('12345'), false);
  assert.equal(isValidUkPostcodeOrArea(''), false);
});

test('isValidPhone validates UK domestic and +44 international phone formats', () => {
  assert.equal(isValidPhone('+44 7708 632170'), true);
  assert.equal(isValidPhone('07708 632170'), true);
  assert.equal(isValidPhone('01473 123456'), true);
  assert.equal(isValidPhone('12345'), false);
  assert.equal(isValidPhone('abc-def-ghij'), false);
});

test('validateQuotePayload catches missing required fields and never substitutes silent defaults', () => {
  const emptyResult = validateQuotePayload({});
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.errors.fullName);
  assert.ok(emptyResult.errors.phoneNumber);
  assert.ok(emptyResult.errors.collectionPostcode);
  assert.ok(emptyResult.errors.destinationPostcode);
  assert.ok(emptyResult.errors.serviceType);
  assert.ok(emptyResult.errors.itemsToMove);
  assert.ok(emptyResult.errors.privacyAccepted);
});

test('validateQuotePayload accepts valid Ipswich quote enquiry and normalizes postcodes', () => {
  const validResult = validateQuotePayload({
    fullName: 'Eleanor Vance',
    phoneNumber: '07708 632170',
    emailAddress: 'eleanor@example.co.uk',
    collectionPostcode: 'ip30qp',
    destinationPostcode: 'ip4 2jn',
    preferredMovingDate: '2026-11-15',
    serviceType: 'House Removals',
    propertyType: '2-Bedroom Terraced House',
    itemsToMove: 'Sofa, dining table with 4 chairs, double bed frame, and 18 medium boxes.',
    additionalInformation: 'Ground floor access at both addresses.',
    privacyAccepted: true,
  });

  assert.equal(validResult.valid, true);
  assert.equal(validResult.isSpam, false);
  assert.equal(Object.keys(validResult.errors).length, 0);
  assert.equal(validResult.normalized.collectionPostcode, 'IP3 0QP');
  assert.equal(validResult.normalized.destinationPostcode, 'IP4 2JN');
});

test('validateQuotePayload flags honeypot submissions as spam', () => {
  const spamResult = validateQuotePayload({
    fullName: 'Bot User',
    phoneNumber: '07708 632170',
    collectionPostcode: 'IP3 0QP',
    destinationPostcode: 'IP1 1AA',
    serviceType: 'Man and Van',
    itemsToMove: '10 boxes and a desk',
    privacyAccepted: true,
    companyWebsiteHoneypot: 'https://spam-link.example',
  });
  assert.equal(spamResult.isSpam, true);
  assert.equal(spamResult.valid, false);
});

test('buildSubmissionFingerprint produces identical fingerprints regardless of whitespace or casing', () => {
  const fpA = buildSubmissionFingerprint({
    phoneNumber: '+44 7708 632170',
    collectionPostcode: 'ip30qp',
    destinationPostcode: 'IP1 2AA',
    serviceType: 'Man and Van',
    itemsToMove: 'Two sofas   and  ten boxes',
  });
  const fpB = buildSubmissionFingerprint({
    phoneNumber: '447708632170',
    collectionPostcode: 'IP3 0QP',
    destinationPostcode: 'ip12aa',
    serviceType: 'man and van',
    itemsToMove: 'two sofas and ten boxes',
  });
  assert.equal(fpA, fpB);
});

test('generateQuoteReference formats deterministic MK reference code', () => {
  const ref = generateQuoteReference(new Date('2026-10-27T12:00:00Z'), 4821);
  assert.equal(ref, 'MK-20261027-4821');
});

test('all 7 core pages plus privacy policy have unique SEO titles and descriptions', () => {
  const requiredRoutes = [
    '/',
    '/about',
    '/services',
    '/areas-we-cover',
    '/why-choose-us',
    '/gallery-reviews',
    '/contact',
    '/privacy-policy',
  ];
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const route of requiredRoutes) {
    assert.ok(PAGE_SEO_MAP[route], `Missing SEO entry for ${route}`);
    const meta = getPageSeoMeta(route);
    titles.add(meta.title);
    descriptions.add(meta.description);
  }

  assert.equal(titles.size, requiredRoutes.length);
  assert.equal(descriptions.size, requiredRoutes.length);
});

test('vercel.json configures Vite outputDirectory and SPA fallback rewrite to prevent 404 NOT_FOUND', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const raw = fs.readFileSync(path.resolve(process.cwd(), 'vercel.json'), 'utf-8');
  const parsed = JSON.parse(raw) as {
    framework?: string;
    outputDirectory?: string;
    rewrites?: Array<{ source: string; destination: string }>;
  };

  assert.equal(parsed.framework, 'vite');
  assert.equal(parsed.outputDirectory, 'dist');
  assert.ok(
    parsed.rewrites?.some((r) => r.destination === '/index.html'),
    'Expected SPA catch-all rewrite to /index.html'
  );
});

test('serverless /api/quotes handler validates and records a valid quote enquiry', async () => {
  const { default: quotesHandler } = await import('../../api/quotes');
  let statusCode = 0;
  let jsonBody: Record<string, unknown> = {};

  const mockRes = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    setHeader() {},
    json(body: unknown) {
      jsonBody = body as Record<string, unknown>;
    },
  };

  await quotesHandler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': '203.0.113.42' },
      body: {
        fullName: 'Arthur Pendelton',
        phoneNumber: '07708 632170',
        collectionPostcode: 'IP3 0QP',
        destinationPostcode: 'IP1 2AA',
        serviceType: 'Man and Van',
        itemsToMove: 'Corner sofa and 12 packed moving cartons.',
        privacyAccepted: true,
      },
    },
    mockRes
  );

  assert.equal(statusCode, 201);
  assert.equal(jsonBody.ok, true);
  assert.match(String(jsonBody.reference || ''), /^MK-\d{8}-\d{4}$/);
});

