/* ============================================================
 * Servicios simulados preparados para backend (secciones 6.4 y 10.3)
 * authService (SSO Moodle), aiService y feedbackService por reglas.
 * ============================================================ */
import type { LudikState, ModuleResult, SkillId } from "@/types/ludik";
import { PATHS } from "@/data/paths";
import { CHARACTERS } from "@/data/characters";
import { nodeStatus, topFailedTopics } from "./rules";

export const authService = {
  /** Simulado: en producción redirige al SSO de Moodle. */
  async login(mode: "guest" | "moodle") {
    await new Promise((r) => setTimeout(r, 400));
    return { loggedIn: true, mode } as const;
  },
  async logout() {
    return { loggedIn: false, mode: "guest" } as const;
  },
};

export interface Recommendation {
  title: string;
  reason: string;
  skillId: SkillId;
  nodeId?: string;
}

/** Recomendaciones por reglas (Plus/Super). Sustituible por IA real vía backend. */
export const aiService = {
  getRecommendation(state: LudikState): Recommendation[] {
    const recs: Recommendation[] = [];
    const failed = topFailedTopics(state.results, 2);
    failed.forEach(([topic, count]) => {
      const r = [...state.results].reverse().find((x) => x.failedTopics.includes(topic));
      if (r)
        recs.push({
          title: `Repasa: ${topic}`,
          reason: `Lo fallaste ${count} ${count === 1 ? "vez" : "veces"} con ${CHARACTERS[r.skillId].name}.`,
          skillId: r.skillId,
          nodeId: r.nodeId,
        });
    });
    // Habilidad con menos avance
    const weakest = (Object.keys(PATHS) as SkillId[])
      .map((id) => ({
        id,
        done: PATHS[id].filter((n) => (state.progress[n.id]?.stars ?? 0) > 0).length,
      }))
      .sort((a, b) => a.done - b.done)[0];
    const path = PATHS[weakest.id];
    const nextIdx = path.findIndex(
      (_, i) => nodeStatus(path, i, state.progress, state.plan) === "available",
    );
    if (nextIdx >= 0)
      recs.push({
        title: `Sigue con ${CHARACTERS[weakest.id].name}: ${path[nextIdx].title}`,
        reason: `Es la habilidad en la que llevas menos avance (${CHARACTERS[weakest.id].skillEs}).`,
        skillId: weakest.id,
        nodeId: path[nextIdx].id,
      });
    return recs;
  },
};

export const feedbackService = {
  /** Explicación breve por reglas; punto de extensión para corrección en tiempo real. */
  explainError(result: ModuleResult) {
    if (!result.failedTopics.length) return "¡Todo perfecto! Sigue así.";
    return `Repasa: ${result.failedTopics.join(", ")}.`;
  },
};
