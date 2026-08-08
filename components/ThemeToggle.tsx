"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("chrome");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all bg-background border-border size-10"
        aria-label={t("toggleTheme")}
      >
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all bg-background border-border size-10"
      onClick={handleToggle}
      aria-label={t("toggleTheme")}
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
