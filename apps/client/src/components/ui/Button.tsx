import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium leading-none tracking-tight select-none",
    "transition-colors duration-150 cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      /**
       * variant — visual style
       *   solid   → filled bg (primary action)
       *   outline → border only
       *   ghost   → no border, subtle hover bg
       *   soft    → tinted bg, no border
       *   link    → text link style
       */
      variant: {
        solid:   "",
        outline: "border bg-transparent",
        ghost:   "border-transparent bg-transparent",
        soft:    "border-transparent",
        link:    "border-transparent bg-transparent underline-offset-4 hover:underline",
      },

      /**
       * color — semantic role
       *   default  → accent (violet)
       *   neutral  → gray
       *   positive → teal (credit / confirm)
       *   negative → cerise (debt / destructive)
       *   warning  → sand (caution)
       */
      color: {
        default:  "",
        neutral:  "",
        positive: "",
        negative: "",
        warning:  "",
      },

      /**
       * size — height + padding + font size
       *   xs  → 28px  chips, dense lists
       *   sm  → 34px  secondary actions
       *   md  → 42px  default
       *   lg  → 52px  primary CTA
       *   xl  → 60px  hero / full-width CTA
       */
      size: {
        xs: "h-7 px-3 text-xs",
        sm: "h-[34px] px-4 text-sm",
        md: "h-[42px] px-5 text-sm",
        lg: "h-[52px] px-6 text-base",
        xl: "h-[60px] px-8 text-base",
      },

      /**
       * shape — radius
       *   rounded  → rounded-card (design system default)
       *   pill     → fully rounded
       *   square   → rounded-sm (icon buttons, tight grids)
       */
      shape: {
        rounded: "rounded-card",
        pill:    "rounded-pill",
        square:  "rounded-sm",
      },

      width: {
        auto: "w-auto",
        full: "w-full",
      },

      /** strips horizontal padding for icon-only buttons */
      iconOnly: {
        true:  "px-0 aspect-square",
        false: "",
      },
    },

    compoundVariants: [
      // ── solid ─────────────────────────────────────────────
      { variant: "solid", color: "default",  class: "bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-hover" },
      { variant: "solid", color: "neutral",  class: "bg-text text-surface hover:bg-text-muted active:bg-text-muted" },
      { variant: "solid", color: "positive", class: "bg-positive text-text-on-accent hover:opacity-90 active:opacity-90" },
      { variant: "solid", color: "negative", class: "bg-negative text-text-on-accent hover:opacity-90 active:opacity-90" },
      { variant: "solid", color: "warning",  class: "bg-warning text-text-on-accent hover:opacity-90 active:opacity-90" },

      // ── outline ───────────────────────────────────────────
      { variant: "outline", color: "default",  class: "border-accent text-accent-text hover:bg-accent-subtle active:bg-accent-subtle" },
      { variant: "outline", color: "neutral",  class: "border-border text-text hover:bg-bg active:bg-bg" },
      { variant: "outline", color: "positive", class: "border-positive text-positive-text hover:bg-positive-subtle active:bg-positive-subtle" },
      { variant: "outline", color: "negative", class: "border-negative text-negative-text hover:bg-negative-subtle active:bg-negative-subtle" },
      { variant: "outline", color: "warning",  class: "border-warning text-warning-text hover:bg-warning-subtle active:bg-warning-subtle" },

      // ── ghost ─────────────────────────────────────────────
      { variant: "ghost", color: "default",  class: "text-accent-text hover:bg-accent-subtle active:bg-accent-subtle" },
      { variant: "ghost", color: "neutral",  class: "text-text hover:bg-border active:bg-border" },
      { variant: "ghost", color: "positive", class: "text-positive-text hover:bg-positive-subtle active:bg-positive-subtle" },
      { variant: "ghost", color: "negative", class: "text-negative-text hover:bg-negative-subtle active:bg-negative-subtle" },
      { variant: "ghost", color: "warning",  class: "text-warning-text hover:bg-warning-subtle active:bg-warning-subtle" },

      // ── soft ──────────────────────────────────────────────
      { variant: "soft", color: "default",  class: "bg-accent-subtle text-accent-text hover:opacity-80 active:opacity-80" },
      { variant: "soft", color: "neutral",  class: "bg-bg text-text-muted hover:bg-border active:bg-border" },
      { variant: "soft", color: "positive", class: "bg-positive-subtle text-positive-text hover:opacity-80 active:opacity-80" },
      { variant: "soft", color: "negative", class: "bg-negative-subtle text-negative-text hover:opacity-80 active:opacity-80" },
      { variant: "soft", color: "warning",  class: "bg-warning-subtle text-warning-text hover:opacity-80 active:opacity-80" },

      // ── link ──────────────────────────────────────────────
      { variant: "link", color: "default",  class: "text-accent-text" },
      { variant: "link", color: "neutral",  class: "text-text-muted" },
      { variant: "link", color: "positive", class: "text-positive-text" },
      { variant: "link", color: "negative", class: "text-negative-text" },
      { variant: "link", color: "warning",  class: "text-warning-text" },
    ],

    defaultVariants: {
      variant:  "solid",
      color:    "default",
      size:     "md",
      shape:    "rounded",
      width:    "auto",
      iconOnly: false,
    },
  }
);

export type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  ref?: React.Ref<HTMLButtonElement>;
  /** Render as child element (e.g. <a> or <Link>) via Radix Slot */
  asChild?: boolean;
  /** Icon placed before label */
  startIcon?: ReactNode;
  /** Icon placed after label */
  endIcon?: ReactNode;
  /** Disables and shows inline spinner */
  loading?: boolean;
}

function Button({
  ref,
  asChild,
  variant,
  color,
  size,
  shape,
  width,
  iconOnly,
  startIcon,
  endIcon,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      disabled={disabled || loading}
      className={button({ variant, color, size, shape, width, iconOnly, className })}
      {...props}
    >
      {loading ? (
        <Spinner size={size} />
      ) : (
        <>
          {startIcon}
          {children}
          {endIcon}
        </>
      )}
    </Comp>
  );
}

Button.displayName = "Button";

function Spinner({ size }: { size?: ButtonVariants["size"] }) {
  const dim = size === "xs" || size === "sm" ? "size-3.5" : "size-4";
  return (
    <svg
      className={`${dim} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export { Button, button };
