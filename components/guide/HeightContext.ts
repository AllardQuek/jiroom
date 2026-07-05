"use client";

import { createContext } from "react";

export type MeasuredHeightMap = Map<string, number>;

export const MeasuredHeightContext = createContext<{
  reportHeight: (nodeId: string, totalHeight: number) => void;
}>({ reportHeight: () => {} });
