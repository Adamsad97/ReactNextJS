"use client";

import { useState } from "react";
import { TaskForm } from "./task-form";
import { useTranslations } from "next-intl";

export function TaskFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const translate = useTranslations("tasks");

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>+ {translate("add")}</button>
      {isOpen && <TaskForm onClose={() => setIsOpen(false)} />}
    </div>
  );
}