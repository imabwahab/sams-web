"use client";

import DoctorDashboard from "@/features/doctor/DoctorDashboard";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function DoctorHomePage() {
  return (
    <ProtectedLayout allowedRoles={["doctor"]}>
      <DoctorDashboard />
    </ProtectedLayout>
  );
}
