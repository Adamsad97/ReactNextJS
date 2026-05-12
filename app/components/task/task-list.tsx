"use client";

import { useEffect, useRef } from "react";
import { useTask } from "@/app/contexts/task-context";
import { useCategory } from "@/app/contexts/category-context";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { TaskKanban } from "./task-kanban";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  deadline?: string;
  position: number;
  categoryId?: string;
};

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const { tasks, setTasks } = useTask();
  const { activeCategoryId, categories } = useCategory();
  const translate = useTranslations("tasks");
  const tProject = useTranslations("project");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      setTasks(initialTasks);
      hasInitialized.current = true;
    }
  }, [initialTasks, setTasks]);

  // Filtrer les tâches selon le projet sélectionné
  const filteredTasks = activeCategoryId
    ? tasks.filter((t) => t.categoryId === activeCategoryId)
    : tasks;

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  // Aucun projet sélectionné
  if (!activeCategoryId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 gap-3 text-center"
      >
        <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
          {translate("selectProject")}
        </p>
        <p className="text-sm text-zinc-500">
          {translate("createProjectHint")} <strong>{tProject("new")}</strong>
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategoryId}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800"
          >
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {translate("noTasks")} {translate("in")} <strong>{activeCategory?.name}</strong>
            </p>
            <p className="text-xs text-zinc-400">
              {translate("useButton")} <strong>+ {translate("add")}</strong> {translate("toCreateTask")}
            </p>
          </motion.div>
        ) : (
          <TaskKanban tasks={filteredTasks} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}