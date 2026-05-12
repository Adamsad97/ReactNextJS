"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/app/contexts/auth-context";
import { useCategory } from "@/app/contexts/category-context";
import { useTranslations } from "next-intl";

interface Invitation {
  id: string;
  category: {
    id: string;
    name: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export function Notifications() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const { fetchCategories } = useCategory();
  const t = useTranslations("notifications");

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchInvitations();
    }
  }, [isAuthenticated, token]);

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/invitations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    }
  };

  const handleAccept = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invitations/${id}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
        fetchCategories(); // Refresh projects list
      }
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invitations/${id}/decline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch (error) {
      console.error("Failed to decline invitation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        title={t("title")}
      >
        <Bell size={20} />
        {invitations.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {invitations.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 z-50 rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10 overflow-hidden">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {t("title")}
              </h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {invitations.length === 0 ? (
                <div className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  {t("empty")}
                </div>
              ) : (
                invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {invitation.category.user.name}
                      </span>{" "}
                      {t("inviteText1")}{" "}
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {invitation.category.name}
                      </span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(invitation.id)}
                        disabled={loading}
                        className="flex-1 btn-cta px-3 py-1.5 text-xs h-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {t("accept")}
                      </button>
                      <button
                        onClick={() => handleDecline(invitation.id)}
                        disabled={loading}
                        className="flex-1 btn-outline px-3 py-1.5 text-xs h-auto border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      >
                        {t("decline")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
