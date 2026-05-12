"use client";

import { useState } from "react";
import { useCategory, type Category } from "@/app/contexts/category-context";
import { InviteModal } from "./invite-modal";
import { useTranslations } from "next-intl";

export function ProjectManager() {
  const { categories, activeCategoryId, setActiveCategoryId, addCategory } = useCategory();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const translateTasks = useTranslations("tasks");
  const translateCommon = useTranslations("common");
  const t = useTranslations("project");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newProjectName, color: "#3B82F6" }),
      });

      if (res.ok) {
        const newCategory = await res.json();
        addCategory(newCategory);
        setActiveCategoryId(newCategory.id);
        setNewProjectName("");
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-4 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {t("label")}
        </label>
        {isCreating ? (
          <form onSubmit={handleCreateProject} className="flex items-center gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              autoFocus
            />
            <button type="submit" className="btn-cta text-xs px-3 py-1.5 h-auto">
              {translateCommon("save")}
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="btn-outline text-xs px-3 py-1.5 h-auto"
            >
              {translateCommon("cancel")}
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={activeCategoryId || ""}
              onChange={(e) => setActiveCategoryId(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="" disabled>{t("selectPlaceholder")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsCreating(true)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              {t("new")}
            </button>
          </div>
        )}
      </div>

      {activeCategory && (
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {activeCategory.members?.map((member) => (
              <div
                key={member.id}
                title={member.name}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 border-2 border-white text-xs font-bold text-zinc-700 dark:border-zinc-900 dark:bg-zinc-700 dark:text-zinc-200"
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="btn-outline text-sm px-3 py-1.5 h-auto flex items-center gap-2"
          >
            {t("invite")}
          </button>
        </div>
      )}

      {isInviteModalOpen && activeCategoryId && (
        <InviteModal
          categoryId={activeCategoryId}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}
    </div>
  );
}
