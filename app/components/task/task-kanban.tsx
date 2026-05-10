"use client";

import {
  DndContext,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useTask } from "@/app/contexts/task-context";
import { useAuth } from "@/app/contexts/auth-context";
import { useTranslations } from "next-intl";
import { KanbanColumn } from "./kanban-column";

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

const KANBAN_COLUMNS = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as const;

export function TaskKanban({ tasks }: { tasks: Task[] }) {
  const { setTasks } = useTask();
  const { token } = useAuth();
  const translate = useTranslations("tasks");

  const dragSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (dragEvent: DragEndEvent) => {
    const { active: draggedTask, over: dropTarget } = dragEvent;
    if (!dropTarget) return;

    const draggedTaskId = draggedTask.id as string;
    const targetId = dropTarget.id as string;

    const targetColumnStatus = KANBAN_COLUMNS.includes(targetId as typeof KANBAN_COLUMNS[number])
      ? targetId
      : tasks.find((task) => task.id === targetId)?.status;

    if (!targetColumnStatus) return;

    const draggedTaskData = tasks.find((task) => task.id === draggedTaskId);
    if (!draggedTaskData || draggedTaskData.status === targetColumnStatus) return;

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTaskId ? { ...task, status: targetColumnStatus } : task
    );

    setTasks(updatedTasks);

    await fetch(`/api/tasks/${draggedTaskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...draggedTaskData, status: targetColumnStatus }),
    });
  };

  return (
    <DndContext
      sensors={dragSensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KANBAN_COLUMNS.map((columnStatus) => (
          <KanbanColumn
            key={columnStatus}
            columnStatus={columnStatus}
            columnLabel={translate(`status.${columnStatus}`)}
            columnTasks={tasks.filter((task) => task.status === columnStatus)}
          />
        ))}
      </div>
    </DndContext>
  );
}