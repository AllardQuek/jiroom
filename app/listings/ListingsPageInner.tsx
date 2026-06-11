"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Download, Upload, FlaskConical } from "lucide-react";
import { ListingList } from "@/components/listings/ListingList";
import { ListingDetailModal } from "@/components/listings/ListingDetailModal";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { useComparisonStore } from "@/store/comparisonStore";
import {
  exportAllData,
  downloadData,
  importData,
  type ExportData,
} from "@/lib/data/exportImport";
import {
  loadSeedData,
  isSeedModeActive,
  isAnyStoreEmpty,
  toggleSeedMode,
} from "@/lib/data/seedData";

export function ListingsPageInner() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null
  );
  const [backupStatus, setBackupStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [seedMode, setSeedMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const detailId = searchParams.get("detail");
    if (detailId) {
      setSelectedListingId(detailId);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("detail");
      router.replace(`/listings?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (isAnyStoreEmpty()) {
      loadSeedData();
      window.location.reload();
    } else {
      setSeedMode(isSeedModeActive());
    }
  }, []);
  const selectedListingIds = useComparisonStore(
    (state) => state.selectedListingIds
  );

  const handleCompare = () => {
    router.push("/compare");
  };

  function handleToggleSeed() {
    const result = toggleSeedMode();
    if (result === "seed") {
      setBackupStatus({
        type: "success",
        message: "Sample data loaded. Reloading...",
      });
    } else if (result === "user") {
      setBackupStatus({
        type: "success",
        message: "Your data restored. Reloading...",
      });
    } else {
      setBackupStatus({ type: "error", message: "No user data to restore" });
      return;
    }
    setTimeout(() => window.location.reload(), 1500);
  }

  function handleExport() {
    try {
      const data = exportAllData();
      downloadData(data);
      setBackupStatus({ type: "success", message: "Backup downloaded" });
      setTimeout(() => setBackupStatus({ type: null, message: "" }), 3000);
    } catch {
      setBackupStatus({ type: "error", message: "Export failed" });
      setTimeout(() => setBackupStatus({ type: null, message: "" }), 3000);
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as ExportData;
        const result = importData(json);
        if (result.success) {
          setBackupStatus({
            type: "success",
            message: "Restored. Reloading...",
          });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setBackupStatus({ type: "error", message: result.message });
          setTimeout(() => setBackupStatus({ type: null, message: "" }), 3000);
        }
      } catch {
        setBackupStatus({ type: "error", message: "Invalid file" });
        setTimeout(() => setBackupStatus({ type: null, message: "" }), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listings</h1>
          <p className="text-sm text-muted-foreground">
            Track each room from first save to final decision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedListingIds.length >= 2 && (
            <Button variant="outline" onClick={handleCompare}>
              Compare ({selectedListingIds.length})
            </Button>
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add listing
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExport}
            title="Export data"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileRef.current?.click()}
            title="Import data"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSeed}
            title={seedMode ? "Switch to your data" : "Switch to sample data"}
            className={seedMode ? "text-amber-500" : ""}
          >
            <FlaskConical className="h-4 w-4" />
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {backupStatus.type && (
        <div
          className={`mb-4 text-xs flex items-center gap-1.5 ${
            backupStatus.type === "success"
              ? "text-emerald-600"
              : "text-destructive"
          }`}
        >
          {backupStatus.message}
        </div>
      )}

      <div className="mt-6">
        <ListingList onListingClick={(id) => setSelectedListingId(id)} />
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
          </DialogHeader>
          <CreateListingForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ListingDetailModal
        listingId={selectedListingId ?? ""}
        open={!!selectedListingId}
        onClose={() => setSelectedListingId(null)}
      />
    </div>
  );
}
