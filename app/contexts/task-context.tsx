"use client";

import { createContext, useContext, useState } from "react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Task Context",
    description: "Contexte de gestion des tâches",
  };
}


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

type TaskContextType = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);

  const updateTask = (task: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask, filter, setFilter }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within TaskProvider");
  return context;
}