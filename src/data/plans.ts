/* ============================================================
 * Planes Ludik y feature flags (secciones 1.5 y 10)
 * ============================================================ */
import type { PlanId } from "@/types/ludik";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // COP
  period: string; // editable, por defecto mensual
  tone: { bg: string; soft: string; border: string; button: "teal" | "default" | "yellow" };
  includes: string[];
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Ludik Gratis",
    price: 0,
    period: "mes",
    tone: { bg: "bg-teal", soft: "bg-teal/15", border: "border-teal", button: "teal" },
    includes: [
      "Acceso libre a los 4 modelos de aprendizaje",
      "Lecciones esenciales del plan básico",
      "Registro y seguimiento de tu progreso diario",
    ],
  },
  {
    id: "plus",
    name: "Ludik Plus",
    price: 30000,
    period: "mes",
    tone: { bg: "bg-orange", soft: "bg-orange/15", border: "border-orange", button: "default" },
    includes: [
      "Todo lo del plan Gratuito incluido",
      "Exámenes y evaluaciones semanales",
      "Inteligencia Artificial adaptada a tu ritmo de estudio",
      "Corrección de errores en tiempo real",
    ],
  },
  {
    id: "super",
    name: "Ludik Super",
    price: 50000,
    period: "mes",
    tone: { bg: "bg-yellow", soft: "bg-yellow/25", border: "border-yellow", button: "yellow" },
    includes: [
      "Todo lo del plan Plus incluido",
      "Entrenamientos especiales y avanzados",
      "Simulacros y ejercicios enfocados en exámenes oficiales de lenguaje",
    ],
  },
];

export const PLAN_RANK: Record<PlanId, number> = { free: 0, plus: 1, super: 2 };

export const planName = (id: PlanId) => PLANS.find((p) => p.id === id)?.name ?? id;

export const formatCop = (value: number) =>
  value === 0 ? "Gratis" : `$${value.toLocaleString("es-CO")}`;

export type Feature =
  | "skills"
  | "essentialLessons"
  | "dailyTracking"
  | "weeklyExams"
  | "adaptiveAi"
  | "realtimeCorrection"
  | "advancedTraining"
  | "officialMocks";

export const FEATURES: { id: Feature; label: string; minPlan: PlanId }[] = [
  { id: "skills", label: "Acceso a las 4 habilidades y personajes", minPlan: "free" },
  { id: "essentialLessons", label: "Lecciones esenciales (plan básico)", minPlan: "free" },
  { id: "dailyTracking", label: "Registro y seguimiento del progreso diario", minPlan: "free" },
  { id: "weeklyExams", label: "Exámenes y evaluaciones semanales", minPlan: "plus" },
  { id: "adaptiveAi", label: "IA adaptada al ritmo de estudio", minPlan: "plus" },
  { id: "realtimeCorrection", label: "Corrección de errores en tiempo real", minPlan: "plus" },
  { id: "advancedTraining", label: "Entrenamientos especiales y avanzados", minPlan: "super" },
  {
    id: "officialMocks",
    label: "Simulacros y ejercicios para exámenes oficiales",
    minPlan: "super",
  },
];

export const hasPlan = (current: PlanId, required: PlanId = "free") =>
  PLAN_RANK[current] >= PLAN_RANK[required];

export const hasFeature = (current: PlanId, feature: Feature) => {
  const f = FEATURES.find((x) => x.id === feature);
  return f ? hasPlan(current, f.minPlan) : false;
};
