"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/contexts/auth-context";
import { useTranslations } from "next-intl";
import { useState } from "react";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Mot de passe trop court"),
  newPassword: z.string().min(6, "Mot de passe trop court"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordForm() {
  const { token } = useAuth();
  const translate = useTranslations("common");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
   
    resolver: zodResolver(passwordSchema) as any,
  });

  const onSubmit = async (data: PasswordFormData) => {
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSuccess(translate("save"));
      reset();
    } else {
      const json = await res.json();
      setError(json.error);
    }
  };

  return (
    <div>
      <h2>{translate("changePassword")}</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>{translate("currentPassword")}</label>
          <input type="password" {...register("currentPassword")} />
          {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label>{translate("newPassword")}</label>
          <input type="password" {...register("newPassword")} />
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </div>
        <div>
          <label>{translate("confirmPassword")}</label>
          <input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? translate("loading") : translate("change")}
        </button>
      </form>
    </div>
  );
}