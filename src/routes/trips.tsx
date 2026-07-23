import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Bookmark, Calendar, MapPin, Sparkles } from "lucide-react";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: "Saved Trips — VoyaNomics AI" },
      { name: "description", content: "All your saved travel plans and budgets in one place." },
      { property: "og:title", content: "Saved Trips — VoyaNomics AI" },
      { property: "og:description", content: "Revisit and refine your AI travel plans." },
    ],
  }),
  component: Trips,
});

const trips = [
  { city: "Lisbon", country: "Portugal", days: 7, cost: 2480, score: 88, tag: "Comfort" },
  { city: "Bali", country: "Indonesia", days: 10, cost: 1920, score: 92, tag: "Budget" },
  { city: "Tokyo", country: "Japan", days: 5, cost: 3150, score: 74, tag: "Comfort" },
  { city: "Reykjavík", country: "Iceland", days: 6, cost: 4200, score: 61, tag: "Luxury" },
  { city: "Mexico City", country: "Mexico", days: 8, cost: 1580, score: 95, tag: "Budget" },
  { city: "Marrakech", country: "Morocco", days: 6, cost: 1290, score: 90, tag: "Comfort" },
];

function Trips() {
  return (
    <AppShell
      title="Saved Trips"
      subtitle={`${trips.length} plans ready to refine`}
      actions={
        <Link
          to="/planner"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" /> New plan
        </Link>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {trips.map((t) => (
          <div
            key={t.city}
            className="group rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {t.country}
                </div>
                <h3 className="mt-1 font-display text-2xl font-bold">{t.city}</h3>
              </div>
              <button className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary">
                <Bookmark className="h-4 w-4 fill-current" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {t.days} days
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                {t.tag}
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between border-t pt-4">
              <div>
                <div className="text-xs text-muted-foreground">Estimated</div>
                <div className="font-display text-xl font-bold">${t.cost.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Score</div>
                <div className="font-display text-xl font-bold text-primary">{t.score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
