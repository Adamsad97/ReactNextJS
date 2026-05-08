"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/app/lib/validations/auth.schema";
import { useAuth } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";


export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({

    resolver: zodResolver(loginSchema) as any,
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    const res = await fetch("/api/auth/login", {
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
      <h1>Connexion</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <Link href={`/${locale}/register`}>Pas encore de compte ?</Link>
    </div>
  );
}