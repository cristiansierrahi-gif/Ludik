import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CHARACTERS, isSkillId } from "@/data/characters";
import { Hub } from "@/features/hub/Hub";
import { useLudik } from "@/store/ludik-store";

export const Route = createFileRoute("/habilidad/$skillId")({
  beforeLoad: ({ params }) => {
    if (!isSkillId(params.skillId)) throw notFound();
  },
  head: ({ params }) => {
    const c = isSkillId(params.skillId) ? CHARACTERS[params.skillId] : null;
    const title = c ? `${c.skill} con ${c.name} · Ludik` : "Habilidad · Ludik";
    const description = c ? c.description : "Elige una habilidad para practicar en Ludik.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: SkillPage,
});

function SkillPage() {
  const { skillId } = Route.useParams();
  const { selectSkill } = useLudik();
  const navigate = useNavigate();
  const id = isSkillId(skillId) ? skillId : "echo";

  // Guardar la selección en el estado para que persista al volver al inicio.
  useEffect(() => {
    selectSkill(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Hub
      skillId={id}
      onSelect={(next) => navigate({ to: "/habilidad/$skillId", params: { skillId: next }, replace: true })}
    />
  );
}
