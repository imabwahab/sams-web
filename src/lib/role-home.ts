import type { UserRole } from "@/types/domain";

export function roleHomePath(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "doctor") return "/doctor";
  return "/dashboard";
}
