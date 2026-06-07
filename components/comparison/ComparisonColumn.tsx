import { Listing } from "@/types/listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useComparisonStore } from "@/store/comparisonStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useVerdictStore } from "@/store/verdictStore";
import { useViewingStore } from "@/store/viewingStore";
import { useTemplateStore } from "@/store/templateStore";
import { calculateScore } from "@/lib/utils/calculateScore";

interface ComparisonColumnProps {
  listing: Listing;
}

const statusColors: Record<string, string> = {
  yes: "bg-green-500",
  maybe: "bg-yellow-500",
  no: "bg-red-500",
  undecided: "bg-gray-500",
};

const viewingStatusColors: Record<string, string> = {
  "to-view": "bg-blue-500",
  upcoming: "bg-purple-500",
  viewed: "bg-green-500",
  skipped: "bg-gray-500",
  cancelled: "bg-red-500",
};

export function ComparisonColumn({ listing }: ComparisonColumnProps) {
  const router = useRouter();
  const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);
  const evaluation = useEvaluationStore((state) => state.getEvaluationByListingId(listing.id));
  const verdict = useVerdictStore((state) => state.getVerdictByListingId(listing.id));
  const viewing = useViewingStore((state) => state.getViewingByListingId(listing.id));
  const templates = useTemplateStore((state) => state.templates);

  const score = evaluation && templates.length > 0
    ? calculateScore(evaluation.responses, templates[0])
    : null;

  const handleRemove = () => {
    removeFromComparison(listing.id);
  };

  const handleViewDetails = () => {
    router.push(`/listings/${listing.id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {listing.title}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">${listing.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Area:</span>
            <span className="font-medium">{listing.area} sqft</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Source:</span>
            <span className="font-medium">{listing.source_platform}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Score:</span>
            {score !== null ? (
              <span className="font-bold text-lg">{score}/100</span>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Verdict:</span>
            {verdict ? (
              <Badge className={statusColors[verdict.status]}>
                {verdict.status}
              </Badge>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Viewing:</span>
            {viewing ? (
              <Badge className={viewingStatusColors[viewing.status]}>
                {viewing.status}
              </Badge>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleViewDetails}
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
