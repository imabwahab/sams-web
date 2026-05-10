"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { useDoctorSchedule, useUpdateSchedule, useDeleteSchedule } from "@/hooks/use-doctors";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Check, X, Calendar, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatApiDate } from "@/lib/date";

export default function DoctorDashboard() {
  const { user } = useAuth();

  // In a real app we would have specific hooks that filter on backend
  // For this MVP, assume list returns all relevant to the user context from backend
  const { data: appointments, isLoading: isLoadingApts } = useAppointments();

  const pendingAppointments = appointments?.filter((a) => a.status === "pending") || [];
  const confirmedAppointments = appointments?.filter((a) => a.status === "accepted") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Dr. {user?.fullName}</h1>
        <p className="mt-1 text-muted-foreground">Manage your practice and patients.</p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-8 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          {/* Pending Requests */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              Pending Requests
              <Badge variant="secondary" className="rounded-full">
                {pendingAppointments.length}
              </Badge>
            </h2>

            {pendingAppointments.length === 0 ? (
              <div className="text-sm italic text-muted-foreground">No pending appointments.</div>
            ) : (
              <div className="grid gap-4">
                {pendingAppointments.map((apt: any) => (
                  <AppointmentActionCard key={apt.id} appointment={apt} />
                ))}
              </div>
            )}
          </div>

          <div className="my-8 border-t" />

          {/* Upcoming Schedule */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
            {confirmedAppointments.length === 0 ? (
              <div className="text-sm italic text-muted-foreground">No upcoming appointments.</div>
            ) : (
              <div className="grid gap-4">
                {confirmedAppointments.map((apt: any) => (
                  <AppointmentActionCard key={apt.id} appointment={apt} readonly />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleManager userId={user!.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppointmentActionCard({
  appointment,
  readonly = false,
}: {
  appointment: any;
  readonly?: boolean;
}) {
  const updateStatus = useUpdateAppointmentStatus();

  return (
    <Card className="flex flex-col items-start justify-between gap-4 border-l-4 border-l-primary p-6 md:flex-row md:items-center">
      <div className="space-y-1">
        <h4 className="text-lg font-semibold">{appointment.patientName}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />{" "}
            {format(new Date(appointment.date), "MMM d, yyyy")}
          </span>
          <span className="flex items-center">
            <Clock className="mr-1 h-4 w-4" /> {appointment.startTime} - {appointment.endTime}
          </span>
        </div>
        {appointment.notes && (
          <p className="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-600">"{appointment.notes}"</p>
        )}
      </div>

      {!readonly && (
        <div className="flex w-full gap-2 md:w-auto">
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "cancelled" })}
            disabled={updateStatus.isPending}
          >
            <X className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "accepted" })}
            disabled={updateStatus.isPending}
          >
            <Check className="mr-2 h-4 w-4" /> Accept
          </Button>
        </div>
      )}

      {readonly && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "done" })}
          >
            Mark Complete
          </Button>
        </div>
      )}
    </Card>
  );
}

function ScheduleManager({ userId }: { userId: number }) {
  const { data: schedule = [] } = useDoctorSchedule(userId);
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleAdd = () => {
    updateSchedule.mutate({
      date,
      startTime,
      endTime,
      isAvailable: true,
    });
  };

  const groupedSchedule = schedule.reduce<Record<string, typeof schedule>>((acc, slot) => {
    acc[slot.date] = [...(acc[slot.date] ?? []), slot].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSchedule).sort((a, b) => a.localeCompare(b));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Add Slot Form */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Add Availability</CardTitle>
          <CardDescription>Set availability for a specific date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <Button className="mt-4 w-full" onClick={handleAdd} disabled={updateSchedule.isPending}>
            Add Slot
          </Button>
        </CardContent>
      </Card>

      {/* Current Slots */}
      <div className="space-y-4 lg:col-span-2">
        <h3 className="text-lg font-semibold">Current Schedule</h3>
        <div className="grid gap-3">
          {sortedDates.map((scheduleDate) => {
            const slots = groupedSchedule[scheduleDate] ?? [];
            return (
              <div
                key={scheduleDate}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-40 font-bold text-gray-700">
                    {formatApiDate(scheduleDate, "EEE, MMM d")}
                  </div>
                  <div className="flex gap-2">
                    {slots.map((s) => (
                      <Badge key={s.id} variant="secondary" className="px-3 py-1">
                        {s.startTime} - {s.endTime}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* For MVP, assuming one slot per day per UI simplification, but backend supports many. 
                    Deleting the first one found for the demo logic. */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => deleteSchedule.mutate({ id: slots[0].id, doctorId: userId })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          {schedule.length === 0 && (
            <div className="rounded-xl border-2 border-dashed py-10 text-center text-muted-foreground">
              No availability slots configured.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
