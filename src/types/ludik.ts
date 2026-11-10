/* ============================================================
 * Ludik — shared domain types (contrato de datos de la plataforma)
 * ============================================================ */

export type SkillId = "echo" | "lexi" | "tinta" | "fono";
export type PlanId = "free" | "plus" | "super";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type StudyLanguage = "en" | "fr";
export type Mood = "neutral" | "feliz" | "pensando" | "animando" | "gris";

export type NodeType = "lesson" | "chest" | "boss" | "exam";
export type NodeStatus = "completed" | "available" | "locked" | "plan-locked";

/** Un nodo del mapa de aprendizaje (sección 8.3). */
export interface PathNode {
  id: string;
  skillId: SkillId;
  order: number;
  title: string;
  description: string;
  level: CefrLevel;
  moduleId: string;
  levelId: string;
  type: NodeType;
  minutes: number;
  reward: { xp: number; coins: number };
  /** Plan mínimo requerido (feature flag). */
  requiresPlan?: PlanId;
}

/** Objeto de resultado estándar que devuelve cada módulo (sección 6.4). */
export interface ModuleResult {
  userId: string;
  skillId: SkillId;
  moduleId: string;
  levelId: string;
  nodeId: string;
  stage: string | number;
  score: number;
  xp: number;
  coins?: number;
  stars: number;
  correct: number;
  total: number;
  timeSeconds: number;
  date: string;
  failedTopics: string[];
  completed: boolean;
}

export interface NodeProgress {
  stars: number;
  bestScore: number;
  attempts: number;
  lastPlayed: string;
}

export interface Preferences {
  textSize: "normal" | "large" | "xlarge";
  highContrast: boolean;
  reducedMotion: boolean;
  sound: boolean;
  uiLanguage: "es" | "en" | "fr";
  studyLanguage: StudyLanguage;
  dailyGoalXp: number;
  reminders: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Session {
  loggedIn: boolean;
  mode: "guest" | "moodle";
}

export interface LudikState {
  version: 1;
  user: User;
  session: Session;
  plan: PlanId;
  xp: number;
  coins: number;
  streak: { current: number; best: number; lastActiveDate: string | null };
  selectedSkill: SkillId | null;
  progress: Record<string, NodeProgress>;
  results: ModuleResult[];
  prefs: Preferences;
}

/** Props que recibe cada módulo (contrato 6.5). */
export interface ModuleProps {
  skillId: SkillId;
  levelId: string;
  nodeId: string;
  language: StudyLanguage;
  plan: PlanId;
  user: User;
  onComplete(result: Omit<ModuleResult, "userId" | "date" | "nodeId" | "skillId">): void;
  onExit(): void;
  reducedMotion: boolean;
}
