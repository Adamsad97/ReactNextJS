"use client";

import { useState } from "react";
import { useCategory } from "@/app/contexts/category-context";
import { useTranslations } from "next-intl";
import { TaskForm } from "./task-form";
import { Modal } from "../ui/modal";

export function ProjectHeader() {
  const { categories, activeCategoryId } = useCategory();
  const [isOpen, setIsOpen] = useState(false);
  const translate = useTranslations("tasks");
  const tProject = useTranslations("project");

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const projectName = activeCategory ? activeCategory.name : translate("title");

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
          {translate("project")}
        </p>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          {projectName}
        </h2>
      </div>
      
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={!activeCategoryId}
        title={!activeCategoryId ? tProject("selectFirst") : ""}
      >
        <span className="text-lg">+</span> {translate("add")}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={translate("add")}
      >
        <TaskForm onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
}
