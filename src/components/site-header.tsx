import { Link } from "@tanstack/react-router";
import { AudioLines } from "lucide-react";

const nav = [
  { to: "/", label: "Coach" },
  { to: "/history", label: "History" },
  { to: "/tips", label: "Tips" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl brand-gradient text-primary-foreground shadow-[var(--shadow-glow)]">
            <AudioLines className="size-5" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            SpeakUp <span className="text-gradient">AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-lg px-2.5 py-2 text-sm text-muted-foreground sm:px-3 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
