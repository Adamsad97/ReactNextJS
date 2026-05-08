"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "@/app/lib/validations/task.schema";
import { useTask } from "@/app/contexts/task-context";
import { useAuth } from "@/app/contexts/auth-context";
import { useTranslations } from "next-intl";

export function TaskForm({ onClose }: { onClose: () => void }) {
  const { addTask } = useTask();
  const { token } = useAuth();
  const translateTasks = useTranslations("tasks");
  const translateCommon = useTranslations("common");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskSchema) as any,
  });

  const onSubmit = async (data: TaskFormData) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const task = await res.json();
      addTask(task);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>{translateTasks("form.title")}</label>
        <input {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div>
        <label>{translateTasks("form.description")}</label>
        <textarea {...register("description")} />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <div>
        <label>{translateTasks("form.status")}</label>
        <select {...register("status")}>
          <option value="TODO">{translateTasks("status.TODO")}</option>
          <option value="IN_PROGRESS">{translateTasks("status.IN_PROGRESS")}</option>
          <option value="DONE">{translateTasks("status.DONE")}</option>
          <option value="CANCELLED">{translateTasks("status.CANCELLED")}</option>
        </select>
      </div>

      <div>
        <label>{translateTasks("form.priority")}</label>
        <select {...register("priority")}>
          <option value="LOW">{translateTasks("priority.LOW")}</option>
          <option value="MEDIUM">{translateTasks("priority.MEDIUM")}</option>
          <option value="HIGH">{translateTasks("priority.HIGH")}</option>
          <option value="URGENT">{translateTasks("priority.URGENT")}</option>
        </select>
      </div>

      <div>
        <label>{translateTasks("form.deadline")}</label>
        <input type="date" {...register("deadline")} />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? translateCommon("loading") : translateTasks("form.create")}
      </button>
      <button type="button" onClick={onClose}>
        {translateCommon("cancel")}
      </button>
    </form>
  );
}