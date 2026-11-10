import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { toast } from "sonner";
import { FEATURES, PLANS, formatCop, hasPlan } from "@/data/plans";
import { SectionTitle } from "@/components/ludik/bits";
import { Button } from "@/components/ui/button";
import { useLudik } from "@/store/ludik-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planes")({
  head: () => ({
    meta: [
      { title: "Planes Ludik · Gratis, Plus y Super" },
      {
        name: "description",
        content: "Compara Ludik Gratis, Ludik Plus ($30.000) y Ludik Super ($50.000) y elige tu plan.",
      },
      { property: "og:title", content: "Planes Ludik · Gratis, Plus y Super" },
      { property: "og:description", content: "Aprende gratis o desbloquea exámenes, IA y simulacros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  const { state, setPlan } = useLudik();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionTitle as="h1" center>
        Elige tu plan
      </SectionTitle>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg">
        Las cuatro habilidades y las lecciones esenciales siempre son gratis. Precios en pesos colombianos.
      </p>

      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => {
          const current = state.plan === p.id;
          return (
            <li
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-3xl border-[3px] bg-card p-6 shadow-card",
                current ? p.tone.border : "border-border",
              )}
            >
              {current && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-strong px-3 py-1 text-sm font-bold text-card">
                  <Check aria-hidden className="size-4" /> Tu plan actual
                </span>
              )}
              <div className={cn("-mx-6 -mt-6 rounded-t-[1.3rem] px-6 pb-5 pt-7", p.tone.soft)}>
                <h2 className="font-display text-2xl text-strong">{p.name}</h2>
                <p className="mt-2">
                  <span className="text-4xl font-black text-strong">{formatCop(p.price)}</span>
                  {p.price > 0 && <span className="font-bold text-ui-gray"> COP / {p.period}</span>}
                </p>
              </div>
              <ul className="mt-5 flex-1 space-y-3">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-2">
                    <Check aria-hidden className="mt-1 size-5 shrink-0 text-success" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                variant={current ? "outline" : p.tone.button}
                className="mt-6 w-full"
                disabled={current}
                onClick={() => {
                  setPlan(p.id);
                  toast.success(`Ahora tienes ${p.name}`, {
                    description: "Modo demostración: no se realizó ningún cobro.",
                  });
                }}
              >
                {current ? "Plan actual" : "Elegir plan"}
              </Button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-center text-sm text-ui-gray">
        Modo demostración: la pasarela de pago se conectará más adelante. Elegir un plan aquí solo cambia tu acceso de
        prueba.
      </p>

      <section aria-labelledby="comparar" className="mt-14">
        <SectionTitle>
          <span id="comparar">Compara los planes</span>
        </SectionTitle>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[560px] text-left">
            <caption className="sr-only">Funciones incluidas en cada plan</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="p-4 font-extrabold text-strong">
                  Función
                </th>
                {PLANS.map((p) => (
                  <th key={p.id} scope="col" className="p-4 text-center font-extrabold text-strong">
                    {p.name.replace("Ludik ", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0">
                  <th scope="row" className="p-4 font-semibold text-strong">
                    {f.label}
                  </th>
                  {PLANS.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      {hasPlan(p.id, f.minPlan) ? (
                        <span className="inline-flex items-center gap-1 font-bold text-success">
                          <Check aria-hidden className="size-5" /> <span className="sr-only">Incluido</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-ui-gray">
                          <Minus aria-hidden className="size-5" /> <span className="sr-only">No incluido</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
