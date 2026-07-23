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

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: PlanInput) => data)
  .handler(async ({ data }): Promise<AIPlan> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(data) },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
      throw new Error(`AI gateway error (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";

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
