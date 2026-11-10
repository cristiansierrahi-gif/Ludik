import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, SectionTitle } from "@/components/ludik/bits";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLudik } from "@/store/ludik-store";
import { cn } from "@/lib/utils";
import type { Preferences } from "@/types/ludik";

export const Route = createFileRoute("/ajustes")({
  head: () => ({
    meta: [
      { title: "Ajustes y accesibilidad · Ludik" },
      { name: "description", content: "Ajusta tamaño de texto, contraste, movimiento, sonido, idioma y metas diarias." },
      { property: "og:title", content: "Ajustes y accesibilidad · Ludik" },
      { property: "og:description", content: "Haz que Ludik se adapte a ti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function Choice<T extends string | number>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: { value: T; label: string; disabled?: boolean; note?: string }[];
  onChange(v: T): void;
}) {
  return (
    <fieldset>
      <legend className="font-extrabold text-strong">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={on}
              disabled={o.disabled}
              onClick={() => onChange(o.value)}
              className={cn(
                "min-h-11 rounded-xl border-2 px-4 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                on ? "border-cobalt bg-cobalt/10 text-strong" : "border-border bg-card hover:bg-muted",
              )}
            >
              {o.label}
              {o.note && <span className="ml-1 text-sm font-semibold text-ui-gray">({o.note})</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Toggle({ id, label, help, checked, onChange }: { id: string; label: string; help: string; checked: boolean; onChange(v: boolean): void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor={id} className="text-base font-extrabold text-strong">
          {label}
        </Label>
        <p id={`${id}-help`} className="text-ui-gray">
          {help}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-describedby={`${id}-help`} className="mt-1" />
    </div>
  );
}

function SettingsPage() {
  const { state, setPrefs, reset } = useLudik();
  const p = state.prefs;
  const set = (x: Partial<Preferences>) => setPrefs(x);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <SectionTitle as="h1">Ajustes</SectionTitle>

      <Card className="mt-8 space-y-6">
        <h2 className="font-display text-xl">Accesibilidad</h2>
        <Choice
          legend="Tamaño del texto"
          value={p.textSize}
          onChange={(v) => set({ textSize: v })}
          options={[
            { value: "normal", label: "Normal" },
            { value: "large", label: "Grande" },
            { value: "xlarge", label: "Muy grande" },
          ]}
        />
        <Toggle
          id="hc"
          label="Alto contraste"
          help="Textos más oscuros y bordes más marcados."
          checked={p.highContrast}
          onChange={(v) => set({ highContrast: v })}
        />
        <Toggle
          id="rm"
          label="Reducir movimiento"
          help="Desactiva animaciones y pulsos. También respetamos la opción de tu dispositivo."
          checked={p.reducedMotion}
          onChange={(v) => set({ reducedMotion: v })}
        />
        <Toggle
          id="snd"
          label="Sonido y efectos"
          help="Sonidos de acierto y celebración en los ejercicios."
          checked={p.sound}
          onChange={(v) => set({ sound: v })}
        />
      </Card>

      <Card className="mt-6 space-y-6">
        <h2 className="font-display text-xl">Idioma</h2>
        <Choice
          legend="Idioma de la interfaz"
          value={p.uiLanguage}
          onChange={(v) => set({ uiLanguage: v })}
          options={[
            { value: "es", label: "Español" },
            { value: "en", label: "English", disabled: true, note: "próximamente" },
            { value: "fr", label: "Français", disabled: true, note: "bientôt" },
          ]}
        />
        <Choice
          legend="Idioma que estudias"
          value={p.studyLanguage}
          onChange={(v) => set({ studyLanguage: v })}
          options={[
            { value: "en", label: "Inglés" },
            { value: "fr", label: "Francés", disabled: true, note: "próximamente" },
          ]}
        />
      </Card>

      <Card className="mt-6 space-y-6">
        <h2 className="font-display text-xl">Constancia</h2>
        <Choice
          legend="Meta diaria de XP"
          value={p.dailyGoalXp}
          onChange={(v) => set({ dailyGoalXp: v })}
          options={[
            { value: 50, label: "Relajada · 50" },
            { value: 100, label: "Normal · 100" },
            { value: 200, label: "Intensa · 200" },
          ]}
        />
        <Toggle
          id="rem"
          label="Recordatorios amables"
          help="Te recordaremos practicar para no perder tu racha (solo con tu permiso)."
          checked={p.reminders}
          onChange={(v) => set({ reminders: v })}
        />
      </Card>

      <Card className="mt-6">
        <h2 className="font-display text-xl">Datos de demostración</h2>
        <p className="mt-2">Vuelve al progreso de ejemplo inicial. Esta acción no se puede deshacer.</p>
        {confirmReset ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                reset();
                setConfirmReset(false);
                toast.success("Progreso reiniciado");
              }}
            >
              Sí, reiniciar
            </Button>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Cancelar
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="mt-4" onClick={() => setConfirmReset(true)}>
            Reiniciar progreso
          </Button>
        )}
      </Card>
    </div>
  );
}
