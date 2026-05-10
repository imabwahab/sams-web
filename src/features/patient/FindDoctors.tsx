"use client";

import { useState } from "react";
import { useDoctors, useDoctorSchedule } from "@/hooks/use-doctors";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Search, Stethoscope, Clock, Calendar, DollarSign } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Schedule } from "@/types/domain";
import { specializations } from "@/types/domain";

export default function FindDoctors() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const { data: doctors, isLoading } = useDoctors(specialization, search);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Find a Specialist</h1>
          <p className="mt-1 text-muted-foreground">
            Search through our qualified network of healthcare providers.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-6 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-doctors"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={specialization} onValueChange={setSpecialization}>
            <SelectTrigger data-testid="select-specialization-filter">
              <SelectValue placeholder="Filter by Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Doctor Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : doctors?.length === 0 ? (
        <div className="py-20 text-center">
          <Stethoscope className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setSpecialization("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors?.map((doc: any) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl"
      data-testid={`doctor-card-${doctor.id}`}
    >
      <div className="h-24 bg-gradient-to-r from-primary via-teal-500 to-emerald-500" />
      <div className="-mt-12 mb-4 px-6">
        <div className="h-24 w-24 rounded-2xl border bg-card p-1 shadow-lg">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-teal-500/20 text-primary">
            <Stethoscope className="h-10 w-10" />
          </div>
        </div>
      </div>
      <CardContent className="flex-1">
        <h3 className="text-xl font-bold">{doctor.fullName}</h3>
        <p className="mb-2 text-sm font-medium text-primary">
          {doctor.doctorProfile?.specialization}
        </p>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {doctor.doctorProfile?.bio || "No biography available."}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-normal">
            <DollarSign className="mr-1 h-3 w-3" /> ${doctor.doctorProfile?.consultationFee || 0}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {doctor.doctorProfile?.experienceYears || 0} Years Exp.
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" data-testid={`button-book-${doctor.id}`}>
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Book with {doctor.fullName}</DialogTitle>
            </DialogHeader>
            <BookingForm doctorId={doctor.id} onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function BookingForm({ doctorId, onSuccess }: { doctorId: number; onSuccess: () => void }) {
  const { data: schedule } = useDoctorSchedule(doctorId);
  const createAppointment = useCreateAppointment();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Schedule | null>(null);
  const [notes, setNotes] = useState("");

  const today = new Date();
  const nextDates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  const availableDates = nextDates.filter((date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return schedule?.some((slot) => slot.date === formattedDate && slot.isAvailable !== false);
  });

  const availableSlots = selectedDate
    ? (schedule ?? [])
        .filter(
          (slot) => slot.date === format(selectedDate, "yyyy-MM-dd") && slot.isAvailable !== false,
        )
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    : [];

  const handleBook = () => {
    if (!selectedDate || !selectedSlot) return;

    createAppointment.mutate(
      {
        doctorId,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes,
      },
      {
        onSuccess,
      },
    );
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Date</label>
        <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {availableDates.length === 0 ? (
            <div className="col-span-4 py-4 text-center text-sm text-muted-foreground">
              <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
              No availability found
            </div>
          ) : (
            availableDates.map((date) => {
              const isSelected = selectedDate && isSameDay(selectedDate, date);
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  className={`rounded-lg border p-2 text-sm transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                  data-testid={`date-${format(date, "yyyy-MM-dd")}`}
                >
                  <div className="font-semibold">{format(date, "MMM d")}</div>
                  <div className="text-xs opacity-80">{format(date, "EEE")}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedDate && (
        <div className="space-y-2 animate-in fade-in">
          <label className="text-sm font-medium">Available Time</label>
          {availableSlots.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No slots found for the selected date.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableSlots.map((slot) => {
                const isSelected =
                  selectedSlot?.id === slot.id &&
                  selectedSlot?.startTime === slot.startTime &&
                  selectedSlot?.endTime === slot.endTime;

                return (
                  <button
                    key={`${slot.id}-${slot.startTime}-${slot.endTime}`}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border p-3 text-sm transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 font-medium">
                      <Clock className="h-4 w-4" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Reason for Visit</label>
        <Input
          placeholder="Briefly describe your symptoms..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          data-testid="input-appointment-notes"
        />
      </div>

      <Button
        className="w-full"
        disabled={!selectedDate || !selectedSlot || createAppointment.isPending}
        onClick={handleBook}
        data-testid="button-confirm-booking"
      >
        {createAppointment.isPending ? "Booking..." : "Confirm Booking"}
      </Button>
    </div>
  );
}
