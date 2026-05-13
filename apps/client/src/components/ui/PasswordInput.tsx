import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { input as inputCva, type InputVariants } from "./Input";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    Omit<InputVariants, "hasStartIcon" | "hasEndIcon"> {
  ref?: React.Ref<HTMLInputElement>;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </>
    )}
  </svg>
);

export function PasswordInput({
  ref,
  id,
  label,
  helperText,
  error,
  size,
  shape,
  state,
  className,
  ...props
}: Props) {
  const [show, setShow] = useState(false);
  const reactId = useId();
  const inputId = id ?? reactId;
  const helperId = `${inputId}-help`;
  const resolvedState = error ? "error" : state;
  const helper = error ?? helperText;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="text-label-md font-medium text-text">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={show ? "text" : "password"}
          aria-invalid={!!error || undefined}
          aria-describedby={helper ? helperId : undefined}
          className={inputCva({
            size,
            shape,
            state: resolvedState,
            hasEndIcon: true,
            className,
          })}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
          tabIndex={-1}
          className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors p-1 -m-1 rounded-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-subtle"
        >
          <EyeIcon open={show} />
        </button>
      </div>

      {helper && (
        <p id={helperId} className={`text-label-sm ${error ? "text-negative-text" : "text-text-muted"}`}>
          {helper}
        </p>
      )}
    </div>
  );
}
