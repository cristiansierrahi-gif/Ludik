import { createFileRoute, Link } from "@tanstack/react-router";
import { Coins, Crosshair, Flame, Lock, Sparkles, Target, Trophy, Wand2 } from "lucide-react";
import { CHARACTERS, SKILL_ORDER } from "@/data/characters";
import { ALL_NODES, PATHS, findNode } from "@/data/paths";
import { hasFeature } from "@/data/plans";
import { Card, CefrBadge, PlanLockTag, ProgressBar, SectionTitle, Stars } from "@/components/ludik/bits";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { Button } from "@/components/ui/button";
import { accuracy, highestLevel, pathStats, topFailedTopics } from "@/services/rules";
import { aiService } from "@/services/services";
import { useLudik } from "@/store/ludik-store";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso · Ludik" },
      { name: "description", content: "Tu XP, racha, precisión y avance por habilidad en Ludik." },
      { property: "og:title", content: "Mi progreso · Ludik" },
      { property: "og:description", content: "Revisa tu avance en escucha, lectura, escritura y habla." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Flame; label: string; value: string; tone: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full ${tone}`}>
        <Icon aria-hidden className="size-6 text-strong" />
      </span>
      <div>
        <p className="text-sm font-bold text-ui-gray">{label}</p>
        <p className="font-display text-2xl text-strong">{value}</p>
      </div>
    </Card>
  );
}

function ProgressPage() {
  const { state, streakToday, todayXp, ready } = useLudik();
  const overall = pathStats(ALL_NODES, state.progress);
  const failed = topFailedTopics(state.results);
  const canAi = hasFeature(state.plan, "adaptiveAi");
  const recs = canAi ? aiService.getRecommendation(state) : [];
  const history = [...state.results].reverse().slice(0, 8);
  const goalPct = Math.min(100, Math.round((todayXp / state.prefs.dailyGoalXp) * 100));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionTitle as="h1">Mi progreso</SectionTitle>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Sparkles} label="XP total" value={state.xp.toLocaleString("es-CO")} tone="bg-blue" />
        <Stat icon={Coins} label="Monedas" value={String(state.coins)} tone="bg-yellow" />
        <Stat icon={Flame} label={`Racha (mejor: ${state.streak.best})`} value={`${streakToday} días`} tone="bg-orange" />
        <Stat icon={Crosshair} label="Precisión" value={`${accuracy(state.results)}%`} tone="bg-teal" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="font-display text-xl text-strong">Avance general</h2>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={overall.percent} label="Avance general" />
            <span className="font-extrabold text-strong">{overall.percent}%</span>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {SKILL_ORDER.map((id) => {
              const c = CHARACTERS[id];
              const s = pathStats(PATHS[id], state.progress);
              return (
                <li key={id} className={`flex items-center gap-3 rounded-2xl p-3 ${c.tone.softBg}`}>
                  <CharacterArt id={id} decorative className="size-16" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-extrabold text-strong">
                      {c.name} · {c.skillEs}
                    </p>
                    <ProgressBar value={s.percent} color={c.tone.cssVar} label={`Avance con ${c.name}`} className="mt-1.5" />
                    <p className="mt-1 flex items-center gap-2 text-sm font-bold text-ui-gray">
                      {s.completed}/{s.total} niveles · Nivel alcanzado:{" "}
                      {highestLevel(PATHS[id], state.progress) === "—" ? (
                        "—"
                      ) : (
                        <CefrBadge level={highestLevel(PATHS[id], state.progress)} className="px-1.5 text-xs" />
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-display text-xl text-strong">
            <Target aria-hidden className="size-6 text-ink-orange" /> Meta diaria
          </h2>
          <p className="mt-2 text-lg font-bold text-strong">
            {todayXp} / {state.prefs.dailyGoalXp} XP hoy
          </p>
          <ProgressBar value={goalPct} label="Meta diaria" className="mt-2" />
          <p className="mt-2 text-ui-gray">Puedes cambiar tu meta en Ajustes.</p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/ajustes">Cambiar meta</Link>
          </Button>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl text-strong">¿Qué practicar?</h2>
          {failed.length ? (
            <ul className="mt-4 space-y-2">
              {failed.map(([topic, n]) => (
                <li key={topic} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span className="font-bold text-strong">Repasa: {topic}</span>
                  <span className="text-sm font-bold text-ui-gray">
                    {n} {n === 1 ? "fallo" : "fallos"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3">¡Sin temas pendientes! Sigue así.</p>
          )}
        </Card>

        <Card>
          <h2 className="flex flex-wrap items-center gap-2 font-display text-xl text-strong">
            <Wand2 aria-hidden className="size-6 text-ink-blue" /> Tu ruta recomendada
            {!canAi && <PlanLockTag plan="plus" />}
          </h2>
          {canAi ? (
            <ul className="mt-4 space-y-2">
              {recs.map((r) => (
                <li key={r.title} className={`rounded-xl px-4 py-3 ${CHARACTERS[r.skillId].tone.softBg}`}>
                  <p className="font-extrabold text-strong">{r.title}</p>
                  <p className="text-sm">{r.reason}</p>
                </li>
              ))}
              <li className="text-sm text-ui-gray">Recomendaciones por reglas, según tu historial.</li>
            </ul>
          ) : (
            <div className="mt-3">
              <p>Ludik Plus analiza tu historial y te sugiere qué practicar a tu ritmo.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/planes">
                  <Lock aria-hidden /> Ver Ludik Plus
                </Link>
              </Button>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-xl text-strong">
          <Trophy aria-hidden className="size-6 text-ink-yellow" /> Historial de actividad
        </h2>
        {history.length ? (
          <ul className="mt-4 divide-y divide-border">
            {history.map((r, i) => {
              const node = findNode(r.nodeId);
              return (
                <li key={`${r.nodeId}-${r.date}-${i}`} className="flex flex-wrap items-center gap-3 py-3">
                  <CharacterArt id={r.skillId} decorative className="size-10" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-strong">{node?.title ?? r.moduleId}</p>
                    <p className="text-sm text-ui-gray">
                      {ready ? new Date(r.date).toLocaleDateString("es-CO", { day: "numeric", month: "long" }) : ""}
                      {r.total > 0 && ` · ${r.correct}/${r.total} aciertos`}
                    </p>
                  </div>
                  <Stars count={r.stars} size="sm" />
                  <span className="font-extrabold text-strong">+{r.xp} XP</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3">Aún no tienes actividad. ¡Completa tu primer nivel!</p>
        )}
      </Card>
    </div>
  );
}
