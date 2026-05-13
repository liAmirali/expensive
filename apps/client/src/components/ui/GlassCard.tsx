import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

const card = cva(
  [
    "relative overflow-hidden",
    "border border-white/40",
    "shadow-[0_20px_60px_-20px_rgba(11,0,20,0.18)]",
    "backdrop-blur-2xl",
  ],
  {
    variants: {
      tone: {
        light: "bg-white/70",
        frost: "bg-white/45",
      },
      padding: {
        none: "p-0",
        md:   "p-6",
        lg:   "p-8",
        xl:   "p-10",
      },
      radius: {
        card:  "rounded-card",
        xl:    "rounded-xl",
        sheet: "rounded-sheet",
      },
    },
    defaultVariants: {
      tone: "light",
      padding: "lg",
      radius: "sheet",
    },
  }
);

export interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof card> {
  children: ReactNode;
}

export function GlassCard({ tone, padding, radius, className, children, ...props }: GlassCardProps) {
  return (
    <div className={card({ tone, padding, radius, className })} {...props}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-60" />
      <div className="relative">{children}</div>
    </div>
  );
}
