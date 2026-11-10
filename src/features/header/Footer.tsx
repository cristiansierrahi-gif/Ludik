import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/ludik/Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/70 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-bold text-strong">Una forma divertida de aprender.</p>
          <p className="text-ui-gray">Te esperamos para que estudiemos juntos.</p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-4 gap-y-2 text-ui-gray">
          <Link to="/nosotros" className="rounded underline-offset-4 hover:text-cobalt hover:underline">
            Nosotros
          </Link>
          <Link to="/planes" className="rounded underline-offset-4 hover:text-cobalt hover:underline">
            Planes
          </Link>
          <Link to="/ajustes" className="rounded underline-offset-4 hover:text-cobalt hover:underline">
            Accesibilidad y ajustes
          </Link>
          <Link to="/acceso" className="rounded underline-offset-4 hover:text-cobalt hover:underline">
            Acceso
          </Link>
        </nav>
        <Logo size="md" className="self-end sm:self-auto" />
      </div>
    </footer>
  );
}
