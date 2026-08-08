"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  listingTitle: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  listingTitle,
}: DeleteConfirmationDialogProps) {
  const t = useTranslations("listings.delete");
  const tCommon = useTranslations("common");

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("confirm", { title: listingTitle })} {t("cannotUndo")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {tCommon("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
