"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star, Bug, Share2 } from "lucide-react";

const TIERS = [
  {
    label: "Bus fare to next viewing",
    amount: 1,
    qr: "/support/paynow-1-sgd.jpg",
  },
  {
    label: "MRT to next viewing",
    amount: 2,
    qr: "/support/paynow-2-sgd.jpg",
  },
  {
    label: "Kopi after a bad viewing",
    amount: 5,
    qr: "/support/paynow-5-sgd.jpg",
  },
  {
    label: "Agent co-broke coffee",
    amount: 10,
    qr: "/support/paynow-10-sgd.jpg",
  },
];

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SupportModal({
  open,
  onOpenChange,
}: SupportModalProps) {
  const [selected, setSelected] = useState<(typeof TIERS)[number] | null>(null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelected(null);
    }
    onOpenChange(newOpen);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    if (navigator.share) {
      await navigator.share({
        title: "JIRoom",
        text: "JIRoom helped my rental hunt in Singapore.",
        url,
      });
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enjoying JIRoom?</DialogTitle>
          <DialogDescription>
            JIRoom is{" "}
            <a
              href="https://github.com/AllardQuek/jiroom"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              free and open-source
            </a>
            . If it helped your hunt, pick an amount and scan with any bank app
            — the amount is pre-filled.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {TIERS.map((tier) => {
              const isSelected = selected?.amount === tier.amount;
              return (
                <Button
                  key={tier.amount}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelected(tier)}
                  className="h-auto py-3 flex flex-col items-start text-left !select-text"
                >
                  <span className="text-sm font-medium">{tier.label}</span>
                  <span
                    className={
                      isSelected
                        ? "text-xs text-primary-foreground/80"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    SGD {tier.amount}
                  </span>
                </Button>
              );
            })}
          </div>

          {selected && (
            <div className="flex justify-center bg-white p-2 rounded-lg shadow">
              <Image
                src={selected.qr}
                alt={`PayNow QR for SGD ${selected.amount}`}
                width={645}
                height={717}
                className="w-56 h-auto rounded"
                unoptimized
              />
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Can&apos;t use PayNow? You can still support JIRoom by sharing or
              contributing.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleShare}
              >
                <Share2 className="size-4" />
                Share
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() =>
                  window.open(
                    "https://github.com/AllardQuek/jiroom",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <Star className="size-4" />
                Star on GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() =>
                  window.open(
                    "https://github.com/AllardQuek/jiroom/issues/new",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <Bug className="size-4" />
                Report an issue
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
