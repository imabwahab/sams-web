"use client";

import AdminDashboard from "@/features/admin/AdminDashboard";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function AdminPage() {
  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedLayout>
  );
}
