"use client";

import { Verdict } from "@/types/verdict";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Gavel } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { VerdictStatusButtons } from "./VerdictStatusButtons";
import { ScoreDisplay } from "./ScoreDisplay";
import { VerdictReasoning } from "./VerdictReasoning";

interface VerdictSectionProps {
  verdict: Verdict | null;
  listingId: string;
  onVerdictUpdate: (updates: Partial<Verdict>) => void;
  onVerdictCreate: (verdict: Verdict) => void;
  onVerdictDelete?: () => void;
}

export function VerdictSection({
  verdict,
  listingId,
  onVerdictUpdate,
  onVerdictCreate,
  onVerdictDelete,
}: VerdictSectionProps) {
  const t = useTranslations("verdict");
  const [isExpanded, setIsExpanded] = useState(true);

  if (!verdict) {
    return (
      <div className="rounded-xl bg-muted/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("title")}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{t("notSetYet")}</p>
        <VerdictStatusButtons
          currentStatus=""
          onStatusChange={(status) => {
            const newVerdict: Verdict = {
              id: crypto.randomUUID(),
              listing_id: listingId,
              status: status as "yes" | "maybe" | "no",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            onVerdictCreate(newVerdict);
          }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gavel className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t("title")}</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <ScoreDisplay listingId={listingId} />

          <VerdictStatusButtons
            currentStatus={verdict.status}
            onStatusChange={(status) => {
              if (status === verdict.status) {
                onVerdictDelete?.();
              } else {
                onVerdictUpdate({
                  status: status as "yes" | "maybe" | "no",
                  updated_at: new Date().toISOString(),
                });
              }
            }}
          />

          <VerdictReasoning
            reasoning={verdict.reasoning || ""}
            onReasoningChange={(reasoning) =>
              onVerdictUpdate({
                reasoning,
                updated_at: new Date().toISOString(),
              })
            }
          />

          {onVerdictDelete && (
            <button
              type="button"
              onClick={onVerdictDelete}
              className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors"
            >
              {t("clear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
