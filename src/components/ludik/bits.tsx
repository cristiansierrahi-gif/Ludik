/* Piezas pequeñas reutilizables: títulos con barra, estrellas, etiquetas, barras de progreso. */
import { Star, Lock } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { planName } from "@/data/plans";
import { CEFR_TONE } from "@/data/characters";
import type { PlanId } from "@/types/ludik";

export function SectionTitle({
  children,
  color = "var(--ludik-orange)",
  as: Tag = "h2",
  center,
  className,
}: {
  children: ReactNode;
  color?: string;
  as?: "h1" | "h2" | "h3";
  center?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-display tracking-wide text-strong title-bar",
        center && "title-bar-center text-center",
        Tag === "h1" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
        className,
      )}
      style={{ ["--bar-color" as string]: color }}
    >
      {children}
    </Tag>
  );
}

export function Stars({ count, max = 3, size = "md" }: { count: number; max?: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "size-4" : "size-5";
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} de ${max} estrellas`} role="img">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(s, i < count ? "fill-yellow text-ink-yellow" : "fill-transparent text-locked-foreground/50")}
        />
      ))}
    </span>
  );
}

export function CefrBadge({ level, className }: { level: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-9 items-center justify-center rounded-full px-2 py-0.5 text-sm font-extrabold",
        CEFR_TONE[level] ?? "bg-muted text-strong",
        className,
      )}
    >
      {level}
    </span>
  );
}

export function PlanTag({ plan, className }: { plan: PlanId; className?: string }) {
  const tone = { free: "bg-teal", plus: "bg-orange", super: "bg-yellow" }[plan];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-extrabold text-strong", tone, className)}>
      {planName(plan).replace("Ludik ", "")}
    </span>
  );
}

export function PlanLockTag({ plan }: { plan: PlanId }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-strong px-2.5 py-0.5 text-sm font-bold text-card">
      <Lock aria-hidden className="size-3.5" /> Disponible en {planName(plan)}
    </span>
  );
}

export function ProgressBar({
  value,
  color = "var(--ludik-orange)",
  label,
  className,
}: {
  value: number;
  color?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn("h-3.5 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border", className)}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{ width: `${Math.max(value, value > 0 ? 4 : 0)}%`, background: color }}
      />
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}>{children}</div>;
}
