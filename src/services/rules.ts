/* ============================================================
 * Reglas de gamificación (puras y testeables) — sección 11
 * ============================================================ */
import { hasPlan } from "@/data/plans";
import type {
  LudikState,
  ModuleResult,
  NodeStatus,
  PathNode,
  PlanId,
  NodeProgress,
} from "@/types/ludik";

/** Estrellas por porcentaje: 3★ ≥ 90 %, 2★ ≥ 70 %, 1★ < 70 %. */
export function starsFor(percent: number): 1 | 2 | 3 {
  if (percent >= 90) return 3;
  if (percent >= 70) return 2;
  return 1;
}

/** Estrellas necesarias en el nivel anterior para desbloquear el siguiente. */
export const UNLOCK_STARS = 2;

export function nodeStatus(
  path: PathNode[],
  index: number,
  progress: Record<string, NodeProgress>,
  plan: PlanId,
): NodeStatus {
  const node = path[index];
  if (node.requiresPlan && !hasPlan(plan, node.requiresPlan)) return "plan-locked";
  if ((progress[node.id]?.stars ?? 0) > 0) return "completed";
  if (index === 0) return "available";
  const prev = path[index - 1];
  return (progress[prev.id]?.stars ?? 0) >= UNLOCK_STARS ? "available" : "locked";
}

/** Mensaje amable con el requisito de un nivel bloqueado. */
export function lockReason(
  path: PathNode[],
  index: number,
  progress: Record<string, NodeProgress>,
): string {
  const prev = path[index - 1];
  if (!prev) return "";
  const have = progress[prev.id]?.stars ?? 0;
  const base = `Consigue ${UNLOCK_STARS} estrellas en el nivel ${prev.order} («${prev.title}»)`;
  return have > 0 ? `${base}. ¡Ya tienes ${have}, casi lo logras!` : `${base} para abrir este.`;
}

/* ---------- Fechas y racha ---------- */

export const toDay = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const dayDiff = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`)) / 86_400_000);

/** Racha visible hoy: si el último día activo fue antes de ayer, la racha se reinicia (0). */
export function visibleStreak(streak: LudikState["streak"], today: string) {
  if (!streak.lastActiveDate) return 0;
  return dayDiff(streak.lastActiveDate, today) <= 1 ? streak.current : 0;
}

/** Actualiza la racha al completar una actividad hoy. */
export function updateStreak(streak: LudikState["streak"], today: string): LudikState["streak"] {
  const last = streak.lastActiveDate;
  let current: number;
  if (last === today) current = Math.max(1, streak.current);
  else if (last && dayDiff(last, today) === 1) current = streak.current + 1;
  else current = 1;
  return { current, best: Math.max(streak.best, current), lastActiveDate: today };
}

/* ---------- Aplicar resultado de un módulo ---------- */

export function applyResult(
  state: LudikState,
  result: ModuleResult,
  today: string = toDay(new Date()),
): LudikState {
  const prev = state.progress[result.nodeId];
  const nextProgress: NodeProgress = {
    stars: Math.max(prev?.stars ?? 0, result.completed ? result.stars : 0),
    bestScore: Math.max(prev?.bestScore ?? 0, result.score),
    attempts: (prev?.attempts ?? 0) + 1,
    lastPlayed: result.date,
  };
  return {
    ...state,
    xp: state.xp + result.xp,
    coins: state.coins + (result.coins ?? 0),
    streak: updateStreak(state.streak, today),
    progress: { ...state.progress, [result.nodeId]: nextProgress },
    results: [...state.results, result],
  };
}

/* ---------- Estadísticas derivadas ---------- */

export function pathStats(path: PathNode[], progress: Record<string, NodeProgress>) {
  const completed = path.filter((x) => (progress[x.id]?.stars ?? 0) > 0).length;
  const stars = path.reduce((acc, x) => acc + (progress[x.id]?.stars ?? 0), 0);
  return {
    completed,
    total: path.length,
    percent: path.length ? Math.round((completed / path.length) * 100) : 0,
    stars,
    maxStars: path.length * 3,
  };
}

export function accuracy(results: ModuleResult[]) {
  const total = results.reduce((a, r) => a + r.total, 0);
  const correct = results.reduce((a, r) => a + r.correct, 0);
  return total ? Math.round((correct / total) * 100) : 0;
}

export function topFailedTopics(results: ModuleResult[], limit = 5) {
  const counts = new Map<string, number>();
  results.forEach((r) => r.failedTopics.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

const CEFR = ["A1", "A2", "B1", "B2", "C1"];
export function highestLevel(path: PathNode[], progress: Record<string, NodeProgress>) {
  const done = path.filter((x) => (progress[x.id]?.stars ?? 0) > 0).map((x) => x.level);
  if (!done.length) return "—";
  return done.sort((a, b) => CEFR.indexOf(b) - CEFR.indexOf(a))[0];
}
