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
import { Label } from "@/components/ui/label";
import { Star, Bug, Share2 } from "lucide-react";

const TIERS = [
  {
    amount: 1,
    message: "That's a bus fare to the next viewing — thank you!",
    qr: "/support/paynow-1-sgd.jpg",
  },
  {
    amount: 2,
    message: "That's an iced kopi from the nearest hawker — thank you!",
    qr: "/support/paynow-2-sgd.jpg",
  },
  {
    amount: 5,
    message: "That's a kopi after a bad viewing — thank you!",
    qr: "/support/paynow-5-sgd.jpg",
  },
  {
    amount: 10,
    message: "That's a well-deserved lunch between viewings — thank you!",
    qr: "/support/paynow-10-sgd.jpg",
  },
];

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

export default function SupportModal({
  open,
  onOpenChange,
}: SupportModalProps) {
  const [selected, setSelected] = useState<(typeof TIERS)[number] | null>(null);
  const [note, setNote] = useState("");

  const showNote = Boolean(supportEmail);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelected(null);
      setNote("");
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

  const handleSendNote = () => {
    if (!supportEmail || !note.trim()) return;

    const tipLine = selected
      ? `I also sent a S$${selected.amount} tip via PayNow.`
      : "No tip selected.";

    const body = `${note.trim()}\n\n${tipLine}\n\n— from JIRoom`;
    const subject = "A note for JIRoom";

    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
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
            .{" "}
            {showNote
              ? "A quick note means a lot — and a small tip helps keep it running."
              : "If it helped your rental hunt, a small tip or share goes a long way."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {showNote && (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="support-note" className="text-sm">
                  Say thanks or share a thought
                </Label>
                <p className="text-xs text-muted-foreground">
                  Opens your email app — no account needed.
                </p>
              </div>
              <textarea
                id="support-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
                placeholder="Liked JIRoom? Found a bug? Just want to say hi..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {note.length} / 200
                </span>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleSendNote}
                  disabled={!note.trim()}
                  className="w-full sm:w-auto"
                >
                  Send note
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              Add a tip <span className="text-xs">(S$)</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {TIERS.map((tier) => {
                const isSelected = selected?.amount === tier.amount;
                return (
                  <Button
                    key={tier.amount}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelected(tier)}
                    className="h-14 w-14 rounded-full p-0 text-lg"
                    aria-label={`S$${tier.amount} tip`}
                  >
                    {tier.amount}
                  </Button>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                {selected.message}
              </p>
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
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
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
            <Button asChild variant="outline" size="sm" className="gap-1">
              <a
                href="https://github.com/AllardQuek/jiroom"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="size-4" />
                Star on GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1">
              <a
                href="https://github.com/AllardQuek/jiroom/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bug className="size-4" />
                Report an issue
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
