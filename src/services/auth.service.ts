import type { ChangePasswordRequest } from "@/types/api";
import type { UserResponse } from "@/types/domain";
import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";

export function getCurrentUser() {
  return apiFetch<UserResponse>(endpoints.auth.me, { method: "GET" });
}

export function logout() {
  return apiFetch<void>(endpoints.auth.logout, { method: "POST" });
}

export function changePassword(payload: ChangePasswordRequest) {
  return apiFetch<void>(endpoints.auth.changePassword, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
