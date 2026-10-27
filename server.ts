import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  validateQuotePayload,
  buildSubmissionFingerprint,
  generateQuoteReference,
  PAGE_SEO_MAP,
} from './src/utils/quoteValidation.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const VERIFIED_ADDRESS = '3 Mersey Road, Ipswich, IP3 0QP, United Kingdom';
const GMP_ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

// Private server-side storage for quote enquiries (never exposed publicly via any GET route)
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'mk-removals-data')
  : path.join(__dirname, 'server-data');
const PRIVATE_QUOTES_FILE = path.join(DATA_DIR, 'quotes.private.json');

interface StoredQuoteRecord {
  reference: string;
  submittedAt: string;
  destinationEmail: string;
  fingerprint: string;
  enquiry: ReturnType<typeof validateQuotePayload>['normalized'];
  webhookDelivered: boolean;
}

// In-memory duplicate & rate-limit guards
const recentFingerprints = new Map<string, { reference: string; timestamp: number }>();
const ipRateWindow = new Map<string, number[]>();
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_QUOTES_PER_WINDOW = 8;

// Cached Google Maps Geocoding response (< 30 days per GMP Service Specific Terms; cleared on restart)
interface CachedGeocodeResult {
  status: 'OK' | 'UNAVAILABLE' | 'QUOTA_EXCEEDED';
  formattedAddress: string;
  location: { lat: number; lng: number } | null;
  placeId?: string;
  locationType?: string;
  fetchedAt: number;
}
let cachedIpswichGeocode: CachedGeocodeResult | null = null;
const GEOCODE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function appendPrivateQuoteRecord(record: StoredQuoteRecord): void {
  const tryWrite = (dir: string, filePath: string) => {
    fs.mkdirSync(dir, { recursive: true });
    let existing: StoredQuoteRecord[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) existing = parsed;
      } catch {
        existing = [];
      }
    }
    existing.push(record);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), { mode: 0o600 });
  };

  try {
    tryWrite(DATA_DIR, PRIVATE_QUOTES_FILE);
  } catch {
    const fallbackDir = path.join(os.tmpdir(), 'mk-removals-data');
    tryWrite(fallbackDir, path.join(fallbackDir, 'quotes.private.json'));
  }
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));

async function configureServer() {

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'MK Man And Van Removals Services Ipswich' });
  });

  // Google Maps Geocoding endpoint for 3 Mersey Road, Ipswich, IP3 0QP, United Kingdom
  // Never invents coordinates; retrieves directly from Google Maps Platform Geocoding API and caches for 24h.
  app.get('/api/location', async (_req, res) => {
    if (
      cachedIpswichGeocode &&
      cachedIpswichGeocode.status === 'OK' &&
      Date.now() - cachedIpswichGeocode.fetchedAt < GEOCODE_CACHE_TTL_MS
    ) {
      res.json(cachedIpswichGeocode);
      return;
    }

    const mapsApiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    if (!mapsApiKey) {
      res.json({
        status: 'UNAVAILABLE',
        formattedAddress: VERIFIED_ADDRESS,
        location: null,
        fetchedAt: Date.now(),
      } satisfies CachedGeocodeResult);
      return;
    }

    try {
      const geocodeUrl =
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(VERIFIED_ADDRESS)}` +
        `&region=gb&key=${encodeURIComponent(mapsApiKey)}&solution_id=${GMP_ATTRIBUTION_ID}`;

      const response = await fetch(geocodeUrl);
      if (response.status === 429) {
        res.status(429).json({
          status: 'QUOTA_EXCEEDED',
          formattedAddress: VERIFIED_ADDRESS,
          location: null,
          fetchedAt: Date.now(),
        } satisfies CachedGeocodeResult);
        return;
      }

      const data = (await response.json()) as {
        status?: string;
        results?: Array<{
          formatted_address?: string;
          place_id?: string;
          geometry?: {
            location?: { lat: number; lng: number };
            location_type?: string;
          };
        }>;
      };

      if (data.status === 'OVER_QUERY_LIMIT' || data.status === 'OVER_DAILY_LIMIT') {
        res.status(429).json({
          status: 'QUOTA_EXCEEDED',
          formattedAddress: VERIFIED_ADDRESS,
          location: null,
          fetchedAt: Date.now(),
        } satisfies CachedGeocodeResult);
        return;
      }

      const first = data.results?.[0];
      if (data.status === 'OK' && first?.geometry?.location) {
        cachedIpswichGeocode = {
          status: 'OK',
          formattedAddress: first.formatted_address || VERIFIED_ADDRESS,
          location: {
            lat: first.geometry.location.lat,
            lng: first.geometry.location.lng,
          },
          placeId: first.place_id,
          locationType: first.geometry.location_type,
          fetchedAt: Date.now(),
        };
        res.json(cachedIpswichGeocode);
        return;
      }

      res.json({
        status: 'UNAVAILABLE',
        formattedAddress: VERIFIED_ADDRESS,
        location: null,
        fetchedAt: Date.now(),
      } satisfies CachedGeocodeResult);
    } catch {
      res.json({
        status: 'UNAVAILABLE',
        formattedAddress: VERIFIED_ADDRESS,
        location: null,
        fetchedAt: Date.now(),
      } satisfies CachedGeocodeResult);
    }
  });

  // Functional Quote Request Submission Endpoint (protected, validated, duplicate-guarded)
  app.post('/api/quotes', async (req, res) => {
    const clientIp =
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0]?.trim()
        : req.socket.remoteAddress) || 'local';

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

    const validation = validateQuotePayload(req.body || {});

    // Silently discard automated honeypot spam without storing
    if (validation.isSpam) {
      res.status(400).json({
        ok: false,
        error: 'Unable to process automated submission.',
      });
      return;
    }

    if (!validation.valid) {
      res.status(400).json({
        ok: false,
        error: 'Please review the highlighted fields before submitting your quote request.',
        fieldErrors: validation.errors,
      });
      return;
    }

    const fingerprint = buildSubmissionFingerprint(validation.normalized);
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
      (typeof req.body?.targetBusinessEmail === 'string' &&
      req.body.targetBusinessEmail.includes('@')
        ? req.body.targetBusinessEmail.trim()
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
            enquiry: validation.normalized,
          }),
        });
        webhookDelivered = whRes.ok;
      } catch {
        webhookDelivered = false;
      }
    }

    try {
      appendPrivateQuoteRecord({
        reference,
        submittedAt: new Date(now).toISOString(),
        destinationEmail,
        fingerprint,
        enquiry: validation.normalized,
        webhookDelivered,
      });
    } catch {
      res.status(500).json({
        ok: false,
        error:
          'We could not record your quote request right now. Please call +44 7708 632170 or email SERVICES@gmail.com directly.',
      });
      return;
    }

    recentFingerprints.set(fingerprint, { reference, timestamp: now });
    recentTimestamps.push(now);
    ipRateWindow.set(clientIp, recentTimestamps);

    res.status(201).json({
      ok: true,
      reference,
      submittedAt: new Date(now).toISOString(),
      destinationEmail,
      summary: {
        fullName: validation.normalized.fullName,
        collectionPostcode: validation.normalized.collectionPostcode,
        destinationPostcode: validation.normalized.destinationPostcode,
        serviceType: validation.normalized.serviceType,
        preferredMovingDate: validation.normalized.preferredMovingDate,
      },
    });
  });

  // High-Thinking Complex Move Preparation Checklist Assistant (gemini-4-argon with ThinkingLevel.HIGH)
  app.post('/api/move-planner', async (req, res) => {
    const moveDescription =
      typeof req.body?.moveDescription === 'string' ? req.body.moveDescription.trim() : '';

    if (moveDescription.length < 10) {
      res.status(400).json({
        ok: false,
        error: 'Please describe your rooms, bulky items, or access considerations in at least a sentence.',
      });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        ok: false,
        error:
          'Deep-thinking checklist structuring is currently offline. You can enter your item list directly into the Quote Request Form below.',
      });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: `Organise the following customer move description for MK Man And Van Removals Services Ipswich into a practical, factual enquiry summary without inventing any prices, vehicle sizes, or service guarantees:\n\n"${moveDescription}"`,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          systemInstruction:
            'You assist customers preparing a clear moving enquiry for MK Man And Van Removals Services Ipswich. Never invent prices, vehicle dimensions, insurance claims, or availability guarantees. Return concise, practical British English JSON summarizing suggested service category, structured item inventory, access details to mention, and preparation tips.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedServiceType: {
                type: Type.STRING,
                description:
                  'One of: House Removals, Flat and Apartment Moves, Man and Van, Furniture Transportation, Single-Item Moves, Collection and Delivery.',
              },
              formattedItemsSummary: {
                type: Type.STRING,
                description: 'Clean room-by-room or item-by-item text ready to paste into the Items to Move field.',
              },
              accessQuestionsToConfirm: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 to 5 practical access or preparation details the customer should mention.',
              },
              packingPreparationNotes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 concise preparation reminders before moving day.',
              },
            },
            required: [
              'suggestedServiceType',
              'formattedItemsSummary',
              'accessQuestionsToConfirm',
              'packingPreparationNotes',
            ],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      res.json({ ok: true, plan: parsed });
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? 'Checklist assistant could not complete this request right now. Please type your items directly into the Quote Request Form.'
          : 'Checklist assistant unavailable.';
      res.status(502).json({ ok: false, error: message });
    }
  });

  // Dynamic XML Sitemap for all 7 pages + Privacy Policy
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (
      process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
        ? process.env.APP_URL
        : `${req.protocol}://${req.get('host')}`
    ).replace(/\/+$/, '');

    const urls = Object.keys(PAGE_SEO_MAP)
      .map((routePath) => {
        const priority = routePath === '/' ? '1.0' : routePath === '/contact' ? '0.9' : '0.8';
        return `  <url>\n    <loc>${baseUrl}${routePath}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  const distPath = path.join(__dirname, 'dist');
  const hasBuiltClient = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL || hasBuiltClient && process.env.NODE_ENV !== 'development' && !process.env.VITE_DEV_SERVER) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`MK Man And Van Removals Services Ipswich server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

void configureServer();

export default app;
