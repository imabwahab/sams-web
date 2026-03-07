"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query-keys";
import { createDoctorSchedule, deleteDoctorSchedule, getDoctor, getDoctors, getDoctorSchedule } from "@/services/doctors.service";
import type { CreateScheduleRequest } from "@/types/api";

export function useDoctors(specialization?: string, search?: string) {
  return useQuery({
    queryKey: queryKeys.doctors(specialization, search),
    queryFn: () => getDoctors({ specialization, search }),
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: queryKeys.doctor(id),
    queryFn: () => getDoctor(id),
    enabled: !!id,
  });
}

export function useDoctorSchedule(id: number) {
  return useQuery({
    queryKey: queryKeys.doctorSchedule(id),
    queryFn: () => getDoctorSchedule(id),
    enabled: !!id,
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateScheduleRequest) => createDoctorSchedule(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctorSchedule(data.doctorId) });
      toast({ title: "Schedule Updated", description: "Your availability has been updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, doctorId }: { id: number; doctorId: number }) => deleteDoctorSchedule(id).then(() => doctorId),
    onSuccess: (doctorId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctorSchedule(doctorId) });
      toast({ title: "Slot Removed", description: "Availability slot deleted." });
    },
  });
}
