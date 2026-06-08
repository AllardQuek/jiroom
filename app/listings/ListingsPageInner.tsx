"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ListingList } from "@/components/listings/ListingList";
import { ListingDetailModal } from "@/components/listings/ListingDetailModal";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { useComparisonStore } from "@/store/comparisonStore";

export function ListingsPageInner() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const detailId = searchParams.get("detail");
    if (detailId) {
      setSelectedListingId(detailId);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("detail");
      router.replace(`/listings?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);
  const selectedListingIds = useComparisonStore(
    (state) => state.selectedListingIds
  );

  const handleCompare = () => {
    router.push("/compare");
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listings</h1>
          <p className="text-sm text-muted-foreground">
            Track each room from first save to final decision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedListingIds.length >= 2 && (
            <Button variant="outline" onClick={handleCompare}>
              Compare ({selectedListingIds.length})
            </Button>
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add listing
          </Button>
        </div>
      </div>

      <ListingList onListingClick={(id) => setSelectedListingId(id)} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
          </DialogHeader>
          <CreateListingForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ListingDetailModal
        listingId={selectedListingId ?? ""}
        open={!!selectedListingId}
        onClose={() => setSelectedListingId(null)}
      />
    </div>
  );
}
