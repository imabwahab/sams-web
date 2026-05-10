"use client";

import PatientProfile from "@/features/patient/PatientProfile";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function ProfilePage() {
  return (
    <ProtectedLayout allowedRoles={["patient"]}>
      <PatientProfile />
    </ProtectedLayout>
  );
}
