import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { HISTORY } from "@/lib/history-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Presentation History — SpeakUp AI" },
      {
        name: "description",
        content:
          "Review your previous presentation scores, word counts and speaking times to see how your delivery is improving over time.",
      },
      { property: "og:title", content: "Presentation History — SpeakUp AI" },
      {
        property: "og:description",
        content: "Track how your presentation scores improve session after session.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const avg = Math.round(HISTORY.reduce((a, h) => a + h.score, 0) / HISTORY.length);
  const best = Math.max(...HISTORY.map((h) => h.score));
  const growth = HISTORY[0]!.score - HISTORY[HISTORY.length - 1]!.score;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="aurora mx-auto max-w-6xl px-5 pb-24 pt-16">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Presentation <span className="text-gradient">History</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every analysed talk, scored the same way — so progress is measurable, not a feeling.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Average score", value: avg },
            { label: "Best score", value: best },
            { label: "Growth since June", value: `+${growth}` },
          ].map((s) => (
            <div key={s.label} className="glass-card animate-rise rounded-2xl p-6">
              <p className="font-display text-4xl font-semibold tabular-nums">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        <section className="glass-card mt-6 overflow-hidden rounded-3xl">
          {HISTORY.map((h, i) => (
            <div
              key={h.title}
              className="flex flex-wrap items-center gap-4 border-b border-border/70 p-5 transition-colors last:border-0 hover:bg-surface-2/50 sm:p-6"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="min-w-52 flex-1">
                <p className="font-display text-base font-semibold">{h.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.date} · {h.words} words · {h.duration}
                </p>
              </div>
              <span className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                {h.tag}
              </span>
              <div className="w-40">
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[var(--gradient-brand)]"
                    style={{ width: `${h.score}%` }}
                  />
                </div>
              </div>
              <p className="w-14 text-right font-display text-2xl font-semibold tabular-nums">
                {h.score}
              </p>
            </div>
          ))}
        </section>

        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="size-4 text-success" />
          Your clarity scores have risen fastest — keep trimming sentence length.
        </p>
      </main>
    </div>
  );
}
