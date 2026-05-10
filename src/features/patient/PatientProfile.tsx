"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Mail, Phone, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/services/auth.service";

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export default function PatientProfile() {
  const { user } = useAuth();
  const { toast } = useToast();

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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Review your personal details and keep your account secure.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-2xl font-bold text-white shadow-lg">
              {user?.fullName?.charAt(0) || "P"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.fullName}</h2>
              <p className="text-muted-foreground">@{user?.username}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  <User className="mr-1 h-3 w-3" />
                  {user?.role}
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
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your profile details are currently read-only. Contact support if anything needs to be
            updated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input value={user?.fullName ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input value={user?.email ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone
              </Label>
              <Input value={user?.phone ?? ""} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Keep your account protected by choosing a strong, updated password.
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
