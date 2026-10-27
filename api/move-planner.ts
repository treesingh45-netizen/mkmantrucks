import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

interface ServerlessRequest {
  method?: string;
  body?: { moveDescription?: unknown } | string;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
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

  let parsedBody: { moveDescription?: unknown } = {};
  if (typeof req.body === 'string') {
    try {
      parsedBody = JSON.parse(req.body) as { moveDescription?: unknown };
    } catch {
      parsedBody = {};
    }
  } else if (req.body && typeof req.body === 'object') {
    parsedBody = req.body;
  }

  const moveDescription =
    typeof parsedBody.moveDescription === 'string' ? parsedBody.moveDescription.trim() : '';

  if (moveDescription.length < 10) {
    res.status(400).json({
      ok: false,
      error: 'Please describe your rooms, bulky items, or access considerations in at least a sentence.',
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.status(503).json({
      ok: false,
      error:
        'Deep-thinking checklist structuring is currently offline. You can enter your item list directly into the Quote Request Form below.',
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

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
    res.status(200).json({ ok: true, plan: parsed });
  } catch {
    res.status(502).json({
      ok: false,
      error:
        'Checklist assistant could not complete this request right now. Please type your items directly into the Quote Request Form.',
    });
  }
}
