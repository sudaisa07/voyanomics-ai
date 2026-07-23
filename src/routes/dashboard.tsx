import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  Wallet,
  MapPin,
  Coins,
  PiggyBank,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — VoyaNomics AI" },
      { name: "description", content: "Overview of your travel budget, destinations, and AI insights." },
      { property: "og:title", content: "Dashboard — VoyaNomics AI" },
      { property: "og:description", content: "Your travel economics at a glance." },
    ],
  }),
  component: Dashboard,
});

const spend = [
  { m: "Jan", v: 420 }, { m: "Feb", v: 520 }, { m: "Mar", v: 380 },
  { m: "Apr", v: 610 }, { m: "May", v: 720 }, { m: "Jun", v: 690 },
  { m: "Jul", v: 880 },
];

function Dashboard() {
  return (
    <AppShell
      title="Welcome back, Jane"
      subtitle="Here's your travel economics snapshot"
      actions={
        <Link
          to="/planner"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" /> New AI plan
        </Link>
      }
    >
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Budget"
          value="$3,200"
          delta="+8%"
          trend="up"
          sub="Set for July trip"
        />
        <StatCard
          icon={MapPin}
          label="Destination"
          value="Lisbon"
          sub="Portugal · 7 days"
        />
        <StatCard
          icon={Coins}
          label="Estimated Cost"
          value="$2,480"
          delta="-4%"
          trend="down"
          sub="AI forecast · 92% conf."
        />
        <StatCard
          icon={PiggyBank}
          label="Savings"
          value="$720"
          delta="+22%"
          trend="up"
          sub="vs. average traveler"
        />
      </div>

      {/* Chart + AI recos */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Spend trajectory</h3>
              <p className="text-sm text-muted-foreground">Monthly travel spend, USD</p>
            </div>
            <div className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal-foreground">
              Under budget
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spend} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#fill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-gradient-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-hero text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-display text-lg font-bold">AI Recommendations</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Shift travel dates by 2 weeks to save ~$180 on flights.",
              "Lisbon offers 27% better value than Barcelona for your style.",
              "EUR is trending down 1.4% — book activities in local currency.",
              "Bundle transport pass ($34) to save ~$68 over 7 days.",
            ].map((t) => (
              <li key={t} className="flex gap-2 rounded-2xl bg-background/60 p-3">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-6 rounded-3xl border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Upcoming trips</h3>
          <Link to="/trips" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { city: "Lisbon", country: "Portugal", days: 7, cost: "$2,480" },
            { city: "Bali", country: "Indonesia", days: 10, cost: "$1,920" },
            { city: "Tokyo", country: "Japan", days: 5, cost: "$3,150" },
          ].map((t) => (
            <div
              key={t.city}
              className="rounded-2xl border bg-gradient-soft p-5 transition hover:shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg font-bold">{t.city}</div>
                  <div className="text-xs text-muted-foreground">{t.country} · {t.days} days</div>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {t.cost}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delta,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-hero text-white shadow-glow">
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <div
            className={
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold " +
              (trend === "up"
                ? "bg-success/15 text-success"
                : "bg-destructive/10 text-destructive")
            }
          >
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {delta}
          </div>
        )}
      </div>
      <div className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
