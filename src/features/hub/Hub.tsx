/* ============================================================
 * Pantalla principal (sección 8): trayectoria (izq.) + personajes (der.)
 * ============================================================ */
import { Flame, Target } from "lucide-react";
import { CHARACTERS, SKILL_ORDER } from "@/data/characters";
import { ALL_NODES, PATHS } from "@/data/paths";
import { Button } from "@/components/ui/button";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { Card, CefrBadge, ProgressBar, SectionTitle } from "@/components/ludik/bits";
import { LearningPath } from "@/features/learning-path/LearningPath";
import { SkillSelector } from "@/features/skills/SkillSelector";
import { nodeStatus, pathStats } from "@/services/rules";
import { useLudik } from "@/store/ludik-store";
import type { SkillId } from "@/types/ludik";

export function Hub({ skillId, onSelect }: { skillId: SkillId | null; onSelect(id: SkillId): void }) {
  const { state } = useLudik();
  const c = skillId ? CHARACTERS[skillId] : null;
  const stats = skillId ? pathStats(PATHS[skillId], state.progress) : pathStats(ALL_NODES, state.progress);

  const subtitle = (() => {
    if (!skillId) return "Elige a tu guía para ver su camino. ¡Cada paso cuenta!";
    const path = PATHS[skillId];
    const next = path.find((_, i) => nodeStatus(path, i, state.progress, state.plan) === "available");
    if (stats.completed === 0) return `¡Empieza tu aventura con ${c!.name}! Tu primer reto te espera.`;
    if (!next) return "¡Increíble! Completaste todo lo disponible. Repite niveles para ganar más estrellas.";
    return `¡Vas muy bien! Un paso más: «${next.title}» y ganas nuevas estrellas.`;
  })();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      {/* Selector compacto: móvil y tablet, fijo bajo el header */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <SkillSelector variant="compact" value={skillId} onChange={onSelect} />
      </div>

      <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:pt-8">
        {/* ---------- COLUMNA IZQUIERDA: TRAYECTORIA ---------- */}
        <section aria-labelledby="path-title" className="min-w-0">
          <Card className="p-5 sm:p-7">
            <SectionTitle as="h1" color={c?.tone.cssVar ?? "var(--ludik-orange)"} className="text-2xl sm:text-3xl">
              <span id="path-title">{c ? c.pathTitle : "CONOCIMIENTOS GENERALES"}</span>
            </SectionTitle>
            <p className="mt-3 text-lg text-foreground">{subtitle}</p>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar
                value={stats.percent}
                color={c?.tone.cssVar}
                label={c ? `Progreso de ${c.skillEs}` : "Progreso general"}
              />
              <span className="shrink-0 font-extrabold text-strong">{stats.percent}%</span>
            </div>
            <p className="mt-1 text-sm font-bold text-ui-gray">
              {stats.completed} de {stats.total} niveles · {stats.stars} de {stats.maxStars} estrellas
            </p>
          </Card>

          <div className="mt-6">
            {skillId ? (
              <Card className="overflow-hidden px-2 py-6 sm:px-6">
                <LearningPath key={skillId} skillId={skillId} />
              </Card>
            ) : (
              <Overview onSelect={onSelect} />
            )}
          </div>
        </section>

        {/* ---------- COLUMNA DERECHA: PERSONAJES ---------- */}
        <aside aria-label="Personajes y habilidades" className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-5">
            <Card>
              <SectionTitle as="h2" className="mb-4 text-xl sm:text-2xl">
                ¿Con quién practicas hoy?
              </SectionTitle>
              <SkillSelector variant="full" value={skillId} onChange={onSelect} />
            </Card>
            <ConstancyCard />
          </div>
        </aside>
      </div>

      <div className="mt-8 lg:hidden">
        <ConstancyCard />
      </div>
    </div>
  );
}

/* Vista general cuando no hay habilidad seleccionada */
function Overview({ onSelect }: { onSelect(id: SkillId): void }) {
  const { state } = useLudik();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SKILL_ORDER.map((id) => {
        const c = CHARACTERS[id];
        const path = PATHS[id];
        const s = pathStats(path, state.progress);
        const next = path.find((_, i) => nodeStatus(path, i, state.progress, state.plan) === "available");
        return (
          <Card key={id} className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="spotlight rounded-xl">
                <CharacterArt id={id} decorative className="size-20" />
              </span>
              <div>
                <h2 className="font-display text-xl text-strong">{c.name}</h2>
                <p className={`text-sm font-extrabold ${c.tone.text}`}>
                  {c.skill} · {c.skillEs}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <ProgressBar value={s.percent} color={c.tone.cssVar} label={`Progreso con ${c.name}`} />
              <span className="text-sm font-bold text-ui-gray">
                {s.completed}/{s.total}
              </span>
            </div>
            <p className="mt-3 flex-1 text-foreground">
              {next ? (
                <>
                  Siguiente: <strong className="text-strong">{next.title}</strong>{" "}
                  <CefrBadge level={next.level} className="ml-1 px-1.5 text-xs" />
                </>
              ) : (
                "¡Todo al día por aquí!"
              )}
            </p>
            <Button variant={c.tone.buttonVariant} className="mt-4 w-full" onClick={() => onSelect(id)}>
              Practicar con {c.name}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

/* Racha y meta diaria — "constancia activa" */
function ConstancyCard() {
  const { state, streakToday, todayXp, ready } = useLudik();
  const goal = state.prefs.dailyGoalXp;
  const pct = Math.min(100, Math.round((todayXp / goal) * 100));
  return (
    <Card className="bg-orange/10">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-orange">
          <Flame aria-hidden className="size-7 fill-card text-strong" />
        </span>
        <div>
          <p className="font-display text-2xl text-strong">
            {streakToday} {streakToday === 1 ? "día" : "días"}
          </p>
          <p className="text-sm font-bold text-ui-gray">
            {ready && streakToday === 0 ? "¡Empieza una nueva racha hoy!" : `Mejor racha: ${state.streak.best} días`}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="mb-1 flex items-center gap-1.5 font-bold text-strong">
          <Target aria-hidden className="size-5 text-ink-orange" /> Meta de hoy: {todayXp}/{goal} XP
        </p>
        <ProgressBar value={pct} label="Meta diaria de XP" />
        <p className="mt-1 text-sm text-ui-gray">
          {pct >= 100 ? "¡Meta cumplida! Eres pura constancia." : "Completa un nivel para sumar a tu meta."}
        </p>
      </div>
    </Card>
  );
}
