"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { useCategory } from "@/app/contexts/category-context";
import { useTranslations } from "next-intl";

export function InviteModal({ categoryId, onClose }: { categoryId: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const { token } = useAuth();
  const { fetchCategories } = useCategory();
  const translateCommon = useTranslations("common");
  const t = useTranslations("project");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !token) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/categories/${categoryId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || t("inviteSuccess"), type: "success" });
        setEmail("");
        // Rafraîchir les catégories pour voir le nouveau membre
        await fetchCategories();
        setTimeout(onClose, 2000);
      } else {
        setMessage({ text: data.error || t("inviteError"), type: "error" });
      }
    } catch (error) {
      setMessage({ text: t("networkError"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">{t("inviteTitle")}</h3>
        
        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleInvite} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              required
            />
          </div>
          
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline px-4 py-2"
              disabled={loading}
            >
              {translateCommon("cancel")}
            </button>
            <button
              type="submit"
              className="btn-cta px-4 py-2"
              disabled={loading}
            >
              {loading ? translateCommon("loading") : t("sendInvite")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
