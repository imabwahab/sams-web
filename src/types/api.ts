import type { AppointmentStatus, DayOfWeek, UserRole } from "@/types/domain";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  role: Exclude<UserRole, "admin">;
  fullName: string;
  phone?: string;
  specialization?: string;
  bio?: string;
  consultationFee?: number;
  experienceYears?: number;
};

export type CreateScheduleRequest = {
  doctorId?: number;
  date: string;
  dayOfWeek?: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type BookAppointmentRequest = {
  patientId?: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export type UpdateAppointmentStatusRequest = {
  status: AppointmentStatus;
};

export type UpdateUserProfileRequest = {
  username?: string;
  fullName: string;
  email: string;
  phone?: string | null;
};

export type UpdateDoctorProfileRequest = UpdateUserProfileRequest & {
  specialization: string;
  bio?: string | null;
  consultationFee: number;
  experienceYears: number;
  isActive?: boolean;
};

export type UpdateCurrentDoctorRequest = Partial<Omit<UpdateDoctorProfileRequest, "isActive">>;

export type UpdateAdminRequest = UpdateUserProfileRequest & {
  password?: string;
  isActive?: boolean;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
