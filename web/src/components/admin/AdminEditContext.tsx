"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

type AdminEditContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
};

const AdminEditContext = createContext<AdminEditContextValue | null>(null);

const STORAGE_KEY = "paulo_suculentas_edit_mode";

export function AdminEditProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  const [editMode, setEditModeState] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAdmin) {
      setEditModeState(false);
      return;
    }
    if (searchParams.get("editar") === "1") {
      setEditModeState(true);
      window.localStorage.setItem(STORAGE_KEY, "1");
      return;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setEditModeState(saved === "1");
  }, [isAdmin, searchParams]);

  function setEditMode(value: boolean) {
    if (!isAdmin) return;
    setEditModeState(value);
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  }

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  return (
    <AdminEditContext.Provider
      value={{
        isAdmin,
        editMode: isAdmin && editMode,
        setEditMode,
        toggleEditMode,
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  const ctx = useContext(AdminEditContext);
  if (!ctx) {
    return {
      isAdmin: false,
      editMode: false,
      setEditMode: () => undefined,
      toggleEditMode: () => undefined,
    };
  }
  return ctx;
}
