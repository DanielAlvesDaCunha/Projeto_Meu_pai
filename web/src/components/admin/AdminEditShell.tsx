"use client";

import { AdminEditProvider } from "@/components/admin/AdminEditContext";
import { AdminEditToolbar } from "@/components/admin/AdminEditToolbar";
import type { ReactNode } from "react";

export function AdminEditShell({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  return (
    <AdminEditProvider isAdmin={isAdmin}>
      {children}
      <AdminEditToolbar />
    </AdminEditProvider>
  );
}
