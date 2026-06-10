import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://smonadjemi.github.io/miva",
      lastModified: "2026-06-10",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
