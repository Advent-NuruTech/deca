"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PublicArticle, ResourceTaxonomy } from "@/lib/types";
import { getPublicTaxonomy } from "@/lib/public-settings-client";

export default function ArticleSidebar({ article }: { article: PublicArticle }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [taxonomy, setTaxonomy] = useState<ResourceTaxonomy>({ majors: [], subcategories: [] });
  useEffect(() => setCurrentUrl(window.location.href), []);
  useEffect(() => {
    getPublicTaxonomy().then(setTaxonomy).catch(() => undefined);
  }, []);
  const shareText = `Check out this article: ${article.title}`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
            {article.author?.name?.charAt(0) || "A"}
          </div>
          <div>
            <p className="font-medium text-gray-900">{article.author?.name || "Admin"}</p>
            <p className="text-sm text-gray-500">Ministry Contributor</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Sharing faith, family, and farming insights to encourage and equip others.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {taxonomy.subcategories.map((category) => {
            const basePath = category.parentId === "study-library" ? "/study-materials" : `/articles?major=${encodeURIComponent(category.parentId)}`;
            return <Link
              key={category.id}
              href={`${basePath}${basePath.includes("?") ? "&" : "?"}category=${encodeURIComponent(category.id)}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition"
            >
              {category.name}
            </Link>;
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Article</h3>
        <div className="flex gap-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition"
            aria-label="Share on Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" /></svg>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition"
            aria-label="Share on Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 1.998c-5.522 0-9.999 4.477-9.999 10 0 2.25.746 4.334 2.002 5.999l-2.003 6 6.166-2.002c1.646.98 3.5 1.502 5.833 1.502 5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18c-1.75 0-3.438-.512-4.831-1.398l-3.743 1.217 1.213-3.705c-.918-1.364-1.453-2.998-1.453-4.772 0-4.653 3.784-8.438 8.438-8.438s8.438 3.785 8.438 8.438-3.785 8.438-8.438 8.438z" /></svg>
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
