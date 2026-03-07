"use client";

import UserManagement from "@/features/admin/UserManagement";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function AdminUsersPage() {
  return <ProtectedLayout allowedRoles={["admin"]}><UserManagement /></ProtectedLayout>;
}
