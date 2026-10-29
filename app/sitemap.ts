import type { MetadataRoute } from "next";
import { games, siteUrl } from "@/lib/games";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, priority: 1 },
    ...games
      .filter((g) => g.status === "available")
      .map((g) => ({ url: `${siteUrl}/play/${g.slug}/`, priority: 0.8 })),
  ];
}
