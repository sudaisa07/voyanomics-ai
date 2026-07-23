import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  Plane, Hotel, UtensilsCrossed, Bus, Ticket, Sparkles,
  Bookmark, Share2, Lightbulb, DollarSign, MapPin,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "AI Results — VoyaNomics AI" },
      { name: "description", content: "Your AI-generated travel plan with a full budget breakdown." },
      { property: "og:title", content: "AI Results — VoyaNomics AI" },
      { property: "og:description", content: "Budget breakdown, exchange info, and itinerary." },
    ],
  }),
  component: Results,
});

const breakdown = [
  { name: "Flights", value: 780, color: "var(--color-chart-1)" },
  { name: "Hotel",   value: 840, color: "var(--color-chart-2)" },
  { name: "Food",    value: 380, color: "var(--color-chart-3)" },
  { name: "Transport", value: 180, color: "var(--color-chart-4)" },
  { name: "Activities", value: 300, color: "var(--color-chart-5)" },
];

const items = [
  { icon: Plane, k: "Flights", v: "$780", note: "Round trip · 1 stop" },
  { icon: Hotel, k: "Hotel", v: "$840", note: "7 nights · 4★ boutique" },
  { icon: UtensilsCrossed, k: "Food", v: "$380", note: "Mix of local & mid-range" },
  { icon: Bus, k: "Transport", v: "$180", note: "Metro pass + rideshare" },
  { icon: Ticket, k: "Activities", v: "$300", note: "3 tours + museum passes" },
];

const itinerary = [
  { d: "Day 1", t: "Arrival & Alfama walk", c: "$65" },
  { d: "Day 2", t: "Belém Tower + pastel de nata tour", c: "$95" },
  { d: "Day 3", t: "Sintra day trip", c: "$140" },
  { d: "Day 4", t: "LX Factory + Bairro Alto nightlife", c: "$80" },
  { d: "Day 5", t: "Cascais beach day", c: "$70" },
  { d: "Day 6", t: "Food tour + Fado dinner", c: "$120" },
  { d: "Day 7", t: "Markets & departure", c: "$40" },
];

function Results() {
  const total = breakdown.reduce((a, b) => a + b.value, 0);

  return (
    <AppShell
      title="Your AI plan is ready"
      subtitle="Lisbon, Portugal · 7 days · 2 travelers"
      actions={
        <>
          <button className="hidden rounded-full border px-3 py-2 text-sm font-medium hover:bg-muted sm:inline-flex">
            <Share2 className="mr-1.5 h-4 w-4" /> Share
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            <Bookmark className="h-4 w-4" /> Save
          </button>
        </>
      }
    >
      {/* Hero recommendation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white shadow-glow sm:p-8">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Lisbon, Portugal
            </h2>
            <p className="mt-2 max-w-lg text-white/90">
              27% better value than similar Mediterranean cities for your comfort-tier profile. EUR
              trending stable; costs remain within budget with a comfortable buffer.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Great value", "Foodie hub", "Walkable", "Safe"].map((t) => (
                <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-wide opacity-90">Total estimated</div>
            <div className="mt-1 font-display text-4xl font-extrabold">${total.toLocaleString()}</div>
            <div className="mt-1 text-sm opacity-90">under $3,200 budget</div>
          </div>
        </div>
      </div>

      {/* Breakdown grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-soft lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Budget breakdown</h3>
          <p className="text-sm text-muted-foreground">Where every dollar goes</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {items.map((i) => (
              <div key={i.k} className="flex items-center gap-3 rounded-2xl border bg-gradient-soft p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-hero text-white">
                  <i.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-muted-foreground">{i.k}</div>
                  <div className="font-display text-lg font-bold">{i.v}</div>
                  <div className="truncate text-xs text-muted-foreground">{i.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold">Spend distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {breakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Currency + cost of living + explanation */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold">Currency exchange</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Row k="1 USD" v="0.92 EUR" />
            <Row k="Trend (30d)" v="EUR -1.4%" tone="success" />
            <Row k="Best time to convert" v="This week" />
            <Row k="Card fees to watch" v="1-3% FX markup" />
          </div>
        </div>
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-teal" />
            <h3 className="font-display text-lg font-bold">Cost of living</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Row k="Meal (mid-range)" v="€14" />
            <Row k="Public transport day pass" v="€6.60" />
            <Row k="Coffee" v="€1.20" />
            <Row k="Overall vs. USA" v="-32%" tone="success" />
          </div>
        </div>
        <div className="rounded-3xl border bg-gradient-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold">AI economic explanation</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Lisbon's tourism inflation is modest (+3.1% YoY) and hotel supply is high in your target
            week, softening prices. Your comfort-tier budget maps to Alfama and Príncipe Real hotels
            with strong walkability, cutting transport spend.
          </p>
        </div>
      </div>

      {/* Money-saving tips + Itinerary */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold">Money-saving tips</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Fly Tue/Wed to trim ~$85 per ticket.",
              "Buy the 7-day Viva Viagem transit pass — saves ~$68.",
              "Eat lunch as your main meal for 25–30% savings on menus.",
              "Skip taxi at the airport: metro is €1.85 and 20 min faster in traffic.",
            ].map((t) => (
              <li key={t} className="flex gap-2 rounded-2xl bg-gradient-soft p-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold">Suggested itinerary</h3>
          <div className="mt-4 space-y-2">
            {itinerary.map((r) => (
              <div
                key={r.d}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border bg-background px-4 py-3"
              >
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {r.d}
                </span>
                <span className="truncate text-sm">{r.t}</span>
                <span className="text-sm font-semibold">{r.c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/compare"
          className="rounded-full border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          Compare with another city
        </Link>
        <Link
          to="/planner"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          Refine plan
        </Link>
      </div>
    </AppShell>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={"font-semibold " + (tone === "success" ? "text-success" : "")}>{v}</span>
    </div>
  );
}
