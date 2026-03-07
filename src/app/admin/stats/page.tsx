"use client";

import SystemStats from "@/features/admin/SystemStats";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function AdminStatsPage() {
  return <ProtectedLayout allowedRoles={["admin"]}><SystemStats /></ProtectedLayout>;
}
