"use client";

import { Filter } from "lucide-react";
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface ListingFilters {
  hideTaken: boolean;
  areas: string[];
  priceMin: number | null;
  priceMax: number | null;
}

// Helper function to get the effective price for filtering/sorting
export function getEffectivePrice(listing: { price: number; negotiated_price?: number }): number {
  return listing.negotiated_price ?? listing.price;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  areas: string[];
}

export function FilterDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  areas,
}: FilterDialogProps) {
  const t = useTranslations('listings.filter');
  const handleFilterChange = (key: keyof ListingFilters, value: boolean | string | number | null | string[]) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ListingFilters = {
      hideTaken: false,
      areas: [],
      priceMin: null,
      priceMax: null,
    };
    onFiltersChange(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter size={18} />
            {t('title')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hideTaken">{t('hideTaken')}</Label>
            <Switch
              id="hideTaken"
              checked={filters.hideTaken}
              onCheckedChange={(checked) => handleFilterChange("hideTaken", checked)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="area">{t('area')}</Label>
              {filters.areas.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleFilterChange("areas", [])}
                  className="text-xs text-primary hover:underline"
                >
                  {t('clearSelection')}
                </button>
              )}
            </div>
            <select
              id="area"
              multiple
              value={filters.areas}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, (opt) => opt.value);
                handleFilterChange("areas", selectedOptions);
              }}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              size={Math.min(areas.length + 1, 5)}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">{t('multipleHint')}</p>
          </div>

          <div className="space-y-2">
            <Label>{t('priceRange')}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder={t('minPrice')}
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  handleFilterChange("priceMin", e.target.value ? Number(e.target.value) : null)
                }
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder={t('maxPrice')}
                value={filters.priceMax ?? ""}
                onChange={(e) =>
                  handleFilterChange("priceMax", e.target.value ? Number(e.target.value) : null)
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            {t('reset')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
