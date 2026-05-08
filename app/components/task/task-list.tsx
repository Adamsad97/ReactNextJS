"use client";

import { useEffect } from "react";
import { useTask } from "@/app/contexts/task-context";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TaskCard } from "./task-card";

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

const FILTERS = ["ALL", "TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as const;

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const { tasks, setTasks, filter, setFilter } = useTask();
  const translate = useTranslations("tasks");

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks, setTasks]);

  const filteredTasks = filter === "ALL"
    ? tasks
    : tasks.filter((task) => task.status === filter);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`locale-button ${filter === f ? "locale-button-active" : "locale-button-inactive"}`}
          >
            {f === "ALL" ? translate("filters.ALL") : translate(`status.${f}`)}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card-description"
        >
          {translate("noTasks")}
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredTasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}