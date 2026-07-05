import { Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";

interface SelectPillsProps {
  options: string[];
  scores?: Record<string, -1 | 0 | 1>;
  value: string | undefined;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SelectPills({
  options,
  scores,
  value,
  onChange,
  onClear,
}: SelectPillsProps) {
  return (
    <div className="flex items-center flex-wrap gap-1 min-w-0 max-w-[180px] justify-end">
      {options.map((option) => {
        const selected = value === option;
        const score = scores?.[option] ?? 0;
        return (
          <button
            key={option}
            type="button"
            onClick={() => (selected ? onClear() : onChange(option))}
            className={`
              h-6 rounded-full px-2.5 text-[11px] font-medium
              transition-all duration-150 leading-none
              ${
                selected
                  ? score === 1
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                    : score === -1
                      ? "bg-red-50 text-red-700 border-red-200 shadow-xs"
                      : "bg-primary/10 text-primary border-primary/30 shadow-xs"
                  : "bg-transparent text-muted-foreground/60 border border-border/30 hover:border-border/60 hover:text-foreground/80"
              }
            `}
            style={selected ? { borderWidth: 1 } : { borderWidth: 1 }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

interface NumberBadgeProps {
  value: number | string | undefined;
  onChange: (value: number) => void;
  onClear: () => void;
}

export function NumberBadge({ value, onChange, onClear }: NumberBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/80 text-[10px] text-muted-foreground/60 font-medium">
        <Hash className="h-2.5 w-2.5" />
      </span>
      <Input
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue === "") {
            onClear();
            return;
          }
          onChange(Number(nextValue));
        }}
        className="h-7 w-[72px] text-xs rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="..."
      />
    </div>
  );
}

interface TextNoteProps {
  value: string | undefined;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function TextNote({ value, onChange, onClear }: TextNoteProps) {
  const hasContent = value !== undefined && value !== "";
  return (
    <div className="relative">
      <AutoResizeTextarea
        value={typeof value === "string" ? value : ""}
        onChange={(event) => {
          if (event.target.value === "") {
            onClear();
            return;
          }
          onChange(event.target.value);
        }}
        placeholder="..."
        className={`
          text-xs py-2 rounded-lg
          transition-all duration-150
          ${
            hasContent
              ? "bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/40 dark:border-amber-800/30"
              : "border-dashed border-border/40"
          }
        `}
      />
    </div>
  );
}
