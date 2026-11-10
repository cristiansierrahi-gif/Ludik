import { CHARACTERS } from "@/data/characters";
import { cn } from "@/lib/utils";
import type { Mood, SkillId } from "@/types/ludik";

/*
 * Ilustración de personaje con estados (mood).
 * neutral/feliz: color; pensando: leve balanceo; animando: rebote; gris: inactivo.
 * Ilustraciones provisionales (sección 4.5).
 */
export function CharacterArt({
  id,
  mood = "neutral",
  className,
  decorative = false,
  eager = false,
}: {
  id: SkillId;
  mood?: Mood;
  className?: string;
  decorative?: boolean;
  eager?: boolean;
}) {
  const c = CHARACTERS[id];
  const moodClass = {
    neutral: "",
    feliz: "animate-pop-in",
    pensando: "animate-bob",
    animando: "animate-bob",
    gris: "grayscale-char",
  }[mood];
  return (
    <img
      src={c.image}
      alt={decorative ? "" : `${c.name}, personaje de ${c.skillEs}`}
      width={816}
      height={816}
      loading={eager ? "eager" : "lazy"}
      draggable={false}
      className={cn("select-none object-contain transition-[filter,opacity] duration-300", moodClass, className)}
    />
  );
}
