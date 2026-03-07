export const queryKeys = {
  authUser: ["auth", "me"] as const,
  appointments: ["appointments"] as const,
  adminAppointments: ["admin", "appointments"] as const,
  admins: ["admin", "admins"] as const,
  adminDoctors: ["admin", "doctors"] as const,
  doctors: (specialization?: string, search?: string) => ["doctors", specialization ?? "", search ?? ""] as const,
  doctor: (id: number) => ["doctor", id] as const,
  doctorSchedule: (id: number) => ["doctor", id, "schedule"] as const,
};
