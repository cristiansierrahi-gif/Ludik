/* Tarjeta del ejercicio al seleccionar un nivel disponible (sección 8.1). */
import { useNavigate } from "@tanstack/react-router";
import { Clock, Coins, Gift, Hammer, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { CefrBadge, Stars } from "@/components/ludik/bits";
import { CHARACTERS } from "@/data/characters";
import { getModule, isLevelPlayable } from "@/data/modules.registry";
import { useLudik } from "@/store/ludik-store";
import type { PathNode } from "@/types/ludik";

export function LevelDialog({ node, onClose }: { node: PathNode | null; onClose(): void }) {
  const { state, claimChest } = useLudik();
  const navigate = useNavigate();
  if (!node) return <Dialog open={false} />;

  const c = CHARACTERS[node.skillId];
  const mod = getModule(node.moduleId);
  const playable = isLevelPlayable(mod, node.levelId);
  const best = state.progress[node.id];
  const isChest = node.type === "chest";

  const start = () => {
    onClose();
    navigate({
      to: "/ejercicio/$skillId/$moduleId/$levelId",
      params: { skillId: node.skillId, moduleId: node.moduleId, levelId: node.levelId },
    });
  };

  const openChest = () => {
    claimChest(node);
    onClose();
    toast.success(`¡Cofre abierto! +${node.reward.coins} monedas y +${node.reward.xp} XP`);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <div className="-mx-6 -mt-6 flex items-end justify-center rounded-t-2xl spotlight pt-4">
          <CharacterArt id={node.skillId} mood="feliz" decorative className="size-32" eager />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CefrBadge level={node.level} />
          <span className="text-sm font-bold text-ui-gray">
            Nivel {node.order} · {isChest ? "Cofre" : (mod?.name ?? "Ejercicio")} · con {c.name}
          </span>
        </div>
        <DialogTitle className="font-display text-2xl font-normal text-strong">{node.title}</DialogTitle>
        <DialogDescription className="text-base text-foreground">{node.description}</DialogDescription>

        <dl className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-muted p-2">
            <dt className="flex items-center justify-center gap-1 text-xs font-bold text-ui-gray">
              <Clock aria-hidden className="size-4" /> Duración
            </dt>
            <dd className="font-extrabold text-strong">{node.minutes} min</dd>
          </div>
          <div className="rounded-xl bg-muted p-2">
            <dt className="flex items-center justify-center gap-1 text-xs font-bold text-ui-gray">
              <Sparkles aria-hidden className="size-4" /> XP
            </dt>
            <dd className="font-extrabold text-strong">+{node.reward.xp}</dd>
          </div>
          <div className="rounded-xl bg-muted p-2">
            <dt className="flex items-center justify-center gap-1 text-xs font-bold text-ui-gray">
              <Coins aria-hidden className="size-4" /> Monedas
            </dt>
            <dd className="font-extrabold text-strong">+{node.reward.coins}</dd>
          </div>
        </dl>

        {!isChest && (
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <span className="font-bold text-strong">Mejor resultado</span>
            {best ? (
              <span className="flex items-center gap-2">
                <Stars count={best.stars} /> <span className="font-bold">{best.bestScore} pts</span>
              </span>
            ) : (
              <span className="text-ui-gray">Aún no lo juegas</span>
            )}
          </div>
        )}

        {!isChest && !playable && (
          <p className="flex items-start gap-2 rounded-xl bg-warning-soft px-4 py-3 text-strong">
            <Hammer aria-hidden className="mt-0.5 size-5 shrink-0 text-warning" />
            Este ejercicio está en construcción. Puedes ver de qué se trata.
          </p>
        )}

        {isChest ? (
          best ? (
            <p className="text-center font-bold text-ui-gray">Ya abriste este cofre. ¡Sigue avanzando!</p>
          ) : (
            <Button size="lg" variant={c.tone.buttonVariant} onClick={openChest} className="w-full">
              <Gift aria-hidden /> ABRIR COFRE
            </Button>
          )
        ) : (
          <Button size="lg" onClick={start} className="w-full">
            {playable ? (best ? "REPETIR" : "COMENZAR") : "VER EJERCICIO"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
