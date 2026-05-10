"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Clock,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Heart,
  Star,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass-effect fixed left-0 right-0 top-0 z-50 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-hero flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SAMS</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth">
                <Button variant="ghost" className="font-medium" data-testid="button-login">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  className="font-medium shadow-md shadow-primary/20"
                  data-testid="button-get-started"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/40 via-background to-background" />
        <div className="bg-primary/8 absolute left-10 top-40 -z-10 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-teal-400/8 absolute right-10 top-60 -z-10 h-96 w-96 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-accent px-4 py-2 shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-accent-foreground">
                  Healthcare Made Simple
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-foreground">Smart Appointment</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Connect with healthcare professionals seamlessly. Book appointments, manage
                schedules, and take control of your healthcare journey with confidence.
              </p>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="h-12 w-full px-8 text-base font-medium shadow-lg shadow-primary/25 sm:w-auto"
                    data-testid="button-hero-cta"
                  >
                    Book Your First Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full border-2 px-8 text-base font-medium sm:w-auto"
                    data-testid="button-doctor-join"
                  >
                    <Stethoscope className="mr-2 h-5 w-5" />
                    Join as a Doctor
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 border-t border-border/50 pt-6">
                <div className="flex -space-x-3">
                  {[
                    "from-teal-400 to-teal-600",
                    "from-emerald-400 to-emerald-600",
                    "from-cyan-400 to-cyan-600",
                    "from-primary to-teal-500",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center border-2 border-background text-xs font-bold text-white shadow-md`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">1,000+</span>
                  <span className="text-muted-foreground"> patients trust us</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-sm font-medium">4.9</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute -right-10 -top-10 h-80 w-80 rounded-full bg-gradient-to-br from-primary/15 to-teal-400/15 blur-3xl" />

              <Card className="relative overflow-hidden border border-border/50 bg-card shadow-2xl shadow-primary/10">
                <CardContent className="p-0">
                  <div className="gradient-hero p-8 text-white">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
                        <Stethoscope className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">Dr. Sarah Johnson</div>
                        <div className="text-sm text-white/80">Cardiologist</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="border-0 bg-white/20 text-white hover:bg-white/25">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Available Today
                      </Badge>
                      <Badge className="border-0 bg-white/20 text-white hover:bg-white/25">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        4.9 Rating
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-5 p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Available Slots</span>
                      <span className="text-xs text-muted-foreground">Today</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00", "10:30", "14:00", "15:30", "16:00", "17:00"].map((time, i) => (
                        <Button
                          key={time}
                          variant={i === 2 ? "default" : "outline"}
                          size="sm"
                          className={`text-xs font-medium ${i === 2 ? "shadow-md" : ""}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <Button className="h-11 w-full font-medium shadow-md shadow-primary/20">
                      Book Appointment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-accent/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              <Zap className="mr-1 h-3 w-3" />
              Features
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Everything You Need for
              <br />
              <span className="text-primary">Healthcare Management</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our platform connects patients with doctors effortlessly, with features designed for
              everyone.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: "Easy Scheduling",
                description:
                  "Book appointments with just a few clicks. View doctor availability in real-time.",
                color: "from-primary to-teal-500",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your health data is protected with enterprise-grade security and encryption.",
                color: "from-emerald-500 to-green-500",
              },
              {
                icon: Clock,
                title: "No Double Bookings",
                description:
                  "Smart scheduling prevents conflicts and ensures your time is respected.",
                color: "from-violet-500 to-purple-500",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description:
                  "Patients, doctors, and admins each get tailored dashboards and features.",
                color: "from-orange-500 to-amber-500",
              },
              {
                icon: Heart,
                title: "Patient-Centered",
                description:
                  "Search doctors by specialty, view profiles, and choose what works for you.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Star,
                title: "Quality Care",
                description: "Connect with verified healthcare professionals in your area.",
                color: "from-amber-500 to-yellow-500",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="group border border-border/50 bg-card/80 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
              >
                <CardContent className="p-6">
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} mb-5 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              How It Works
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Get Started in <span className="text-primary">Three Simple Steps</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
            {[
              {
                step: "01",
                title: "Create Account",
                description:
                  "Sign up as a patient or doctor in less than a minute. It's free to get started.",
              },
              {
                step: "02",
                title: "Find a Doctor",
                description:
                  "Browse specialists, check availability, and read profiles to find your match.",
              },
              {
                step: "03",
                title: "Book & Visit",
                description:
                  "Select a time slot, confirm your booking, and attend your appointment.",
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center lg:text-left">
                <div className="mb-6 inline-flex items-center justify-center lg:justify-start">
                  <span className="bg-gradient-to-br from-primary/20 to-teal-400/20 bg-clip-text text-6xl font-bold text-transparent lg:text-7xl">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                {i < 2 && (
                  <ChevronRight className="absolute -right-6 top-12 hidden h-8 w-8 text-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Doctors CTA */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-600 to-emerald-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white drop-shadow-lg lg:text-5xl">
            Are You a Healthcare Provider?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-white/90">
            Join our platform to manage your practice efficiently. Set your availability, accept
            appointments, and grow your patient base.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth">
              <Button
                size="lg"
                className="h-12 bg-white px-10 text-base font-semibold text-primary shadow-xl hover:bg-white/90"
                data-testid="button-doctor-cta"
              >
                Register as a Doctor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/70">Doctors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10k+</p>
              <p className="text-sm text-white/70">Appointments</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-white/70">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-accent/20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Trusted by <span className="text-primary">Patients & Doctors</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Finally, a system that makes booking doctor appointments as easy as ordering food online!",
                name: "John D.",
                role: "Patient",
              },
              {
                quote:
                  "Managing my practice has never been easier. The scheduling features save me hours every week.",
                name: "Dr. Emily R.",
                role: "Pediatrician",
              },
              {
                quote:
                  "I love how I can see all available slots and choose what works best for my schedule.",
                name: "Maria S.",
                role: "Patient",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border border-border/50 bg-card shadow-lg shadow-black/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-5 leading-relaxed text-muted-foreground">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-400/20 font-bold text-primary">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white lg:text-5xl">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
              Healthcare Experience?
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-300">
            Join thousands of patients and doctors using SAMS today.
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="h-12 px-10 text-base font-semibold shadow-xl shadow-primary/30"
              data-testid="button-final-cta"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="gradient-hero flex h-9 w-9 items-center justify-center rounded-xl shadow-md">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">SAMS</span>
            </div>
            <p className="text-sm text-slate-400">
              Smart Appointment Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
