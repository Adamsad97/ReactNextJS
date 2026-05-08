import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2, "Le titre est obligatoire").max(100, "Titre trop long"),
  description: z.string().max(500, "Description trop longue").optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  deadline: z.string().optional(),
  categoryId: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;