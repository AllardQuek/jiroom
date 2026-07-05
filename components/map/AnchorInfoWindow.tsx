import { Anchor } from "@/types/anchor";
import { getAnchorColor } from "@/lib/constants/ANCHOR_COLORS";

interface AnchorInfoWindowProps {
  anchor: Anchor;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * An info window component for displaying anchor details on the map.
 * This component shows anchor information including title, type, address,
 * and provides edit/delete action buttons when displayed in a Google Maps InfoWindow.
 *
 * @param anchor - The anchor to display
 * @param onEdit - Callback when the edit button is clicked
 * @param onDelete - Callback when the delete button is clicked
 * @returns An anchor info window component
 *
 * @example
 * ```tsx
 * <InfoWindow position={{ lat, lng }}>
 *   <AnchorInfoWindow
 *     anchor={selectedAnchor}
 *     onEdit={() => setShowEditDialog(true)}
 *     onDelete={() => deleteAnchor(anchor.id)}
 *   />
 * </InfoWindow>
 * ```
 */
export function AnchorInfoWindow({
  anchor,
  onEdit,
  onDelete,
}: AnchorInfoWindowProps) {
  const color = getAnchorColor(anchor);

  return (
    <div className="text-sm" style={{ minWidth: 180, maxWidth: 280 }}>
      <h3 className="font-semibold leading-tight text-[13px] break-words">
        {anchor.title}
      </h3>
      <div className="flex items-center gap-2 mt-1.5">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider text-white"
          style={{
            backgroundColor: color + "20",
          }}
        >
          {anchor.type === "custom" && anchor.customTypeLabel
            ? anchor.customTypeLabel
            : anchor.type.replace("_", " ")}
        </span>
      </div>
      {anchor.address && (
        <p className="text-[11px] text-muted-foreground mt-1">
          {anchor.address}
        </p>
      )}
      <div className="flex gap-1.5 mt-3 mb-2 pt-2.5 border-t border-border/40">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
