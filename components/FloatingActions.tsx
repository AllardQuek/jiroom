"use client";

import { useEffect, useState } from "react";
import { Bug, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import HelpDialog from "@/components/HelpDialog";

const GITHUB_ISSUES_URL =
  "https://github.com/AllardQuek/rental-room-rater/issues/new";

export default function FloatingActions() {
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "?" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        )
      ) {
        e.preventDefault();
        setHelpOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div className="hidden sm:flex fixed bottom-[calc(7rem+env(safe-area-inset-bottom,0px))] right-4 z-40 items-center gap-2">
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Report an issue on GitHub"
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all bg-background border-border size-10"
          >
            <Bug className="size-4" />
          </Button>
        </a>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all bg-background border-border size-10"
          onClick={() => setHelpOpen(true)}
          aria-label="Open help"
        >
          <CircleHelp className="size-4" />
        </Button>
      </div>
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
