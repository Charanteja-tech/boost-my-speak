import { createFileRoute } from "@tanstack/react-router";
import { Anchor, Eye, Gauge, Mic2, Repeat, Timer } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Speaking Tips — SpeakUp AI" },
      {
        name: "description",
        content:
          "Practical public speaking techniques for students: pacing, structure, eye contact, handling nerves and rehearsing out loud.",
      },
      { property: "og:title", content: "Speaking Tips — SpeakUp AI" },
      {
        property: "og:description",
        content: "Six techniques that reliably raise a student presentation score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TipsPage,
});

const TIPS = [
  {
    icon: Anchor,
    title: "Write the one sentence first",
    body: "Before a single slide, write the sentence you want someone to repeat afterwards. Anything that doesn't support it gets cut.",
  },
  {
    icon: Gauge,
    title: "Aim for 140–160 words a minute",
    body: "Faster and the room stops processing; slower and attention drifts. Time a rehearsal and adjust the script, not the speed.",
  },
  {
    icon: Repeat,
    title: "Rehearse out loud three times",
    body: "Run one is messy, run two finds the rhythm, run three is the one you give. Silent reading never surfaces the awkward sentence.",
  },
  {
    icon: Mic2,
    title: "Trade fillers for silence",
    body: "A two-beat pause where an \u201cum\u201d used to be reads as confidence. Audiences hear thinking, not hesitation.",
  },
  {
    icon: Eye,
    title: "Talk to one person at a time",
    body: "Hold a single face for a full sentence, then move. Sweeping the room looks nervous; landing on people looks certain.",
  },
  {
    icon: Timer,
    title: "Own the first ten seconds",
    body: "Walk to centre, stop, breathe, look up, then speak. Those ten seconds set how the rest of the talk is received.",
  },
];

function TipsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="aurora mx-auto max-w-6xl px-5 pb-24 pt-16">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Speaking <span className="text-gradient">Tips</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          The techniques our coach checks for — worth reading before your next analysis.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((t, i) => (
            <article
              key={t.title}
              className="glass-card animate-rise rounded-2xl p-6 transition-transform hover:-translate-y-1"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <t.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{t.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
