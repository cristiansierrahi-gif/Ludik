/* ============================================================
 * Mapa de aprendizaje serpenteante (sección 8.1)
 * Estados: completado (✓ + estrellas), disponible (número + pulso),
 * bloqueado (candado), bloqueado por plan (candado + etiqueta).
 * ============================================================ */
import { Check, Crown, Gift, Lock, ClipboardCheck, Swords } from "lucide-react";
import { useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { PATHS } from "@/data/paths";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { CefrBadge, Stars } from "@/components/ludik/bits";
import { lockReason, nodeStatus } from "@/services/rules";
import { useLudik } from "@/store/ludik-store";
import { cn } from "@/lib/utils";
import type { NodeStatus, PathNode, SkillId } from "@/types/ludik";
import { LevelDialog } from "./LevelDialog";
import { PlanLockDialog } from "./PlanLockDialog";

const X_PATTERN = [50, 74, 50, 26];
const GAP = 136;
const TOP = 64;

const STATUS_TEXT: Record<NodeStatus, string> = {
  completed: "completado",
  available: "disponible",
  locked: "bloqueado",
  "plan-locked": "bloqueado por plan",
};

export function LearningPath({ skillId }: { skillId: SkillId }) {
  const { state, reducedMotion } = useLudik();
  const c = CHARACTERS[skillId];
  const path = PATHS[skillId];
  const [openNode, setOpenNode] = useState<PathNode | null>(null);
  const [planNode, setPlanNode] = useState<PathNode | null>(null);
  const [announce, setAnnounce] = useState("");

  const statuses = path.map((_, i) => nodeStatus(path, i, state.progress, state.plan));
  const currentIdx = statuses.findIndex((s) => s === "available");
  const pts = path.map((_, i) => ({ x: X_PATTERN[i % X_PATTERN.length], y: TOP + i * GAP }));
  const height = TOP + (path.length - 1) * GAP + 90;

  const seg = (i: number) => {
    const a = pts[i];
    const b = pts[i + 1];
    return `M ${a.x} ${a.y} C ${a.x} ${a.y + GAP / 2}, ${b.x} ${b.y - GAP / 2}, ${b.x} ${b.y}`;
  };

  const onNodeClick = (node: PathNode, i: number) => {
    const status = statuses[i];
    if (status === "locked") {
      setAnnounce(`Nivel ${node.order} bloqueado. ${lockReason(path, i, state.progress)}`);
      return;
    }
    setAnnounce("");
    if (status === "plan-locked") setPlanNode(node);
    else setOpenNode(node);
  };

  return (
    <div className="relative">
      <p
        aria-live="polite"
        className={cn(
          "sticky top-20 z-10 mx-auto mb-2 flex max-w-md items-start gap-2 rounded-xl border-2 border-warning bg-warning-soft px-4 py-3 font-bold text-strong shadow-card transition-opacity",
          announce ? "opacity-100" : "pointer-events-none h-0 overflow-hidden border-0 p-0 opacity-0",
        )}
      >
        {announce && (
          <>
            <Lock aria-hidden className="mt-0.5 size-5 shrink-0 text-warning" /> {announce}
          </>
        )}
      </p>

      <ol className="relative mx-auto w-full max-w-xl list-none" style={{ height }} aria-label={`Camino de ${c.name}`}>
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
        >
          {pts.slice(0, -1).map((_, i) => (
            <path
              key={`base-${i}`}
              d={seg(i)}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={12}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {pts.slice(0, -1).map((_, i) =>
            statuses[i] === "completed" ? (
              <path
                key={`done-${i}`}
                d={seg(i)}
                fill="none"
                stroke={c.tone.cssVar}
                strokeWidth={12}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <path
                key={`dash-${i}`}
                d={seg(i)}
                fill="none"
                stroke="var(--color-card)"
                strokeWidth={3}
                strokeDasharray="2 14"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ),
          )}
        </svg>

        {path.map((node, i) => {
          const status = statuses[i];
          const p = pts[i];
          const labelRight = p.x <= 50;
          const progress = state.progress[node.id];
          const TypeIcon =
            node.type === "chest" ? Gift : node.type === "boss" ? Swords : node.type === "exam" ? ClipboardCheck : null;
          const isCurrent = i === currentIdx;

          return (
            <li
              key={node.id}
              className="absolute"
              style={{ left: `${p.x}%`, top: p.y, transform: "translate(-50%, -50%)" }}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => onNodeClick(node, i)}
                  aria-disabled={status === "locked" || undefined}
                  aria-label={`Nivel ${node.order}: ${node.title}, ${node.level}. ${STATUS_TEXT[status]}${
                    progress ? `, ${progress.stars} de 3 estrellas` : ""
                  }${status === "plan-locked" && node.requiresPlan ? `. Disponible en Ludik ${node.requiresPlan === "plus" ? "Plus" : "Super"}` : ""}`}
                  className={cn(
                    "relative flex size-[76px] items-center justify-center rounded-full border-4 font-display text-2xl transition-transform",
                    status === "completed" && cn(c.tone.bg, "border-card text-strong shadow-card hover:scale-105"),
                    status === "available" &&
                      cn("border-card bg-card text-strong shadow-pop hover:scale-110", !reducedMotion && "animate-pulse-soft"),
                    status === "locked" && "cursor-not-allowed border-card bg-locked text-locked-foreground",
                    status === "plan-locked" &&
                      "border-dashed border-locked-foreground/50 bg-locked text-locked-foreground hover:scale-105",
                  )}
                  style={
                    status === "available"
                      ? { ["--node-color" as string]: c.tone.cssVar, boxShadow: `inset 0 0 0 6px ${c.tone.cssVar}` }
                      : undefined
                  }
                >
                  {status === "completed" && <Check aria-hidden className="size-9" strokeWidth={3.5} />}
                  {status === "available" &&
                    (TypeIcon ? <TypeIcon aria-hidden className="size-8" /> : <span aria-hidden>{node.order}</span>)}
                  {status === "locked" && <Lock aria-hidden className="size-7" />}
                  {status === "plan-locked" && <Crown aria-hidden className="size-7" />}
                  {TypeIcon && status !== "available" && (
                    <span className="absolute -bottom-1 -right-1 inline-flex size-7 items-center justify-center rounded-full border-2 border-card bg-strong text-card">
                      <TypeIcon aria-hidden className="size-4" />
                    </span>
                  )}
                </button>

                {/* Etiqueta del nivel */}
                <div
                  className={cn(
                    "absolute top-1/2 w-[8.5rem] -translate-y-1/2 sm:w-52",
                    labelRight ? "left-[88px]" : "right-[88px] text-right",
                  )}
                >
                  <div className={cn("flex items-center gap-1.5", !labelRight && "justify-end")}>
                    <CefrBadge level={node.level} className="px-1.5 text-xs" />
                    {status === "completed" && <Stars count={progress?.stars ?? 0} size="sm" />}
                  </div>
                  <p className="mt-0.5 text-sm font-extrabold leading-tight text-strong sm:text-base">{node.title}</p>
                  <p className="text-xs font-bold text-ui-gray sm:text-sm">
                    {status === "completed" && "Completado"}
                    {status === "available" && (isCurrent ? "¡Tu siguiente reto!" : "Disponible")}
                    {status === "locked" && "Bloqueado"}
                    {status === "plan-locked" &&
                      `Ludik ${node.requiresPlan === "plus" ? "Plus" : "Super"}`}
                  </p>
                </div>

                {/* Personaje acompaña el nodo actual */}
                {isCurrent && (
                  <div
                    aria-hidden
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2",
                      labelRight ? "right-[84px]" : "left-[84px]",
                    )}
                  >
                    <CharacterArt
                      id={skillId}
                      decorative
                      mood="animando"
                      className={cn("size-12 sm:size-16", reducedMotion && "animate-none")}
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <LevelDialog node={openNode} onClose={() => setOpenNode(null)} />
      <PlanLockDialog node={planNode} onClose={() => setPlanNode(null)} />
    </div>
  );
}
