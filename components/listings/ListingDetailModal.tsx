"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingDetailContent } from "./ListingDetailContent";

interface ListingDetailModalProps {
  listingId: string;
  open: boolean;
  onClose: () => void;
}

export function ListingDetailModal({
  listingId,
  open,
  onClose,
}: ListingDetailModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-[0_8px_32px_var(--shadow-modal)] max-h-[85dvh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
          <Dialog.Title className="sr-only">Listing Details</Dialog.Title>
          <Dialog.Description className="sr-only">
            View listing details including price, score, and notes
          </Dialog.Description>
          <div className="sticky top-0 z-10 flex justify-end pr-3 pt-3">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-background/80 backdrop-blur-xl rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="px-4 pb-4">
            <ListingDetailContent listingId={listingId} onDeleted={onClose} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
