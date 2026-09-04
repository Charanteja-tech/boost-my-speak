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
        <h1 className="animate-rise font-display text-[2rem] font-semibold sm:text-5xl">
          Presentation <span className="text-gradient">History</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every analysed talk, scored the same way — so progress is measurable, not a feeling.
        </p>

        <section className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Average score", value: avg },
            { label: "Best score", value: best },
            { label: "Growth since June", value: `+${growth}` },
          ].map((s) => (
            <div key={s.label} className="glass-card animate-rise rounded-2xl p-4 sm:p-6">
              <p className="font-display text-2xl font-semibold tabular-nums sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground sm:text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        <section className="glass-card mt-6 overflow-hidden rounded-3xl">
          {HISTORY.map((h, i) => (
            <div
              key={h.title}
              className="border-b border-border/70 p-5 transition-colors last:border-0 hover:bg-surface-2/50 sm:flex sm:items-center sm:gap-5 sm:p-6"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-4 sm:min-w-52 sm:flex-1">
                <div>
                  <p className="font-display text-base font-semibold leading-snug">{h.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {h.date} · {h.words} words · {h.duration}
                  </p>
                </div>
                <p className="font-display text-2xl font-semibold tabular-nums sm:hidden">
                  {h.score}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4 sm:mt-0">
                <span className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                  {h.tag}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary sm:w-40 sm:flex-none">
                  <div
                    className="h-full rounded-full brand-gradient transition-[width] duration-700"
                    style={{ width: `${h.score}%` }}
                  />
                </div>
                <p className="hidden w-12 text-right font-display text-2xl font-semibold tabular-nums sm:block">
                  {h.score}
                </p>
              </div>
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
