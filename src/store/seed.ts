/* ============================================================
 * Estado inicial de demostración (datos de ejemplo)
 * ============================================================ */
import type { LudikState, ModuleResult } from "@/types/ludik";
import { toDay } from "@/services/rules";

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(18, 30, 0, 0);
  return d;
};

const r = (
  partial: Omit<ModuleResult, "userId" | "completed" | "timeSeconds" | "stage"> &
    Partial<ModuleResult>,
): ModuleResult => ({
  userId: "demo-001",
  stage: "final",
  timeSeconds: 420,
  completed: true,
  ...partial,
});

export function createSeedState(): LudikState {
  return {
    version: 1,
    user: { id: "demo-001", name: "Sofía Ramírez" },
    session: { loggedIn: true, mode: "guest" },
    plan: "free",
    xp: 640,
    coins: 85,
    streak: { current: 12, best: 15, lastActiveDate: toDay(daysAgo(1)) },
    selectedSkill: null,
    progress: {
      "echo-01": { stars: 3, bestScore: 95, attempts: 2, lastPlayed: daysAgo(6).toISOString() },
      "echo-02": { stars: 2, bestScore: 78, attempts: 1, lastPlayed: daysAgo(3).toISOString() },
      "lexi-a1-1": { stars: 2, bestScore: 80, attempts: 1, lastPlayed: daysAgo(2).toISOString() },
      "lexi-a1-2": { stars: 1, bestScore: 60, attempts: 1, lastPlayed: daysAgo(1).toISOString() },
    },
    results: [
      r({
        skillId: "echo",
        moduleId: "echo-listening-challenge",
        levelId: "A1",
        nodeId: "echo-01",
        score: 95,
        xp: 150,
        coins: 20,
        stars: 3,
        correct: 4,
        total: 4,
        date: daysAgo(6).toISOString(),
        failedTopics: [],
      }),
      r({
        skillId: "echo",
        moduleId: "echo-listen-up-rpg",
        levelId: "forest",
        nodeId: "echo-02",
        score: 78,
        xp: 140,
        coins: 15,
        stars: 2,
        correct: 7,
        total: 9,
        date: daysAgo(3).toISOString(),
        failedTopics: ["números de dos cifras"],
      }),
      r({
        skillId: "lexi",
        moduleId: "lexi-repairing-library",
        levelId: "A1-1",
        nodeId: "lexi-a1-1",
        score: 80,
        xp: 200,
        coins: 30,
        stars: 2,
        correct: 9,
        total: 11,
        date: daysAgo(2).toISOString(),
        failedTopics: ["artículos a/an", "present simple (3.ª persona)"],
      }),
      r({
        skillId: "lexi",
        moduleId: "lexi-repairing-library",
        levelId: "A1-2",
        nodeId: "lexi-a1-2",
        score: 60,
        xp: 150,
        coins: 20,
        stars: 1,
        correct: 7,
        total: 11,
        date: daysAgo(1).toISOString(),
        failedTopics: ["present simple (3.ª persona)", "pronombres"],
      }),
    ],
    prefs: {
      textSize: "normal",
      highContrast: false,
      reducedMotion: false,
      sound: true,
      uiLanguage: "es",
      studyLanguage: "en",
      dailyGoalXp: 100,
      reminders: true,
    },
  };
}
