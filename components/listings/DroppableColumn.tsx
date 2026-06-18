import { useDroppable } from "@dnd-kit/core";

/**
 * Props for the DroppableColumn component
 */
interface DroppableColumnProps {
  columnId: string;
  className?: string;
  children: React.ReactNode;
  dropData?: any;
}

/**
 * A droppable column component that accepts draggable listings.
 * This component uses dnd-kit to create a drop zone where listings
 * can be dragged and dropped, providing visual feedback when a draggable
 * item is hovering over the column.
 *
 * @param columnId - The ID of the column (used for drop target identification)
 * @param className - Optional additional CSS classes
 * @param children - The column content (typically listing cards)
 * @returns A droppable section with visual feedback on hover
 *
 * @example
 * ```tsx
 * <DroppableColumn columnId="to_view" className="min-h-[200px]">
 *   {listings.map(listing => <DraggableListing key={listing.id} listing={listing} />)}
 * </DroppableColumn>
 * ```
 */
export function DroppableColumn({
  columnId,
  className,
  children,
  dropData,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnId}`,
    data: { columnId, ...dropData },
  });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[200px] lg:min-h-[560px] flex-col rounded-xl bg-muted/30 transition-colors ${className ?? ""} ${
        isOver ? "bg-primary/5 ring-2 ring-primary/30" : ""
      }`}
    >
      {children}
    </section>
  );
}
