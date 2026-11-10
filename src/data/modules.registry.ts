/* ============================================================
 * Registro de módulos (sección 6.3)
 * Agregar un módulo = crear su carpeta en src/modules/<id>/ con un
 * componente por defecto (contrato ModuleProps) y añadir aquí `load`.
 * Los módulos sin `load` muestran la página "Próximamente".
 * ============================================================ */
import type { ComponentType } from "react";
import type { ModuleProps, SkillId } from "@/types/ludik";

export interface ModuleEntry {
  id: string;
  name: string;
  skillId: SkillId | "any";
  summary: string;
  /** Niveles con contenido jugable. Vacío = todos los del módulo, si existe `load`. */
  availableLevels?: string[];
  load?: () => Promise<{ default: ComponentType<ModuleProps> }>;
}

export const MODULES: Record<string, ModuleEntry> = {
  "echo-listening-challenge": {
    id: "echo-listening-challenge",
    name: "Listening Challenge",
    skillId: "echo",
    summary:
      "Escucha un audio y responde 4 preguntas: opción múltiple, palabras escuchadas, verdadero/falso y completar frases. Niveles A1, B1 y C1.",
  },
  "echo-listen-up-rpg": {
    id: "echo-listen-up-rpg",
    name: "Listen Up! Ultimate Battle RPG",
    skillId: "echo",
    summary:
      "Un RPG de combate por regiones (Bosque Encantado, Tierras del Volcán, Reino Helado) donde cada ataque depende de lo que escuchas.",
  },
  "lexi-repairing-library": {
    id: "lexi-repairing-library",
    name: "Lexi: Reparando la Biblioteca",
    skillId: "lexi",
    summary:
      "Ayuda a Lexi a reparar su biblioteca: lee y responde, completa frases y caza errores gramaticales. Niveles A1 a C1.",
  },
  "tinta-english-ink": {
    id: "tinta-english-ink",
    name: "English Ink",
    skillId: "tinta",
    summary:
      "Escribe las frases en inglés antes de que la tinta las alcance. Rachas, alertas y el poder especial Ink Storm.",
  },
  "fono-voice-echo": {
    id: "fono-voice-echo",
    name: "Eco de Voz",
    skillId: "fono",
    summary:
      "Fono te escucha: escucha y repite, lee en voz alta y responde. Funciona también sin micrófono con autoevaluación.",
  },
  "weekly-exam": {
    id: "weekly-exam",
    name: "Evaluación semanal",
    skillId: "any",
    summary: "Exámenes semanales para medir tu avance (Ludik Plus).",
  },
  "official-mock": {
    id: "official-mock",
    name: "Simulacro oficial",
    skillId: "any",
    summary: "Simulacros enfocados en exámenes oficiales de lenguaje (Ludik Super).",
  },
  "advanced-training": {
    id: "advanced-training",
    name: "Entrenamiento avanzado",
    skillId: "any",
    summary: "Entrenamientos especiales y avanzados (Ludik Super).",
  },
};

export const getModule = (id: string): ModuleEntry | undefined => MODULES[id];

export const isLevelPlayable = (entry: ModuleEntry | undefined, levelId: string) => {
  if (!entry?.load) return false;
  return !entry.availableLevels || entry.availableLevels.includes(levelId);
};
