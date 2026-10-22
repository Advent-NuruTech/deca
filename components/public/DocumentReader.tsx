"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, ZoomIn, ZoomOut } from "lucide-react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { api } from "@/lib/api";
import type { PublicArticle } from "@/lib/types";

function Page({ document, number, zoom }: { document: PDFDocumentProxy; number: number; zoom: number }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(700);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { rootMargin: "600px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = box.current?.parentElement;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.min(850, Math.max(200, entry.contentRect.width - 32))));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || !canvas.current) return;
    let cancelled = false;
    let renderTask: ReturnType<PDFPageProxy["render"]> | undefined;
    void document.getPage(number).then((page) => {
      if (cancelled || !canvas.current) return;
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / base.width * zoom });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const target = canvas.current;
      target.width = Math.floor(viewport.width * ratio); target.height = Math.floor(viewport.height * ratio);
      target.style.width = `${viewport.width}px`; target.style.height = `${viewport.height}px`;
      const context = target.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      renderTask = page.render({ canvas: target, canvasContext: context, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
      return renderTask.promise;
    }).catch((reason) => { if (!cancelled && reason?.name !== "RenderingCancelledException") setError(true); });
    return () => { cancelled = true; renderTask?.cancel(); };
  }, [document, number, visible, width, zoom]);
  return <div ref={box} className="relative mx-auto w-fit min-h-[400px] max-w-none rounded-xl bg-white p-2 shadow-lg sm:p-4" style={{ minWidth: Math.min(width * zoom, 300) }}>
    {!visible && <span className="sr-only">Page {number} loading</span>}
    {error && <p role="alert" className="p-6 text-red-700">This page could not be displayed. Try downloading the document.</p>}
    <canvas ref={canvas} aria-label={`Page ${number}`} className="block" />
    <span className="absolute bottom-5 right-5 rounded-lg bg-gray-800/75 px-3 py-1.5 text-sm font-semibold text-white">Page {number}</span>
  </div>;
}

export default function DocumentReader({ slug }: { slug: string }) {
  const [article, setArticle] = useState<PublicArticle | null>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    let cancelled = false;
    let loadingTask: { destroy: () => Promise<void> } | undefined;
    async function load() {
      try {
        const item = await api.get<PublicArticle>(`/api/articles/${encodeURIComponent(slug)}`);
        if (!item.isDownloadable || !item.fileUrl || !(item.fileType === "application/pdf" || item.fileName?.toLowerCase().endsWith(".pdf"))) throw new Error("This resource is not available to read online.");
        if (cancelled) return;
        setArticle(item);
        const pdf = await import("pdfjs-dist");
        pdf.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const url = new URL(item.fileUrl, window.location.origin);
        if (url.origin !== window.location.origin) throw new Error("This document cannot be opened in the reader.");
        url.searchParams.set("inline", "1");
        const task = pdf.getDocument({ url: url.toString(), isEvalSupported: false });
        loadingTask = task;
        const result = await task.promise;
        if (!cancelled) setDocument(result);
      } catch { if (!cancelled) setError("The document could not be opened. Please try again or download it instead."); }
    }
    void load();
    return () => { cancelled = true; void loadingTask?.destroy(); };
  }, [slug]);
  return <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100 text-slate-900">
    <header className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-3 shadow-sm sm:gap-4 sm:px-6">
      <Link href={`/articles/${encodeURIComponent(slug)}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 font-semibold hover:bg-slate-50"><ArrowLeft size={18} /> <span className="hidden sm:inline">Resource</span><span className="sm:hidden">Back</span></Link>
      <div className="min-w-0 flex-1"><h1 className="truncate font-bold">{article?.title || "Document"}</h1><p className="text-xs text-slate-500">Read online</p></div>
      <div className="flex items-center rounded-lg border border-slate-300"><button aria-label="Zoom out" disabled={zoom <= .75} onClick={() => setZoom((value) => Math.max(.75, value - .25))} className="p-2.5 disabled:opacity-40"><ZoomOut size={20} /></button><span className="w-12 text-center text-sm font-semibold">{Math.round(zoom * 100)}%</span><button aria-label="Zoom in" disabled={zoom >= 2} onClick={() => setZoom((value) => Math.min(2, value + .25))} className="p-2.5 disabled:opacity-40"><ZoomIn size={20} /></button></div>
      {article?.fileUrl && <a href={article.fileUrl} download={article.fileName} aria-label="Download document" title="Download document" className="rounded-lg bg-emerald-700 p-3 text-white hover:bg-emerald-800"><Download size={20} /></a>}
    </header>
    <main className="min-h-0 flex-1 overflow-auto"><div className="mx-auto space-y-6 py-6 sm:py-10">
      {error ? <p role="alert" className="mx-auto max-w-lg rounded-xl bg-white p-6 text-center text-red-700">{error}</p> : !document ? <p role="status" className="p-8 text-center text-slate-600">Loading document…</p> : Array.from({ length: document.numPages }, (_, i) => <Page key={i} document={document} number={i + 1} zoom={zoom} />)}
    </div></main>
  </div>;
}
