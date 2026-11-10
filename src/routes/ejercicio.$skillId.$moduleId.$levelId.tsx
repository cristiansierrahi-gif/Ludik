import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Hammer, Lock } from "lucide-react";
import { toast } from "sonner";
import { CHARACTERS, isSkillId } from "@/data/characters";
import { findNodeByModule, PATHS } from "@/data/paths";
import { getModule, isLevelPlayable } from "@/data/modules.registry";
import { planName } from "@/data/plans";
import { Button } from "@/components/ui/button";
import { CefrBadge } from "@/components/ludik/bits";
import { FriendlyState, LazyModule, ModuleShell } from "@/features/module-shell/ModuleShell";
import { lockReason, nodeStatus } from "@/services/rules";
import { useLudik } from "@/store/ludik-store";

export const Route = createFileRoute("/ejercicio/$skillId/$moduleId/$levelId")({
  head: () => ({
    meta: [
      { title: "Ejercicio · Ludik" },
      { name: "description", content: "Practica tu idioma con los minijuegos de Ludik." },
      { property: "og:title", content: "Ejercicio · Ludik" },
      { property: "og:description", content: "Practica tu idioma con los minijuegos de Ludik." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExercisePage,
});

function ExercisePage() {
  const { skillId, moduleId, levelId } = Route.useParams();
  const { state, reducedMotion, submitResult } = useLudik();
  const navigate = useNavigate();

  if (!isSkillId(skillId)) {
    return (
      <ModuleShell skillId="echo" title="Ejercicio">
        <FriendlyState skillId="echo" title="No encontramos ese ejercicio" text="Revisa el enlace o vuelve al inicio." />
      </ModuleShell>
    );
  }

  const node = findNodeByModule(skillId, moduleId, levelId);
  const entry = getModule(moduleId);
  const c = CHARACTERS[skillId];

  if (!node || !entry) {
    return (
      <ModuleShell skillId={skillId} title="Ejercicio">
        <FriendlyState
          skillId={skillId}
          title="No encontramos ese ejercicio"
          text={`Puede que se haya movido. Vuelve al camino de ${c.name} y elige otro.`}
        />
      </ModuleShell>
    );
  }

  const path = PATHS[skillId];
  const idx = path.findIndex((x) => x.id === node.id);
  const status = nodeStatus(path, idx, state.progress, state.plan);

  if (status === "plan-locked" && node.requiresPlan) {
    return (
      <ModuleShell skillId={skillId} title={node.title}>
        <FriendlyState
          skillId={skillId}
          title={`Disponible en ${planName(node.requiresPlan)}`}
          text="Este contenido es parte de un plan superior. Tus lecciones esenciales siguen siendo gratis."
        >
          <Button asChild variant="outline" className="mt-4">
            <Link to="/planes">Ver planes</Link>
          </Button>
        </FriendlyState>
      </ModuleShell>
    );
  }

  if (status === "locked") {
    return (
      <ModuleShell skillId={skillId} title={node.title}>
        <FriendlyState skillId={skillId} title="Este nivel aún está bloqueado" text={lockReason(path, idx, state.progress)}>
          <Lock aria-hidden className="mt-4 size-8 text-locked-foreground" />
        </FriendlyState>
      </ModuleShell>
    );
  }

  if (!isLevelPlayable(entry, levelId)) {
    return (
      <ModuleShell skillId={skillId} title={node.title}>
        <FriendlyState
          skillId={skillId}
          title="¡Próximamente!"
          text="Este ejercicio aún no está listo. ¡Mientras tanto prueba otro!"
        >
          <div className="mt-6 w-full rounded-2xl bg-muted p-5 text-left">
            <p className="flex items-center gap-2 text-sm font-extrabold text-ui-gray">
              <Hammer aria-hidden className="size-4" /> En construcción
            </p>
            <h2 className="mt-1 flex flex-wrap items-center gap-2 font-display text-xl text-strong">
              {entry.name} <CefrBadge level={node.level} className="text-xs" />
            </h2>
            <p className="mt-2 text-foreground">{entry.summary}</p>
          </div>
        </FriendlyState>
      </ModuleShell>
    );
  }

  return (
    <ModuleShell skillId={skillId} title={`${entry.name} · ${node.title}`}>
      <LazyModule
        entry={entry}
        props={{
          skillId,
          levelId,
          nodeId: node.id,
          language: state.prefs.studyLanguage,
          plan: state.plan,
          user: state.user,
          reducedMotion,
          onComplete: (result) => {
            submitResult(node, result);
            toast.success(`¡Guardado! +${result.xp} XP`);
          },
          onExit: () => navigate({ to: "/habilidad/$skillId", params: { skillId } }),
        }}
      />
    </ModuleShell>
  );
}
