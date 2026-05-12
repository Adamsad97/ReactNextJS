"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";

export type ProjectMember = {
  id: string;
  name: string;
  email: string;
};

export type Category = {
  id: string;
  name: string;
  color: string | null;
  userId: string;
  members: ProjectMember[];
};

type CategoryContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  activeCategoryId: string | null;
  setActiveCategoryId: (id: string | null) => void;
  fetchCategories: () => Promise<void>;
};

const STORAGE_KEY = "task-flow-active-project";
const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });
  const { token, isAuthenticated } = useAuth();

  const handleSetActiveCategoryId = (id: string | null) => {
    setActiveCategoryId(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        
        if (data.length > 0) {
          const savedId = localStorage.getItem(STORAGE_KEY);
          const projectStillExists = data.some((c: Category) => c.id === savedId);
          
          if (projectStillExists && savedId) {
            setActiveCategoryId(savedId);
          } else {
            // Keep current if valid, otherwise fallback to first project
            setActiveCategoryId((prev) => {
              if (prev && data.some((c: Category) => c.id === prev)) return prev;
              return data[0].id;
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    } else {
      setCategories([]);
      setActiveCategoryId(null);
    }
  }, [isAuthenticated, token]);

  const addCategory = (category: Category) => setCategories((prev) => [...prev, category]);

  const updateCategory = (category: Category) =>
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (activeCategoryId === id) {
      handleSetActiveCategoryId(null);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        activeCategoryId,
        setActiveCategoryId: handleSetActiveCategoryId,
        fetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategory must be used within CategoryProvider");
  return context;
}
