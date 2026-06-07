import { Listing } from "@/types/listing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  listing: Listing;
}

const statusColors: Record<string, string> = {
  new: "bg-gray-500",
  to_view: "bg-blue-500",
  viewed: "bg-green-500",
  archived: "bg-gray-400",
  shortlisted: "bg-yellow-500",
};

const statusLabels: Record<string, string> = {
  new: "New",
  to_view: "To View",
  viewed: "Viewed",
  archived: "Archived",
  shortlisted: "Shortlisted",
};

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/listings/${listing.id}`);
  };

  const statusColor = statusColors[listing.status] || "bg-gray-500";
  const statusLabel = statusLabels[listing.status] || listing.status;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
          <Badge className={`${statusColor} text-white`}>{statusLabel}</Badge>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">
            ${listing.price.toLocaleString()}
          </p>
          {listing.area && <p>{listing.area}</p>}
          {listing.source_platform && (
            <p className="text-xs">{listing.source_platform}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
