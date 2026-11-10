import { createFileRoute } from "@tanstack/react-router";
import { Hub } from "@/features/hub/Hub";
import { useLudik } from "@/store/ludik-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ludik — Una forma divertida de aprender idiomas" },
      {
        name: "description",
        content:
          "Practica escucha, lectura, escritura y habla en inglés con Echo, Lexi, Tinta y Fono. Minijuegos, estrellas y rachas.",
      },
      { property: "og:title", content: "Ludik — Una forma divertida de aprender idiomas" },
      {
        property: "og:description",
        content: "Practica escucha, lectura, escritura y habla con los personajes de Ludik.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { state, selectSkill } = useLudik();
  return <Hub skillId={state.selectedSkill} onSelect={selectSkill} />;
}
