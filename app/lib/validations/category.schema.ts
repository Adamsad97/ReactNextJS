import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").max(50, "Nom trop long"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide").optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;