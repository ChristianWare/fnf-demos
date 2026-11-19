"use client";

// Hands the demo's market to client components. The root layout reads it
// on the server (getMarket) and passes it in; useMarket() reads it back.

import { createContext, useContext } from "react";
import { marketById, type Market } from "@/markets";
import { setMarketCenter } from "@/lib/marketGeo";

const MarketContext = createContext<Market | null>(null);

export default function MarketProvider({
  market,
  children,
}: {
  market: Market;
  children: React.ReactNode;
}) {
  // Set during render, before any map or address field below mounts. The
  // same value every render, so it's safe to repeat.
  setMarketCenter(market.geo, market.reach);
  return (
    <MarketContext.Provider value={market}>{children}</MarketContext.Provider>
  );
}

/** The demo's market. Outside the provider: the default market. */
export function useMarket(): Market {
  return useContext(MarketContext) ?? marketById(null);
}
