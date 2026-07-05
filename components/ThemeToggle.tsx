"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all bg-background border-border size-10"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="size-4 hidden dark:block" />
    </Button>
  );
}
