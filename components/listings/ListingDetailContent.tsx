"use client";

import { useState } from "react";
import { useListingStore } from "@/store/listingStore";
import { useViewingStore } from "@/store/viewingStore";
import { useVerdictStore } from "@/store/verdictStore";
import { ListingDetail } from "@/components/listings/ListingDetail";
import { EditListingForm } from "@/components/listings/EditListingForm";
import { DeleteConfirmationDialog } from "@/components/listings/DeleteConfirmationDialog";
import { ViewingSection } from "@/components/viewing/ViewingSection";
import { EvaluationSection } from "@/components/evaluation/EvaluationSection";
import { InlineNotes } from "@/components/notes/InlineNotes";
import { VerdictSection } from "@/components/verdict/VerdictSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Viewing } from "@/types/listing";
import { Verdict } from "@/types/verdict";

interface ListingDetailContentProps {
  listingId: string;
  onDeleted?: () => void;
}

export function ListingDetailContent({
  listingId,
  onDeleted,
}: ListingDetailContentProps) {
  const listings = useListingStore((state) => state.listings);
  const updateListing = useListingStore((state) => state.updateListing);
  const deleteListing = useListingStore((state) => state.deleteListing);

  const viewings = useViewingStore((state) => state.viewings);
  const addViewing = useViewingStore((state) => state.addViewing);
  const updateViewing = useViewingStore((state) => state.updateViewing);

  const verdicts = useVerdictStore((state) => state.verdicts);
  const addVerdict = useVerdictStore((state) => state.addVerdict);
  const updateVerdict = useVerdictStore((state) => state.updateVerdict);
  const deleteVerdict = useVerdictStore((state) => state.deleteVerdict);

  const listing = listings.find((l) => l.id === listingId) ?? null;
  const viewing = listing
    ? (viewings.find((v) => v.listing_id === listing.id) ?? null)
    : null;
  const verdict = listing
    ? (verdicts.find((v) => v.listing_id === listing.id) ?? null)
    : null;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isDeleting) {
    return <div className="p-4 text-sm text-muted-foreground">Deleting...</div>;
  }

  if (!listing) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Listing not found. It may have been deleted.
        </p>
        <Button type="button" onClick={onDeleted}>
          Back to Listings
        </Button>
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    deleteListing(listing.id);
    onDeleted?.();
  };

  const handleListingNotesUpdate = (notes: string) => {
    updateListing(listing.id, { notes });
  };

  const handleViewingUpdate = (updates: Partial<Viewing>) => {
    if (viewing) {
      updateViewing(viewing.id, updates);
    }
  };

  const handleViewingCreate = (newViewing: Viewing) => {
    addViewing(newViewing);
  };

  const handleVerdictUpdate = (updates: Partial<Verdict>) => {
    if (verdict) {
      updateVerdict(verdict.id, updates);
    }
    updateListing(listing!.id, { status: "viewed" });
  };

  const handleVerdictCreate = (newVerdict: Verdict) => {
    addVerdict(newVerdict);
    updateListing(listing!.id, { status: "viewed" });
  };

  const handleVerdictDelete = () => {
    if (verdict) {
      deleteVerdict(verdict.id);
      updateListing(listing!.id, { status: "to_view" });
    }
  };

  return (
    <div className="space-y-5">
      <ListingDetail
        listing={listing}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <InlineNotes
        notes={listing.notes || ""}
        onUpdate={handleListingNotesUpdate}
        label="Listing Notes"
      />

      <ViewingSection
        viewing={viewing}
        listingId={listing.id}
        onViewingUpdate={handleViewingUpdate}
        onViewingCreate={handleViewingCreate}
      />

      <EvaluationSection listingId={listing.id} />

      <VerdictSection
        verdict={verdict}
        listingId={listing.id}
        onVerdictUpdate={handleVerdictUpdate}
        onVerdictCreate={handleVerdictCreate}
        onVerdictDelete={handleVerdictDelete}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          <EditListingForm
            listing={listing}
            onSuccess={() => setIsEditDialogOpen(false)}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        listingTitle={listing.title}
      />
    </div>
  );
}
