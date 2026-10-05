import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://acewears.com";

  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await db.category.findMany({ select: { slug: true } });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: "daily" },
    { url: `${baseUrl}/?section=catalog`, priority: 0.9, changeFrequency: "daily" },
    { url: `${baseUrl}/?section=reels`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${baseUrl}/?section=wishlist`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${baseUrl}/?section=tradein`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/?section=premium`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/?section=credit`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/?section=terms`, priority: 0.5, changeFrequency: "yearly" },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/?section=catalog&category=${c.slug}`,
    priority: 0.6,
    changeFrequency: "weekly" as const,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/?product=${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
