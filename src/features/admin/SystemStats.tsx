"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, CheckCircle, Shield, Stethoscope, Users, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { queryKeys } from "@/lib/query-keys";
import { getAdminAppointments, getAdmins, getManagedDoctors } from "@/services/admin.service";

export default function SystemStats() {
  const { data: admins = [] } = useQuery({
    queryKey: queryKeys.admins,
    queryFn: getAdmins,
  });
  const { data: doctors = [] } = useQuery({
    queryKey: queryKeys.adminDoctors,
    queryFn: () => getManagedDoctors(),
  });
  const { data: appointments = [] } = useQuery({
    queryKey: queryKeys.adminAppointments,
    queryFn: getAdminAppointments,
  });

  const appointmentStatusData = [
    {
      name: "Pending",
      value: appointments.filter((item) => item.status === "pending").length,
      color: "#f59e0b",
    },
    {
      name: "Accepted",
      value: appointments.filter((item) => item.status === "accepted").length,
      color: "#10b981",
    },
    {
      name: "Completed",
      value: appointments.filter((item) => item.status === "done").length,
      color: "#3b82f6",
    },
    {
      name: "Cancelled",
      value: appointments.filter((item) => item.status === "cancelled").length,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  const resourceData = [
    { name: "Admins", count: admins.length },
    { name: "Doctors", count: doctors.length },
    { name: "Appointments", count: appointments.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Statistics</h1>
        <p className="mt-1 text-muted-foreground">
          Visual insights into platform capacity, staff activity, and appointment outcomes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{admins.length}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctors.length}</p>
                <p className="text-sm text-muted-foreground">Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-sm text-muted-foreground">Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Users className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {admins.filter((item) => item.isActive).length +
                    doctors.filter((item) => item.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Active Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>
              See how bookings are progressing across each appointment stage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
            <CardDescription>
              Compare the main operational records managed in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Summary</CardTitle>
          <CardDescription>Fast breakdown of appointment outcomes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
              <Users className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-xl font-bold">
                  {appointmentStatusData.find((item) => item.name === "Pending")?.value ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-xl font-bold">
                  {appointmentStatusData.find((item) => item.name === "Accepted")?.value ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-xl font-bold">
                  {appointmentStatusData.find((item) => item.name === "Completed")?.value ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-xl font-bold">
                  {appointmentStatusData.find((item) => item.name === "Cancelled")?.value ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
