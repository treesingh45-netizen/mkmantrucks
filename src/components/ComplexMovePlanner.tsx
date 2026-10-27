import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ClipboardList, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface StructuredMovePlan {
  suggestedServiceType: string;
  formattedItemsSummary: string;
  accessQuestionsToConfirm: string[];
  packingPreparationNotes: string[];
}

interface ComplexMovePlannerProps {
  onApplyToQuote?: (data: {
    serviceType: string;
    itemsSummary: string;
    accessNotes: string;
  }) => void;
  defaultExpanded?: boolean;
}

export const ComplexMovePlanner: React.FC<ComplexMovePlannerProps> = ({
  onApplyToQuote,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [plan, setPlan] = useState<StructuredMovePlan | null>(null);
  const [applied, setApplied] = useState(false);

  const handleOrganise = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setApplied(false);

    if (description.trim().length < 10) {
      setErrorMessage(
        'Please write at least a brief sentence describing the rooms, furniture, or access details you want organised.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/move-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moveDescription: description.trim() }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        plan?: StructuredMovePlan;
      };

      if (!res.ok || !data.ok || !data.plan) {
        setErrorMessage(
          data.error ||
            'Checklist structuring is currently unavailable. Please enter your item list directly into the Quote Request Form.'
        );
        return;
      }

      setPlan(data.plan);
    } catch {
      setErrorMessage(
        'Could not connect to the checklist organiser right now. You can type your moving details directly into the Quote Request Form.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!plan || !onApplyToQuote) return;
    onApplyToQuote({
      serviceType: plan.suggestedServiceType,
      itemsSummary: plan.formattedItemsSummary,
      accessNotes: plan.accessQuestionsToConfirm.map((q) => `- ${q}`).join('\n'),
    });
    setApplied(true);
  };

  return (
    <div className="border border-[#E8EDF4] rounded-xl bg-[#F5F7FA] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="complex-move-planner-panel"
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[#E8EDF4]/45 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-3.5">
          <ClipboardList className="w-5 h-5 text-[#0B2348] mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[#0B2348]">
              Optional: Organise a Multi-Room or Complex Item List Before Enquiring
            </p>
            <p className="text-xs text-[#667085] mt-0.5">
              Describe rough room contents, stairs, or awkward items in plain English to structure a clear checklist for your quote request.
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-[#0B2348] shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#0B2348] shrink-0" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div id="complex-move-planner-panel" className="px-6 pb-6 pt-2 border-t border-[#E8EDF4] bg-white">
          <form onSubmit={handleOrganise} className="space-y-4 pt-3">
            <div>
              <label
                htmlFor="complex-move-notes"
                className="block text-xs font-semibold uppercase tracking-wider text-[#283548] mb-2"
              >
                Your Rough Move Notes
              </label>
              <textarea
                id="complex-move-notes"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Moving from a 2nd-floor flat near Ipswich Waterfront (lift available) to a 2-bed terrace in IP3. Corner sofa splits in two, king bed frame, dining table + 4 chairs, washing machine, and roughly 25 medium boxes."
                className="w-full rounded-md border border-[#E8EDF4] bg-white px-3.5 py-2.5 text-sm text-[#283548] placeholder:text-[#667085]/75 focus:border-[#0B2348] focus:outline-none"
              />
            </div>

            {errorMessage && (
              <div
                role="status"
                className="rounded-md border border-[#E8EDF4] bg-[#F5F7FA] px-4 py-3 text-xs text-[#283548]"
              >
                {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#667085]">
                Does not generate prices or confirm bookings — helps prepare clear enquiry notes.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide bg-[#0B2348] text-white rounded-md hover:bg-[#07172F] disabled:opacity-60 transition-colors cursor-pointer"
              >
                <span>{loading ? 'Structuring Checklist…' : 'Structure My Item List'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </form>

          {plan && (
            <div className="mt-6 pt-5 border-t border-[#E8EDF4] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                    Suggested Service Category
                  </p>
                  <p className="text-sm font-semibold text-[#0B2348] mt-1">
                    {plan.suggestedServiceType}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085] mt-3">
                    Formatted Item Summary
                  </p>
                  <p className="text-xs text-[#283548] mt-1 whitespace-pre-line leading-relaxed">
                    {plan.formattedItemsSummary}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E8EDF4] space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                      Access Details Worth Mentioning
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-[#283548] list-disc pl-4">
                      {plan.accessQuestionsToConfirm.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                      Preparation Reminders
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-[#283548] list-disc pl-4">
                      {plan.packingPreparationNotes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {onApplyToQuote && (
                <div className="flex items-center justify-end gap-3">
                  {applied && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0B2348]">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Copied into Quote Form below
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-2 text-xs font-semibold border border-[#0B2348] text-[#0B2348] rounded-md hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                  >
                    Copy Into Quote Form
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
