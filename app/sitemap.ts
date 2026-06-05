import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.floppyy.com",
      lastModified: new Date("2026-06-05"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
