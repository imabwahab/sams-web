"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Calendar, CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteSchedule, useDoctorSchedule, useUpdateSchedule } from "@/hooks/use-doctors";
import { useToast } from "@/hooks/use-toast";
import { formatApiDate } from "@/lib/date";
import type { Schedule } from "@/types/domain";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
] as const;

const scheduleSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  isAvailable: z.boolean().default(true),
}).refine((d) => d.startTime < d.endTime, { message: "End time must be after start time", path: ["endTime"] });

function isOverlapping(schedules: Schedule[], date: string, start: string, end: string) {
  return schedules.some(
    (schedule) =>
      schedule.date === date &&
      ((start >= schedule.startTime && start < schedule.endTime) ||
        (end > schedule.startTime && end <= schedule.endTime) ||
        (start <= schedule.startTime && end >= schedule.endTime)),
  );
}

export default function ManageSchedule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const { data: schedules = [], isLoading } = useDoctorSchedule(user?.id ?? 0);
  const createMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
  });

  const groupedSchedules = useMemo(() => {
    const grouped = schedules.reduce<Record<string, Schedule[]>>((acc, schedule) => {
      const key = schedule.date;
      acc[key] = [...(acc[key] ?? []), schedule].sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [schedules]);

  const onSubmit = (data: z.infer<typeof scheduleSchema>) => {
    if (isOverlapping(schedules, data.date, data.startTime, data.endTime)) {
      setDuplicateError(`A slot already exists on ${data.date} that overlaps with ${data.startTime} - ${data.endTime}`);
      return;
    }

    setDuplicateError(null);
    createMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Schedule slot added successfully" });
        form.reset({
          date: format(new Date(), "yyyy-MM-dd"),
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        });
        setShowForm(false);
      },
    });
  };

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Schedule</h1>
          <p className="mt-1 text-muted-foreground">Set your available date-based time slots for appointments.</p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}><Plus className="mr-2 h-4 w-4" />Add Time Slot</Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Add New Time Slot</CardTitle>
            <CardDescription>Choose a specific date and your availability window.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {duplicateError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{duplicateError}</AlertDescription></Alert>}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.watch("date")} onChange={(event) => form.setValue("date", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={form.watch("startTime")} onValueChange={(value) => form.setValue("startTime", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{timeSlots.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select value={form.watch("endTime")} onValueChange={(value) => form.setValue("endTime", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{timeSlots.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Available</Label>
                  <div className="flex h-10 items-center">
                    <Switch checked={form.watch("isAvailable")} onCheckedChange={(value) => form.setValue("isAvailable", value)} />
                    <span className="ml-2 text-sm text-muted-foreground">{form.watch("isAvailable") ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Save Schedule"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {groupedSchedules.length === 0 ? (
          <Card className="opacity-60">
            <CardContent className="p-6 text-center text-muted-foreground">
              No schedule slots configured yet.
            </CardContent>
          </Card>
        ) : (
          groupedSchedules.map(([date, dateSchedules]) => (
            <Card key={date}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{formatApiDate(date, "EEEE, MMM d, yyyy")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dateSchedules.length} time slot{dateSchedules.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {dateSchedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center gap-2">
                        <Badge variant={schedule.isAvailable !== false ? "default" : "secondary"} className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {schedule.startTime} - {schedule.endTime}
                          {schedule.isAvailable !== false && <CheckCircle2 className="ml-1 h-3 w-3 text-emerald-300" />}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => user?.id && deleteMutation.mutate({ id: schedule.id, doctorId: user.id })}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
