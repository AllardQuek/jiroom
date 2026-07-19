"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import SupportModal from "./SupportModal";

interface SupportButtonProps {
  variant?: "chip" | "icon";
}

export default function SupportButton({
  variant = "chip",
}: SupportButtonProps) {
  const [open, setOpen] = useState(false);

  if (variant === "icon") {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all bg-background border-border size-10"
          onClick={() => setOpen(true)}
          aria-label="Support JIRoom"
        >
          <Heart className="size-4" />
        </Button>
        <SupportModal open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-auto rounded-full border border-border/40 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs leading-none text-muted-foreground/60 hover:text-muted-foreground hover:border-border/60 transition-colors inline-flex gap-1.5 select-text"
        onClick={() => setOpen(true)}
      >
        <Heart className="size-3" />
        Enjoying JIRoom? ☕
      </Button>
      <SupportModal open={open} onOpenChange={setOpen} />
    </>
  );
}
