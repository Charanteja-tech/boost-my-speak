import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, RotateCcw } from "lucide-react";

export function PracticeMode({ targetSeconds }: { targetSeconds: number }) {
  const target = Math.max(30, targetSeconds);
  const [left, setLeft] = useState(target);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    setLeft(target);
    setRunning(false);
  }, [target]);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          window.clearInterval(ref.current!);
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(ref.current!);
  }, [running]);

  const pct = ((target - left) / target) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <section className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold">Practice Mode</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Deliver it out loud against your estimated slot time.
          </p>
        </div>
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            running ? "bg-destructive/15 text-destructive" : "bg-secondary text-muted-foreground"
          }`}
        >
          <Mic className="size-3.5" />
          {running ? "Recording your run" : left === 0 ? "Run complete" : "Ready"}
        </span>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <div
          className="font-display text-6xl font-semibold tabular-nums sm:text-7xl"
          style={{ textShadow: "0 0 40px color-mix(in oklab, var(--brand) 40%, transparent)" }}
        >
          {mm}:{ss}
        </div>
        <div className="mt-6 h-2 w-full max-w-xl overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[var(--gradient-brand)] transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex w-full max-w-xl justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>{Math.round(pct)}% of your slot</span>
          <span>
            {Math.floor(target / 60)}:{String(target % 60).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={left === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-40"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pause" : left === target ? "Start Practice" : "Resume"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setLeft(target);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
