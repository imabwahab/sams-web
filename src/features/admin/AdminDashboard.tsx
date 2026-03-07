"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Shield, Stethoscope, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { queryKeys } from "@/lib/query-keys";
import { getAdminAppointments, getAdmins, getManagedDoctors } from "@/services/admin.service";

export default function AdminDashboard() {
  const { data: admins = [], isLoading: adminsLoading } = useQuery({
    queryKey: queryKeys.admins,
    queryFn: getAdmins,
  });
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: queryKeys.adminDoctors,
    queryFn: () => getManagedDoctors(),
  });
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: queryKeys.adminAppointments,
    queryFn: getAdminAppointments,
  });

  if (adminsLoading || doctorsLoading || appointmentsLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>;
  }

  const activeAdmins = admins.filter((admin) => admin.isActive);
  const activeDoctors = doctors.filter((doctor) => doctor.isActive);
  const completedAppointments = appointments.filter((appointment) => appointment.status === "done");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of admins, doctors, and appointments from the documented API.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100"><Shield className="h-6 w-6 text-blue-600" /></div><div><p className="text-2xl font-bold">{admins.length}</p><p className="text-sm text-muted-foreground">Admins</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Stethoscope className="h-6 w-6 text-primary" /></div><div><p className="text-2xl font-bold">{doctors.length}</p><p className="text-sm text-muted-foreground">Doctors</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100"><Calendar className="h-6 w-6 text-amber-600" /></div><div><p className="text-2xl font-bold">{appointments.length}</p><p className="text-sm text-muted-foreground">Appointments</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100"><TrendingUp className="h-6 w-6 text-emerald-600" /></div><div><p className="text-2xl font-bold">{appointments.length > 0 ? Math.round((completedAppointments.length / appointments.length) * 100) : 0}%</p><p className="text-sm text-muted-foreground">Completion</p></div></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
            <CardDescription>Staff loaded from `/api/admins`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Active</span><Badge variant="secondary">{activeAdmins.length}/{admins.length}</Badge></div>
            {admins.slice(0, 4).map((admin) => (
              <div key={admin.id} className="flex items-center justify-between rounded-xl bg-accent/50 p-3">
                <div><p className="font-medium">{admin.fullName}</p><p className="text-sm text-muted-foreground">@{admin.username}</p></div>
                <Badge variant={admin.isActive ? "default" : "secondary"}>{admin.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>Doctors loaded from `/api/doctors`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Active</span><Badge variant="secondary">{activeDoctors.length}/{doctors.length}</Badge></div>
            {doctors.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="flex items-center justify-between rounded-xl bg-accent/50 p-3">
                <div><p className="font-medium">{doctor.fullName}</p><p className="text-sm text-muted-foreground">{doctor.doctorProfile?.specialization || "Doctor"}</p></div>
                <Badge variant={doctor.isActive ? "default" : "secondary"}>{doctor.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Summary from `/api/appointments`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Pending</span><Badge variant="secondary">{appointments.filter((appointment) => appointment.status === "pending").length}</Badge></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Accepted</span><Badge variant="secondary">{appointments.filter((appointment) => appointment.status === "accepted").length}</Badge></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Cancelled</span><Badge variant="secondary">{appointments.filter((appointment) => appointment.status === "cancelled").length}</Badge></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

