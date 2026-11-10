/* ============================================================
 * Los cuatro personajes oficiales de Ludik (sección 1.6)
 * Ilustraciones provisionales generadas; reemplazar por las oficiales.
 * ============================================================ */
import echoImg from "@/assets/char-echo.png";
import lexiImg from "@/assets/char-lexi.png";
import tintaImg from "@/assets/char-tinta.png";
import fonoImg from "@/assets/char-fono.png";
import type { SkillId } from "@/types/ludik";

export interface Character {
  id: SkillId;
  name: string;
  skill: string; // en inglés, como en la marca
  skillEs: string;
  pathTitle: string;
  description: string;
  image: string;
  /** Clases de color (tokens del sistema de diseño). */
  tone: {
    bg: string;
    softBg: string;
    text: string;
    border: string;
    ring: string;
    cssVar: string;
    buttonVariant: "teal" | "yellow" | "salmon" | "blue";
  };
  /** Animación breve de reacción. */
  reaction: string;
}

export const CHARACTERS: Record<SkillId, Character> = {
  echo: {
    id: "echo",
    name: "Echo",
    skill: "LISTENING",
    skillEs: "Escucha",
    pathTitle: "LISTENING — Escucha con Echo",
    description:
      "Es el monstruo de la escucha, ¡listo para convertirte en un maestro del oído y comprensión!",
    image: echoImg,
    tone: {
      bg: "bg-teal",
      softBg: "bg-teal/15",
      text: "text-ink-teal",
      border: "border-teal",
      ring: "ring-teal",
      cssVar: "var(--ludik-teal)",
      buttonVariant: "teal",
    },
    reaction: "animate-wiggle",
  },
  lexi: {
    id: "lexi",
    name: "Lexi",
    skill: "READING",
    skillEs: "Lectura",
    pathTitle: "READING — Lee con Lexi",
    description:
      "Es un robot genial que te echará una mano con la comprensión lectora y la gramática de tus frases.",
    image: lexiImg,
    tone: {
      bg: "bg-yellow",
      softBg: "bg-yellow/25",
      text: "text-ink-yellow",
      border: "border-yellow",
      ring: "ring-yellow",
      cssVar: "var(--ludik-yellow)",
      buttonVariant: "yellow",
    },
    reaction: "animate-bob",
  },
  tinta: {
    id: "tinta",
    name: "Tinta",
    skill: "WRITING",
    skillEs: "Escritura",
    pathTitle: "WRITING — Escribe con Tinta",
    description:
      "¡Es un robot pulpo que con sus muchos brazos te enseñará a escribir y ampliar tu vocabulario!",
    image: tintaImg,
    tone: {
      bg: "bg-salmon",
      softBg: "bg-salmon/15",
      text: "text-ink-salmon",
      border: "border-salmon",
      ring: "ring-salmon",
      cssVar: "var(--ludik-salmon)",
      buttonVariant: "salmon",
    },
    reaction: "animate-wiggle",
  },
  fono: {
    id: "fono",
    name: "Fono",
    skill: "SPEAKING",
    skillEs: "Habla",
    pathTitle: "SPEAKING — Habla con Fono",
    description:
      "Un micrófono que te adora, listo para corregirte y afinar tu pronunciación con cariño.",
    image: fonoImg,
    tone: {
      bg: "bg-blue",
      softBg: "bg-blue/15",
      text: "text-ink-blue",
      border: "border-blue",
      ring: "ring-blue",
      cssVar: "var(--ludik-blue)",
      buttonVariant: "blue",
    },
    reaction: "animate-wiggle",
  },
};

export const SKILL_ORDER: SkillId[] = ["echo", "lexi", "tinta", "fono"];

export const isSkillId = (v: string): v is SkillId => (SKILL_ORDER as string[]).includes(v);

/** Colores por nivel MCER (insignias). */
export const CEFR_TONE: Record<string, string> = {
  A1: "bg-teal text-strong",
  A2: "bg-yellow text-strong",
  B1: "bg-blue text-strong",
  B2: "bg-salmon text-strong",
  C1: "bg-orange text-strong",
};
