"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, FileText, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Article } from "@/lib/types";

export type StudyMaterial = Article & { _id?: string; thumbnail?: string; description?: string };

export default function StudyMaterialCard({ material, categoryName, hideEmptyImage = false }: { material: StudyMaterial; categoryName?: string; hideEmptyImage?: boolean }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const image = material.thumbnail || material.featuredImage;
  const showImage = Boolean(image && image !== failedImage);
  const share = async () => {
    const url = new URL(`/articles/${material.slug}`, window.location.origin).href;
    try {
      if (navigator.share) await navigator.share({ title: material.title, text: material.description || material.excerpt, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied to clipboard"); }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") toast.error("Unable to share this link. Please try again.");
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      {(showImage || !hideEmptyImage) && <Link href={`/articles/${material.slug}`} className="block aspect-video overflow-hidden bg-emerald-50">
        {showImage ? <img src={image} alt="" onError={() => setFailedImage(image || null)} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" /> : <div className="flex h-full items-center justify-center text-emerald-700"><FileText size={44} /></div>}
      </Link>}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{categoryName || material.studyCategory || material.category}</p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-gray-900"><Link href={`/articles/${material.slug}`} className="hover:text-emerald-700">{material.title}</Link></h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{material.description || material.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 pt-5">
          {material.fileUrl && <a href={material.fileUrl} download={material.fileName || undefined} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"><Download size={16} /> Download</a>}
          <Link href={`/articles/${material.slug}`} className="rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">View</Link>
          <button onClick={share} aria-label={`Share ${material.title}`} title="Share" className="ml-auto inline-flex shrink-0 items-center justify-center rounded-lg p-2.5 text-gray-600 hover:bg-gray-100"><Share2 size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </article>
  );
}
