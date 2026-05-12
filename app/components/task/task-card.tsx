"use client";

import { useState } from "react";
import { useTask } from "@/app/contexts/task-context";
import { useAuth } from "@/app/contexts/auth-context";
import { useCategory, type ProjectMember } from "@/app/contexts/category-context";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useLocale } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  deadline?: string;
  position: number;
  categoryId?: string;
  assignees?: ProjectMember[];
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
  const { categories } = useCategory();
  const translateTasks = useTranslations("tasks");
  const translateCommon = useTranslations("common");
  const locale = useLocale();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(task.title);
  const [updatedDescription, setUpdatedDescription] = useState(task.description ?? "");
  const [updatedPriority, setUpdatedPriority] = useState(task.priority);
  const [updatedDeadline, setUpdatedDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
  );
  const [updatedAssigneeIds, setUpdatedAssigneeIds] = useState<string[]>(
    task.assignees ? task.assignees.map((a) => a.id) : []
  );

  const taskCategory = categories.find((c) => c.id === task.categoryId);

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    transform: dragTransform,
    transition: dragTransition,
    isDragging,
  } = useSortable({ id: task.id });

  const dragStyle = {
    transform: CSS.Transform.toString(dragTransform),
    transition: dragTransition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) deleteTask(task.id);
  };

  const handleUpdate = async () => {
    const updatedTaskData: Task = {
      ...task,
      title: updatedTitle,
      description: updatedDescription,
      priority: updatedPriority,
      deadline: updatedDeadline ? new Date(updatedDeadline).toISOString() : undefined,
    };

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...updatedTaskData, assigneeIds: updatedAssigneeIds }),
    });

    if (res.ok) {
      updateTask(updatedTaskData);
      setIsEditFormOpen(false);
    }
  };

  return (
    <motion.div
      ref={setDragNodeRef}
      style={dragStyle}
      {...dragAttributes}
      {...dragListeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="card cursor-grab active:cursor-grabbing"
    >
      {isEditFormOpen ? (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {translateTasks("form.title")}
            </label>
            <input
              value={updatedTitle}
              onChange={(changeEvent) => setUpdatedTitle(changeEvent.target.value)}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {translateTasks("form.description")}
            </label>
            <textarea
              value={updatedDescription}
              onChange={(changeEvent) => setUpdatedDescription(changeEvent.target.value)}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {translateTasks("form.priority")}
            </label>
            <select
              value={updatedPriority}
              onChange={(changeEvent) => setUpdatedPriority(changeEvent.target.value)}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="LOW">{translateTasks("priority.LOW")}</option>
              <option value="MEDIUM">{translateTasks("priority.MEDIUM")}</option>
              <option value="HIGH">{translateTasks("priority.HIGH")}</option>
              <option value="URGENT">{translateTasks("priority.URGENT")}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {translateTasks("form.deadline")}
            </label>
            <input
              type="date"
              value={updatedDeadline}
              onChange={(changeEvent) => setUpdatedDeadline(changeEvent.target.value)}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          {taskCategory && taskCategory.members && taskCategory.members.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {translateTasks("assignTo")}
              </label>
              <select
                multiple
                value={updatedAssigneeIds}
                onChange={(changeEvent) => {
                  const options = changeEvent.target.options;
                  const selectedValues = [];
                  for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) selectedValues.push(options[i].value);
                  }
                  setUpdatedAssigneeIds(selectedValues);
                }}
                onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 h-24"
              >
                {taskCategory.members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">{translateTasks("multiSelectHint")}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
              className="btn-cta text-sm px-3 py-1 h-9"
            >
              {translateCommon("save")}
            </button>
            <button
              onClick={() => setIsEditFormOpen(false)}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
              className="btn-outline text-sm px-3 py-1 h-9"
            >
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
          
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-2 mt-2">
              {task.assignees.map((assignee) => (
                <div
                  key={assignee.id}
                  title={assignee.name}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 border-2 border-white text-[10px] font-bold text-blue-700 dark:border-zinc-900 dark:bg-blue-900/50 dark:text-blue-200"
                >
                  {assignee.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setIsEditFormOpen(true)}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
              className="btn-outline text-sm px-3 py-1 h-9"
            >
              {translateTasks("edit")}
            </button>
            <button
              onClick={handleDelete}
              onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
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