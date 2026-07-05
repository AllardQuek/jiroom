import { ArrowUpDown } from "lucide-react";

type SortField =
  | "price"
  | "score"
  | "name"
  | "date"
  | "area"
  | "created_date"
  | "modified_date";
type SortDir = "asc" | "desc";

interface SortConfig {
  by: SortField;
  dir: SortDir;
}

interface SortButtonProps {
  columnId: string;
  options: readonly {
    readonly label: string;
    readonly value: SortConfig | null;
  }[];
  sortConfigs: Record<string, SortConfig | null>;
  setSortConfigs: (
    fn: (
      prev: Record<string, SortConfig | null>
    ) => Record<string, SortConfig | null>
  ) => void;
  openSortCol: string | null;
  setOpenSortCol: (id: string | null) => void;
}

/**
 * A button component that displays a sort dropdown for a column.
 * This component allows users to sort listings by various criteria
 * such as price, score, name, date, or area in ascending or descending order.
 *
 * @param columnId - The ID of the column this sort button belongs to
 * @param options - Array of available sort options with labels and values
 * @param sortConfigs - Current sort configuration for all columns
 * @param setSortConfigs - Function to update sort configurations
 * @param openSortCol - ID of the currently open sort dropdown
 * @param setOpenSortCol - Function to set which sort dropdown is open
 * @returns A sort button with dropdown menu
 *
 * @example
 * ```tsx
 * <SortButton
 *   columnId="to_view"
 *   options={SORT_OPTIONS}
 *   sortConfigs={sortConfigs}
 *   setSortConfigs={setSortConfigs}
 *   openSortCol={openSortCol}
 *   setOpenSortCol={setOpenSortCol}
 * />
 * ```
 */
export function SortButton({
  columnId,
  options,
  sortConfigs,
  setSortConfigs,
  openSortCol,
  setOpenSortCol,
}: SortButtonProps) {
  const config = sortConfigs[columnId] ?? null;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpenSortCol(openSortCol === columnId ? null : columnId)
        }
        className={`flex items-center rounded-md p-1 text-xs ${
          config
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/60"
        }`}
        title="Sort listings"
      >
        <ArrowUpDown size={12} />
      </button>
      {openSortCol === columnId && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenSortCol(null)}
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border bg-popover p-1 shadow-md">
            {options.map((opt) => {
              const isActive =
                JSON.stringify(config) === JSON.stringify(opt.value);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setSortConfigs((prev) => ({
                      ...prev,
                      [columnId]: opt.value,
                    }));
                    setOpenSortCol(null);
                  }}
                  className={`w-full rounded-md px-2.5 py-1.5 text-left text-xs ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted/80"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
