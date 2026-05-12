"use client";
import { useState } from "react";
import { TaskForm } from "./task-form";
import { useTranslations } from "next-intl";
import { Modal } from "../ui/modal";

export function TaskFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const translate = useTranslations("tasks");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-95"
      >
        <span>+</span> {translate("add")}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={translate("add")}
      >
        <TaskForm onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}