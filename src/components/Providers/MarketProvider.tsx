"use client";

// Hands the demo's market to client components. The root layout reads it
// on the server (getMarket) and passes it in; useMarket() reads it back.

import { createContext, useContext } from "react";
import { marketById, type Market } from "@/markets";

const MarketContext = createContext<Market | null>(null);

export default function MarketProvider({
  market,
  children,
}: {
  market: Market;
  children: React.ReactNode;
}) {
  return (
    <MarketContext.Provider value={market}>{children}</MarketContext.Provider>
  );
}

/** The demo's market. Outside the provider: the default market. */
export function useMarket(): Market {
  return useContext(MarketContext) ?? marketById(null);
}
