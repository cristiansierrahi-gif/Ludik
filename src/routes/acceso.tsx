import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CharacterArt } from "@/components/ludik/CharacterArt";
import { Logo } from "@/components/ludik/Logo";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/services";
import { useLudik } from "@/store/ludik-store";

export const Route = createFileRoute("/acceso")({
  head: () => ({
    meta: [
      { title: "Entrar · Ludik" },
      { name: "description", content: "Entra a Ludik con tu cuenta de Moodle o prueba el modo invitado." },
      { property: "og:title", content: "Entrar · Ludik" },
      { property: "og:description", content: "Entra con Moodle o como invitado y empieza a practicar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccessPage,
});

function AccessPage() {
  const { state, setSession } = useLudik();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<"guest" | "moodle" | null>(null);

  const enter = async (mode: "guest" | "moodle") => {
    setLoading(mode);
    const session = await authService.login(mode);
    setSession(session);
    setLoading(null);
    toast.success(
      mode === "moodle" ? "Entraste con Moodle (simulado)" : "¡Bienvenido! Estás en modo invitado",
      mode === "moodle" ? { description: "La conexión real con Moodle se activará más adelante." } : undefined,
    );
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center">
      <div className="flex -space-x-6">
        {(["echo", "lexi", "tinta", "fono"] as const).map((id) => (
          <CharacterArt key={id} id={id} decorative className="size-20 sm:size-24" />
        ))}
      </div>
      <Logo size="lg" className="mt-4" />
      <h1 className="mt-4 font-display text-2xl text-strong">Te esperamos para que estudiemos juntos</h1>
      <p className="mt-2 text-lg">
        {state.session.loggedIn
          ? `Ya estás dentro como ${state.user.name}.`
          : "Entra con tu cuenta institucional o prueba Ludik como invitado."}
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        <Button size="lg" variant="cobalt" onClick={() => enter("moodle")} disabled={loading !== null}>
          <GraduationCap aria-hidden /> {loading === "moodle" ? "Conectando…" : "Entrar con Moodle"}
        </Button>
        <Button size="lg" variant="outline" onClick={() => enter("guest")} disabled={loading !== null}>
          <UserRound aria-hidden /> {loading === "guest" ? "Entrando…" : "Entrar como invitado (demo)"}
        </Button>
      </div>
      <p className="mt-6 text-sm text-ui-gray">
        La conexión con Moodle es simulada por ahora. Nunca guardamos contraseñas en tu dispositivo.
      </p>
    </div>
  );
}
