"use client";

import { useState } from "react";
import { useTask } from "@/app/contexts/task-context";
import { useAuth } from "@/app/contexts/auth-context";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useLocale } from "next-intl";

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

const statusColors: Record<string, string> = {
  TODO: "bg-zinc-100 text-zinc-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-zinc-100 text-zinc-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export function TaskCard({ task, index }: { task: Task; index: number }) {
  const { deleteTask, updateTask } = useTask();
  const { token } = useAuth();
  const translateTasks = useTranslations("tasks");
  const translateCommon = useTranslations("common");
  const locale = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleDelete = async () => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) deleteTask(task.id);
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...task, title: editTitle }),
    });
    if (res.ok) {
      updateTask({ ...task, title: editTitle });
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="btn-cta text-sm px-3 py-1 h-9">
              { translateTasks("edit")}
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-outline text-sm px-3 py-1 h-9">
              {translateCommon("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[task.status]}`}>
              {translateTasks(`status.${task.status}`)}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityColors[task.priority]}`}>
              {translateTasks(`priority.${task.priority}`)}
            </span>
          </div>
          {task.deadline && (
            <p className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              <Calendar className="h-4 w-4 text-blue-500" />
              {new Date(task.deadline).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" })}
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button onClick={() => setIsEditing(true)} className="btn-outline text-sm px-3 py-1 h-9">
              {translateTasks("edit")}
            </button>
            <button
              onClick={handleDelete}
              className="text-sm px-3 py-1 h-9 text-red-600 hover:text-red-800 transition-colors"
            >
              {translateTasks("delete")}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}