"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/app/lib/validations/auth.schema";
import { useAuth } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";





export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    
    resolver: zodResolver(registerSchema) as any,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const { token, user } = await res.json();
      login(token, user);
      router.push(`/${locale}/dashboard`);
    } else {
      const json = await res.json();
      setError(json.error);
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nom</label>
          <input type="text" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Mot de passe</label>
          <input type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label>Confirmer le mot de passe</label>
          <input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
      <Link href={`/${locale}/login`}>Déjà un compte ?</Link>
    </div>
  );
}