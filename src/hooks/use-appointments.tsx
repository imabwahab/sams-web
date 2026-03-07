"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query-keys";
import { createAppointment, getAppointments, updateAppointmentStatus } from "@/services/appointments.service";
import type { BookAppointmentRequest, UpdateAppointmentStatusRequest } from "@/types/api";

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments,
    queryFn: getAppointments,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: BookAppointmentRequest) => createAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      toast({ title: "Appointment Booked!", description: "Your appointment is now pending approval." });
    },
    onError: (error: Error) => {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number } & UpdateAppointmentStatusRequest) => updateAppointmentStatus(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      toast({ title: "Status Updated", description: `Appointment marked as ${variables.status}.` });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });
}
