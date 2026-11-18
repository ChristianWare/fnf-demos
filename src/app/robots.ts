import { MetadataRoute } from "next";

// The demo platform: private previews only, so nothing is crawled. (Every
// page also says noindex, in the root layout.)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
