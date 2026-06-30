"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { ThemeProvider } from "next-themes";
import { runMigrations } from "@/lib/data/migrations";
import { useStoreInitialization } from "@/lib/hooks/useStoreInitialization";

// next-themes renders an inline <script> to prevent theme flicker.
// React 19 warns about script tags inside components.
// The warning is a false positive — the script runs correctly during SSR.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    )
      return;
    orig.apply(console, args);
  };
}

function StoreInitializer({ children }: { children: React.ReactNode }) {
  useStoreInitialization();
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // Run migrations once on the server side or first client render
  if (typeof window !== "undefined") {
    runMigrations();
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <StoreInitializer>
        {apiKey ? <APIProvider apiKey={apiKey}>{children}</APIProvider> : children}
      </StoreInitializer>
    </ThemeProvider>
  );
}
