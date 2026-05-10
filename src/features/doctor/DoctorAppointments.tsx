"use client";

import { format } from "date-fns";
import { Calendar, CheckCircle, Clock, User, UserCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import type { AppointmentResponse } from "@/types/domain";

export default function DoctorAppointments() {
  const { data: appointments = [], isLoading } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "done":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const acceptedAppointments = appointments.filter((a) => a.status === "accepted");
  const completedAppointments = appointments.filter(
    (a) => a.status === "done" || a.status === "cancelled",
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  const AppointmentCard = ({ appointment }: { appointment: AppointmentResponse }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col items-center justify-center border-b border-border/50 bg-primary/5 p-6 sm:w-32 sm:border-b-0 sm:border-r">
            <span className="text-2xl font-bold text-primary">
              {format(new Date(appointment.date), "dd")}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(appointment.date), "MMM yyyy")}
            </span>
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{appointment.patientName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                </div>
                {appointment.notes && (
                  <p className="mt-2 rounded-lg bg-muted/50 p-2 text-sm text-muted-foreground">
                    {appointment.notes}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${getStatusColor(appointment.status)} border-0 capitalize`}>
                  {appointment.status}
                </Badge>
                {appointment.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: appointment.id, status: "accepted" })
                      }
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: appointment.id, status: "cancelled" })
                      }
                    >
                      <X className="mr-1 h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                )}
                {appointment.status === "accepted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateStatusMutation.mutate({ id: appointment.id, status: "done" })
                    }
                  >
                    <UserCheck className="mr-1 h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and respond to patient appointment requests
        </p>
      </div>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">History</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          {pendingAppointments.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </TabsContent>
        <TabsContent value="accepted" className="space-y-4">
          {acceptedAppointments.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
