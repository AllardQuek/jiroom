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

          <Section title="Getting Started">
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">Quick Start (3 steps)</strong>
                <ol className="mt-2 space-y-1.5 list-decimal list-inside text-muted-foreground">
                  <li><strong className="text-foreground">Add a listing:</strong> Click "Add listing" on Listings page, paste URL from PropertyGuru/99.co</li>
                  <li><strong className="text-foreground">Evaluate:</strong> Click listing card, fill evaluation criteria, see score calculate automatically</li>
                  <li><strong className="text-foreground">Decide:</strong> Set verdict (Yes/Maybe/No) to move to decision columns</li>
                </ol>
              </div>
              <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                <p className="text-xs">
                  <strong>Tip:</strong> Use the sample data (flask icon 🧪) to explore features before adding your own listings.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Pages">
            <div className="space-y-4">
              <div>
                <strong className="text-foreground">Listings</strong> — Your main workspace
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li><strong className="text-foreground">Columns:</strong> To View (new listings), Yes/Maybe/No (your decisions after viewing)</li>
                  <li><strong className="text-foreground">Actions:</strong> Drag cards between columns, click card to evaluate/schedule/notes</li>
                  <li><strong className="text-foreground">Tools:</strong> Filter by area/price/score, Sort by price/score/date, Toggle compact view</li>
                  <li><strong className="text-foreground">Compare:</strong> Check boxes to select up to 3 listings, then click "Compare"</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Map</strong> — Visual location view
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li><strong className="text-foreground">Markers:</strong> All listings shown as pins, color-coded by status or area</li>
                  <li><strong className="text-foreground">Commute:</strong> Click a listing to see travel times to your anchors</li>
                  <li><strong className="text-foreground">Add from map:</strong> Search any location → click "Listing" or "Anchor" button</li>
                  <li><strong className="text-foreground">Filter:</strong> Toggle marker colors, change travel mode (driving/transit/walking/biking)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Compare</strong> — Side-by-side evaluation
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Select up to 3 listings via checkboxes on Listings page</li>
                  <li>View key criteria, scores, and verdicts side-by-side</li>
                  <li>Top-scored listing highlighted with badge</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Schedule</strong> — Your viewing timeline
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Upcoming and past viewings grouped by day</li>
                  <li>Click any entry to see full listing details</li>
                  <li>Schedule/reschedule directly from listing cards</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Settings Dialog">
            <p className="mb-2 text-muted-foreground">
              <strong className="text-foreground">Access:</strong> Settings icon (⚙️) on Listings page toolbar
            </p>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">Evaluation Templates</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Customize criteria for scoring listings</li>
                  <li>Add/remove/reorder criteria by category (Cost, Room, Bathroom, etc.)</li>
                  <li>Criterion types: checkbox, rating 1-5, number with thresholds, select dropdown, text notes</li>
                  <li><strong>Example:</strong> Add "Has aircon" as checkbox → +1 if yes, -1 if no</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Agent Questions</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Create question templates to send property agents</li>
                  <li><strong>Example:</strong> "Visitors allowed?", "Aircon hours?", "Current tenants?"</li>
                  <li>Copy to clipboard for easy sharing via WhatsApp/email</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Tenant Profile</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Store your details to share with agents</li>
                  <li>Fields: name, occupation, budget, move-in date, lease duration, etc.</li>
                  <li>Copy to clipboard for quick sharing</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Scoring">
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">How it works</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Each answered criterion contributes +1 (good), 0 (neutral), or -1 (bad)</li>
                  <li>Net score = total good points - total bad points</li>
                  <li>Text fields and unanswered questions don't affect score</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Score ranges</strong>
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">≥ +4:</strong> Great (emerald) — Excellent fit
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">+1 to +3:</strong> Good (green) — Strong contender
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-gray-400" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">0:</strong> Neutral (gray) — Mixed pros/cons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">-1 to -2:</strong> Below average (orange) — Major concerns
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">≤ -3:</strong> Poor (red) — Deal-breakers
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                <p className="text-xs text-muted-foreground">
                  <strong>Example:</strong> If you answer 8 criteria with 5 good (+5) and 2 bad (-2), your score is +3 (Good)
                </p>
              </div>
            </div>
          </Section>

          <Section title="Anchors">
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">What are anchors?</strong>
                <p className="mt-1 text-muted-foreground">
                  Your important locations: home, work, school, MRT stations. Set them once to evaluate commute times for all listings.
                </p>
              </div>
              <div>
                <strong className="text-foreground">How to add anchors</strong>
                <ol className="mt-1.5 space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Go to Map page</li>
                  <li>Search a location (e.g., "Raffles Place MRT")</li>
                  <li>Click the purple "Anchor" button that appears</li>
                  <li>Give it a name and type (e.g., "Office" → "work")</li>
                </ol>
              </div>
              <div>
                <strong className="text-foreground">Manage anchors</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Click "Anchors" button (top-right of Map page) to view/edit/delete</li>
                  <li>Diamond markers on map show your anchor locations</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Data Management">
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">Your data, your control</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>All data stored in your browser (no server, no sign-up)</li>
                  <li>Private and local - nothing leaves your device</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Backup & transfer</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li><strong className="text-foreground">Export:</strong> Download button on Listings page → saves all data as JSON file</li>
                  <li><strong className="text-foreground">Import:</strong> Upload button → restore from backup or transfer between devices</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Try it out</strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Click flask icon (🧪) on Listings page to load sample data</li>
                  <li>Explore all features with demo listings</li>
                  <li>Switch back to your data anytime</li>
                </ul>
              </div>
            </div>
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
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
