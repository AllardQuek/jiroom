"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useListingStore } from "@/store/listingStore";
import { ListingDetail } from "@/components/listings/ListingDetail";
import { EditListingForm } from "@/components/listings/EditListingForm";
import { DeleteConfirmationDialog } from "@/components/listings/DeleteConfirmationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { notFound } from "next/navigation";

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const listings = useListingStore((state) => state.listings);
  const deleteListing = useListingStore((state) => state.deleteListing);
  const listing = listings.find((l) => l.id === params.id);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  return (
    <div className="p-4">
      <ListingDetail
        listing={listing}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
