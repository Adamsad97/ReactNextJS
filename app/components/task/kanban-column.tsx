"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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

export function KanbanColumn({
  columnStatus,
  columnLabel,
  columnTasks,
}: {
  columnStatus: string;
  columnLabel: string;
  columnTasks: Task[];
}) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: columnStatus,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {columnLabel}
        </h3>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {columnTasks.length}
        </span>
      </div>

      <div
        ref={setDroppableRef}
        className={`flex flex-col gap-3 min-h-32 rounded-2xl border border-dashed p-3 transition-colors ${
          isOver
            ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/20"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
      >
        <SortableContext
          items={columnTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task, taskIndex) => (
            <TaskCard key={task.id} task={task} index={taskIndex} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}