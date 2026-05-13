import { cva, type VariantProps } from "class-variance-authority";
import { type InputHTMLAttributes, type ReactNode, useId } from "react";

const input = cva(
  [
    "w-full border bg-surface text-text",
    "placeholder:text-text-subtle",
    "transition-colors duration-150",
    "outline-none focus:outline-none focus-visible:outline-none",
    "disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed",
  ],
  {
    variants: {
      /**
       * size — height + padding + font size
       */
      size: {
        sm: "h-[34px] text-body-sm px-4",
        md: "h-[42px] text-body-md px-5",
        lg: "h-[52px] text-body-lg px-6",
      },

      /**
       * shape — border radius
       */
      shape: {
        pill:    "rounded-pill",
        rounded: "rounded-card",
        square:  "rounded-sm",
      },

      /**
       * state — validation visual
       */
      state: {
        default:  "border-border hover:border-border-strong focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-subtle focus-visible:ring-offset-surface",
        error:    "border-negative focus-visible:border-negative focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-negative-subtle focus-visible:ring-offset-surface",
        success:  "border-positive focus-visible:border-positive focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-positive-subtle focus-visible:ring-offset-surface",
      },

      hasStartIcon: { true: "ps-12", false: "" },
      hasEndIcon:   { true: "pe-12", false: "" },
    },

    defaultVariants: {
      size:  "md",
      shape: "pill",
      state: "default",
      hasStartIcon: false,
      hasEndIcon:   false,
    },
  }
);

export type InputVariants = VariantProps<typeof input>;

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<InputVariants, "hasStartIcon" | "hasEndIcon"> {
  ref?: React.Ref<HTMLInputElement>;
  /** Label text shown above input */
  label?: ReactNode;
  /** Helper text shown below input */
  helperText?: ReactNode;
  /** Error message — overrides helperText and forces error state */
  error?: ReactNode;
  /** Icon placed at start (RTL/LTR aware) */
  startIcon?: ReactNode;
  /** Icon placed at end (RTL/LTR aware) */
  endIcon?: ReactNode;
}

function Input({
  ref,
  id,
  label,
  helperText,
  error,
  startIcon,
  endIcon,
  size,
  shape,
  state,
  className,
  ...props
}: InputProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const helperId = `${inputId}-help`;
  const resolvedState = error ? "error" : state;
  const helper = error ?? helperText;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-label-md font-medium text-text"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <span className="pointer-events-none absolute inset-s-4 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
            {startIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={helper ? helperId : undefined}
          className={input({
            size,
            shape,
            state: resolvedState,
            hasStartIcon: !!startIcon,
            hasEndIcon:   !!endIcon,
            className,
          })}
          {...props}
        />

        {endIcon && (
          <span className="pointer-events-none absolute inset-e-4 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
            {endIcon}
          </span>
        )}
      </div>

      {helper && (
        <p
          id={helperId}
          className={`text-label-sm ${error ? "text-negative-text" : "text-text-muted"}`}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

Input.displayName = "Input";

export { Input, input };
