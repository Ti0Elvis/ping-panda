"use client";
import type { EventCategory } from "@prisma/client";
import { createContext, type PropsWithChildren, useContext } from "react";
import { useCategory, type UseCategoryReturn } from "../hooks/use-category";

interface Context extends UseCategoryReturn {
  has_events?: boolean;
  category: EventCategory;
}

export const CategoryContext = createContext<Context | null>(null);

export function useCategoryContext() {
  const context = useContext(CategoryContext);

  if (context === null) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
}

interface Props extends PropsWithChildren {
  has_events?: boolean;
  category: EventCategory;
}

export function CategoryProvider({ children, ...props }: Readonly<Props>) {
  const data = useCategory(props.category, props.has_events);

  return (
    <CategoryContext.Provider value={{ ...data }}>
      {children}
    </CategoryContext.Provider>
  );
}
