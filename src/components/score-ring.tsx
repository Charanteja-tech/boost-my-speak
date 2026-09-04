import { useEffect, useState } from "react";

type Props = {
  value: number;
  label?: string;
  size?: number;
  stroke?: number;
  tone?: "brand" | "violet" | "amber" | "success";
  delay?: number;
  children?: React.ReactNode;
};

const toneVar: Record<NonNullable<Props["tone"]>, string> = {
  brand: "var(--brand)",
  violet: "var(--violet)",
  amber: "var(--amber)",
  success: "var(--success)",
};

export function ScoreRing({
  value,
  label,
  size = 116,
  stroke = 9,
  tone = "brand",
  delay = 0,
  children,
}: Props) {
  const [shown, setShown] = useState(0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start - delay) / 1100));
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(value * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, delay]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            stroke="color-mix(in oklab, var(--border) 90%, transparent)"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke={toneVar[tone]}
            strokeDasharray={c}
            strokeDashoffset={c - (c * shown) / 100}
            style={{ filter: `drop-shadow(0 0 10px color-mix(in oklab, ${toneVar[tone]} 55%, transparent))` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children ?? (
            <span className="font-display text-2xl font-semibold tabular-nums">
              {Math.round(shown)}
              <span className="text-sm text-muted-foreground">%</span>
            </span>
          )}
        </div>
      </div>
      {label ? (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      ) : null}
    </div>
  );
}
