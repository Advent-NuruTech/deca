"use client";

import PageQuickActions from "@/components/admin/PageQuickActions";

import { useEffect, useState } from "react";
import { GripVertical, MessageCircle, Plus, Save, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { ChatCategory, ChatSettings } from "@/lib/types";
import { errorMessage } from "@/components/admin/admin-utils";

const emptySettings: ChatSettings = { directPhone: "", categories: [] };

export default function ChatSettingsManager() {
  const [settings, setSettings] = useState<ChatSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get<ChatSettings>("/api/admin/chat")
      .then(setSettings)
      .catch((nextError) => setError(errorMessage(nextError, "Could not load chat settings")))
      .finally(() => setLoading(false));
  }, []);

  function updateCategory(id: string, field: "label" | "phone", value: string) {
    setSettings((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === id ? { ...category, [field]: value } : category,
      ),
    }));
  }

  function addCategory() {
    const category: ChatCategory = {
      id: `category-${Date.now()}`,
      label: "",
      phone: settings.directPhone,
    };
    setSettings((current) => ({ ...current, categories: [...current.categories, category] }));
  }

  function removeCategory(id: string) {
    setSettings((current) => ({
      ...current,
      categories: current.categories.filter((category) => category.id !== id),
    }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await api.put<ChatSettings>("/api/admin/chat", settings);
      setSettings(saved);
      setMessage("Chat categories and WhatsApp routing have been saved.");
    } catch (nextError) {
      setError(errorMessage(nextError, "Could not save chat settings"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-green-100 p-3 text-green-700"><MessageCircle /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chat settings</h1>
          <p className="mt-2 text-gray-600">Manage the choices shown in the website chat and the WhatsApp number used for each choice.</p>
        </div>
      </div>

      <PageQuickActions actions={[
        { label: "Add chat category", icon: <Plus size={18} />, onClick: addCategory, disabled: loading },
        { label: "Direct number", icon: <MessageCircle size={18} />, onClick: () => document.getElementById("direct-chat-number")?.focus() },
        { label: "View chat categories", icon: <GripVertical size={18} />, href: "#chat-categories" },
      ]} />

      {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
      {message && <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-700">{message}</p>}

      <form onSubmit={save} className="mt-6 space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <label className="block font-semibold text-gray-900">
            Direct-message WhatsApp number
            <input
              id="direct-chat-number"
              required
              type="tel"
              value={settings.directPhone}
              onChange={(event) => setSettings((current) => ({ ...current, directPhone: event.target.value }))}
              placeholder="254721627977"
              className="input-field mt-2"
            />
          </label>
          <p className="mt-2 text-sm text-gray-500">Include the country code. The “send a direct message” link uses this number.</p>
        </section>

        <section id="chat-categories" className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chat categories</h2>
              <p className="mt-1 text-sm text-gray-500">Each category opens WhatsApp using the number on the same row.</p>
            </div>
            <button type="button" onClick={addCategory} className="flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-700 hover:bg-green-50">
              <Plus size={18} /> Add category
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {settings.categories.map((category, index) => (
              <div key={category.id} className="grid items-end gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[auto_1fr_1fr_auto]">
                <div className="hidden self-center text-gray-400 md:block" aria-hidden="true"><GripVertical size={20} /></div>
                <label className="text-sm font-medium text-gray-700">
                  Category {index + 1}
                  <input required value={category.label} onChange={(event) => updateCategory(category.id, "label", event.target.value)} className="input-field mt-1.5 bg-white" placeholder="Category name" />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  WhatsApp number
                  <input required type="tel" value={category.phone} onChange={(event) => updateCategory(category.id, "phone", event.target.value)} className="input-field mt-1.5 bg-white" placeholder="254721627977" />
                </label>
                <button type="button" onClick={() => removeCategory(category.id)} aria-label={`Remove ${category.label || `category ${index + 1}`}`} className="rounded-lg p-3 text-red-600 hover:bg-red-50">
                  <Trash2 size={19} />
                </button>
              </div>
            ))}
            {!loading && settings.categories.length === 0 && <p className="rounded-lg bg-amber-50 p-4 text-amber-800">Add at least one chat category before saving.</p>}
          </div>
        </section>

        <button disabled={loading || saving || settings.categories.length === 0} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
          <Save size={18} /> {saving ? "Saving…" : "Save chat settings"}
        </button>
      </form>
    </main>
  );
}
