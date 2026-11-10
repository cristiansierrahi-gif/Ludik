import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Ludik buttons: large, tactile (≥44px), optional "3D" bottom shadow. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-extrabold cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground btn-3d hover:brightness-105",
        destructive:
          "bg-destructive text-destructive-foreground btn-3d [--btn-shadow:var(--color-strong)] hover:brightness-105",
        outline:
          "border-2 border-border bg-card text-strong btn-3d [--btn-shadow:var(--color-border)] hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground btn-3d [--btn-shadow:var(--color-border)] hover:bg-muted",
        ghost: "text-strong hover:bg-muted",
        link: "text-cobalt underline-offset-4 hover:underline",
        teal: "bg-teal text-strong btn-3d [--btn-shadow:var(--color-ink-teal)] hover:brightness-105",
        blue: "bg-blue text-strong btn-3d [--btn-shadow:var(--color-ink-blue)] hover:brightness-105",
        yellow:
          "bg-yellow text-strong btn-3d [--btn-shadow:var(--color-ink-yellow)] hover:brightness-105",
        salmon:
          "bg-salmon text-strong btn-3d [--btn-shadow:var(--color-ink-salmon)] hover:brightness-105",
        cobalt:
          "bg-cobalt text-card btn-3d [--btn-shadow:var(--color-strong)] hover:brightness-110",
      },
      size: {
        default: "min-h-11 px-5 py-2",
        sm: "min-h-11 px-4 text-sm",
        lg: "min-h-13 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
