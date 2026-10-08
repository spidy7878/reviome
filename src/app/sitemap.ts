import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://reviome.in";
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/third-party-disclosure",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/about" || route === "/contact" ? 0.8 : 0.5,
  }));
}
