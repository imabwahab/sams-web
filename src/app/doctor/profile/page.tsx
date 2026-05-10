"use client";

import DoctorProfile from "@/features/doctor/DoctorProfile";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function DoctorProfilePage() {
  return (
    <ProtectedLayout allowedRoles={["doctor"]}>
      <DoctorProfile />
    </ProtectedLayout>
  );
}
