"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, ArrowLeft, ArrowRight, Stethoscope, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { specializations } from "@/types/domain";
import { DEFAULT_ROLE_HOME, ROLE_ROUTE_PREFIXES } from "@/config/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const baseRegisterSchema = z.object({
  email: z.string().email("Valid email is required"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username cannot exceed 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["patient", "doctor"]).default("patient"),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  consultationFee: z.coerce.number().min(0, "Fee must be positive").optional(),
  experienceYears: z.coerce.number().min(0, "Experience must be positive").optional(),
});

const doctorRegisterSchema = baseRegisterSchema.refine(
  (data) => (data.role === "doctor" ? !!data.specialization : true),
  { message: "Specialization is required for doctors", path: ["specialization"] },
);

type RegisterFormData = z.infer<typeof baseRegisterSchema>;

export default function AuthPage({ nextPath }: { nextPath?: string }) {
  const { user, loginMutation, registerMutation } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [selectedRole, setSelectedRole] = useState("patient");

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(doctorRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      role: "patient",
      specialization: "",
      bio: "",
      consultationFee: 50,
      experienceYears: 0,
    },
  });

  useEffect(() => {
    if (!user) return;
    const roleHome = DEFAULT_ROLE_HOME[user.role];
    const canVisitNext =
      nextPath &&
      nextPath.startsWith("/") &&
      ((user.role === "admin" &&
        nextPath.startsWith(ROLE_ROUTE_PREFIXES.admin[0])) ||
        (user.role === "doctor" &&
          nextPath.startsWith(ROLE_ROUTE_PREFIXES.doctor[0])) ||
        (user.role === "patient" &&
          ROLE_ROUTE_PREFIXES.patient.some(
            (prefix) =>
              nextPath === prefix || nextPath.startsWith(`${prefix}/`),
          )));

    router.replace(canVisitNext ? nextPath : roleHome);
  }, [nextPath, router, user]);

  if (user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-1/2 bg-gradient-to-t from-accent/10 to-transparent" />
      <div className="w-full max-w-md space-y-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero shadow-lg shadow-primary/25">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome to SAMS</h2>
          <p className="mt-2 text-muted-foreground">Smart Appointment Management System</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid h-12 w-full grid-cols-2 bg-muted/50 p-1">
            <TabsTrigger value="login" className="h-10 text-sm font-medium">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="h-10 text-sm font-medium">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-sm">
              <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-sm font-medium">Username</Label>
                    <Input id="login-username" placeholder="Enter your username" {...loginForm.register("username")} />
                    {loginForm.formState.errors.username && <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.username.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                    <PasswordInput id="login-password" placeholder="Enter your password" {...loginForm.register("password")} />
                    {loginForm.formState.errors.password && <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.password.message}</p>}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="h-11 w-full text-base font-medium" type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending && <Activity className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-sm">
              <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Create Account</CardTitle>
                  <CardDescription>Join as a patient or healthcare provider</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 max-h-[55vh] overflow-y-auto px-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className={`rounded-xl border-2 p-4 text-center transition-all duration-200 ${selectedRole === "patient" ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/40 hover:bg-accent/50"}`} onClick={() => { setSelectedRole("patient"); registerForm.setValue("role", "patient"); registerForm.clearErrors("specialization"); }}>
                      <User className={`mx-auto mb-2 h-6 w-6 transition-colors ${selectedRole === "patient" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className={`text-sm font-semibold ${selectedRole === "patient" ? "text-primary" : "text-foreground"}`}>Patient</div>
                    </button>
                    <button type="button" className={`rounded-xl border-2 p-4 text-center transition-all duration-200 ${selectedRole === "doctor" ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/40 hover:bg-accent/50"}`} onClick={() => { setSelectedRole("doctor"); registerForm.setValue("role", "doctor"); }}>
                      <Stethoscope className={`mx-auto mb-2 h-6 w-6 transition-colors ${selectedRole === "doctor" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className={`text-sm font-semibold ${selectedRole === "doctor" ? "text-primary" : "text-foreground"}`}>Doctor</div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></Label>
                    <Input {...registerForm.register("fullName")} placeholder="John Doe" />
                    {registerForm.formState.errors.fullName && <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email <span className="text-destructive">*</span></Label>
                      <Input type="email" {...registerForm.register("email")} placeholder="doctor@example.com" />
                      {registerForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Phone</Label>
                      <Input {...registerForm.register("phone")} placeholder="+923001112233" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Username <span className="text-destructive">*</span></Label>
                      <Input {...registerForm.register("username")} placeholder="johndoe" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Password <span className="text-destructive">*</span></Label>
                      <PasswordInput {...registerForm.register("password")} placeholder="Min 6 chars" />
                    </div>
                  </div>

                  {selectedRole === "doctor" && (
                    <div className="animate-in slide-in-from-top-2 fade-in space-y-4 border-t pt-4 duration-300">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Specialization <span className="text-destructive">*</span></Label>
                        <Select value={registerForm.watch("specialization")} onValueChange={(val) => { registerForm.setValue("specialization", val); registerForm.clearErrors("specialization"); }}>
                          <SelectTrigger><SelectValue placeholder="Select your specialization" /></SelectTrigger>
                          <SelectContent>{specializations.map((spec) => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}</SelectContent>
                        </Select>
                        {registerForm.formState.errors.specialization && <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.specialization.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Consultation Fee ($)</Label>
                          <Input type="number" {...registerForm.register("consultationFee", { valueAsNumber: true })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Experience (Years)</Label>
                          <Input type="number" {...registerForm.register("experienceYears", { valueAsNumber: true })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Bio</Label>
                        <Textarea {...registerForm.register("bio")} placeholder="Tell us about your practice and expertise..." className="min-h-[100px] resize-none" />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="h-11 w-full text-base font-medium" type="submit" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? <><Activity className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : <>Create Account<ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground">By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
}
