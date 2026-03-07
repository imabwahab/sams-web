"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Shield, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query-keys";
import { deleteAdmin, deleteManagedDoctor, getAdmins, getManagedDoctors, updateAdmin, updateManagedDoctor } from "@/services/admin.service";
import type { User, UserResponse } from "@/types/domain";

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: admins = [], isLoading: adminsLoading } = useQuery({
    queryKey: queryKeys.admins,
    queryFn: getAdmins,
  });
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: queryKeys.adminDoctors,
    queryFn: () => getManagedDoctors(),
  });

  const adminMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateAdmin(id, { isActive }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admins });
      toast({ title: "Admin updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update admin", description: error.message, variant: "destructive" });
    },
  });

  const doctorMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateManagedDoctor(id, { isActive }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminDoctors });
      toast({ title: "Doctor updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update doctor", description: error.message, variant: "destructive" });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admins });
      toast({ title: "Admin deactivated" });
    },
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: deleteManagedDoctor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminDoctors });
      toast({ title: "Doctor deactivated" });
    },
  });

  const matchesSearch = (value: User | UserResponse) =>
    value.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    value.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    value.email.toLowerCase().includes(searchQuery.toLowerCase());

  const filteredAdmins = admins.filter(matchesSearch);
  const filteredDoctors = doctors.filter(matchesSearch);

  if (adminsLoading || doctorsLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Management</h1>
        <p className="mt-1 text-muted-foreground">Admin and doctor resources mapped directly to the backend APIs.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, username, or email..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-3">
          {filteredAdmins.map((admin) => (
            <Card key={admin.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{admin.fullName}</span>
                      <Badge variant="secondary">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{admin.username}</p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={admin.isActive ?? true}
                      onCheckedChange={(isActive) => adminMutation.mutate({ id: admin.id, isActive })}
                      disabled={adminMutation.isPending}
                    />
                    <Button variant="outline" onClick={() => deleteAdminMutation.mutate(admin.id)} disabled={deleteAdminMutation.isPending}>
                      Deactivate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="doctors" className="space-y-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{doctor.fullName}</span>
                      <Badge variant="secondary">
                        <Stethoscope className="mr-1 h-3 w-3" />
                        {doctor.doctorProfile?.specialization || "Doctor"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{doctor.username}</p>
                    <p className="text-sm text-muted-foreground">{doctor.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={doctor.isActive ?? true}
                      onCheckedChange={(isActive) => doctorMutation.mutate({ id: doctor.id, isActive })}
                      disabled={doctorMutation.isPending}
                    />
                    <Button variant="outline" onClick={() => deleteDoctorMutation.mutate(doctor.id)} disabled={deleteDoctorMutation.isPending}>
                      Deactivate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

