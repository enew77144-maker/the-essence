import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";
import { queries } from "@/lib/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/about",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [products, categories] = await Promise.all([
      queries.products({ page_size: 100 }),
      queries.categories(),
    ]);

    const productUrls: MetadataRoute.Sitemap = products.results.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${base}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticUrls, ...productUrls, ...categoryUrls];
  } catch {
    return staticUrls;
  }
}
