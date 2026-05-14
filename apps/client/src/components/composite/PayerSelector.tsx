import { Avatar } from "@/components/ui/Avatar";

export interface PayerSelectorOption {
  id: string;
  fullName: string;
}

export interface PayerSelectorProps {
  options: PayerSelectorOption[];
  value: string | null;
  onChange: (id: string) => void;
}

export function PayerSelector({ options, value, onChange }: PayerSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((u) => {
        const selected = u.id === value;
        return (
          <button
            key={u.id}
            type="button"
            onClick={() => onChange(u.id)}
            aria-pressed={selected}
            className={`flex items-center gap-2 rounded-pill ps-1.5 pe-3 py-1 border transition-colors cursor-pointer ${
              selected
                ? "border-accent bg-accent-subtle text-accent-text"
                : "border-border bg-surface text-text-muted hover:bg-bg"
            }`}
          >
            <Avatar name={u.fullName} size="sm" tone={selected ? "violet" : "ink"} />
            <span className="text-label-sm font-medium">{u.fullName.split(/\s+/)[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
