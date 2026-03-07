"use client";

import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import AppShell from "@/components/layout/AppShell";
import type { UserRole } from "@/types/domain";

export default function ProtectedLayout({ allowedRoles, children }: { allowedRoles: UserRole[]; children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}
