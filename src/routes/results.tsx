import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  Plane, Hotel, UtensilsCrossed, Bus, Ticket, Sparkles,
  Bookmark, Share2, Lightbulb, Loader2, AlertCircle,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generatePlan, type AIPlan, type PlanInput } from "@/lib/plan.functions";
import { PLAN_INPUT_STORAGE_KEY } from "./planner";

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

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Flights: Plane,
  Accommodation: Hotel,
  Food: UtensilsCrossed,
  Transportation: Bus,
  Activities: Ticket,
};

function Results() {
  const navigate = useNavigate();
  const [input, setInput] = useState<PlanInput | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: PlanInput) => generatePlan({ data }),
  });

  useEffect(() => {
    setHydrated(true);
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(PLAN_INPUT_STORAGE_KEY);
    if (!raw) {
      navigate({ to: "/planner" });
      return;
    }
    try {
      const parsed = JSON.parse(raw) as PlanInput;
      setInput(parsed);
      mutation.mutate(parsed);
    } catch {
      navigate({ to: "/planner" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hydrated || !input) {
    return (
      <AppShell title="Preparing your plan" subtitle="Loading trip inputs…">
        <LoadingState label="Loading…" />
      </AppShell>
    );
  }

  const subtitle = `${input.destination} · ${input.days} days · ${input.travelers} traveler${input.travelers > 1 ? "s" : ""}`;

  if (mutation.isPending) {
    return (
      <AppShell title="Crunching the numbers" subtitle={subtitle}>
        <LoadingState label="AI is analyzing costs, FX rates, and value for money…" />
      </AppShell>
    );
  }

  if (mutation.isError) {
    return (
      <AppShell title="We couldn't generate your plan" subtitle={subtitle}>
        <div className="rounded-3xl border bg-card p-8 text-center shadow-soft">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold">Something went wrong</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {(mutation.error as Error)?.message ?? "The AI service is unavailable right now."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => mutation.mutate(input)}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
            >
              Try again
            </button>
            <Link to="/planner" className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted">
              Edit inputs
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const plan = mutation.data as AIPlan | undefined;
  if (!plan) return null;

  return <PlanView plan={plan} input={input} subtitle={subtitle} />;
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border bg-gradient-soft p-10 text-center shadow-soft">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 font-display text-lg font-semibold">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">This usually takes 5-15 seconds.</p>
    </div>
  );
}

function PlanView({ plan, input, subtitle }: { plan: AIPlan; input: PlanInput; subtitle: string }) {
  const breakdown = plan.breakdown.map((b, i) => ({
    name: b.name,
    value: Math.max(0, Number(b.amount) || 0),
    note: b.note,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));
  const total = plan.totalEstimated || breakdown.reduce((a, b) => a + b.value, 0);
  const currency = plan.currency || input.currency;
  const fmt = (n: number) =>
    `${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;

  return (
    <AppShell
      title="Your AI plan is ready"
      subtitle={subtitle}
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
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white shadow-glow sm:p-8">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              {plan.destination}
            </h2>
            <p className="mt-2 max-w-xl text-white/90">{plan.summary}</p>
            {plan.highlights?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {plan.highlights.map((t) => (
                  <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-wide opacity-90">Total estimated</div>
            <div className="mt-1 font-display text-4xl font-extrabold">{fmt(total)}</div>
            <div className="mt-1 text-sm opacity-90">
              of {fmt(input.budget)} budget
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-soft lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Budget breakdown</h3>
          <p className="text-sm text-muted-foreground">Where every {currency} goes</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {breakdown.map((i) => {
              const Icon = CATEGORY_ICONS[i.name] ?? Ticket;
              return (
                <div key={i.name} className="flex items-center gap-3 rounded-2xl border bg-gradient-soft p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-hero text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-muted-foreground">{i.name}</div>
                    <div className="font-display text-lg font-bold">{fmt(i.value)}</div>
                    <div className="truncate text-xs text-muted-foreground">{i.note}</div>
                  </div>
                </div>
              );
            })}
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

      {/* Explanation */}
      <div className="mt-6 rounded-3xl border bg-gradient-card p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold">Why this allocation</h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{plan.summary}</p>
      </div>

      {/* Tips + Itinerary */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold">Money-saving tips</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {plan.savingTips?.map((t) => (
              <li key={t} className="flex gap-2 rounded-2xl bg-gradient-soft p-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>

          {plan.optimizationTips?.length ? (
            <>
              <h4 className="mt-6 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Budget optimization
              </h4>
              <ul className="mt-3 space-y-3 text-sm">
                {plan.optimizationTips.map((t) => (
                  <li key={t} className="flex gap-2 rounded-2xl border p-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold">Suggested itinerary</h3>
          <div className="mt-4 space-y-2">
            {plan.itinerary?.map((r) => (
              <div
                key={r.day}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border bg-background px-4 py-3"
              >
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {r.day}
                </span>
                <span className="truncate text-sm">{r.title}</span>
                <span className="text-sm font-semibold">{fmt(r.cost)}</span>
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
