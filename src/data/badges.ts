/* ============================================================
 * Insignias (sección 9.4 / 11). Cada regla se evalúa sobre el estado.
 * ============================================================ */
import type { LudikState, SkillId } from "@/types/ludik";
import { PATHS } from "./paths";

export interface Badge {
  id: string;
  name: string;
  requirement: string;
  icon: "flame" | "star" | "ear" | "book" | "pen" | "mic" | "trophy" | "coins";
  tone: string;
  earned: (s: LudikState) => boolean;
}

const completedIn = (s: LudikState, skill: SkillId) =>
  PATHS[skill].filter((n) => (s.progress[n.id]?.stars ?? 0) > 0).length;

const totalCompleted = (s: LudikState) =>
  Object.values(s.progress).filter((p) => p.stars > 0).length;

export const BADGES: Badge[] = [
  {
    id: "first-step",
    name: "Primer paso",
    requirement: "Completa tu primer nivel",
    icon: "star",
    tone: "bg-orange",
    earned: (s) => totalCompleted(s) >= 1,
  },
  {
    id: "streak-7",
    name: "Constancia activa",
    requirement: "Mantén una racha de 7 días",
    icon: "flame",
    tone: "bg-orange",
    earned: (s) => s.streak.best >= 7,
  },
  {
    id: "streak-30",
    name: "Imparable",
    requirement: "Mantén una racha de 30 días",
    icon: "flame",
    tone: "bg-salmon",
    earned: (s) => s.streak.best >= 30,
  },
  {
    id: "echo-3",
    name: "Oído fino",
    requirement: "Completa 3 niveles con Echo",
    icon: "ear",
    tone: "bg-teal",
    earned: (s) => completedIn(s, "echo") >= 3,
  },
  {
    id: "lexi-3",
    name: "Ratón de biblioteca",
    requirement: "Completa 3 misiones con Lexi",
    icon: "book",
    tone: "bg-yellow",
    earned: (s) => completedIn(s, "lexi") >= 3,
  },
  {
    id: "tinta-1",
    name: "Pluma veloz",
    requirement: "Completa 1 nivel con Tinta",
    icon: "pen",
    tone: "bg-salmon",
    earned: (s) => completedIn(s, "tinta") >= 1,
  },
  {
    id: "fono-1",
    name: "Voz clara",
    requirement: "Completa 1 nivel con Fono",
    icon: "mic",
    tone: "bg-blue",
    earned: (s) => completedIn(s, "fono") >= 1,
  },
  {
    id: "three-stars",
    name: "Perfeccionista",
    requirement: "Consigue 3 estrellas en 3 niveles",
    icon: "trophy",
    tone: "bg-yellow",
    earned: (s) => Object.values(s.progress).filter((p) => p.stars >= 3).length >= 3,
  },
  {
    id: "coins-200",
    name: "Ahorrador",
    requirement: "Reúne 200 monedas",
    icon: "coins",
    tone: "bg-yellow",
    earned: (s) => s.coins >= 200,
  },
];

/** Certificado: completar todos los nodos A1 de las cuatro habilidades. */
export const CERTIFICATE_NODES = Object.values(PATHS)
  .flat()
  .filter((n) => n.level === "A1" && !n.requiresPlan);
