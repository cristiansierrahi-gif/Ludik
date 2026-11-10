import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LudikProvider } from "@/store/ludik-store";
import { Header } from "@/features/header/Header";
import { Footer } from "@/features/header/Footer";
import { Toaster } from "@/components/ui/sonner";
import { CharacterArt } from "@/components/ludik/CharacterArt";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <span className="spotlight inline-block rounded-3xl px-6 pt-2">
          <CharacterArt id="echo" mood="pensando" decorative className="size-40" />
        </span>
        <h1 className="mt-4 font-display text-5xl text-strong">404</h1>
        <h2 className="mt-2 text-xl font-extrabold text-strong">Echo no escucha esta página</h2>
        <p className="mt-2 text-foreground">La página que buscas no existe o se movió. ¡Volvamos a aprender!</p>
        <Link
          to="/"
          className="btn-3d mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 font-extrabold text-primary-foreground"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-strong">Esta página no cargó</h1>
        <p className="mt-2 text-foreground">Algo salió mal de nuestro lado. Intenta de nuevo o vuelve al inicio.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-3d inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 font-extrabold text-primary-foreground"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-border bg-card px-5 font-extrabold text-strong"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Ludik — Una forma divertida de aprender" },
      {
        name: "description",
        content: "Plataforma de práctica de idiomas con minijuegos y gamificación.",
      },
      { name: "author", content: "Ludik" },
      { name: "theme-color", content: "#FC9645" },
      { property: "og:title", content: "Ludik — Una forma divertida de aprender" },
      {
        property: "og:description",
        content: "Plataforma de práctica de idiomas con minijuegos y gamificación.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Titan+One&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LudikProvider>
        <a
          href="#contenido"
          className="sr-only z-50 rounded-xl bg-cobalt px-4 py-3 font-bold text-card focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <div aria-hidden className="ludik-pattern" />
        <Header />
        <main id="contenido" tabIndex={-1} className="min-h-[70vh] outline-none">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </LudikProvider>
    </QueryClientProvider>
  );
}
