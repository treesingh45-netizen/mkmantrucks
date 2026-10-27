import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Phone, Mail, Send } from 'lucide-react';
import { useSiteConfig } from '../data/siteConfig';
import {
  QuoteRequestPayload,
  QuoteValidationErrors,
  validateQuotePayload,
} from '../utils/quoteValidation';

interface QuoteFormProps {
  initialServiceType?: string;
  externalPrefill?: {
    serviceType?: string;
    itemsSummary?: string;
    accessNotes?: string;
    nonce?: number;
  } | null;
}

interface QuoteReceipt {
  reference: string;
  submittedAt: string;
  destinationEmail: string;
  summary: {
    fullName: string;
    collectionPostcode: string;
    destinationPostcode: string;
    serviceType: string;
    preferredMovingDate: string;
  };
}

const PROPERTY_TYPES = [
  '',
  'Studio / Ground-Floor Flat',
  'Upper-Floor Flat / Apartment (with lift)',
  'Upper-Floor Flat / Apartment (stairs only)',
  '1–2 Bedroom House / Bungalow',
  '3+ Bedroom House',
  'Storage Unit / Single Address Pickup',
  'Other / Commercial Space',
];

export const QuoteForm: React.FC<QuoteFormProps> = ({
  initialServiceType = '',
  externalPrefill = null,
}) => {
  const { config } = useSiteConfig();
  const confirmedServices = config.services.filter((s) => s.confirmedByOwner);

  const [formData, setFormData] = useState<QuoteRequestPayload>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    collectionPostcode: '',
    destinationPostcode: '',
    preferredMovingDate: '',
    serviceType: initialServiceType || (confirmedServices[0]?.title ?? 'House Removals'),
    propertyType: '',
    itemsToMove: '',
    additionalInformation: '',
    privacyAccepted: false,
    companyWebsiteHoneypot: '',
  });

  const [errors, setErrors] = useState<QuoteValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<QuoteReceipt | null>(null);

  useEffect(() => {
    if (!initialServiceType) return;
    const matched = confirmedServices.find(
      (s) =>
        s.slug.toLowerCase() === initialServiceType.toLowerCase() ||
        s.title.toLowerCase() === initialServiceType.toLowerCase()
    );
    if (matched) {
      setFormData((prev) => ({ ...prev, serviceType: matched.title }));
    }
  }, [initialServiceType, confirmedServices]);

  useEffect(() => {
    if (!externalPrefill) return;
    setFormData((prev) => ({
      ...prev,
      serviceType: externalPrefill.serviceType || prev.serviceType,
      itemsToMove: externalPrefill.itemsSummary || prev.itemsToMove,
      additionalInformation: externalPrefill.accessNotes
        ? prev.additionalInformation
          ? `${prev.additionalInformation}\n\n${externalPrefill.accessNotes}`
          : externalPrefill.accessNotes
        : prev.additionalInformation,
    }));
  }, [externalPrefill]);

  const updateField = <K extends keyof QuoteRequestPayload>(
    key: K,
    value: QuoteRequestPayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof QuoteValidationErrors];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const check = validateQuotePayload(formData);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetBusinessEmail: config.email,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setServerError(
          `Online submission service returned status ${response.status}. Please call us directly on ${config.phoneDisplay} or email ${config.email}.`
        );
        return;
      }

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: QuoteValidationErrors;
        reference?: string;
        submittedAt?: string;
        destinationEmail?: string;
        summary?: QuoteReceipt['summary'];
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setServerError(
          data.error ||
            `We could not send your enquiry right now. Please call ${config.phoneDisplay} or email ${config.email}.`
        );
        return;
      }

      if (data.reference && data.summary) {
        setReceipt({
          reference: data.reference,
          submittedAt: data.submittedAt || new Date().toISOString(),
          destinationEmail: data.destinationEmail || config.email,
          summary: data.summary,
        });
        window.requestAnimationFrame(() => {
          document.getElementById('quote-form')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    } catch {
      setServerError(
        `Network connection interrupted while sending your enquiry. Please try again or call us directly on ${config.phoneDisplay}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartNewEnquiry = () => {
    setReceipt(null);
    setServerError(null);
    setErrors({});
    setFormData({
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      collectionPostcode: '',
      destinationPostcode: '',
      preferredMovingDate: '',
      serviceType: confirmedServices[0]?.title ?? 'House Removals',
      propertyType: '',
      itemsToMove: '',
      additionalInformation: '',
      privacyAccepted: false,
      companyWebsiteHoneypot: '',
    });
  };

  if (receipt) {
    return (
      <div
        id="quote-form"
        role="region"
        aria-live="polite"
        aria-labelledby="quote-confirmation-heading"
        className="bg-white border border-[#E8EDF4] rounded-xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(7,23,47,0.05)] space-y-6"
      >
        <div className="w-12 h-12 rounded-full bg-[#F5F7FA] border border-[#E8EDF4] flex items-center justify-center text-[#0B2348]">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#667085]">
            Enquiry Recorded · Reference {receipt.reference}
          </p>
          <h3
            id="quote-confirmation-heading"
            className="font-display text-3xl sm:text-4xl font-semibold text-[#0B2348]"
          >
            Thank You, {receipt.summary.fullName}
          </h3>
          <p className="text-[15px] text-[#283548] leading-relaxed">
            Your quote enquiry has been recorded for MK Man And Van Removals Services Ipswich ({receipt.destinationEmail}). We review moving details directly and will be in touch using the contact details you provided to discuss suitability, availability, and your tailored quote.
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4] text-sm">
          <div>
            <dt className="text-xs font-medium text-[#667085]">Enquiry Reference</dt>
            <dd className="font-semibold text-[#0B2348] tabular-nums mt-0.5">{receipt.reference}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#667085]">Service Category</dt>
            <dd className="font-semibold text-[#0B2348] mt-0.5">{receipt.summary.serviceType}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#667085]">Route Postcodes</dt>
            <dd className="font-semibold text-[#0B2348] tabular-nums mt-0.5">
              {receipt.summary.collectionPostcode} &rarr; {receipt.summary.destinationPostcode}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#667085]">Preferred Date</dt>
            <dd className="font-semibold text-[#0B2348] tabular-nums mt-0.5">
              {receipt.summary.preferredMovingDate || 'Flexible / To be discussed'}
            </dd>
          </div>
        </dl>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8EDF4]">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085]">
            <span>Need to speak urgently?</span>
            <a
              href={config.phoneTelHref}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0B2348] hover:underline"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{config.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${config.email}?subject=${encodeURIComponent(`Quote Enquiry ${receipt.reference}`)}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0B2348] hover:underline"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{config.email}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={handleStartNewEnquiry}
            className="px-4 py-2.5 text-xs font-semibold border border-[#0B2348] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors cursor-pointer"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="quote-form"
      noValidate
      onSubmit={handleSubmit}
      className="bg-white border border-[#E8EDF4] rounded-xl p-6 sm:p-9 lg:p-10 shadow-[0_8px_30px_rgba(7,23,47,0.04)] space-y-6"
    >
      <div className="border-b border-[#E8EDF4] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0B2348]">
          Free Moving &amp; Transport Quote Enquiry
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B2348] mt-1">
          Tell Us About Your Move
        </h2>
        <p className="text-sm text-[#667085] mt-2 leading-relaxed">
          Fields marked with an asterisk (*) are required so we can review your route and items accurately. Submitting an enquiry carries no obligation.
        </p>
      </div>

      {/* Honeypot anti-spam field (visually hidden from real users) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="quote-company-website">Leave this field empty</label>
        <input
          id="quote-company-website"
          name="companyWebsiteHoneypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.companyWebsiteHoneypot || ''}
          onChange={(e) => updateField('companyWebsiteHoneypot', e.target.value)}
        />
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg border border-red-200 bg-red-50/70 text-red-900 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Unable to complete submission</p>
            <p className="mt-0.5 text-xs leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Row 1: Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="quote-full-name" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Full Name *
          </label>
          <input
            id="quote-full-name"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'err-full-name' : undefined}
            placeholder="e.g. Sarah Jenkins"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-[#283548] bg-white placeholder:text-[#667085]/70 focus:outline-none ${
              errors.fullName ? 'border-red-600 focus:border-red-700' : 'border-[#E8EDF4] focus:border-[#0B2348]'
            }`}
          />
          {errors.fullName && (
            <p id="err-full-name" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quote-phone" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Phone Number *
          </label>
          <input
            id="quote-phone"
            name="phoneNumber"
            type="tel"
            required
            autoComplete="tel"
            value={formData.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={errors.phoneNumber ? 'err-phone' : undefined}
            placeholder="e.g. 07708 632170"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-[#283548] bg-white placeholder:text-[#667085]/70 focus:outline-none ${
              errors.phoneNumber ? 'border-red-600 focus:border-red-700' : 'border-[#E8EDF4] focus:border-[#0B2348]'
            }`}
          />
          {errors.phoneNumber && (
            <p id="err-phone" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.phoneNumber}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Email & Preferred Moving Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="quote-email" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Email Address <span className="font-normal text-[#667085]">(Optional)</span>
          </label>
          <input
            id="quote-email"
            name="emailAddress"
            type="email"
            autoComplete="email"
            value={formData.emailAddress || ''}
            onChange={(e) => updateField('emailAddress', e.target.value)}
            aria-invalid={Boolean(errors.emailAddress)}
            aria-describedby={errors.emailAddress ? 'err-email' : undefined}
            placeholder="you@example.co.uk"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-[#283548] bg-white placeholder:text-[#667085]/70 focus:outline-none ${
              errors.emailAddress ? 'border-red-600 focus:border-red-700' : 'border-[#E8EDF4] focus:border-[#0B2348]'
            }`}
          />
          {errors.emailAddress && (
            <p id="err-email" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.emailAddress}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quote-moving-date" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Preferred Moving Date <span className="font-normal text-[#667085]">(Optional)</span>
          </label>
          <input
            id="quote-moving-date"
            name="preferredMovingDate"
            type="date"
            value={formData.preferredMovingDate || ''}
            onChange={(e) => updateField('preferredMovingDate', e.target.value)}
            aria-invalid={Boolean(errors.preferredMovingDate)}
            aria-describedby={errors.preferredMovingDate ? 'err-date' : undefined}
            className="w-full rounded-md border border-[#E8EDF4] px-3.5 py-2.5 text-sm text-[#283548] bg-white focus:border-[#0B2348] focus:outline-none"
          />
          {errors.preferredMovingDate && (
            <p id="err-date" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.preferredMovingDate}
            </p>
          )}
        </div>
      </div>

      {/* Row 3: Collection & Destination Postcodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="quote-collection-postcode" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Collection Postcode *
          </label>
          <input
            id="quote-collection-postcode"
            name="collectionPostcode"
            type="text"
            required
            autoComplete="postal-code"
            value={formData.collectionPostcode}
            onChange={(e) => updateField('collectionPostcode', e.target.value)}
            aria-invalid={Boolean(errors.collectionPostcode)}
            aria-describedby={errors.collectionPostcode ? 'err-col-postcode' : undefined}
            placeholder="e.g. IP3 0QP"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm uppercase text-[#283548] bg-white placeholder:normal-case placeholder:text-[#667085]/70 focus:outline-none ${
              errors.collectionPostcode ? 'border-red-600 focus:border-red-700' : 'border-[#E8EDF4] focus:border-[#0B2348]'
            }`}
          />
          {errors.collectionPostcode && (
            <p id="err-col-postcode" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.collectionPostcode}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quote-destination-postcode" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Destination Postcode *
          </label>
          <input
            id="quote-destination-postcode"
            name="destinationPostcode"
            type="text"
            required
            value={formData.destinationPostcode}
            onChange={(e) => updateField('destinationPostcode', e.target.value)}
            aria-invalid={Boolean(errors.destinationPostcode)}
            aria-describedby={errors.destinationPostcode ? 'err-dst-postcode' : undefined}
            placeholder="e.g. IP1 2AA"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm uppercase text-[#283548] bg-white placeholder:normal-case placeholder:text-[#667085]/70 focus:outline-none ${
              errors.destinationPostcode ? 'border-red-600 focus:border-red-700' : 'border-[#E8EDF4] focus:border-[#0B2348]'
            }`}
          />
          {errors.destinationPostcode && (
            <p id="err-dst-postcode" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.destinationPostcode}
            </p>
          )}
        </div>
      </div>

      {/* Row 4: Type of Service & Property Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="quote-service-type" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Type of Service *
          </label>
          <select
            id="quote-service-type"
            name="serviceType"
            required
            value={formData.serviceType}
            onChange={(e) => updateField('serviceType', e.target.value)}
            aria-invalid={Boolean(errors.serviceType)}
            aria-describedby={errors.serviceType ? 'err-service' : undefined}
            className="w-full rounded-md border border-[#E8EDF4] px-3.5 py-2.5 text-sm text-[#283548] bg-white focus:border-[#0B2348] focus:outline-none"
          >
            {confirmedServices.map((svc) => (
              <option key={svc.id} value={svc.title}>
                {svc.title}
              </option>
            ))}
            <option value="General Moving / Transport Enquiry">General Moving / Transport Enquiry</option>
          </select>
          {errors.serviceType && (
            <p id="err-service" className="mt-1.5 text-xs font-medium text-red-700">
              {errors.serviceType}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quote-property-type" className="block text-sm font-semibold text-[#283548] mb-1.5">
            Property Type <span className="font-normal text-[#667085]">(Optional)</span>
          </label>
          <select
            id="quote-property-type"
            name="propertyType"
            value={formData.propertyType || ''}
            onChange={(e) => updateField('propertyType', e.target.value)}
            className="w-full rounded-md border border-[#E8EDF4] px-3.5 py-2.5 text-sm text-[#283548] bg-white focus:border-[#0B2348] focus:outline-none"
          >
            <option value="">Select property type (optional)</option>
            {PROPERTY_TYPES.filter(Boolean).map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 5: Items to Move */}
      <div>
        <label htmlFor="quote-items" className="block text-sm font-semibold text-[#283548] mb-1.5">
          Items to Move *
        </label>
        <textarea
          id="quote-items"
          name="itemsToMove"
          rows={4}
          required
          value={formData.itemsToMove}
          onChange={(e) => updateField('itemsToMove', e.target.value)}
          aria-invalid={Boolean(errors.itemsToMove)}
          aria-describedby={errors.itemsToMove ? 'err-items' : 'hint-items'}
          placeholder="Please list key furniture pieces, appliances, or approximate number of boxes to move…"
          className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-[#283548] bg-white placeholder:text-[#667085]/70 focus:outline-none ${
            errors.itemsToMove ? 'border-red-600 focus:border-red-700' : 'border-[#E8EDF4] focus:border-[#0B2348]'
          }`}
        />
        <p id="hint-items" className="mt-1 text-xs text-[#667085]">
          Include approximate dimensions for any unusually large or heavy items if known.
        </p>
        {errors.itemsToMove && (
          <p id="err-items" className="mt-1 text-xs font-medium text-red-700">
            {errors.itemsToMove}
          </p>
        )}
      </div>

      {/* Row 6: Additional Information */}
      <div>
        <label htmlFor="quote-additional-info" className="block text-sm font-semibold text-[#283548] mb-1.5">
          Additional Information <span className="font-normal text-[#667085]">(Optional)</span>
        </label>
        <textarea
          id="quote-additional-info"
          name="additionalInformation"
          rows={3}
          value={formData.additionalInformation || ''}
          onChange={(e) => updateField('additionalInformation', e.target.value)}
          placeholder="Stairs, lift access, parking arrangements outside collection/delivery addresses, or preferred call times…"
          className="w-full rounded-md border border-[#E8EDF4] px-3.5 py-2.5 text-sm text-[#283548] bg-white placeholder:text-[#667085]/70 focus:border-[#0B2348] focus:outline-none"
        />
      </div>

      {/* Privacy acknowledgement */}
      <div className="pt-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            id="quote-privacy"
            name="privacyAccepted"
            type="checkbox"
            checked={formData.privacyAccepted}
            onChange={(e) => updateField('privacyAccepted', e.target.checked)}
            aria-invalid={Boolean(errors.privacyAccepted)}
            aria-describedby={errors.privacyAccepted ? 'err-privacy' : undefined}
            className="mt-1 w-4 h-4 rounded border-[#667085] text-[#0B2348] focus:ring-[#0B2348]"
          />
          <span className="text-xs text-[#283548] leading-relaxed">
            I consent to MK Man And Van Removals Services Ipswich using the details entered above solely to review and respond to my moving quote enquiry in accordance with the{' '}
            <Link to="/privacy-policy" className="font-semibold text-[#0B2348] underline underline-offset-2">
              Privacy Policy
            </Link>
            . *
          </span>
        </label>
        {errors.privacyAccepted && (
          <p id="err-privacy" className="mt-1.5 text-xs font-medium text-red-700">
            {errors.privacyAccepted}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wider uppercase bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] disabled:opacity-60 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>{submitting ? 'Sending Quote Request…' : 'SEND QUOTE REQUEST'}</span>
        </button>
      </div>
    </form>
  );
};
