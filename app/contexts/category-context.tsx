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

const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !activeCategoryId) {
          setActiveCategoryId(data[0].id);
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
      setActiveCategoryId(null);
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
        setActiveCategoryId,
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
