"use client";

import { useState } from "react";
import { useCategory } from "@/app/contexts/category-context";
import { useTranslations } from "next-intl";
import { TaskForm } from "./task-form";

export function ProjectHeader() {
  const { categories, activeCategoryId } = useCategory();
  const [isOpen, setIsOpen] = useState(false);
  const translate = useTranslations("tasks");
  const tProject = useTranslations("project");

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const projectName = activeCategory ? activeCategory.name : translate("title");

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="card-label">{translate("project")}</p>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{projectName}</h2>
      </div>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-cta flex items-center gap-2"
        disabled={!activeCategoryId}
        title={!activeCategoryId ? tProject("selectFirst") : ""}
      >
        + {translate("add")}
      </button>
      {isOpen && <TaskForm onClose={() => setIsOpen(false)} />}
    </div>
  );
}
