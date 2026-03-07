"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, Plus, Search, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments();

  const upcomingAppointments = appointments?.filter(a => 
    ["pending", "accepted"].includes(a.status)
  ) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Hello, {user?.fullName}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your health schedule.</p>
        </div>
        <Link href="/find-doctors">
          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
            <Plus className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg shadow-blue-500/5 bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Upcoming Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-emerald-500/5 bg-gradient-to-br from-emerald-50 to-white border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Completed Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {appointments?.filter(a => a.status === "done").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-purple-500/5 bg-gradient-to-br from-purple-50 to-white border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{appointments?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments List */}
      <div>
        <h2 className="text-xl font-bold font-display mb-4">Upcoming Appointments</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center bg-gray-50/50">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No appointments scheduled</h3>
            <p className="text-muted-foreground mt-1 mb-6">You don't have any upcoming visits.</p>
            <Link href="/find-doctors">
              <Button variant="outline">Find a Doctor</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map((apt: any) => (
              <Card key={apt.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-gray-100">
                <div className={`h-2 w-full ${
                  apt.status === 'accepted' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{apt.doctorName}</CardTitle>
                      <CardDescription>Doctor</CardDescription>
                    </div>
                    <Badge variant={apt.status === 'accepted' ? 'default' : 'secondary'} className="capitalize">
                      {apt.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {format(new Date(apt.date), 'MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    {apt.startTime} - {apt.endTime}
                  </div>
                  {apt.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
                      Note: {apt.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


