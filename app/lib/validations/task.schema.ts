import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire").max(100, "Titre trop long"),
  description: z.string().max(500, "Description trop longue").optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  deadline: z
    .string()
    .min(1, "La deadline est obligatoire")
    .refine((dateString) => {
      const selectedDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "La deadline ne peut pas être dans le passé"),
  categoryId: z.string().optional(),
  assigneeIds: z.array(z.string()).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;