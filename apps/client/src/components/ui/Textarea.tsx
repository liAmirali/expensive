import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode, type TextareaHTMLAttributes, useId } from "react";

const textarea = cva(
  [
    "w-full border bg-surface text-text",
    "placeholder:text-text-subtle",
    "transition-colors duration-150",
    "outline-none focus:outline-none focus-visible:outline-none",
    "disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed",
    "resize-y min-h-24 py-3 px-5 text-body-md",
  ],
  {
    variants: {
      shape: {
        rounded: "rounded-card",
        square:  "rounded-sm",
      },
      state: {
        default:  "border-border hover:border-border-strong focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-subtle focus-visible:ring-offset-surface",
        error:    "border-negative focus-visible:border-negative focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-negative-subtle focus-visible:ring-offset-surface",
      },
    },
    defaultVariants: { shape: "rounded", state: "default" },
  }
);

export type TextareaVariants = VariantProps<typeof textarea>;

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    Omit<TextareaVariants, "state"> {
  ref?: React.Ref<HTMLTextAreaElement>;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

function Textarea({
  ref,
  id,
  label,
  helperText,
  error,
  shape,
  className,
  ...props
}: TextareaProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const helperId = `${inputId}-help`;
  const helper = error ?? helperText;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="text-label-md font-medium text-text">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={!!error || undefined}
        aria-describedby={helper ? helperId : undefined}
        className={textarea({ shape, state: error ? "error" : "default", className })}
        {...props}
      />

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

Textarea.displayName = "Textarea";

export { Textarea, textarea };
