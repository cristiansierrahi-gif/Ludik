/* ============================================================
 * Estado global centralizado (Context + reducer) — sección 6.4
 * Usuario, plan, XP, monedas, racha, progreso, resultados y
 * preferencias. Persistencia mediante adaptador intercambiable.
 * ============================================================ */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  LudikState,
  ModuleResult,
  PathNode,
  PlanId,
  Preferences,
  Session,
  SkillId,
} from "@/types/ludik";
import { applyResult, toDay, visibleStreak } from "@/services/rules";
import { createAdapter, type PersistenceAdapter } from "@/services/persistence";
import { createSeedState } from "./seed";

type Action =
  | { type: "hydrate"; state: LudikState }
  | { type: "selectSkill"; skillId: SkillId | null }
  | { type: "result"; result: ModuleResult }
  | { type: "setPlan"; plan: PlanId }
  | { type: "setPrefs"; prefs: Partial<Preferences> }
  | { type: "setSession"; session: Session }
  | { type: "reset" };

function reducer(state: LudikState, action: Action): LudikState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "selectSkill":
      return { ...state, selectedSkill: action.skillId };
    case "result":
      return applyResult(state, action.result);
    case "setPlan":
      return { ...state, plan: action.plan };
    case "setPrefs":
      return { ...state, prefs: { ...state.prefs, ...action.prefs } };
    case "setSession":
      return { ...state, session: action.session };
    case "reset":
      return createSeedState();
  }
}

interface LudikContextValue {
  state: LudikState;
  today: string;
  streakToday: number;
  reducedMotion: boolean;
  selectSkill(skillId: SkillId | null): void;
  submitResult(node: PathNode, partial: Omit<ModuleResult, "userId" | "date" | "nodeId" | "skillId">): ModuleResult;
  claimChest(node: PathNode): ModuleResult;
  setPlan(plan: PlanId): void;
  setPrefs(prefs: Partial<Preferences>): void;
  setSession(session: Session): void;
  reset(): void;
}

const LudikContext = createContext<LudikContextValue | null>(null);

export function LudikProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeedState);
  const adapterRef = useRef<PersistenceAdapter | null>(null);
  const hydrated = useRef(false);
  const [systemReduced, setSystemReduced] = useState(false);

  // Hidratar desde el adaptador después de montar (evita desajustes de SSR).
  useEffect(() => {
    adapterRef.current = createAdapter();
    const saved = adapterRef.current.load();
    if (saved) dispatch({ type: "hydrate", state: saved });
    hydrated.current = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (hydrated.current) adapterRef.current?.save(state);
  }, [state]);

  // Aplicar preferencias de accesibilidad al documento.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("hc", state.prefs.highContrast);
    html.classList.toggle("reduce-motion", state.prefs.reducedMotion);
    html.classList.toggle("text-lg-pref", state.prefs.textSize === "large");
    html.classList.toggle("text-xl-pref", state.prefs.textSize === "xlarge");
  }, [state.prefs]);

  const today = toDay(new Date());

  const submitResult = useCallback<LudikContextValue["submitResult"]>(
    (node, partial) => {
      const result: ModuleResult = {
        ...partial,
        userId: state.user.id,
        skillId: node.skillId,
        nodeId: node.id,
        date: new Date().toISOString(),
      };
      dispatch({ type: "result", result });
      return result;
    },
    [state.user.id],
  );

  const claimChest = useCallback(
    (node: PathNode) =>
      submitResult(node, {
        moduleId: "chest",
        levelId: "chest",
        stage: "chest",
        score: 100,
        xp: node.reward.xp,
        coins: node.reward.coins,
        stars: 3,
        correct: 0,
        total: 0,
        timeSeconds: 0,
        failedTopics: [],
        completed: true,
      }),
    [submitResult],
  );

  const value = useMemo<LudikContextValue>(
    () => ({
      state,
      today,
      streakToday: visibleStreak(state.streak, today),
      reducedMotion: state.prefs.reducedMotion || systemReduced,
      selectSkill: (skillId) => dispatch({ type: "selectSkill", skillId }),
      submitResult,
      claimChest,
      setPlan: (plan) => dispatch({ type: "setPlan", plan }),
      setPrefs: (prefs) => dispatch({ type: "setPrefs", prefs }),
      setSession: (session) => dispatch({ type: "setSession", session }),
      reset: () => {
        adapterRef.current?.clear();
        dispatch({ type: "reset" });
      },
    }),
    [state, today, systemReduced, submitResult, claimChest],
  );

  return <LudikContext.Provider value={value}>{children}</LudikContext.Provider>;
}

export function useLudik() {
  const ctx = useContext(LudikContext);
  if (!ctx) throw new Error("useLudik debe usarse dentro de <LudikProvider>");
  return ctx;
}
