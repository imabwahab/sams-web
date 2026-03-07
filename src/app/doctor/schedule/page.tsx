"use client";

import ManageSchedule from "@/features/doctor/ManageSchedule";
import ProtectedLayout from "@/components/auth/ProtectedLayout";

export default function DoctorSchedulePage() {
  return <ProtectedLayout allowedRoles={["doctor"]}><ManageSchedule /></ProtectedLayout>;
}
