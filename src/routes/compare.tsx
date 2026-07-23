import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Destination Comparison — VoyaNomics AI" },
      { name: "description", content: "Compare two destinations side by side on cost, FX, and value." },
      { property: "og:title", content: "Destination Comparison — VoyaNomics AI" },
      { property: "og:description", content: "Two destinations, one clear economic winner." },
    ],
  }),
  component: Compare,
});

type Dest = {
  city: string;
  country: string;
  emoji: string;
  total: number;
  daily: number;
  fx: string;
  col: string;
  score: number; // 0-100
  value: string;
};

const A: Dest = {
  city: "Lisbon",
  country: "Portugal",
  emoji: "🇵🇹",
  total: 2480,
  daily: 354,
  fx: "1 USD = 0.92 EUR",
  col: "-32% vs. USA",
  score: 88,
  value: "Excellent",
};
const B: Dest = {
  city: "Barcelona",
  country: "Spain",
  emoji: "🇪🇸",
  total: 3120,
  daily: 445,
  fx: "1 USD = 0.92 EUR",
  col: "-18% vs. USA",
  score: 72,
  value: "Good",
};

const chartData = [
  { k: "Flights", A: 780, B: 720 },
  { k: "Hotel", A: 840, B: 1240 },
  { k: "Food", A: 380, B: 520 },
  { k: "Transport", A: 180, B: 220 },
  { k: "Activities", A: 300, B: 420 },
];

function Compare() {
  const winner = A.score >= B.score ? A : B;

  return (
    <AppShell title="Destination Comparison" subtitle="Side-by-side economic analysis">
      <div className="grid gap-6 lg:grid-cols-2">
        <DestCard d={A} accent="primary" winner={winner.city === A.city} />
        <DestCard d={B} accent="teal" winner={winner.city === B.city} />
      </div>

      <div className="mt-6 rounded-3xl border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold">Category breakdown</h3>
        <p className="text-sm text-muted-foreground">Spend per category, USD</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="k" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar name="Lisbon" dataKey="A" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              <Bar name="Barcelona" dataKey="B" fill="var(--color-teal)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-gradient-hero p-6 text-white shadow-glow sm:p-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-display text-lg font-bold">AI Recommendation</h3>
        </div>
        <p className="mt-3 text-white/90 sm:text-lg">
          <strong>{winner.city}</strong> offers the stronger value-for-money profile for your
          comfort-tier, 7-day trip — an estimated {Math.abs(A.total - B.total).toLocaleString()}$
          savings with a higher budget score. Book within the next 2 weeks to lock EUR while it
          trends stable.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary">
          Pick {winner.city} <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </AppShell>
  );
}

function DestCard({ d, accent, winner }: { d: Dest; accent: "primary" | "teal"; winner: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-soft">
      {winner && (
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
          <Trophy className="h-3.5 w-3.5" /> Best value
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="text-4xl">{d.emoji}</div>
        <div>
          <h3 className="font-display text-2xl font-bold">{d.city}</h3>
          <div className="text-sm text-muted-foreground">{d.country}</div>
        </div>
      </div>

      <div className={"mt-5 rounded-2xl p-4 " + (accent === "primary" ? "bg-primary/10" : "bg-teal/15")}>
        <div className="text-xs font-medium text-muted-foreground">Total estimated cost</div>
        <div className="font-display text-3xl font-extrabold">${d.total.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">${d.daily} per day</div>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <RowKV k="Currency exchange" v={d.fx} />
        <RowKV k="Cost of living" v={d.col} tone="success" />
        <RowKV k="Value for money" v={d.value} />
      </dl>

      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Budget score</span>
          <span className="font-bold text-foreground">{d.score}/100</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={"h-full " + (accent === "primary" ? "bg-gradient-hero" : "bg-teal")}
            style={{ width: `${d.score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function RowKV({ k, v, tone }: { k: string; v: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={"font-semibold " + (tone === "success" ? "text-success" : "")}>{v}</dd>
    </div>
  );
}
