export const userRoles = ["patient", "doctor", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

export const appointmentStatuses = ["pending", "accepted", "cancelled", "done"] as const;
export type AppointmentStatus = (typeof appointmentStatuses)[number];

export const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export type DayOfWeek = (typeof daysOfWeek)[number];

export const specializations = [
  "General Practitioner",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Psychiatrist",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Ophthalmologist",
  "ENT Specialist",
  "Dentist",
  "Urologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Endocrinologist",
  "Oncologist",
  "Rheumatologist",
  "Allergist",
  "Nephrologist",
  "Other",
] as const;
export type Specialization = (typeof specializations)[number];

export type User = {
  id: number;
  username: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
};

export type DoctorProfile = {
  id: number;
  userId: number;
  specialization: string;
  bio?: string | null;
  consultationFee: number;
  experienceYears?: number | null;
};

export type UserResponse = User & { doctorProfile?: DoctorProfile | null };

export type AuthUser = UserResponse;

export type Schedule = {
  id: number;
  doctorId: number;
  date: string;
  dayOfWeek?: DayOfWeek | null;
  startTime: string;
  endTime: string;
  isAvailable?: boolean | null;
};

export type AppointmentResponse = {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string | null;
  patientName: string;
  doctorName: string;
  patient?: User | null;
  doctor?: UserResponse | null;
};
