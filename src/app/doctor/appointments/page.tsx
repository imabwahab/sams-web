"use client";

import DoctorAppointments from "@/features/doctor/DoctorAppointments";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function DoctorAppointmentsPage() {
  return (
    <ProtectedLayout allowedRoles={["doctor"]}>
      <DoctorAppointments />
    </ProtectedLayout>
  );
}
