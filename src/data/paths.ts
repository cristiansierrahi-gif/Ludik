/* ============================================================
 * Mapa de aprendizaje por habilidad (semilla, sección 8.3)
 * Editable sin tocar la lógica. Los nodos sin módulo listo
 * llevan a la página "Próximamente".
 * ============================================================ */
import type { PathNode, SkillId } from "@/types/ludik";

const n = (node: Omit<PathNode, "minutes" | "reward"> & Partial<PathNode>): PathNode => ({
  minutes: 8,
  reward: { xp: 50, coins: 10 },
  ...node,
});

export const PATHS: Record<SkillId, PathNode[]> = {
  echo: [
    n({
      id: "echo-01",
      skillId: "echo",
      order: 1,
      title: "Saludos y números",
      description: "Escucha saludos, números, fechas e información personal.",
      level: "A1",
      moduleId: "echo-listening-challenge",
      levelId: "A1",
      type: "lesson",
    }),
    n({
      id: "echo-02",
      skillId: "echo",
      order: 2,
      title: "Bosque Encantado",
      description: "Campaña Listen Up!: combate escuchando instrucciones sencillas.",
      level: "A1",
      moduleId: "echo-listen-up-rpg",
      levelId: "forest",
      type: "lesson",
      minutes: 12,
      reward: { xp: 70, coins: 15 },
    }),
    n({
      id: "echo-03",
      skillId: "echo",
      order: 3,
      title: "Cofre de Echo",
      description: "¡Un cofre sorpresa por tu constancia! Ábrelo y gana monedas.",
      level: "A1",
      moduleId: "chest",
      levelId: "chest",
      type: "chest",
      minutes: 1,
      reward: { xp: 20, coins: 40 },
    }),
    n({
      id: "echo-04",
      skillId: "echo",
      order: 4,
      title: "Reuniones y llamadas",
      description: "Conversaciones laborales, correos, llamadas y solicitudes de soporte.",
      level: "B1",
      moduleId: "echo-listening-challenge",
      levelId: "B1",
      type: "lesson",
      minutes: 10,
      reward: { xp: 80, coins: 15 },
    }),
    n({
      id: "echo-05",
      skillId: "echo",
      order: 5,
      title: "Tierras del Volcán",
      description: "Campaña Listen Up!: enemigos más rápidos y diálogos más largos.",
      level: "A2",
      moduleId: "echo-listen-up-rpg",
      levelId: "volcano",
      type: "boss",
      minutes: 15,
      reward: { xp: 120, coins: 30 },
    }),
    n({
      id: "echo-06",
      skillId: "echo",
      order: 6,
      title: "Presentaciones ejecutivas",
      description: "Discusiones estratégicas, liderazgo y toma de decisiones.",
      level: "C1",
      moduleId: "echo-listening-challenge",
      levelId: "C1",
      type: "lesson",
      minutes: 12,
      reward: { xp: 120, coins: 20 },
    }),
    n({
      id: "echo-07",
      skillId: "echo",
      order: 7,
      title: "Evaluación semanal",
      description: "Examen semanal de escucha para medir tu avance.",
      level: "B1",
      moduleId: "weekly-exam",
      levelId: "echo",
      type: "exam",
      minutes: 15,
      reward: { xp: 150, coins: 30 },
      requiresPlan: "plus",
    }),
    n({
      id: "echo-08",
      skillId: "echo",
      order: 8,
      title: "Simulacro oficial",
      description: "Simulacro enfocado en exámenes oficiales de lenguaje.",
      level: "C1",
      moduleId: "official-mock",
      levelId: "echo",
      type: "boss",
      minutes: 25,
      reward: { xp: 200, coins: 50 },
      requiresPlan: "super",
    }),
  ],

  lexi: (["A1", "A2", "B1", "B2", "C1"] as const).flatMap((level, i) => {
    const topics: Record<string, [string, string]> = {
      A1: ["Mi rutina diaria", "La ciudad"],
      A2: ["Fin de semana pasado", "Comida y restaurantes"],
      B1: ["Tecnología y apps", "Deportes y salud"],
      B2: ["Medio ambiente", "Redes sociales"],
      C1: ["Economía y sociedad", "Ciencia y cultura"],
    };
    return [1, 2].map((m) =>
      n({
        id: `lexi-${level.toLowerCase()}-${m}`,
        skillId: "lexi",
        order: i * 2 + m,
        title: topics[level][m - 1],
        description: `Reparando la Biblioteca · Misión ${m} de ${level}: lee, completa frases y caza errores.`,
        level,
        moduleId: "lexi-repairing-library",
        levelId: `${level}-${m}`,
        type: m === 2 && (level === "B1" || level === "C1") ? "boss" : "lesson",
        minutes: 8 + i * 2,
        reward: { xp: 50 + i * 20, coins: 10 + i * 5 },
      }),
    );
  }),

  tinta: [
    n({
      id: "tinta-a1",
      skillId: "tinta",
      order: 1,
      title: "English Ink",
      description: "Escribe las frases antes de que la tinta llegue al final de la página.",
      level: "A1",
      moduleId: "tinta-english-ink",
      levelId: "A1",
      type: "lesson",
      minutes: 6,
      reward: { xp: 60, coins: 12 },
    }),
    n({
      id: "tinta-chest",
      skillId: "tinta",
      order: 2,
      title: "Cofre de Tinta",
      description: "Un cofre lleno de lápices… y monedas.",
      level: "A1",
      moduleId: "chest",
      levelId: "chest",
      type: "chest",
      minutes: 1,
      reward: { xp: 20, coins: 40 },
    }),
    n({
      id: "tinta-a2",
      skillId: "tinta",
      order: 3,
      title: "English Ink A2",
      description: "Frases más largas y vocabulario de viajes.",
      level: "A2",
      moduleId: "tinta-english-ink",
      levelId: "A2",
      type: "lesson",
    }),
    n({
      id: "tinta-b1",
      skillId: "tinta",
      order: 4,
      title: "English Ink B1",
      description: "Escritura con conectores y tiempos verbales.",
      level: "B1",
      moduleId: "tinta-english-ink",
      levelId: "B1",
      type: "boss",
      minutes: 10,
      reward: { xp: 100, coins: 20 },
    }),
    n({
      id: "tinta-train",
      skillId: "tinta",
      order: 5,
      title: "Entrenamiento avanzado",
      description: "Entrenamiento especial de escritura con vocabulario avanzado.",
      level: "B2",
      moduleId: "advanced-training",
      levelId: "tinta",
      type: "lesson",
      minutes: 15,
      reward: { xp: 150, coins: 30 },
      requiresPlan: "super",
    }),
  ],

  fono: (["A1", "A2", "B1"] as const).flatMap((level, i) =>
    [1, 2].map((m) =>
      n({
        id: `fono-${level.toLowerCase()}-${m}`,
        skillId: "fono",
        order: i * 2 + m,
        title:
          {
            A1: ["Hola, ¿cómo estás?", "Mi familia"],
            A2: ["De compras", "Pidiendo direcciones"],
            B1: ["Una entrevista", "Contando una historia"],
          }[level][m - 1] ?? "",
        description: `Eco de Voz · ${level}: escucha y repite, lee en voz alta y responde.`,
        level,
        moduleId: "fono-voice-echo",
        levelId: `${level}-${m}`,
        type: m === 2 && level === "B1" ? "boss" : "lesson",
        minutes: 6 + i * 2,
        reward: { xp: 50 + i * 20, coins: 10 + i * 5 },
      }),
    ),
  ),
};

export const ALL_NODES: PathNode[] = Object.values(PATHS).flat();

export const findNode = (nodeId: string) => ALL_NODES.find((x) => x.id === nodeId);

export const findNodeByModule = (skillId: SkillId, moduleId: string, levelId: string) =>
  PATHS[skillId].find((x) => x.moduleId === moduleId && x.levelId === levelId);
