"use client";

import FindDoctors from "@/features/patient/FindDoctors";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function FindDoctorsPage() {
  return <ProtectedLayout allowedRoles={["patient"]}><FindDoctors /></ProtectedLayout>;
}
