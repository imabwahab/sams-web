"use client";

import PatientDashboard from "@/features/patient/PatientDashboard";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function DashboardPage() {
  return <ProtectedLayout allowedRoles={["patient"]}><PatientDashboard /></ProtectedLayout>;
}
