"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Download, Upload, FlaskConical, Columns3, List, Settings, MessageSquare, User, Check, X, MoreVertical } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ListingList } from "@/components/listings/ListingList";
import { ListingDetailModal } from "@/components/listings/ListingDetailModal";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { useComparisonStore } from "@/store/comparisonStore";
import { useAgentQuestionStore } from "@/store/agentQuestionStore";
import { useTenantProfileStore } from "@/store/tenantProfileStore";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
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
  const [compact, setCompact] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("compact-view");
    if (saved === "true") setCompact(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("compact-view", compact ? "true" : "false");
  }, [compact]);
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
    if (sessionStorage.getItem("import-completed")) {
      sessionStorage.removeItem("import-completed");
      localStorage.removeItem("seed-mode-active");
      localStorage.removeItem("user-data-backup");
      setSeedMode(false);
      return;
    }
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
  const getActiveTemplate = useAgentQuestionStore((state) => state.getActiveTemplate);
  const initializeAgentQuestions = useAgentQuestionStore((state) => state.initializeTemplates);
  const getProfile = useTenantProfileStore((state) => state.getProfile);

  useEffect(() => {
    initializeAgentQuestions();
  }, [initializeAgentQuestions]);

  const handleCompare = () => {
    router.push("/compare");
  };

  const showCopyStatus = (type: "success" | "error", message: string) => {
    setCopyStatus({ type, message });
    setTimeout(() => setCopyStatus({ type: null, message: "" }), 3000);
  };

  const handleCopyQuestions = () => {
    const template = getActiveTemplate();
    if (!template) {
      showCopyStatus("error", "No active question template");
      return;
    }

    const text = template.questions.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      showCopyStatus("success", "Questions copied to clipboard");
    }).catch(() => {
      showCopyStatus("error", "Failed to copy");
    });
  };

  const handleCopyProfile = () => {
    const profile = getProfile();

    const fieldLabels: Record<keyof typeof profile, string> = {
      name: "Name",
      occupation: "Occupation",
      nationality: "Nationality",
      noOfPax: "No. of Pax",
      gender: "Gender",
      pets: "Any pets?",
      cooking: "Cooking",
      pass: "Pass",
      workLocation: "Work Location",
      moveInDate: "Move in date",
      leaseDuration: "Lease duration",
      budget: "Budget",
      viewing: "Viewing",
    };

    const lines = Object.entries(profile)
      .filter(([_, value]) => value && value.trim() !== "")
      .map(([key, value]) => `${fieldLabels[key as keyof typeof profile]}: ${value}`);

    if (lines.length === 0) {
      showCopyStatus("error", "Profile is empty");
      return;
    }

    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      showCopyStatus("success", "Profile copied to clipboard");
    }).catch(() => {
      showCopyStatus("error", "Failed to copy");
    });
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
          sessionStorage.setItem("import-completed", "true");
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
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              Track each room from first save to final decision.
            </p>
            {(backupStatus.type || copyStatus.type) && (
              <Badge
                variant={(backupStatus.type === "success" || copyStatus.type === "success") ? "default" : "destructive"}
                className={`text-xs animate-in fade-in slide-in-from-left-2 duration-300 ${(backupStatus.type === "success" || copyStatus.type === "success") ? "bg-[var(--success)] hover:bg-[var(--success)]/80" : ""}`}
              >
                {(backupStatus.type === "success" || copyStatus.type === "success") ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <X className="w-3 h-3 mr-1" />
                )}
                {backupStatus.message || copyStatus.message}
              </Badge>
            )}
          </div>
        </div>
        <TooltipProvider delayDuration={300}>
        <div className="flex items-center justify-between gap-2">
          {/* Left side: Listing-specific actions */}
          <div className="flex flex-wrap gap-2 items-center">
            {compareMode && selectedListingIds.length >= 2 && (
              <Button variant="default" onClick={handleCompare} className="hidden sm:flex">
                Compare ({selectedListingIds.length})
              </Button>
            )}
            <Button
              variant={compareMode ? "default" : "outline"}
              onClick={() => setCompareMode(!compareMode)}
              size="sm"
              className="shrink-0"
            >
              {compareMode ? "Done" : "Compare"}
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCopyQuestions} className="shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy questions to clipboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCopyProfile} className="shrink-0">
                  <User className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy profile to clipboard</TooltipContent>
            </Tooltip>
          </div>
          
          {/* Right side: Primary actions and utilities */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="shrink-0">
              <Plus className="mr-2 h-4 w-4 hidden sm:inline-block" />
              <span className="hidden sm:inline">Add listing</span>
              <Plus className="sm:hidden h-4 w-4" />
            </Button>
            <div className="hidden sm:flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCompact(!compact)}
                    className={compact ? "text-primary shrink-0" : "shrink-0"}
                  >
                    {compact ? <Columns3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {compact ? "Detailed view" : "Compact view"}
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Mobile menu for secondary actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {compareMode && selectedListingIds.length >= 2 && (
                  <DropdownMenuItem onClick={handleCompare}>
                    Compare ({selectedListingIds.length})
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setCompact(!compact)}>
                  {compact ? <Columns3 className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
                  {compact ? "Detailed view" : "Compact view"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleSeed} className={seedMode ? "text-amber-500" : ""}>
                  <FlaskConical className="mr-2 h-4 w-4" />
                  {seedMode ? "Switch to your data" : "Switch to sample data"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Desktop secondary actions */}
            <div className="hidden sm:flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export data</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import data</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleSeed}
                    className={seedMode ? "text-amber-500" : ""}
                  >
                    <FlaskConical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {seedMode ? "Switch to your data" : "Switch to sample data"}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Evaluation templates</TooltipContent>
              </Tooltip>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>
        </TooltipProvider>
      </div>

      <div className="mt-6">
        <ListingList compact={compact} compareMode={compareMode} onListingClick={(id) => setSelectedListingId(id)} />
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90dvh] overflow-y-auto">
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

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
