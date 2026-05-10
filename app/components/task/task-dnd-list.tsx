"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useTask } from "@/app/contexts/task-context";
import { useAuth } from "@/app/contexts/auth-context";
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

export function TaskDndList({ tasks }: { tasks: Task[] }) {
  const { setTasks } = useTask();
  const { token } = useAuth();

  const dragSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (dragEvent: DragEndEvent) => {
    const { active: draggedItem, over: dropTarget } = dragEvent;
    if (!dropTarget || draggedItem.id === dropTarget.id) return;

    const previousIndex = tasks.findIndex((task) => task.id === draggedItem.id);
    const newIndex = tasks.findIndex((task) => task.id === dropTarget.id);
    const reorderedTasks = arrayMove(tasks, previousIndex, newIndex).map((task, index) => ({
      ...task,
      position: index,
    }));

    setTasks(reorderedTasks);

    await Promise.all(
      reorderedTasks.map((task) =>
        fetch(`/api/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        })
      )
    );
  };

  return (
    <DndContext
      sensors={dragSensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task, taskIndex) => (
            <TaskCard key={task.id} task={task} index={taskIndex} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}