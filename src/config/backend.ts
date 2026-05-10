import type { UserRole } from "@/types/domain";

export const PUBLIC_AUTH_ROUTE_PREFIXES = ["/auth"] as const;

export const ROLE_ROUTE_PREFIXES: Record<UserRole, readonly string[]> = {
  patient: ["/dashboard", "/find-doctors", "/my-appointments", "/profile"],
  doctor: ["/doctor"],
  admin: ["/admin"],
};

export const PROTECTED_ROUTE_PREFIXES = [
  ...ROLE_ROUTE_PREFIXES.patient,
  ...ROLE_ROUTE_PREFIXES.doctor,
  ...ROLE_ROUTE_PREFIXES.admin,
] as const;

export const DEFAULT_ROLE_HOME: Record<UserRole, string> = {
  patient: "/dashboard",
  doctor: "/doctor",
  admin: "/admin",
};
