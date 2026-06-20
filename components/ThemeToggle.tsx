"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all bg-background border-border size-10"
        aria-label="Toggle theme"
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
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
