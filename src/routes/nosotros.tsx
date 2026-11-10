import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Compass, Gamepad2, Flame } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CHARACTERS, SKILL_ORDER } from "@/data/characters";
import { PLANS, formatCop } from "@/data/plans";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { Logo } from "@/components/ludik/Logo";
import { SectionTitle } from "@/components/ludik/bits";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SkillId } from "@/types/ludik";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros · Misión, visión y valores de Ludik" },
      {
        name: "description",
        content:
          "Conoce la misión, visión y valores de Ludik, nuestra marca y a Echo, Lexi, Tinta y Fono.",
      },
      { property: "og:title", content: "Nosotros · Ludik" },
      {
        property: "og:description",
        content: "Transformamos el aprendizaje de idiomas en una aventura dinámica y accesible.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function Block({
  id,
  title,
  color,
  soft,
  character,
  children,
  reverse,
}: {
  id: string;
  title: string;
  color: string;
  soft: string;
  character: SkillId;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section aria-labelledby={id} className={cn("rounded-3xl p-6 sm:p-10", soft)}>
      <div className={cn("flex flex-col items-center gap-6 md:flex-row", reverse && "md:flex-row-reverse")}>
        <div className="flex-1">
          <SectionTitle color={color}>
            <span id={id}>{title}</span>
          </SectionTitle>
          <div className="mt-5 text-lg leading-relaxed text-strong">{children}</div>
        </div>
        <CharacterArt id={character} mood="feliz" className="size-44 shrink-0 sm:size-56" />
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="text-center">
        <Logo size="lg" />
        <p className="mt-4 font-display text-2xl text-strong">Una forma divertida de aprender</p>
      </header>

      <Block id="mision" title="Misión" color="var(--ludik-teal)" soft="bg-teal/15" character="echo">
        <p>
          Transformar el aprendizaje de idiomas en una aventura dinámica y accesible. En Ludik, cada estudiante toma
          el control de su propio ritmo, explorando habilidades de escucha, lectura, escritura y habla mediante retos
          interactivos que convierten la práctica diaria en una experiencia natural y divertida.
        </p>
      </Block>

      <Block id="vision" title="Visión" color="var(--ludik-yellow)" soft="bg-yellow/25" character="lexi" reverse>
        <p>
          Ser la empresa líder en aprendizaje en Colombia, teniendo un registro de estudiantes de 200.000 para 2029.
          Logrando aportar a escuelas y universidades a mejorar el nivel de inglés y francés.
        </p>
      </Block>

      <Block id="valores" title="Valores" color="var(--ludik-blue)" soft="bg-blue/15" character="fono">
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Compass, name: "Autonomía", text: "Tú eliges habilidad, nivel y ritmo." },
            { icon: Gamepad2, name: "Gamificación", text: "XP, estrellas, insignias y personajes." },
            { icon: Flame, name: "Constancia activa", text: "Rachas y metas diarias amables." },
          ].map((v) => (
            <li key={v.name} className="rounded-2xl bg-card p-4 shadow-card">
              <v.icon aria-hidden className="size-7 text-ink-blue" />
              <p className="mt-2 font-display text-lg">{v.name}</p>
              <p className="text-base text-foreground">{v.text}</p>
            </li>
          ))}
        </ul>
      </Block>

      <section aria-labelledby="marca" className="rounded-3xl bg-salmon/15 p-6 sm:p-10">
        <SectionTitle color="var(--ludik-salmon)">
          <span id="marca">Nuestra marca</span>
        </SectionTitle>
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-6 shadow-card">
            <Logo size="lg" />
            <p className="mt-3 text-sm font-bold text-ui-gray">Logotipo</p>
          </div>
          <div>
            <p className="font-extrabold text-strong">Color principal</p>
            <Swatch className="bg-orange" name="Naranja Ludik" hex="#FC9645" big />
            <p className="mt-4 font-extrabold text-strong">Colores secundarios</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Swatch className="bg-teal" name="Verde azulado" hex="#5FCBB5" />
              <Swatch className="bg-blue" name="Azul" hex="#42B3F4" />
              <Swatch className="bg-yellow" name="Amarillo" hex="#FDD583" />
              <Swatch className="bg-salmon" name="Salmón" hex="#F9937A" />
            </div>
          </div>
        </div>
      </section>

      <WhoAreThey />

      <section aria-labelledby="planes-resumen" className="rounded-3xl bg-card p-6 shadow-card sm:p-10">
        <SectionTitle>
          <span id="planes-resumen">Planes</span>
        </SectionTitle>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {PLANS.map((p) => (
            <li key={p.id} className={cn("rounded-2xl border-[3px] p-5", p.tone.border, p.tone.soft)}>
              <p className="font-display text-xl text-strong">{p.name}</p>
              <p className="mt-1 text-2xl font-black text-strong">{formatCop(p.price)}</p>
            </li>
          ))}
        </ul>
        <Button asChild size="lg" className="mt-6">
          <Link to="/planes">Ver detalles de los planes</Link>
        </Button>
      </section>

      <p className="py-6 text-center font-display text-3xl text-strong">Te esperamos para que estudiemos juntos</p>
    </div>
  );
}

function Swatch({ className, name, hex, big }: { className: string; name: string; hex: string; big?: boolean }) {
  return (
    <div className={cn("mt-2 overflow-hidden rounded-2xl bg-card shadow-card", big && "max-w-xs")}>
      <div className={cn(className, big ? "h-20" : "h-16")} aria-hidden />
      <div className="px-3 py-2">
        <p className="text-sm font-extrabold text-strong">{name}</p>
        <p className="font-mono text-sm text-ui-gray">{hex}</p>
      </div>
    </div>
  );
}

/* ¿Quiénes son? — reflector sobre el personaje elegido, los demás en gris */
function WhoAreThey() {
  const [sel, setSel] = useState<SkillId>("echo");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const next = (i + d + 4) % 4;
    refs.current[next]?.focus();
    setSel(SKILL_ORDER[next]);
  };
  const c = CHARACTERS[sel];
  return (
    <section aria-labelledby="quienes" className="rounded-3xl bg-card p-6 shadow-card sm:p-10">
      <SectionTitle>
        <span id="quienes">¿Quiénes son?</span>
      </SectionTitle>
      <div role="radiogroup" aria-label="Personajes de Ludik" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SKILL_ORDER.map((id, i) => {
          const ch = CHARACTERS[id];
          const on = sel === id;
          return (
            <button
              key={id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setSel(id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative flex flex-col items-center rounded-2xl border-[3px] p-3 transition-all",
                on ? cn(ch.tone.border, "spotlight") : "border-transparent hover:bg-muted",
              )}
            >
              <CharacterArt id={id} decorative mood={on ? "feliz" : "gris"} className="size-28 sm:size-36" key={`${id}-${on}`} />
              <span className="font-display text-xl text-strong">{ch.name}</span>
              <span className="text-sm font-extrabold text-ui-gray">{ch.skill}</span>
              {on && (
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-strong px-2 py-0.5 text-xs font-bold text-card">
                  <Check aria-hidden className="size-3.5" /> Seleccionado
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className={cn("mt-5 rounded-2xl p-5 text-lg text-strong", c.tone.softBg)}>
        <strong>{c.name}:</strong> {c.description}
      </p>
    </section>
  );
}
