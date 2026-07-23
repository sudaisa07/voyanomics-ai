import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Bell, CreditCard, Globe2, Lock, LogOut, Mail } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — VoyaNomics AI" },
      { name: "description", content: "Manage your account, preferences, and billing." },
      { property: "og:title", content: "Profile — VoyaNomics AI" },
      { property: "og:description", content: "Your VoyaNomics AI account settings." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell title="Your profile" subtitle="Account, preferences, and billing">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-hero font-display text-3xl font-bold text-white shadow-glow">
              JT
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">Jane Traveler</h2>
            <p className="text-sm text-muted-foreground">jane@voyanomics.ai</p>
            <div className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Explorer plan
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <RowKV k="Home currency" v="USD" />
            <RowKV k="Departure country" v="United States" />
            <RowKV k="Travel style" v="Comfort" />
            <RowKV k="Interests" v="Food, Culture" />
          </dl>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-soft lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Personal details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value="Jane Traveler" />
            <Field label="Email" value="jane@voyanomics.ai" />
            <Field label="Currency" value="USD" />
            <Field label="Country" value="United States" />
          </div>
          <button className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            Save changes
          </button>

          <h3 className="mt-10 font-display text-lg font-bold">Preferences</h3>
          <div className="mt-4 grid gap-3">
            <Pref icon={Bell} title="Price alerts" desc="Notify me when flights drop 10%+" on />
            <Pref icon={Globe2} title="FX movement digest" desc="Weekly summary of your currencies" on />
            <Pref icon={Mail} title="AI trip suggestions" desc="Get monthly value-for-money picks" />
            <Pref icon={CreditCard} title="Billing" desc="Manage payment methods" />
            <Pref icon={Lock} title="Security" desc="Password & 2FA" />
          </div>

          <button className="mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/5">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold">{label}</span>
      <input
        defaultValue={value}
        className="w-full rounded-2xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function RowKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}

function Pref({
  icon: Icon,
  title,
  desc,
  on,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  on?: boolean;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border bg-gradient-soft p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{desc}</div>
      </div>
      <div
        className={
          "flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition " +
          (on ? "bg-primary" : "bg-muted")
        }
      >
        <div
          className={
            "h-5 w-5 rounded-full bg-background shadow transition " + (on ? "translate-x-5" : "")
          }
        />
      </div>
    </div>
  );
}
