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
        <p className="text-2xl">📂</p>
        <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
          Sélectionnez un projet pour voir ses tâches
        </p>
        <p className="text-sm text-zinc-500">
          Ou créez un nouveau projet avec le bouton <strong>+ Nouveau</strong>
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
            className="flex flex-col items-center justify-center py-12 gap-2 text-center"
          >
            <p className="text-2xl">✅</p>
            <p className="card-description">
              {translate("noTasks")} dans <strong>{activeCategory?.name}</strong>
            </p>
            <p className="text-xs text-zinc-400">
              Utilisez le bouton <strong>+ {translate("add")}</strong> pour créer une tâche
            </p>
          </motion.div>
        ) : (
          <TaskKanban tasks={filteredTasks} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}