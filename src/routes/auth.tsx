import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Globe2, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — VoyaNomics AI" },
      { name: "description", content: "Sign in or create your VoyaNomics AI account." },
      { property: "og:title", content: "Sign in — VoyaNomics AI" },
      { property: "og:description", content: "Access your AI travel economist dashboard." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Globe2 className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">VoyaNomics AI</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight">
              Every trip,
              <br /> analyzed like a market.
            </h2>
            <p className="mt-4 max-w-md text-white/85">
              Real-time budgets, FX intelligence, and destination economics — built by AI, guided by
              you.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
              {[
                { k: "180+", v: "Countries" },
                { k: "32%", v: "Avg. savings" },
                { k: "24/7", v: "AI insights" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl font-bold">{s.k}</div>
                  <div className="text-xs text-white/80">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-gradient-soft px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero shadow-glow">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">VoyaNomics AI</span>
          </Link>

          <div className="mb-6 inline-flex rounded-full bg-muted p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  "rounded-full px-5 py-1.5 text-sm font-medium transition " +
                  (mode === m
                    ? "bg-background text-foreground shadow-soft"
                    : "text-muted-foreground")
                }
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <h1 className="font-display text-3xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Log in to keep planning value-packed trips."
              : "Start planning smarter, more affordable travel."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
            className="mt-8 space-y-4"
          >
            {mode === "signup" && (
              <Field icon={UserIcon} label="Full name" type="text" placeholder="Jane Traveler" />
            )}
            <Field icon={Mail} label="Email" type="email" placeholder="you@example.com" />
            <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border bg-background py-3 text-sm font-medium hover:bg-muted">
            Continue with Google
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
  placeholder: string;
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
