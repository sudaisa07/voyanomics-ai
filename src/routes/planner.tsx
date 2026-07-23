import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Sparkles, Plane, Wallet, Calendar, Users, Compass } from "lucide-react";
import { useState } from "react";

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

const interests = [
  "Food", "Culture", "Nature", "Beach", "Nightlife", "History", "Shopping", "Adventure", "Family",
];

function Planner() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["Food", "Culture"]);
  const [style, setStyle] = useState<"Budget" | "Comfort" | "Luxury">("Comfort");

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  return (
    <AppShell title="AI Trip Planner" subtitle="Tell us the trip. We'll compute the economics.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/results" });
        }}
        className="mx-auto max-w-4xl"
      >
        <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input icon={Plane} label="Departure Country" placeholder="United States" />
            <Input icon={Compass} label="Destination" placeholder="Lisbon, Portugal" />
            <Input icon={Wallet} label="Budget" placeholder="3000" type="number" />
            <Select label="Currency" options={["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]} />
            <Input icon={Calendar} label="Number of Days" placeholder="7" type="number" />
            <Input icon={Users} label="Number of Travelers" placeholder="2" type="number" />
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
              {interests.map((i) => {
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
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
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
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <select className="w-full rounded-2xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
