import { Listing } from "@/types/listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit, Trash2 } from "lucide-react";

interface ListingDetailProps {
  listing: Listing;
  onEdit?: () => void;
  onDelete?: () => void;
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

export function ListingDetail({ listing, onEdit, onDelete }: ListingDetailProps) {
  const statusColor = statusColors[listing.status] || "bg-gray-500";
  const statusLabel = statusLabels[listing.status] || listing.status;

  const handleOpenSource = () => {
    window.open(listing.source_url, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl">{listing.title}</CardTitle>
          <Badge className={`${statusColor} text-white`}>{statusLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-2xl font-semibold">${listing.price.toLocaleString()}</p>
          </div>
          {listing.area && (
            <div>
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="text-lg">{listing.area}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Source Platform</p>
            <p>{listing.source_platform || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Source URL</p>
            <Button
              variant="link"
              className="p-0 h-auto text-left"
              onClick={handleOpenSource}
            >
              <span className="truncate block max-w-md">
                {listing.source_url}
              </span>
              <ExternalLink className="inline ml-2 h-4 w-4" />
            </Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{new Date(listing.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={onDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
