"use client";

import { useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { runMigrations } from "@/lib/data/migrations";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => { runMigrations(); }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <>
      {apiKey ? <APIProvider apiKey={apiKey}>{children}</APIProvider> : children}
    </>
  );
}
