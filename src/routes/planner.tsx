import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Sparkles, Plane, Wallet, Calendar, Users, Compass } from "lucide-react";
import { useState } from "react";
import type { PlanInput } from "@/lib/plan.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Trip Planner — VoyaNomics AI" },
      { name: "description", content: "Generate an AI-crafted travel plan tailored to your budget." },
      { property: "og:title", content: "AI Trip Planner — VoyaNomics AI" },
      { property: "og:description", content: "Tell us your trip. AI runs the numbers." },
    ],
  }),
  component: Planner,
});

const interestOptions = [
  "Food", "Culture", "Nature", "Beach", "Nightlife", "History", "Shopping", "Adventure", "Family",
];

export const PLAN_INPUT_STORAGE_KEY = "voyanomics:planInput";

function Planner() {
  const navigate = useNavigate();
  const [departureCountry, setDeparture] = useState("United States");
  const [destination, setDestination] = useState("Lisbon, Portugal");
  const [budget, setBudget] = useState("3000");
  const [currency, setCurrency] = useState("USD");
  const [days, setDays] = useState("7");
  const [travelers, setTravelers] = useState("2");
  const [selected, setSelected] = useState<string[]>(["Food", "Culture"]);
  const [style, setStyle] = useState<"Budget" | "Comfort" | "Luxury">("Comfort");

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: PlanInput = {
      departureCountry: departureCountry.trim() || "Unknown",
      destination: destination.trim() || "Unknown",
      budget: Math.max(1, Number(budget) || 0),
      currency,
      days: Math.max(1, Number(days) || 1),
      travelers: Math.max(1, Number(travelers) || 1),
      comfort: style,
      interests: selected,
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem(PLAN_INPUT_STORAGE_KEY, JSON.stringify(input));
    }
    navigate({ to: "/results" });
  };

  return (
    <AppShell title="AI Trip Planner" subtitle="Tell us the trip. We'll compute the economics.">
      <form onSubmit={onSubmit} className="mx-auto max-w-4xl">
        <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input icon={Plane} label="Departure Country" value={departureCountry} onChange={setDeparture} placeholder="United States" />
            <Input icon={Compass} label="Destination" value={destination} onChange={setDestination} placeholder="Lisbon, Portugal" />
            <Input icon={Wallet} label="Budget" value={budget} onChange={setBudget} placeholder="3000" type="number" />
            <Select label="Currency" value={currency} onChange={setCurrency} options={["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]} />
            <Input icon={Calendar} label="Number of Days" value={days} onChange={setDays} placeholder="7" type="number" />
            <Input icon={Users} label="Number of Travelers" value={travelers} onChange={setTravelers} placeholder="2" type="number" />
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Travel Style
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["Budget", "Comfort", "Luxury"] as const).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStyle(s)}
                  className={
                    "rounded-2xl border px-4 py-3 text-sm font-semibold transition " +
                    (style === s
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : "bg-background hover:bg-muted")
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Interests
            </div>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((i) => {
                const active = selected.includes(i);
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => toggle(i)}
                    className={
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition " +
                      (active
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-background hover:bg-muted")
                    }
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-hero py-4 font-display text-base font-bold text-white shadow-glow transition hover:opacity-95"
          >
            <Sparkles className="h-5 w-5" />
            Generate AI Plan
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Estimates use live FX and cost-of-living data. Actual prices vary.
        </p>
      </form>
    </AppShell>
  );
}

function Input({
  icon: Icon,
  label,
  value,
  onChange,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/30">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
