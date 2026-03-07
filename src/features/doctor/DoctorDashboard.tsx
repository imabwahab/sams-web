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
  
  const pendingAppointments = appointments?.filter(a => a.status === 'pending') || [];
  const confirmedAppointments = appointments?.filter(a => a.status === 'accepted') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Dr. {user?.fullName}</h1>
        <p className="text-muted-foreground mt-1">Manage your practice and patients.</p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          {/* Pending Requests */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Pending Requests
              <Badge variant="secondary" className="rounded-full">{pendingAppointments.length}</Badge>
            </h2>
            
            {pendingAppointments.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">No pending appointments.</div>
            ) : (
              <div className="grid gap-4">
                {pendingAppointments.map((apt: any) => (
                  <AppointmentActionCard key={apt.id} appointment={apt} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t my-8" />

          {/* Upcoming Schedule */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
             {confirmedAppointments.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">No upcoming appointments.</div>
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

function AppointmentActionCard({ appointment, readonly = false }: { appointment: any, readonly?: boolean }) {
  const updateStatus = useUpdateAppointmentStatus();

  return (
    <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4 border-l-4 border-l-primary">
      <div className="space-y-1">
        <h4 className="font-semibold text-lg">{appointment.patientName}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {format(new Date(appointment.date), "MMM d, yyyy")}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {appointment.startTime} - {appointment.endTime}</span>
        </div>
        {appointment.notes && (
          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">"{appointment.notes}"</p>
        )}
      </div>

      {!readonly && (
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "cancelled" })}
            disabled={updateStatus.isPending}
          >
            <X className="w-4 h-4 mr-2" /> Reject
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "accepted" })}
            disabled={updateStatus.isPending}
          >
            <Check className="w-4 h-4 mr-2" /> Accept
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
      isAvailable: true
    });
  };

  const groupedSchedule = schedule.reduce<Record<string, typeof schedule>>((acc, slot) => {
    acc[slot.date] = [...(acc[slot.date] ?? []), slot].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSchedule).sort((a, b) => a.localeCompare(b));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End</label>
              <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          </div>
          <Button className="w-full mt-4" onClick={handleAdd} disabled={updateSchedule.isPending}>
            Add Slot
          </Button>
        </CardContent>
      </Card>

      {/* Current Slots */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-semibold text-lg">Current Schedule</h3>
        <div className="grid gap-3">
          {sortedDates.map((scheduleDate) => {
            const slots = groupedSchedule[scheduleDate] ?? [];
            return (
              <div key={scheduleDate} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-40 font-bold text-gray-700">{formatApiDate(scheduleDate, "EEE, MMM d")}</div>
                  <div className="flex gap-2">
                    {slots.map(s => (
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
             <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
               No availability slots configured.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}



