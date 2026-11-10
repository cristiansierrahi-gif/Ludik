import { cn } from "@/lib/utils";

/* Logo Ludik: texto display naranja + tres destellos arriba a la derecha de la "k". */
export function Logo({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const text = { sm: "text-2xl", md: "text-3xl", lg: "text-6xl" }[size];
  const spark = { sm: "w-3 -top-1 -right-3", md: "w-4 -top-1.5 -right-4", lg: "w-8 -top-3 -right-8" }[
    size
  ];
  return (
    <span
      role="img"
      aria-label="Ludik"
      className={cn("relative inline-flex font-display leading-none text-orange", text, className)}
    >
      <span aria-hidden>Ludik</span>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className={cn("absolute", spark)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      >
        <path d="M4 11 L1 14" />
        <path d="M9 7 L9 2" />
        <path d="M13 10 L18 7" />
      </svg>
    </span>
  );
}
