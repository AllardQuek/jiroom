"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { runMigrations } from "@/lib/data/migrations";
import { useStoreInitialization } from "@/lib/hooks/useStoreInitialization";

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
    <StoreInitializer>
      {apiKey ? <APIProvider apiKey={apiKey}>{children}</APIProvider> : children}
    </StoreInitializer>
  );
}
