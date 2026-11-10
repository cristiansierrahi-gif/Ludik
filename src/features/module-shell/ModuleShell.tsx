/* ============================================================
 * Marco común de los módulos (sección 6.5): cabecera mínima,
 * botón "Volver", XP global, logo inferior derecho, ErrorBoundary
 * y carga diferida con Suspense.
 * ============================================================ */
import { Component, Suspense, lazy, type ComponentType, type ReactNode } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/ludik/Logo";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { CHARACTERS } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { useLudik } from "@/store/ludik-store";
import type { ModuleEntry } from "@/data/modules.registry";
import type { ModuleProps, SkillId } from "@/types/ludik";

export function ModuleShell({
  skillId,
  title,
  children,
}: {
  skillId: SkillId;
  title: string;
  children: ReactNode;
}) {
  const { state } = useLudik();
  const c = CHARACTERS[skillId];
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6">
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-card">
        <Button asChild variant="ghost" size="sm">
          <Link to="/habilidad/$skillId" params={{ skillId }}>
            <ArrowLeft aria-hidden /> Volver
          </Link>
        </Button>
        <CharacterArt id={skillId} decorative className="size-10" />
        <p className="min-w-0 flex-1 truncate font-extrabold text-strong">
          {title} <span className={`hidden font-bold sm:inline ${c.tone.text}`}>· con {c.name}</span>
        </p>
        <span className="inline-flex items-center gap-1 font-extrabold text-strong">
          <Sparkles aria-hidden className="size-5 text-ink-blue" /> {state.xp}
          <span className="sr-only">puntos de experiencia</span>
          <span aria-hidden className="text-sm text-ui-gray">XP</span>
        </span>
      </div>
      <main id="contenido">{children}</main>
      <div className="mt-10 flex justify-end">
        <Logo size="sm" />
      </div>
    </div>
  );
}

/* ---------- ErrorBoundary por módulo ---------- */
export class ModuleErrorBoundary extends Component<
  { children: ReactNode; skillId: SkillId },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error("Error en módulo:", error);
  }
  render() {
    if (this.state.error)
      return (
        <FriendlyState
          skillId={this.props.skillId}
          title="Este ejercicio tuvo un problema"
          text="No es tu culpa. Este ejercicio aún no está listo. ¡Mientras tanto prueba otro!"
        />
      );
    return this.props.children;
  }
}

export function FriendlyState({
  skillId,
  title,
  text,
  children,
}: {
  skillId: SkillId;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-card">
      <span className="spotlight rounded-2xl px-6 pt-2">
        <CharacterArt id={skillId} mood="pensando" decorative className="size-36" />
      </span>
      <h1 className="mt-4 font-display text-2xl text-strong sm:text-3xl">{title}</h1>
      <p className="mt-2 text-lg text-foreground">{text}</p>
      {children}
      <Button asChild size="lg" className="mt-6">
        <Link to="/habilidad/$skillId" params={{ skillId }}>
          Volver al camino
        </Link>
      </Button>
    </div>
  );
}

export function ModuleLoading() {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16">
      <CharacterArt id="lexi" mood="pensando" decorative className="size-28" />
      <p className="font-bold text-strong">Lexi está preparando tu ejercicio…</p>
    </div>
  );
}

/* ---------- Carga diferida cacheada por módulo ---------- */
const lazyCache = new Map<string, ComponentType<ModuleProps>>();
export function getLazyModule(entry: ModuleEntry) {
  if (!entry.load) return null;
  let C = lazyCache.get(entry.id);
  if (!C) {
    C = lazy(entry.load);
    lazyCache.set(entry.id, C);
  }
  return C;
}

export function LazyModule({ entry, props }: { entry: ModuleEntry; props: ModuleProps }) {
  const C = getLazyModule(entry);
  if (!C) return null;
  return (
    <ModuleErrorBoundary skillId={props.skillId}>
      <Suspense fallback={<ModuleLoading />}>
        <C {...props} />
      </Suspense>
    </ModuleErrorBoundary>
  );
}
