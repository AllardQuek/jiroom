import { Verdict } from "@/types/verdict";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { VerdictStatusButtons } from "./VerdictStatusButtons";
import { ScoreDisplay } from "./ScoreDisplay";
import { VerdictReasoning } from "./VerdictReasoning";

interface VerdictSectionProps {
  verdict: Verdict | null;
  listingId: string;
  onVerdictUpdate: (updates: Partial<Verdict>) => void;
  onVerdictCreate: (verdict: Verdict) => void;
}

const statusLabels: Record<string, string> = {
  yes: "Yes",
  maybe: "Maybe",
  no: "No",
  undecided: "Undecided",
};

const statusColors: Record<string, string> = {
  yes: "bg-green-500",
  maybe: "bg-yellow-500",
  no: "bg-red-500",
  undecided: "bg-gray-500",
};

export function VerdictSection({
  verdict,
  listingId,
  onVerdictUpdate,
  onVerdictCreate,
}: VerdictSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!verdict) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verdict</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No verdict set yet
          </p>
          <VerdictStatusButtons
            currentStatus="undecided"
            onStatusChange={(status) => {
              const newVerdict: Verdict = {
                id: crypto.randomUUID(),
                listing_id: listingId,
                status: status as "yes" | "maybe" | "no" | "undecided",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              onVerdictCreate(newVerdict);
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Verdict</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={statusColors[verdict.status]}>
              {statusLabels[verdict.status]}
            </Badge>
          </div>

          <ScoreDisplay listingId={listingId} />

          <VerdictStatusButtons
            currentStatus={verdict.status}
            onStatusChange={(status) =>
              onVerdictUpdate({
                status: status as "yes" | "maybe" | "no" | "undecided",
                updated_at: new Date().toISOString(),
              })
            }
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
        </CardContent>
      )}
    </Card>
  );
}
