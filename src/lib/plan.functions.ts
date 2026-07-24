import { createServerFn } from "@tanstack/react-start";

export type PlanInput = {
  departureCountry: string;
  destination: string;
  budget: number;
  currency: string;
  days: number;
  travelers: number;
  comfort: "Budget" | "Comfort" | "Luxury";
  interests: string[];
};

export type PlanCategory = {
  name: "Flights" | "Accommodation" | "Food" | "Transportation" | "Activities";
  amount: number;
  note: string;
};

export type AIPlan = {
  destination: string;
  summary: string;
  totalEstimated: number;
  currency: string;
  breakdown: PlanCategory[];
  savingTips: string[];
  optimizationTips: string[];
  itinerary: { day: string; title: string; cost: number }[];
  highlights: string[];
};

const SYSTEM_PROMPT = `You are VoyaNomics AI, an expert travel economist. Given a traveler's inputs, produce a realistic, data-informed budget plan.

Rules:
- Total across all breakdown categories should be within ~5% of the user's total budget (may go slightly under if the destination is cheaper).
- Categories must be exactly: Flights, Accommodation, Food, Transportation, Activities.
- Scale everything by number of travelers and days.
- Tune costs to the destination's real cost of living and the chosen comfort tier (Budget/Comfort/Luxury).
- Itinerary length equals the number of days.
- Tips must be specific to the destination (not generic).
- Return ONLY valid JSON matching the requested schema. No markdown, no prose outside JSON.`;

function buildUserPrompt(input: PlanInput): string {
  return `Generate a travel budget plan as strict JSON with this shape:
{
  "destination": string,
  "summary": string (2-3 sentences explaining the allocation rationale),
  "totalEstimated": number (in ${input.currency}),
  "currency": "${input.currency}",
  "breakdown": [
    { "name": "Flights", "amount": number, "note": string },
    { "name": "Accommodation", "amount": number, "note": string },
    { "name": "Food", "amount": number, "note": string },
    { "name": "Transportation", "amount": number, "note": string },
    { "name": "Activities", "amount": number, "note": string }
  ],
  "savingTips": string[] (4-6 destination-specific tips),
  "optimizationTips": string[] (3-5 budget optimization tips),
  "itinerary": [ { "day": "Day 1", "title": string, "cost": number } ] (exactly ${input.days} entries),
  "highlights": string[] (3-5 short tags like "Great value", "Walkable")
}

Traveler inputs:
- Departure country: ${input.departureCountry}
- Destination: ${input.destination}
- Total budget: ${input.budget} ${input.currency}
- Trip duration: ${input.days} days
- Travelers: ${input.travelers}
- Comfort level: ${input.comfort}
- Interests / travel style: ${input.interests.join(", ") || "General"}`;
}

// Ordered by preference. First supported model returned by the Models API wins.
const PREFERRED_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
];

let cachedModel: string | null = null;

async function selectSupportedModel(apiKey: string): Promise<string> {
  if (cachedModel) return cachedModel;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Unable to list Gemini models (${res.status}). Verify GEMINI_API_KEY is valid. Details: ${text.slice(0, 200)}`,
    );
  }

  const data = (await res.json()) as {
    models?: { name?: string; supportedGenerationMethods?: string[] }[];
  };

  const available = (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => (m.name ?? "").replace(/^models\//, ""))
    .filter(Boolean);

  if (available.length === 0) {
    throw new Error("No Gemini models with generateContent are available for this API key.");
  }

  const picked =
    PREFERRED_MODELS.find((m) => available.includes(m)) ??
    available.find((m) => m.startsWith("gemini-") && m.includes("flash")) ??
    available.find((m) => m.startsWith("gemini-")) ??
    available[0];

  cachedModel = picked;
  return picked;
}

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: PlanInput) => data)
  .handler(async ({ data }): Promise<AIPlan> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const model = await selectSupportedModel(apiKey);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: buildUserPrompt(data) }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 404) {
        cachedModel = null;
        throw new Error(
          `Gemini model "${model}" is not available for your API key. Please try again — a different supported model will be selected.`,
        );
      }
      throw new Error(`Gemini API error (${res.status}) using model "${model}": ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const content = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

    let parsed: AIPlan;
    try {
      parsed = JSON.parse(content) as AIPlan;
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned invalid JSON");
      parsed = JSON.parse(match[0]) as AIPlan;
    }

    return parsed;
  });

