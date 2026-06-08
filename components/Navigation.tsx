"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutList,
  GitCompareArrows,
  ClipboardList,
  CalendarDays,
  Map,
} from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { name: "Listings", href: "/listings", icon: LayoutList },
    { name: "Compare", href: "/compare", icon: GitCompareArrows },
    { name: "Map", href: "/map", icon: Map },
    { name: "Schedule", href: "/schedule", icon: CalendarDays },
    { name: "Templates", href: "/template", icon: ClipboardList },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 ${
                isActive
                  ? "text-primary scale-110"
                  : "text-muted-foreground hover:text-primary/70"
              }`}
            >
              <Icon
                size={20}
                className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"}
              />
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
