import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe2,
  Wallet,
  LineChart,
  ShieldCheck,
  Compass,
} from "lucide-react";
import heroImg from "@/assets/hero-illustration.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoyaNomics AI — Travel Smarter. Spend Wiser." },
      {
        name: "description",
        content:
          "AI-powered travel economics. Analyze budgets, compare destinations, and maximize value for money on every trip.",
      },
      { property: "og:title", content: "VoyaNomics AI — Travel Smarter. Spend Wiser." },
      {
        property: "og:description",
        content:
          "Your AI travel economist. Smarter budgets, better destinations, real value for money.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Wallet,
    title: "Budget Intelligence",
    desc: "AI breaks down flights, hotels, food, and transport so you know exactly where every dollar goes.",
  },
  {
    icon: Globe2,
    title: "Destination Compare",
    desc: "Side-by-side economics for any two cities — cost of living, FX, and value score.",
  },
  {
    icon: LineChart,
    title: "Exchange Insights",
    desc: "Real-time currency context and forecasts, translated into human-friendly guidance.",
  },
  {
    icon: TrendingUp,
    title: "Money-Saving Tips",
    desc: "Personalized recommendations that stretch your budget further, from off-peak dates to local hacks.",
  },
  {
    icon: Compass,
    title: "Smart Itineraries",
    desc: "Day-by-day plans optimized for experience per dollar, not just tourist checklists.",
  },
  {
    icon: ShieldCheck,
    title: "Trustworthy Estimates",
    desc: "Transparent methodology. See the numbers, the sources, and the assumptions behind every plan.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero shadow-glow">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">VoyaNomics AI</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              Start Planning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-teal/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Your AI Travel Economist
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Travel Smarter.
              <br />
              <span className="text-gradient-hero">Spend Wiser.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              VoyaNomics AI analyzes your travel budget, compares destinations, and decodes exchange
              rates — so every trip delivers real value for money.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                Start Planning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-full border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted"
              >
                Compare destinations
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-6">
              {[
                { k: "180+", v: "Countries" },
                { k: "32%", v: "Avg. savings" },
                { k: "4.9/5", v: "User rating" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl font-bold">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-8 rounded-[3rem] bg-gradient-hero opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border bg-card shadow-elevated">
              <img
                src={heroImg}
                alt="AI-powered travel and finance illustration"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-wide text-primary">Platform</div>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            An economist in your pocket
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six intelligent modules that turn travel decisions into data-backed choices.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-hero text-white shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              Three steps from question to confident booking.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Tell us your trip", d: "Budget, dates, style, and interests." },
              { n: "02", t: "AI runs the numbers", d: "Costs, FX, and cost of living, in seconds." },
              { n: "03", t: "Book with confidence", d: "Plans, comparisons, and money-saving tips." },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl border bg-card p-8 shadow-soft">
                <div className="font-display text-4xl font-extrabold text-gradient-hero">{s.n}</div>
                <div className="mt-4 font-display text-lg font-bold">{s.t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-hero p-10 text-center text-white shadow-glow sm:p-16">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ready to plan a smarter trip?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Start free. Let AI do the math while you dream up the destination.
          </p>
          <Link
            to="/planner"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-elevated transition hover:opacity-95"
          >
            Start Planning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            <span>© {new Date().getFullYear()} VoyaNomics AI</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
