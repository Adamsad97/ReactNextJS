"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "@/app/lib/validations/task.schema";
import { useTask } from "@/app/contexts/task-context";
import { useAuth } from "@/app/contexts/auth-context";
import { useCategory } from "@/app/contexts/category-context";
import { useTranslations } from "next-intl";

export function TaskForm({ onClose }: { onClose: () => void }) {
  const { addTask } = useTask();
  const { token } = useAuth();
  const { categories, activeCategoryId } = useCategory();
  const translateTasks = useTranslations("tasks");
  const translateCommon = useTranslations("common");

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskSchema) as any,
  });

  const onSubmit = async (data: TaskFormData) => {
    const payload = {
      ...data,
      categoryId: activeCategoryId || undefined,
    };

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const task = await res.json();
      addTask(task);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {translateTasks("form.title")}
        </label>
        <input
          {...register("title")}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm transition-all"
          placeholder="Entrez le titre de la tâche..."
        />
        {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {translateTasks("form.description")}
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm transition-all resize-none"
          placeholder="Décrivez la tâche en quelques mots..."
        />
        {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {translateTasks("form.status")}
          </label>
          <select
            {...register("status")}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm transition-all appearance-none"
          >
            <option value="TODO">{translateTasks("status.TODO")}</option>
            <option value="IN_PROGRESS">{translateTasks("status.IN_PROGRESS")}</option>
            <option value="DONE">{translateTasks("status.DONE")}</option>
            <option value="CANCELLED">{translateTasks("status.CANCELLED")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {translateTasks("form.priority")}
          </label>
          <select
            {...register("priority")}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm transition-all appearance-none"
          >
            <option value="LOW">{translateTasks("priority.LOW")}</option>
            <option value="MEDIUM">{translateTasks("priority.MEDIUM")}</option>
            <option value="HIGH">{translateTasks("priority.HIGH")}</option>
            <option value="URGENT">{translateTasks("priority.URGENT")}</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {translateTasks("form.deadline")}
        </label>
        <input
          type="date"
          {...register("deadline")}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm transition-all"
        />
      </div>

      {activeCategory && activeCategory.members && activeCategory.members.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {translateTasks("assignTo")}
          </label>
          <select
            multiple
            {...register("assigneeIds")}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm transition-all h-28"
          >
            {activeCategory.members.map((member) => (
              <option key={member.id} value={member.id} className="py-1 px-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                {member.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-zinc-500 font-medium">
            {translateTasks("multiSelectHint")}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-95"
        >
          {isSubmitting ? translateCommon("loading") : translateTasks("form.create")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-900 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
        >
          {translateCommon("cancel")}
        </button>
      </div>
    </form>
  );
}