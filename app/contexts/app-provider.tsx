"use client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskFlow - Application de gestion de tâches",
  description: "Gérez vos tâches efficacement avec TaskFlow, votre application de gestion de tâches intuitive et puissante.",
};

import { AuthProvider } from "./auth-context";
import { TaskProvider } from "./task-context";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </AuthProvider>
  );
}