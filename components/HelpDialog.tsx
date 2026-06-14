"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Help & Guide</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <Section title="What is Room Rater?">
            <p>
              <a
                href="https://github.com/AllardQuek/rental-room-rater"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Room Rater
              </a>
              {" "}keeps your rental search organised in one place — no more
              juggling browser tabs, spreadsheet notes, and forgotten links.
              Track listings from any portal, evaluate them consistently,
              schedule viewings, compare options side-by-side, and judge
              locations by commute times to the places that matter.
            </p>
            <p className="mt-2">
              Everything stays in your browser. No sign-up, no server, no
              ads.
            </p>
          </Section>

          <Section title="Pages">
            <div className="space-y-3">
              <div>
                <strong>Listings</strong> — A kanban board to organise your
                shortlist. Drag cards between To View, Yes, Maybe, and No
                columns. Click any card to evaluate it against your criteria,
                schedule a viewing, add notes, or record a final verdict.
              </div>
              <div>
                <strong>Map</strong> — See all listings on a map, colour-coded
                by status or area. Click a listing to see commute times to
                your anchors. Search any location to add a new listing or
                anchor directly.
              </div>
              <div>
                <strong>Compare</strong> — Stack up to 3 listings side by
                side to spot the best option. The top-scored listing gets a
                badge. Select listings from the kanban via checkboxes.
              </div>
              <div>
                <strong>Schedule</strong> — A timeline of all your upcoming
                and past viewings, grouped by day. Click any entry to see the
                full listing details. Schedule or reschedule viewings from
                within any listing card.
              </div>
            </div>
          </Section>

          <Section title="Scoring">
            <p className="mb-2">
              Every scorable criterion in your evaluation template contributes{" "}
              <strong>+1</strong> (positive), <strong>0</strong> (neutral), or{" "}
              <strong>-1</strong> (negative). The score is the{" "}
              <strong>net sum</strong> — a simple count of green flags minus
              red flags. Text fields and unanswered criteria are excluded.
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-emerald-500" />
                <span>
                  <strong>Score &ge; +4</strong> — Great
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-green-500" />
                <span>
                  <strong>Score +1 to +3</strong> — Good
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-gray-400" />
                <span>
                  <strong>Score 0</strong> — Neutral
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-orange-500" />
                <span>
                  <strong>Score -1 to -2</strong> — Below Average
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-red-500" />
                <span>
                  <strong>Score &le; -3</strong> — Poor
                </span>
              </div>
            </div>
            <p className="mt-2">
              Customise your criteria, scoring rules, and thresholds in the{" "}
              <strong>Template Editor</strong> (available from Settings).
            </p>
          </Section>

          <Section title="Anchors">
            <p>
              Anchors are your key places — home, work, school, MRT stations.
              Set them once and use commute times as a factor when evaluating
              listings. They appear as coloured diamond markers on the map.
              Create anchors from the map search or the anchor list view.
            </p>
          </Section>

          <Section title="Data">
            <p>
              All data lives in your browser (localStorage). Nothing is sent
              to a server. Use the export and import buttons in the Listings
              toolbar to back up or transfer your data between devices.
            </p>
          </Section>

          <Section title="Keyboard Shortcuts">
            <p>
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">?</kbd>{" "}
              to toggle this help dialog from any page.
            </p>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-semibold text-base mb-1.5">{title}</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
