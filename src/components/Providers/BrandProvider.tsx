"use client";

// Hands the operator's name and logo to client components. The root
// layout reads them on the server (getBrand) and passes them in.

import { createContext, useContext } from "react";
import { SITE } from "@/config/site";
import type { Brand } from "@/lib/brand";

const BrandContext = createContext<Brand | null>(null);

export default function BrandProvider({
  brand,
  children,
}: {
  brand: Brand;
  children: React.ReactNode;
}) {
  return (
    <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
  );
}

/** The operator's name and logo. Outside the provider: src/config/site.ts. */
export function useBrand(): Brand {
  return (
    useContext(BrandContext) ?? {
      name: SITE.name,
      logoUrl: "",
    }
  );
}
