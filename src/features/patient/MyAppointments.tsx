"use client";

import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle2, Clock, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import type { AppointmentResponse } from "@/types/domain";

export default function MyAppointments() {
  const { data: appointments = [], isLoading } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-emerald-100 text-emerald-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "done": return "bg-blue-100 text-blue-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const upcomingAppointments = appointments.filter((a) => a.status !== "cancelled" && a.status !== "done" && new Date(a.date) >= new Date());
  const pastAppointments = appointments.filter((a) => a.status === "done" || a.status === "cancelled" || new Date(a.date) < new Date());

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>;
  }

  const AppointmentCard = ({ appointment }: { appointment: AppointmentResponse }) => (
    <Card key={appointment.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/5 p-6 flex flex-col items-center justify-center sm:w-32 border-b sm:border-b-0 sm:border-r border-border/50">
            <span className="text-2xl font-bold text-primary">{format(new Date(appointment.date), "dd")}</span>
            <span className="text-sm text-muted-foreground">{format(new Date(appointment.date), "MMM yyyy")}</span>
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span className="font-semibold">{appointment.doctorName}</span></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>{appointment.startTime} - {appointment.endTime}</span></div>
                {appointment.notes && <p className="mt-2 text-sm text-muted-foreground">{appointment.notes}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${getStatusColor(appointment.status)} border-0 capitalize`}>{appointment.status}</Badge>
                {appointment.status === "pending" && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: "cancelled" })}>
                    <X className="mr-1 h-4 w-4" />Cancel
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
        <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
        <p className="mt-1 text-muted-foreground">View and manage your scheduled appointments</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <Card className="border-dashed"><CardContent className="flex flex-col items-center justify-center py-12 text-center"><Calendar className="h-12 w-12 text-muted-foreground/40 mb-4" /><h3 className="text-lg font-medium">No upcoming appointments</h3></CardContent></Card>
        ) : (
          <div className="grid gap-4">{upcomingAppointments.map((a) => <AppointmentCard key={a.id} appointment={a} />)}</div>
        )}
      </div>

      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5 text-muted-foreground" />Past Appointments</h2>
          <div className="grid gap-3">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center"><span className="text-lg font-semibold">{format(new Date(appointment.date), "dd")}</span><span className="block text-xs text-muted-foreground">{format(new Date(appointment.date), "MMM")}</span></div>
                      <div><span className="font-medium">{appointment.doctorName}</span><span className="block text-sm text-muted-foreground">{appointment.startTime} - {appointment.endTime}</span></div>
                    </div>
                    <Badge className={`${getStatusColor(appointment.status)} border-0 capitalize`}>{appointment.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
