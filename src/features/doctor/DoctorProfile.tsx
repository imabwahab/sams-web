"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DollarSign,
  KeyRound,
  Mail,
  Pencil,
  Phone,
  Shield,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query-keys";
import { changePassword } from "@/services/auth.service";
import { getCurrentDoctor, updateCurrentDoctor } from "@/services/doctors.service";
import { specializations } from "@/types/domain";
import type { DoctorProfile as DoctorProfileType } from "@/types/domain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  specialization: z.string().min(2, "Specialization is required"),
  bio: z.string().optional(),
  consultationFee: z.coerce.number().positive("Consultation fee must be positive"),
  experienceYears: z.coerce.number().min(0, "Experience years cannot be negative"),
});

export default function DoctorProfile() {
  const { user } = useAuth();
  const { update } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: doctor, isLoading: isDoctorLoading } = useQuery({
    queryKey: queryKeys.doctor(user?.id ?? 0),
    queryFn: getCurrentDoctor,
    enabled: !!user,
  });

  const doctorProfile = doctor?.doctorProfile as DoctorProfileType | undefined;

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      phone: "",
      specialization: "",
      bio: "",
      consultationFee: 0,
      experienceYears: 0,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      passwordForm.reset();
      toast({ title: "Password updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!doctor) {
      return;
    }

    profileForm.reset({
      username: doctor.username ?? "",
      email: doctor.email ?? "",
      fullName: doctor.fullName ?? "",
      phone: doctor.phone ?? "",
      specialization: doctorProfile?.specialization ?? "",
      bio: doctorProfile?.bio ?? "",
      consultationFee: doctorProfile?.consultationFee ?? 0,
      experienceYears: doctorProfile?.experienceYears ?? 0,
    });
  }, [doctor, doctorProfile, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: updateCurrentDoctor,
    onSuccess: async (updatedDoctor) => {
      queryClient.setQueryData(queryKeys.doctor(updatedDoctor.id), updatedDoctor);
      await update({ user: updatedDoctor });
      setIsEditing(false);
      toast({ title: "Profile updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = profileForm.handleSubmit((data) => {
    const dirtyFields = profileForm.formState.dirtyFields;
    const payload = {
      ...(dirtyFields.username ? { username: data.username } : {}),
      ...(dirtyFields.email ? { email: data.email } : {}),
      ...(dirtyFields.fullName ? { fullName: data.fullName } : {}),
      ...(dirtyFields.phone ? { phone: data.phone?.trim() ? data.phone : null } : {}),
      ...(dirtyFields.specialization ? { specialization: data.specialization } : {}),
      ...(dirtyFields.bio ? { bio: data.bio?.trim() ? data.bio : null } : {}),
      ...(dirtyFields.consultationFee ? { consultationFee: data.consultationFee } : {}),
      ...(dirtyFields.experienceYears ? { experienceYears: data.experienceYears } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      toast({ title: "No changes to save" });
      return;
    }

    updateProfileMutation.mutate(payload);
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Doctor Profile</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage your professional profile details.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-2xl font-bold text-white shadow-lg">
              {user?.fullName?.charAt(0) || "D"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.fullName}</h2>
              <p className="text-muted-foreground">@{user?.username}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="default" className="capitalize">
                  <Stethoscope className="mr-1 h-3 w-3" />
                  {doctorProfile?.specialization || "Doctor"}
                </Badge>
                {user?.isActive && (
                  <Badge className="border-0 bg-emerald-100 text-emerald-700">
                    <Shield className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Review your current information and update it when needed.
              </CardDescription>
            </div>
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  if (doctor) {
                    profileForm.reset({
                      username: doctor.username ?? "",
                      email: doctor.email ?? "",
                      fullName: doctor.fullName ?? "",
                      phone: doctor.phone ?? "",
                      specialization: doctorProfile?.specialization ?? "",
                      bio: doctorProfile?.bio ?? "",
                      consultationFee: doctorProfile?.consultationFee ?? 0,
                      experienceYears: doctorProfile?.experienceYears ?? 0,
                    });
                  }
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDoctorLoading ? (
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded-md bg-muted" />
              <div className="h-10 animate-pulse rounded-md bg-muted" />
              <div className="h-10 animate-pulse rounded-md bg-muted" />
              <div className="h-24 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Username
                  </Label>
                  <Input {...profileForm.register("username")} readOnly={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input {...profileForm.register("fullName")} readOnly={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input type="email" {...profileForm.register("email")} readOnly={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input {...profileForm.register("phone")} readOnly={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Consultation Fee
                  </Label>
                  <Input
                    type="number"
                    {...profileForm.register("consultationFee", { valueAsNumber: true })}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    Experience Years
                  </Label>
                  <Input
                    type="number"
                    {...profileForm.register("experienceYears", { valueAsNumber: true })}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  Specialization
                </Label>
                {isEditing ? (
                  <Select
                    value={profileForm.watch("specialization")}
                    onValueChange={(value) =>
                      profileForm.setValue("specialization", value, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((specialization) => (
                        <SelectItem key={specialization} value={specialization}>
                          {specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={profileForm.watch("specialization")} readOnly />
                )}
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea {...profileForm.register("bio")} readOnly={!isEditing} />
              </div>
              {isEditing && (
                <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Keep your account secure by updating your password regularly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit((data) => changePasswordMutation.mutate(data))}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                Current Password
              </Label>
              <PasswordInput id="currentPassword" {...passwordForm.register("currentPassword")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                New Password
              </Label>
              <PasswordInput id="newPassword" {...passwordForm.register("newPassword")} />
            </div>
            <Button type="submit" className="w-full" disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
