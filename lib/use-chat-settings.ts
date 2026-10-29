"use client";

import { useEffect, useState } from "react";
import type { ChatSettings } from "@/lib/types";

export function useChatSettings() {
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const load = () => {
      fetch("/api/chat", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error("Could not load chat settings");
          return response.json() as Promise<ChatSettings>;
        })
        .then((data) => { if (active) { setSettings(data); setError(false); } })
        .catch(() => { if (active) { setSettings(null); setError(true); } });
    };
    load();
    const refresh = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", refresh);
    return () => { active = false; document.removeEventListener("visibilitychange", refresh); };
  }, []);
  return { settings, error };
}
