"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useListingStore } from "@/store/listingStore";
import { useViewingStore } from "@/store/viewingStore";
import { ListingDetail } from "@/components/listings/ListingDetail";
import { EditListingForm } from "@/components/listings/EditListingForm";
import { DeleteConfirmationDialog } from "@/components/listings/DeleteConfirmationDialog";
import { ViewingSection } from "@/components/viewing/ViewingSection";
import { InlineNotes } from "@/components/notes/InlineNotes";
import { NotesSection } from "@/components/notes/NotesSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { notFound } from "next/navigation";
import { Viewing } from "@/types/listing";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const listings = useListingStore((state) => state.listings);
  const updateListing = useListingStore((state) => state.updateListing);
  const deleteListing = useListingStore((state) => state.deleteListing);
  const getViewingByListingId = useViewingStore((state) => state.getViewingByListingId);
  const addViewing = useViewingStore((state) => state.addViewing);
  const updateViewing = useViewingStore((state) => state.updateViewing);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Resolve params on mount
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const listing = resolvedParams ? listings.find((l) => l.id === resolvedParams.id) : null;
  const viewing = listing ? (getViewingByListingId(listing.id) ?? null) : null;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Show loading state while params are resolving
  if (!resolvedParams) {
    return <div className="p-4">Loading...</div>;
  }

  if (!listing) {
    notFound();
  }

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteListing(listing.id);
    router.push("/listings");
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

  return (
    <div className="p-4 space-y-4">
      <ListingDetail
        listing={listing}
        onEdit={handleEdit}
        onDelete={handleDelete}
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

      <NotesSection
        sources={[
          {
            label: "Listing",
            notes: listing.notes || "",
            updatedAt: undefined,
            onUpdate: handleListingNotesUpdate,
          },
          {
            label: "Viewing",
            notes: viewing?.notes || "",
            updatedAt: viewing?.notes_updated_at,
            onUpdate: (notes) => handleViewingUpdate({ notes, notes_updated_at: new Date().toISOString() }),
          },
        ]}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
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
