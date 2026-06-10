"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

export default function SettingsButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/settings")) return null;

  return (
    <Link
      href="/settings"
      className="fixed top-4 right-4 z-50 flex items-center justify-center w-9 h-9 rounded-xl bg-background/80 backdrop-blur-sm border border-border/60 shadow-sm text-muted-foreground hover:text-foreground hover:border-border transition-all"
    >
      <Settings size={16} />
    </Link>
  );
}
