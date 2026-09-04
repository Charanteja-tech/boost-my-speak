import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ResultsDashboard } from "@/components/results-dashboard";
import { analyzeSpeech, SAMPLE_SPEECH, type Analysis } from "@/lib/speech-analysis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpeakUp AI — Presentation Coach for Students" },
      {
        name: "description",
        content:
          "Paste your speech and get an instant AI presentation score, delivery feedback, speaking metrics and a rewritten version before you step on stage.",
      },
      { property: "og:title", content: "SpeakUp AI — Presentation Coach" },
      {
        property: "og:description",
        content: "Instant feedback on your speech: score, metrics, coaching and practice mode.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoachPage,
});

const STAGES = [
  "Parsing sentence structure…",
  "Measuring pacing and filler density…",
  "Scoring clarity and engagement…",
  "Writing your coaching notes…",
];

function CoachPage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [stage, setStage] = useState(0);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzed, setAnalyzed] = useState("");

  useEffect(() => {
    if (phase !== "loading") return;
    const id = window.setInterval(() => setStage((s) => Math.min(STAGES.length - 1, s + 1)), 550);
    const done = window.setTimeout(() => {
      setAnalysis(analyzeSpeech(text));
      setAnalyzed(text);
      setPhase("done");
      window.setTimeout(
        () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
        80,
      );
    }, 2400);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(done);
    };
  }, [phase, text]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="aurora mx-auto max-w-6xl px-5 pb-24">
        <section className="pt-12 pb-9 text-center sm:pt-24 sm:pb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Simulated AI analysis · no account needed
          </span>
          <h1 className="animate-rise mx-auto mt-6 max-w-3xl font-display text-[2.1rem] font-semibold leading-[1.08] sm:text-6xl">
            Speak with confidence.
            <br />
            <span className="text-gradient">Present with impact.</span>
          </h1>
          <p className="animate-rise mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg" style={{ animationDelay: "120ms" }}>
            Get instant feedback on your presentation before you step on stage.
          </p>
        </section>

        <section className="glass-card glow animate-rise rounded-3xl p-4 sm:p-7" style={{ animationDelay: "200ms" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste your speech here..."
            className="w-full resize-y rounded-2xl border border-border bg-surface-2/50 p-5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="tabular-nums">{words} words</span>
              <span className="size-1 rounded-full bg-border" />
              <span className="tabular-nums">
                ~{Math.max(0, Math.round((words / 150) * 60))}s spoken
              </span>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                onClick={() => setText(SAMPLE_SPEECH)}
                className="btn-ghost w-full px-5 py-3 text-sm sm:w-auto"
              >
                <Wand2 className="size-4" />
                Try an example
              </button>
              <button
                onClick={() => {
                  if (!text.trim()) return;
                  setStage(0);
                  setPhase("loading");
                }}
                disabled={!text.trim() || phase === "loading"}
                className="btn-brand w-full px-6 py-3 text-sm sm:w-auto"
              >
                {phase === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Analyze Presentation
              </button>
            </div>
          </div>
        </section>

        {phase === "loading" ? (
          <section className="glass-card animate-rise mt-6 rounded-3xl p-8">
            <div className="flex items-center gap-3">
              <Loader2 className="size-4 animate-spin text-primary" />
              <p className="font-display text-sm font-medium">{STAGES[stage]}</p>
            </div>
            <div className="mt-6 space-y-3">
              {[92, 78, 96, 64, 84].map((w, i) => (
                <div
                  key={i}
                  className="shimmer-line h-3 rounded-full"
                  style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full brand-gradient transition-[width] duration-500"
                style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
              />
            </div>
          </section>
        ) : null}

        {phase === "done" && analysis ? (
          <div id="results" className="mt-8">
            <ResultsDashboard analysis={analysis} speech={analyzed} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
