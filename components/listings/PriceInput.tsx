import { useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * Props for the PriceInput component
 */
interface PriceInputProps {
  field: {
    value: number | undefined;
    onChange: (v: number | undefined) => void;
    onBlur: () => void;
    ref: React.Ref<HTMLInputElement>;
    name: string;
  };
}

/**
 * A specialized input component for price values.
 * This component handles numeric input with automatic formatting,
 * ensuring only digits are accepted and converting between string
 * and number representations.
 *
 * @param field - The react-hook-form field object containing value, onChange, onBlur, ref, and name
 * @returns A controlled input component for price entry
 *
 * @example
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="price"
 *   render={({ field }) => <PriceInput field={field} />}
 * />
 * ```
 */
export function PriceInput({ field }: PriceInputProps) {
  const [text, setText] = useState(() =>
    field.value ? String(field.value) : ""
  );

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="0"
      value={text}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/\D/g, "");
        setText(cleaned);
        field.onChange(cleaned === "" ? undefined : Number(cleaned));
      }}
      onBlur={field.onBlur}
      ref={field.ref}
      name={field.name}
    />
  );
}
