"use client";

import { useEffect, useRef } from "react";
import { useTask } from "@/app/contexts/task-context";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
  const translate = useTranslations("tasks");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      setTasks(initialTasks);
      hasInitialized.current = true;
    }
  }, [initialTasks, setTasks]);

  return (
    <div>
      {tasks.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card-description"
        >
          {translate("noTasks")}
        </motion.p>
      ) : (
        <TaskKanban tasks={tasks} />
      )}
    </div>
  );
}