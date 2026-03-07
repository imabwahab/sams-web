import type { BookAppointmentRequest, UpdateAppointmentStatusRequest } from "@/types/api";
import type { AppointmentResponse } from "@/types/domain";
import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";

function normalizeAppointment(appointment: AppointmentResponse): AppointmentResponse {
  return {
    ...appointment,
    patientName:
      appointment.patientName ??
      appointment.patient?.fullName ??
      "Patient",
    doctorName:
      appointment.doctorName ??
      appointment.doctor?.fullName ??
      "Doctor",
  };
}

export function getAppointments() {
  return apiFetch<AppointmentResponse[]>(endpoints.appointments.list, { method: "GET" }).then((items) =>
    items.map(normalizeAppointment),
  );
}

export function createAppointment(payload: BookAppointmentRequest) {
  return apiFetch<AppointmentResponse>(endpoints.appointments.create, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(normalizeAppointment);
}

export function updateAppointmentStatus(id: number, payload: UpdateAppointmentStatusRequest) {
  return apiFetch<AppointmentResponse>(endpoints.appointments.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then(normalizeAppointment);
}

export function updateAppointment(id: number, payload: Partial<BookAppointmentRequest & UpdateAppointmentStatusRequest & { notes?: string | null }>) {
  return apiFetch<AppointmentResponse>(endpoints.appointments.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then(normalizeAppointment);
}

export function deleteAppointment(id: number) {
  return apiFetch<void>(endpoints.appointments.remove(id), { method: "DELETE" });
}
