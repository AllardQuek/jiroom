import { useDraggable } from "@dnd-kit/core";
import { Listing } from "@/types/listing";
import { ListingCard } from "./ListingCard";

/**
 * Props for the DraggableListing component
 */
interface DraggableListingProps {
  listing: Listing;
  compact?: boolean;
  compareMode?: boolean;
  onClick?: (id: string) => void;
}

/**
 * A wrapper component that makes a ListingCard draggable using dnd-kit.
 * This component enables drag-and-drop functionality for listing cards
 * within the ListingList component, allowing users to move listings
 * between different status columns.
 *
 * @param listing - The listing to make draggable
 * @param compact - Whether to show the compact version of the card
 * @param compareMode - Whether comparison mode is enabled
 * @param onClick - Callback when the card is clicked
 * @returns A draggable listing card component
 *
 * @example
 * ```tsx
 * <DraggableListing
 *   listing={listing}
 *   compact={true}
 *   onClick={(id) => handleListingClick(id)}
 * />
 * ```
 */
export function DraggableListing({
  listing,
  compact,
  compareMode,
  onClick,
}: DraggableListingProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: listing.id,
    data: { listing },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-30" : ""}
    >
      <ListingCard
        listing={listing}
        compact={compact}
        compareMode={compareMode}
        onClick={onClick}
      />
    </div>
  );
}
