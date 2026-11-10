import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, Coins, Ear, Flame, Lock, Mic, PenLine, Star, Trophy } from "lucide-react";
import { BADGES, CERTIFICATE_NODES } from "@/data/badges";
import { Card, ProgressBar, SectionTitle } from "@/components/ludik/bits";
import { Logo } from "@/components/ludik/Logo";
import { useLudik } from "@/store/ludik-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/logros")({
  head: () => ({
    meta: [
      { title: "Logros e insignias · Ludik" },
      { name: "description", content: "Tus insignias, certificado y ranking semanal en Ludik." },
      { property: "og:title", content: "Logros e insignias · Ludik" },
      { property: "og:description", content: "Gana insignias, sube en el ranking y desbloquea tu certificado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AchievementsPage,
});

const ICONS = { flame: Flame, star: Star, ear: Ear, book: BookOpen, pen: PenLine, mic: Mic, trophy: Trophy, coins: Coins };

// Ranking semanal (datos de ejemplo)
const RANKING = [
  { name: "Mateo G.", xp: 980 },
  { name: "Valentina R.", xp: 870 },
  { name: "Samuel P.", xp: 610 },
  { name: "Isabella M.", xp: 540 },
  { name: "Juan D.", xp: 420 },
];

function AchievementsPage() {
  const { state } = useLudik();
  const earned = BADGES.filter((b) => b.earned(state));
  const certDone = CERTIFICATE_NODES.filter((n) => (state.progress[n.id]?.stars ?? 0) > 0).length;
  const certPct = Math.round((certDone / CERTIFICATE_NODES.length) * 100);
  const certUnlocked = certDone === CERTIFICATE_NODES.length;
  const weekXp = state.results
    .filter((r) => Date.now() - Date.parse(r.date) < 7 * 86_400_000)
    .reduce((a, r) => a + r.xp, 0);
  const ranking = [...RANKING, { name: `${state.user.name} (tú)`, xp: weekXp, me: true }].sort((a, b) => b.xp - a.xp);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionTitle as="h1">Logros</SectionTitle>
      <p className="mt-4 text-lg">
        Tienes <strong className="text-strong">{earned.length}</strong> de {BADGES.length} insignias.
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {BADGES.map((b) => {
          const on = b.earned(state);
          const Icon = ICONS[b.icon];
          return (
            <li
              key={b.id}
              className={cn(
                "flex flex-col items-center rounded-2xl border-2 bg-card p-4 text-center shadow-card",
                on ? "border-transparent" : "border-dashed border-border",
              )}
            >
              <span
                className={cn(
                  "relative inline-flex size-16 items-center justify-center rounded-full",
                  on ? b.tone : "bg-locked",
                )}
              >
                <Icon aria-hidden className={cn("size-8", on ? "text-strong" : "text-locked-foreground")} />
                {!on && (
                  <span className="absolute -bottom-1 -right-1 inline-flex size-7 items-center justify-center rounded-full bg-strong text-card">
                    <Lock aria-hidden className="size-4" />
                  </span>
                )}
              </span>
              <p className="mt-2 font-extrabold text-strong">{b.name}</p>
              <p className="text-sm text-ui-gray">{on ? "¡Ganada!" : b.requirement}</p>
              <span className="sr-only">{on ? "Insignia ganada" : "Insignia bloqueada"}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card className="relative overflow-hidden">
          <h2 className="flex items-center gap-2 font-display text-xl text-strong">
            <Award aria-hidden className="size-6 text-ink-orange" /> Certificado A1
          </h2>
          <div
            className={cn(
              "mt-4 rounded-2xl border-4 border-double p-6 text-center",
              certUnlocked ? "border-orange bg-yellow/20" : "border-border bg-muted grayscale",
            )}
          >
            <Logo size="md" />
            <p className="mt-3 font-display text-2xl text-strong">Certificado de logro</p>
            <p className="mt-1">Nivel A1 · Escucha, lectura, escritura y habla</p>
            <p className="mt-3 font-extrabold text-strong">{state.user.name}</p>
            {!certUnlocked && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-strong px-3 py-1 text-sm font-bold text-card">
                <Lock aria-hidden className="size-4" /> Bloqueado
              </p>
            )}
          </div>
          <p className="mt-4 font-bold text-strong">
            Completa todos los niveles A1 de las cuatro habilidades ({certDone}/{CERTIFICATE_NODES.length})
          </p>
          <ProgressBar value={certPct} label="Avance hacia el certificado" className="mt-2" />
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-display text-xl text-strong">
            <Trophy aria-hidden className="size-6 text-ink-yellow" /> Ranking semanal
          </h2>
          <p className="text-sm text-ui-gray">Datos de ejemplo</p>
          <ol className="mt-4 space-y-2">
            {ranking.map((r, i) => (
              <li
                key={r.name}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5",
                  "me" in r ? "bg-orange/20 font-extrabold" : "bg-muted",
                )}
              >
                <span className="w-6 font-display text-lg text-strong">{i + 1}</span>
                <span className="flex-1 text-strong">{r.name}</span>
                <span className="font-bold text-strong">{r.xp} XP</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
