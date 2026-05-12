"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/app/lib/validations/auth.schema";
import { useAuth } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";


import { useTranslations } from "next-intl";


export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const tAuth = useTranslations("auth");
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {tAuth("login")}
          </h1>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {tAuth("email")}
              </label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {tAuth("password")}
                </label>
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-xs font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  {tAuth("forgotPasswordLink")}
                </Link>
              </div>
              <input
                type="password"
                {...register("password")}
                className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:text-sm"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isSubmitting ? tAuth("loading") : tAuth("loginButton")}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            href={`/${locale}/register`}
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            {tAuth("noAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}