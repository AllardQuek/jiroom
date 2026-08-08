"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
  { label: "1", amount: 1, qr: "/support/paynow-1-sgd.jpg" },
  { label: "2", amount: 2, qr: "/support/paynow-2-sgd.jpg" },
  { label: "5", amount: 5, qr: "/support/paynow-5-sgd.jpg" },
  { label: "?", amount: null, qr: "/support/paynow-custom-sgd.jpg" },
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
  const t = useTranslations("support.modal");
  const tierMessages = t.raw("tiers") as Record<string, { message: string }>;
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
        title: t("share.title"),
        text: t("share.text"),
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
      ? selected.amount
        ? t("email.tipWithAmount", { amount: selected.amount })
        : t("email.tipCustom")
      : t("email.noTip");

    const signature = t("email.signature");
    const body = `${note.trim()}\n\n${tipLine}\n\n${signature}`;
    const subject = t("email.subject");

    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t.rich("description", {
              hasNote: showNote ? "yes" : "other",
              link: (chunks) => (
                <a
                  href="https://github.com/AllardQuek/jiroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  {chunks}
                </a>
              ),
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {showNote && (
            <div className="space-y-3">
              <Label htmlFor="support-note" className="text-sm">
                {t("noteLabel")}
              </Label>
              <textarea
                id="support-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
                placeholder={t("notePlaceholder")}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground/80">
                  {t.rich("noteHelper", {
                    email: supportEmail ?? "",
                    emailLink: (chunks) => (
                      <a href={`mailto:${supportEmail ?? ""}`} className="underline">
                        {chunks}
                      </a>
                    ),
                  })}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("noteCounter", { count: note.length })}
                </span>
              </div>
              <Button
                type="button"
                variant="default"
                onClick={handleSendNote}
                disabled={!note.trim()}
                className="w-full sm:w-auto"
              >
                {t("sendNote")}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              {t("tipLabel")} <span className="text-xs">({t("tipCurrency")})</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {TIERS.map((tier) => {
                const isSelected = selected?.label === tier.label;
                return (
                  <Button
                    key={tier.label}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelected(tier)}
                    className="h-14 w-14 rounded-full p-0 text-lg"
                    aria-label={
                      tier.amount
                        ? t("tierAmountLabel", { amount: tier.amount })
                        : t("customTipLabel")
                    }
                  >
                    {tier.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                {tierMessages[selected.label]?.message}
              </p>
              <div className="flex justify-center bg-white p-2 rounded-lg shadow">
                <Image
                  src={selected.qr}
                  alt={
                    selected.amount
                      ? t("qrAltAmount", { amount: selected.amount })
                      : t("qrAltCustom")
                  }
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
              {t("share.button")}
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1">
              <a
                href="https://github.com/AllardQuek/jiroom"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="size-4" />
                {t("star")}
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1">
              <a
                href="https://github.com/AllardQuek/jiroom/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bug className="size-4" />
                {t("report")}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
