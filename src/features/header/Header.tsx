/* ============================================================
 * Header fijo (sección 7): logo, navegación, racha, XP, plan, usuario.
 * ============================================================ */
import { Link, useNavigate } from "@tanstack/react-router";
import { Coins, Flame, Menu, Sparkles, ChevronDown, LogIn } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ludik/Logo";
import { PlanTag } from "@/components/ludik/bits";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLudik } from "@/store/ludik-store";
import { authService } from "@/services/services";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/progreso", label: "Progreso" },
  { to: "/logros", label: "Logros" },
  { to: "/planes", label: "Planes" },
  { to: "/nosotros", label: "Nosotros" },
] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function Header() {
  const { state, streakToday, setSession } = useLudik();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const name = state.session.loggedIn ? state.user.name : "Invitado";
  const streakLabel = `Racha: ${streakToday} ${streakToday === 1 ? "día seguido" : "días seguidos"}`;

  const linkCls =
    "rounded-xl px-3 py-2 font-bold text-ui-gray transition-colors hover:bg-muted hover:text-strong";
  const activeCls = "bg-orange/15 text-strong";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Móvil: menú hamburguesa */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-strong hover:bg-muted lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu aria-hidden className="size-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card">
            <SheetTitle className="mb-6">
              <Logo />
            </SheetTitle>
            <nav aria-label="Menú principal" className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`${linkCls} min-h-11 text-lg`}
                  activeProps={{ className: activeCls }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/ajustes"
                onClick={() => setOpen(false)}
                className={`${linkCls} min-h-11 text-lg`}
                activeProps={{ className: activeCls }}
              >
                Ajustes
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" aria-label="Ludik, ir al inicio" className="mr-2 rounded-lg">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={linkCls}
              activeProps={{ className: activeCls }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            to="/progreso"
            aria-label={streakLabel}
            title={streakLabel}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-orange/15 px-3 font-extrabold text-strong hover:bg-orange/25"
          >
            <Flame aria-hidden className="size-5 fill-orange text-ink-orange" />
            <span>
              {streakToday}
              <span className="hidden sm:inline"> {streakToday === 1 ? "día" : "días"}</span>
            </span>
          </Link>

          <span
            className="hidden items-center gap-1 font-extrabold text-strong md:inline-flex"
            title="Puntos de experiencia"
          >
            <Sparkles aria-hidden className="size-5 text-ink-blue" />
            {state.xp.toLocaleString("es-CO")} <span className="sr-only">puntos de experiencia</span>
            <span aria-hidden className="text-sm font-bold text-ui-gray">XP</span>
          </span>
          <span className="hidden items-center gap-1 font-extrabold text-strong xl:inline-flex" title="Monedas">
            <Coins aria-hidden className="size-5 text-ink-yellow" />
            {state.coins} <span className="sr-only">monedas</span>
          </span>

          <Link to="/planes" className="hidden rounded-full sm:inline-flex" aria-label={`Plan actual: ${state.plan}. Ver planes`}>
            <PlanTag plan={state.plan} />
          </Link>

          {state.session.loggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-1.5 hover:bg-muted"
                aria-label={`Menú de ${name}`}
              >
                <span className="hidden max-w-36 truncate font-bold text-strong sm:inline">{name}</span>
                <span
                  aria-hidden
                  className="inline-flex size-10 items-center justify-center rounded-full bg-teal font-display text-strong ring-2 ring-card"
                >
                  {state.user.avatarUrl ? (
                    <img src={state.user.avatarUrl} alt="" className="size-full rounded-full object-cover" />
                  ) : (
                    initials(name)
                  )}
                </span>
                <ChevronDown aria-hidden className="hidden size-4 sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="text-base">{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="min-h-11 text-base" onSelect={() => navigate({ to: "/progreso" })}>
                  Mi progreso
                </DropdownMenuItem>
                <DropdownMenuItem className="min-h-11 text-base" onSelect={() => navigate({ to: "/logros" })}>
                  Mis logros
                </DropdownMenuItem>
                <DropdownMenuItem className="min-h-11 text-base" onSelect={() => navigate({ to: "/ajustes" })}>
                  Ajustes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="min-h-11 text-base"
                  onSelect={async () => {
                    setSession(await authService.logout());
                    navigate({ to: "/acceso" });
                  }}
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/acceso"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cobalt px-4 font-extrabold text-card"
            >
              <LogIn aria-hidden className="size-5" /> Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
