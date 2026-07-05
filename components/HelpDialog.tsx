"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const t = useTranslations("help");
  const tEval = useTranslations("evaluation");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <Section title={t("whatIsJIRoom")}>
            <p>
              <a
                href="https://github.com/AllardQuek/jiroom"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                JIRoom
              </a>{" "}
              {t("whatIsJIRoomDescription")}
            </p>
            <p className="mt-2">{t("privacy")}</p>
          </Section>

          <Section title={t("guide.title")}>
            <p className="mb-2">{t("guide.description")}</p>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-2 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              {t("guide.linkText")}
            </Link>
          </Section>

          <Section title={t("gettingStarted")}>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">{t("quickStart")}</strong>
                <ol className="mt-2 space-y-1.5 list-decimal list-inside text-muted-foreground">
                  <li>{t("step1")}</li>
                  <li>{t("step2")}</li>
                  <li>{t("step3")}</li>
                </ol>
              </div>
              <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                <p className="text-xs">
                  <strong>{t("tip")}</strong>
                </p>
              </div>
            </div>
          </Section>

          <Section title={t("pages")}>
            <div className="space-y-4">
              <div>
                <strong className="text-foreground">
                  {t("listingsPage.title")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("listingsPage.columns")}</li>
                  <li>{t("listingsPage.actions")}</li>
                  <li>{t("listingsPage.tools")}</li>
                  <li>{t("listingsPage.compare")}</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("mapPage.title")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("mapPage.markers")}</li>
                  <li>{t("mapPage.commute")}</li>
                  <li>{t("mapPage.addFromMap")}</li>
                  <li>{t("mapPage.filter")}</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("comparePage.title")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("comparePage.select")}</li>
                  <li>{t("comparePage.view")}</li>
                  <li>{t("comparePage.highlight")}</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("schedulePage.title")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("schedulePage.grouped")}</li>
                  <li>{t("schedulePage.click")}</li>
                  <li>{t("schedulePage.scheduleDirectly")}</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title={t("settingsDialog.title")}>
            <p className="mb-2 text-muted-foreground">
              <strong className="text-foreground">
                {t("settingsDialog.access")}
              </strong>
            </p>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">
                  {t("settingsDialog.evaluationTemplates.title")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("settingsDialog.evaluationTemplates.customize")}</li>
                  <li>{t("settingsDialog.evaluationTemplates.addRemove")}</li>
                  <li>{t("settingsDialog.evaluationTemplates.types")}</li>
                  <li>
                    <strong>
                      {t("settingsDialog.evaluationTemplates.example")}
                    </strong>
                  </li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("settingsDialog.agentQuestions.title")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("settingsDialog.agentQuestions.create")}</li>
                  <li>
                    <strong>
                      {t("settingsDialog.agentQuestions.example")}
                    </strong>
                  </li>
                  <li>{t("settingsDialog.agentQuestions.copy")}</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("settingsDialog.tenantProfile.title")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("settingsDialog.tenantProfile.store")}</li>
                  <li>{t("settingsDialog.tenantProfile.fields")}</li>
                  <li>{t("settingsDialog.tenantProfile.copy")}</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title={t("scoring.title")}>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">
                  {t("scoring.howItWorks")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("scoring.contribution")}</li>
                  <li>{t("scoring.netScore")}</li>
                  <li>{t("scoring.textFields")}</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("scoring.scoreRanges")}
                </strong>
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">≥ +4:</strong>{" "}
                      {tEval("scoreRanges.great")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">+1 to +3:</strong>{" "}
                      {tEval("scoreRanges.good")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-gray-400" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">0:</strong>{" "}
                      {tEval("scoreRanges.neutral")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">-1 to -2:</strong>{" "}
                      {tEval("scoreRanges.belowAverage")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">≤ -3:</strong>{" "}
                      {tEval("scoreRanges.poor")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title={t("anchors.title")}>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">
                  {t("anchors.whatAre")}
                </strong>
                <p className="mt-1 text-muted-foreground">
                  {t("anchors.description")}
                </p>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("anchors.howToAdd")}
                </strong>
                <ol className="mt-1.5 space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>{t("anchors.step1")}</li>
                  <li>{t("anchors.step2")}</li>
                  <li>{t("anchors.step3")}</li>
                  <li>{t("anchors.step4")}</li>
                </ol>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("anchors.manage")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("anchors.click")}</li>
                  <li>{t("anchors.markers")}</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title={t("dataManagement.title")}>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">
                  {t("dataManagement.yourControl")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("dataManagement.stored")}</li>
                  <li>{t("dataManagement.private")}</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("dataManagement.backup")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("dataManagement.export")}</li>
                  <li>{t("dataManagement.import")}</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">
                  {t("dataManagement.tryIt")}
                </strong>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>{t("dataManagement.click")}</li>
                  <li>{t("dataManagement.explore")}</li>
                  <li>{t("dataManagement.switch")}</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title={t("keyboardShortcuts.title")}>
            <p>{t("keyboardShortcuts.toggleHelp")}</p>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
