"use client";

import { Filter } from "lucide-react";
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
            Filter Listings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hideTaken">Hide taken listings</Label>
            <Switch
              id="hideTaken"
              checked={filters.hideTaken}
              onCheckedChange={(checked) => handleFilterChange("hideTaken", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
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
            <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple areas</p>
          </div>

          <div className="space-y-2">
            <Label>Price range</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  handleFilterChange("priceMin", e.target.value ? Number(e.target.value) : null)
                }
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder="Max"
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
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
