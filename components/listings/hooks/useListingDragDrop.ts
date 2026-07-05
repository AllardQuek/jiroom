import { useState, useCallback } from "react";
import {
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useListingStore } from "@/store/listingStore";
import { useVerdictStore } from "@/store/verdictStore";

interface UseListingDragDropProps {
  updateListing: (id: string, data: Partial<any>) => void;
  updateVerdict: (id: string, data: Partial<any>) => void;
  addVerdict: (data: any) => void;
}

/**
 * Custom hook to handle drag-and-drop functionality for listings.
 * This hook manages the drag-and-drop state using dnd-kit, including
 * sensor configuration, drag start/end handlers, and updating listing
 * status and verdicts when dropped into different columns.
 *
 * @param updateListing - Function to update a listing's status
 * @param updateVerdict - Function to update an existing verdict
 * @param addVerdict - Function to create a new verdict
 * @returns Object containing activeId, sensors, and drag event handlers
 *
 * @example
 * ```tsx
 * const { activeId, sensors, handleDragStart, handleDragEnd } = useListingDragDrop({
 *   updateListing,
 *   updateVerdict,
 *   addVerdict,
 * });
 *
 * <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
 *   {/* draggable content *\/}
 * </DndContext>
 * ```
 */
export function useListingDragDrop({
  updateListing,
  updateVerdict,
  addVerdict,
}: UseListingDragDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const listingId = active.id as string;
      const dropData = over.data.current as any;

      if (dropData?.dropStatus) {
        updateListing(listingId, { status: dropData.dropStatus });

        if (dropData.dropVerdict) {
          const existingVerdict = useVerdictStore
            .getState()
            .verdicts.find((v) => v.listing_id === listingId);

          if (existingVerdict) {
            updateVerdict(existingVerdict.id, { status: dropData.dropVerdict });
          } else {
            addVerdict({
              id: crypto.randomUUID(),
              listing_id: listingId,
              status: dropData.dropVerdict,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      }
    },
    [updateListing, updateVerdict, addVerdict]
  );

  return {
    activeId,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}
