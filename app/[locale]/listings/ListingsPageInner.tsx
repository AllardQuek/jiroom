"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Download,
  Upload,
  FlaskConical,
  Columns3,
  List,
  Settings,
  MessageSquare,
  User,
  Check,
  X,
  MoreVertical,
  Filter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ListingList } from "@/components/listings/ListingList";
import { FilterDialog } from "@/components/listings/FilterDialog";
import type { ListingFilters } from "@/components/listings/FilterDialog";
import { ListingDetailModal } from "@/components/listings/ListingDetailModal";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { useComparisonStore } from "@/store/comparisonStore";
import { useAgentQuestionStore } from "@/store/agentQuestionStore";
import { useTenantProfileStore } from "@/store/tenantProfileStore";
import { useListingStore } from "@/store/listingStore";
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
  const t = useTranslations("listings");
  const tProfile = useTranslations("tenantProfile.fields");
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const listings = useListingStore((state) => state.listings);
  const [filters, setFilters] = useState<ListingFilters>({
    hideTaken: false,
    areas: [],
    priceMin: null,
    priceMax: null,
  });
  const router = useRouter();
  const pathname = usePathname();

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
    // Seed data loading is now handled in useStoreInitialization hook
    setSeedMode(isSeedModeActive());
  }, []);
  const selectedListingIds = useComparisonStore(
    (state) => state.selectedListingIds
  );
  const getActiveTemplate = useAgentQuestionStore(
    (state) => state.getActiveTemplate
  );
  const getProfile = useTenantProfileStore((state) => state.getProfile);

  useEffect(() => {
    if (pathname === "/listings") {
      setCompareMode(false);
    }
  }, [pathname]);

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
      showCopyStatus("error", t("noActiveTemplate"));
      return;
    }

    const text = template.questions.join("\n");
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showCopyStatus("success", t("questionsCopied"));
      })
      .catch(() => {
        showCopyStatus("error", t("failedToCopy"));
      });
  };

  const handleCopyProfile = () => {
    const profile = getProfile();

    const fieldKeys = [
      "name",
      "occupation",
      "nationality",
      "noOfPax",
      "gender",
      "pets",
      "cooking",
      "pass",
      "workLocation",
      "moveInDate",
      "leaseDuration",
      "budget",
      "viewing",
    ] as const;

    const lines = Object.entries(profile)
      .filter(
        ([key, value]) =>
          value &&
          value.trim() !== "" &&
          fieldKeys.includes(key as (typeof fieldKeys)[number])
      )
      .map(
        ([key, value]) =>
          `${tProfile(key as (typeof fieldKeys)[number])}: ${value}`
      );

    if (lines.length === 0) {
      showCopyStatus("error", t("profileEmpty"));
      return;
    }

    const text = lines.join("\n");
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showCopyStatus("success", t("profileCopied"));
      })
      .catch(() => {
        showCopyStatus("error", t("failedToCopy"));
      });
  };

  function handleToggleSeed() {
    const result = toggleSeedMode();
    if (result === "seed") {
      setBackupStatus({
        type: "success",
        message: t("sampleDataLoaded"),
      });
    } else if (result === "user") {
      setBackupStatus({
        type: "success",
        message: t("dataRestored"),
      });
    } else {
      setBackupStatus({ type: "error", message: t("noDataToRestore") });
      return;
    }
    setTimeout(() => window.location.reload(), 1500);
  }

  function handleExport() {
    try {
      const data = exportAllData();
      downloadData(data);
      setBackupStatus({ type: "success", message: t("backupDownloaded") });
      setTimeout(() => setBackupStatus({ type: null, message: "" }), 3000);
    } catch {
      setBackupStatus({ type: "error", message: t("exportFailed") });
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
            message: t("restoredReloading"),
          });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setBackupStatus({ type: "error", message: result.message });
          setTimeout(() => setBackupStatus({ type: null, message: "" }), 3000);
        }
      } catch {
        setBackupStatus({ type: "error", message: t("invalidFile") });
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
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              {t.rich("subtitle", {
                key: (chunks) => (
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                    {chunks}
                  </kbd>
                ),
              })}
            </p>
            {(backupStatus.type || copyStatus.type) && (
              <Badge
                variant={
                  backupStatus.type === "success" ||
                  copyStatus.type === "success"
                    ? "default"
                    : "destructive"
                }
                className={`text-xs animate-in fade-in slide-in-from-left-2 duration-300 ${backupStatus.type === "success" || copyStatus.type === "success" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-red-600 text-white hover:bg-red-700"}`}
              >
                {backupStatus.type === "success" ||
                copyStatus.type === "success" ? (
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
                <Button
                  variant="default"
                  onClick={handleCompare}
                  className="hidden sm:flex"
                >
                  {t("compareCount", { count: selectedListingIds.length })}
                </Button>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFilterOpen(true)}
                    className="shrink-0"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("filterListings")}</TooltipContent>
              </Tooltip>
              {!compareMode && (
                <Button
                  variant="outline"
                  onClick={() => setCompareMode(true)}
                  size="sm"
                  className="shrink-0"
                >
                  {t("compare")}
                </Button>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyQuestions}
                    className="shrink-0"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("copyQuestions")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyProfile}
                    className="shrink-0"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("copyProfile")}</TooltipContent>
              </Tooltip>
            </div>

            {/* Right side: Primary actions and utilities */}
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="sm"
                className="shrink-0"
                style={{ backgroundColor: "#7e5be9", color: "white" }}
              >
                <Plus className="h-4 w-4 hidden sm:inline-block" />
                <span className="hidden sm:inline">{t("addListing")}</span>
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
                      {compact ? (
                        <Columns3 className="h-4 w-4" />
                      ) : (
                        <List className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {compact ? t("detailedView") : t("compactView")}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Mobile menu for secondary actions */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden shrink-0"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {mobileMenuOpen && (
                  <div className="absolute right-0 top-12 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[200px] z-50 transition-all duration-300 animate-fade-in">
                    <button
                      onClick={() => {
                        setCompact(!compact);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md text-left"
                    >
                      {compact ? (
                        <Columns3 className="h-4 w-4" />
                      ) : (
                        <List className="h-4 w-4" />
                      )}
                      {compact ? t("detailedView") : t("compactView")}
                    </button>
                    <button
                      onClick={() => {
                        handleExport();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md text-left"
                    >
                      <Download className="h-4 w-4" />
                      {t("exportData")}
                    </button>
                    <button
                      onClick={() => {
                        fileRef.current?.click();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md text-left"
                    >
                      <Upload className="h-4 w-4" />
                      {t("importData")}
                    </button>
                    <button
                      onClick={() => {
                        handleToggleSeed();
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md text-left ${seedMode ? "text-amber-500" : ""}`}
                    >
                      <FlaskConical className="h-4 w-4" />
                      {seedMode ? t("switchToYours") : t("switchToSample")}
                    </button>
                    <button
                      onClick={() => {
                        setSettingsOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md text-left"
                    >
                      <Settings className="h-4 w-4" />
                      {t("settings")}
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop secondary actions */}
              <div className="hidden sm:flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleExport}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("exportData")}</TooltipContent>
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
                  <TooltipContent>{t("importData")}</TooltipContent>
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
                    {seedMode ? t("switchToYours") : t("switchToSample")}
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
                  <TooltipContent>{t("evaluationTemplates")}</TooltipContent>
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
        <ListingList
          compact={compact}
          compareMode={compareMode}
          onListingClick={(id) => setSelectedListingId(id)}
          filters={filters}
        />
      </div>

      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        areas={Array.from(
          new Set(listings.map((l: any) => l.area).filter(Boolean))
        )}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addNew")}</DialogTitle>
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
