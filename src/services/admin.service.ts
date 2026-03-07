import type { AppointmentResponse, User, UserResponse } from "@/types/domain";
import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import { deleteDoctor, getDoctors, updateDoctor } from "@/services/doctors.service";
import type { UpdateAdminRequest, UpdateDoctorProfileRequest } from "@/types/api";

export function getAdmins() {
  return apiFetch<User[]>(endpoints.admins.list, { method: "GET" });
}

export function createAdmin(payload: UpdateAdminRequest & { username: string; password: string }) {
  return apiFetch<User>(endpoints.admins.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdmin(id: number, payload: Partial<UpdateAdminRequest>) {
  return apiFetch<User>(endpoints.admins.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdmin(id: number) {
  return apiFetch<void>(endpoints.admins.remove(id), { method: "DELETE" });
}

export function getManagedDoctors(params?: { specialization?: string; search?: string }) {
  return getDoctors(params);
}

export function updateManagedDoctor(
  id: number,
  payload: Partial<
    UpdateDoctorProfileRequest & {
      username: string;
      email: string;
      fullName: string;
      phone?: string | null;
    }
  >,
) {
  return updateDoctor(id, payload);
}

export function deleteManagedDoctor(id: number) {
  return deleteDoctor(id);
}

export function getAdminAppointments() {
  return apiFetch<AppointmentResponse[]>(endpoints.appointments.list, { method: "GET" });
}
