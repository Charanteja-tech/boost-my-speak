import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Hash,
  Lightbulb,
  Ruler,
  Sparkles,
  TriangleAlert,
  Type,
  Wand2,
} from "lucide-react";
import { ScoreRing } from "./score-ring";
import { PracticeMode } from "./practice-mode";
import { improveSpeech, type Analysis } from "@/lib/speech-analysis";

const verdict = (s: number) =>
  s >= 90 ? "Stage ready" : s >= 80 ? "Strong draft" : s >= 68 ? "Solid, needs a pass" : "Early draft";

export function ResultsDashboard({ analysis, speech }: { analysis: Analysis; speech: string }) {
  const [improved, setImproved] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const cards = [
    { label: "Confidence", value: analysis.scores.confidence, tone: "brand" as const },
    { label: "Clarity", value: analysis.scores.clarity, tone: "violet" as const },
    { label: "Structure", value: analysis.scores.structure, tone: "amber" as const },
    { label: "Engagement", value: analysis.scores.engagement, tone: "success" as const },
  ];

  const metrics = [
    { icon: Hash, label: "Word Count", value: String(analysis.metrics.wordCount) },
    { icon: Clock, label: "Estimated Speaking Time", value: analysis.metrics.speakingTime },
    { icon: Ruler, label: "Average Sentence Length", value: `${analysis.metrics.avgSentenceLength} words` },
    { icon: Type, label: "Filler Words", value: String(analysis.metrics.fillerWords) },
  ];

  const [mPart, sPart] = analysis.metrics.speakingTime.split(/m\s+/);
  const totalSeconds = Number(mPart ?? 0) * 60 + Number((sPart ?? "0s").replace("s", ""));

  return (
    <div className="space-y-6">
      {/* headline score */}
      <section className="glass-card glow animate-rise overflow-hidden rounded-3xl">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[auto_1fr] lg:items-center">
          <ScoreRing value={analysis.score} size={190} stroke={13} tone="brand">
            <span className="font-display text-5xl font-semibold tabular-nums">
              {analysis.score}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">/ 100</span>
          </ScoreRing>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Analysis complete
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Presentation Score
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {verdict(analysis.score)} — scored across delivery confidence, language clarity,
              narrative structure and audience engagement.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cards.map((c) => (
                <span
                  key={c.label}
                  className="rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {c.label} <span className="font-semibold text-foreground">{c.value}%</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* score cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className="glass-card animate-rise rounded-2xl p-6 transition-transform hover:-translate-y-1"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <ScoreRing value={c.value} label={c.label} tone={c.tone} delay={i * 120} />
          </div>
        ))}
      </section>

      {/* feedback */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card animate-rise rounded-2xl p-6 sm:p-7">
          <h3 className="font-display text-lg font-semibold">Strengths</h3>
          <ul className="mt-4 space-y-3">
            {analysis.strengths.map((s) => (
              <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card animate-rise rounded-2xl p-6 sm:p-7" style={{ animationDelay: "100ms" }}>
          <h3 className="font-display text-lg font-semibold">Areas to Improve</h3>
          <ul className="mt-4 space-y-3">
            {analysis.improvements.map((s) => (
              <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
                  <TriangleAlert className="size-3" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* metrics */}
      <section className="glass-card animate-rise rounded-3xl p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold">Speaking Metrics</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl border border-border bg-surface-2/50 p-5">
              <m.icon className="size-4 text-primary" />
              <p className="mt-4 font-display text-3xl font-semibold tabular-nums">{m.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* recommendations */}
      <section className="glass-card animate-rise rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-amber" />
          <h3 className="font-display text-xl font-semibold">AI Coach Recommendations</h3>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {analysis.recommendations.map((r, i) => (
            <div
              key={r.title}
              className="relative rounded-2xl border border-border bg-surface-2/50 p-5"
            >
              <span className="font-display text-sm text-primary">0{i + 1}</span>
              <h4 className="mt-2 font-display text-base font-semibold">{r.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              setWorking(true);
              setImproved(null);
              window.setTimeout(() => {
                setImproved(improveSpeech(speech));
                setWorking(false);
              }, 1400);
            }}
            className="btn-brand w-full px-6 py-3 text-sm sm:w-auto"
            disabled={working}
          >
            <Wand2 className={`size-4 ${working ? "animate-spin" : ""}`} />
            {working ? "Rewriting your speech…" : "Improve My Speech"}
          </button>
          <span className="text-xs text-muted-foreground">
            Rewrites for a stronger opening, clearer structure and a sharper close.
          </span>
        </div>

        {working ? (
          <div className="mt-6 space-y-3">
            {[100, 88, 94, 72].map((w, i) => (
              <div key={i} className="shimmer-line h-3 rounded-full" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : null}

        {improved ? (
          <div className="animate-rise mt-6 rounded-2xl border border-primary/30 bg-surface-2/60 p-6">
            <div className="flex items-center gap-2 text-primary">
              <ArrowUpRight className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Improved version
              </span>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">
              {improved.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <PracticeMode targetSeconds={totalSeconds} />
    </div>
  );
}
