"use client";

import { useEffect } from "react";

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
};

const defaultDescription =
  "RemSam Homestead – Faith, Family, Farming. Inspiring content on faith, organic recipes, agriculture, homeschooling, free study materials, and farm‑fresh products in Kenya.";

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function SEO({
  title,
  description = defaultDescription,
  keywords = [],
  image,
  url,
  type = "website",
}: SEOProps) {
  useEffect(() => {
    const siteName = "RemSam Homestead";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const canonicalUrl = url ?? window.location.href;
    const fullKeywords = [
      "RemSam Homestead",
      "Faith",
      "Family",
      "Farming",
      "Organic Seeds",
      "Homeschooling",
      "Study Materials",
      "Kenya",
      "Kakamega",
      "Butere",
      ...keywords,
    ].join(", ");

    document.title = fullTitle;
    setMeta('meta[name="title"]', "name", "title", fullTitle);
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="keywords"]', "name", "keywords", fullKeywords);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", siteName);
    setMeta('meta[property="twitter:card"]', "property", "twitter:card", "summary_large_image");
    setMeta('meta[property="twitter:url"]', "property", "twitter:url", canonicalUrl);
    setMeta('meta[property="twitter:title"]', "property", "twitter:title", fullTitle);
    setMeta('meta[property="twitter:description"]', "property", "twitter:description", description);
    if (image) {
      setMeta('meta[property="og:image"]', "property", "og:image", image);
      setMeta('meta[property="twitter:image"]', "property", "twitter:image", image);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, image, keywords, title, type, url]);

  return null;
}
