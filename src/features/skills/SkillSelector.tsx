/* ============================================================
 * Selector de personajes (sección 8.2) — radiogroup accesible.
 * Seleccionado: color + cono de luz + borde + "Seleccionado".
 * Resto: escala de grises, siguen siendo clicables.
 * ============================================================ */
import { Check } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { CHARACTERS, SKILL_ORDER } from "@/data/characters";
import { PATHS } from "@/data/paths";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { ProgressBar } from "@/components/ludik/bits";
import { pathStats } from "@/services/rules";
import { useLudik } from "@/store/ludik-store";
import { cn } from "@/lib/utils";
import type { SkillId } from "@/types/ludik";

interface Props {
  value: SkillId | null;
  onChange(id: SkillId): void;
  variant: "full" | "compact";
}

export function SkillSelector({ value, onChange, variant }: Props) {
  const { state, reducedMotion } = useLudik();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusIdx = value ? SKILL_ORDER.indexOf(value) : 0;

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (delta) {
      e.preventDefault();
      const next = (i + delta + SKILL_ORDER.length) % SKILL_ORDER.length;
      refs.current[next]?.focus();
      onChange(SKILL_ORDER[next]);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(SKILL_ORDER[i]);
    }
  };

  if (variant === "compact") {
    return (
      <div
        role="radiogroup"
        aria-label="Elige un personaje y su habilidad"
        className="grid grid-cols-4 gap-2"
      >
        {SKILL_ORDER.map((id, i) => {
          const c = CHARACTERS[id];
          const selected = value === id;
          return (
            <button
              key={id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={i === focusIdx ? 0 : -1}
              onClick={() => onChange(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative flex min-h-11 flex-col items-center rounded-2xl border-2 bg-card px-1 pb-1.5 pt-1 transition-all",
                selected ? cn(c.tone.border, "spotlight shadow-card") : "border-transparent",
              )}
            >
              <CharacterArt
                id={id}
                decorative
                mood={selected ? "neutral" : "gris"}
                className={cn("size-12 sm:size-14", selected && !reducedMotion && c.reaction)}
                key={selected ? `${id}-on` : `${id}-off`}
              />
              <span className="text-sm font-extrabold text-strong">{c.name}</span>
              <span className="text-xs font-bold text-ui-gray">{c.skill}</span>
              {selected && (
                <span className="absolute -right-1 -top-1 inline-flex size-6 items-center justify-center rounded-full bg-strong text-card">
                  <Check aria-hidden className="size-4" />
                  <span className="sr-only">Seleccionado</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label="Personajes y habilidades" className="flex flex-col gap-3">
      {SKILL_ORDER.map((id, i) => {
        const c = CHARACTERS[id];
        const selected = value === id;
        const stats = pathStats(PATHS[id], state.progress);
        return (
          <button
            key={id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-describedby={`desc-${id}`}
            tabIndex={i === focusIdx ? 0 : -1}
            onClick={() => onChange(id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "group relative flex items-center gap-3 rounded-2xl border-[3px] p-3 text-left transition-all",
              selected
                ? cn(c.tone.border, "bg-card shadow-card")
                : "border-transparent bg-muted/60 hover:bg-muted",
            )}
          >
            <span
              className={cn(
                "relative flex size-24 shrink-0 items-end justify-center rounded-xl",
                selected && "spotlight",
              )}
            >
              <CharacterArt
                id={id}
                decorative
                mood={selected ? "neutral" : "gris"}
                className={cn(
                  "size-24 transition-transform group-hover:scale-105",
                  selected && !reducedMotion && c.reaction,
                )}
                key={selected ? `${id}-on` : `${id}-off`}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-display text-xl text-strong">{c.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-extrabold text-strong", c.tone.bg)}>
                  {c.skill}
                </span>
                {selected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-strong px-2 py-0.5 text-xs font-bold text-card">
                    <Check aria-hidden className="size-3.5" /> Seleccionado
                  </span>
                )}
              </span>
              <span id={`desc-${id}`} className="mt-1 block text-sm leading-snug text-foreground">
                {c.description}
              </span>
              <span className="mt-2 flex items-center gap-2">
                <ProgressBar
                  value={stats.percent}
                  color={c.tone.cssVar}
                  label={`Progreso con ${c.name}`}
                  className="h-2.5"
                />
                <span className="shrink-0 text-xs font-bold text-ui-gray">
                  {stats.completed}/{stats.total}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
