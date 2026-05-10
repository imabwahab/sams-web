"use client";

import MyAppointments from "@/features/patient/MyAppointments";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function MyAppointmentsPage() {
  return (
    <ProtectedLayout allowedRoles={["patient"]}>
      <MyAppointments />
    </ProtectedLayout>
  );
}
