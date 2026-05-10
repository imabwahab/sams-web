import type {
  CreateScheduleRequest,
  UpdateCurrentDoctorRequest,
  UpdateDoctorProfileRequest,
} from "@/types/api";
import type { DoctorProfile, Schedule, User, UserResponse } from "@/types/domain";
import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import { normalizeApiDate } from "@/lib/date";

function normalizeDoctor(
  input: UserResponse | (User & Partial<DoctorProfile> & { doctorProfile?: DoctorProfile | null }),
): UserResponse {
  if ("doctorProfile" in input && input.doctorProfile) {
    return input as UserResponse;
  }

  const doctorProfile =
    "specialization" in input
      ? {
          id: (input as DoctorProfile & { id?: number }).id ?? 0,
          userId: input.id,
          specialization: input.specialization ?? "",
          bio: input.bio ?? null,
          consultationFee: input.consultationFee ?? 0,
          experienceYears: input.experienceYears ?? 0,
        }
      : null;

  return {
    ...input,
    doctorProfile,
  };
}

export function getDoctors(params?: { specialization?: string; search?: string }) {
  const search = new URLSearchParams();
  if (params?.specialization && params.specialization !== "all") {
    search.set("specialization", params.specialization);
  }
  if (params?.search) {
    search.set("search", params.search);
  }
  const suffix = search.toString();
  return apiFetch<Array<UserResponse | (User & Partial<DoctorProfile>)>>(
    `${endpoints.doctors.list}${suffix ? `?${suffix}` : ""}`,
    { method: "GET" },
  ).then((items) => items.map(normalizeDoctor));
}

export function getDoctor(id: number) {
  return apiFetch<UserResponse | (User & Partial<DoctorProfile>)>(endpoints.doctors.detail(id), {
    method: "GET",
  }).then(normalizeDoctor);
}

export function getCurrentDoctor() {
  return apiFetch<UserResponse | (User & Partial<DoctorProfile>)>(endpoints.doctors.me, {
    method: "GET",
  }).then(normalizeDoctor);
}

export function getDoctorSchedule(id: number) {
  return apiFetch<Schedule[]>(endpoints.doctors.schedules(id), { method: "GET" }).then((items) =>
    items.map((item) => ({
      ...item,
      date: normalizeApiDate(item.date),
    })),
  );
}

export function createDoctorSchedule(payload: CreateScheduleRequest) {
  return apiFetch<Schedule>(endpoints.schedules.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDoctorSchedule(id: number, payload: Partial<CreateScheduleRequest>) {
  return apiFetch<Schedule>(endpoints.schedules.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteDoctorSchedule(id: number) {
  return apiFetch<void>(endpoints.schedules.remove(id), { method: "DELETE" });
}

export function createDoctor(
  payload: UpdateDoctorProfileRequest & {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string | null;
  },
) {
  return apiFetch<UserResponse>(endpoints.doctors.create, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(normalizeDoctor);
}

export function updateDoctor(
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
  return apiFetch<UserResponse>(endpoints.doctors.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then(normalizeDoctor);
}

export function updateCurrentDoctor(payload: UpdateCurrentDoctorRequest) {
  return apiFetch<UserResponse>(endpoints.doctors.me, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then(normalizeDoctor);
}

export function deleteDoctor(id: number) {
  return apiFetch<void>(endpoints.doctors.remove(id), { method: "DELETE" });
}
