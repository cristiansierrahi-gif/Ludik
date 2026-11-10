/* Tarjeta amable para contenido de un plan superior (sección 10.2). */
import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlanLockTag } from "@/components/ludik/bits";
import { PLANS } from "@/data/plans";
import type { PathNode } from "@/types/ludik";

export function PlanLockDialog({ node, onClose }: { node: PathNode | null; onClose(): void }) {
  if (!node?.requiresPlan) return <Dialog open={false} />;
  const plan = PLANS.find((p) => p.id === node.requiresPlan)!;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <div className={`-mx-6 -mt-6 flex justify-center rounded-t-2xl py-6 ${plan.tone.soft}`}>
          <span className={`inline-flex size-16 items-center justify-center rounded-full ${plan.tone.bg}`}>
            <Crown aria-hidden className="size-8 text-strong" />
          </span>
        </div>
        <PlanLockTag plan={plan.id} />
        <DialogTitle className="font-display text-2xl font-normal text-strong">{node.title}</DialogTitle>
        <DialogDescription className="text-base text-foreground">
          {node.description} Puedes seguir aprendiendo gratis con todas las lecciones esenciales; cuando quieras ir
          más allá, {plan.name} te espera.
        </DialogDescription>
        <ul className="list-disc space-y-1 pl-5">
          {plan.includes.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="flex-1" variant={plan.tone.button}>
            <Link to="/planes" onClick={onClose}>
              Ver planes
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="flex-1" onClick={onClose}>
            Ahora no
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
