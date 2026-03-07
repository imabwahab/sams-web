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
  Zap
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">SAMS</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth">
                <Button variant="ghost" className="font-medium" data-testid="button-login">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="font-medium shadow-md shadow-primary/20" data-testid="button-get-started">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/40 via-background to-background -z-10" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl -z-10" />
        <div className="absolute top-60 right-10 w-96 h-96 bg-teal-400/8 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/10 shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-accent-foreground">Healthcare Made Simple</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="text-foreground">Smart Appointment</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">Management System</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Connect with healthcare professionals seamlessly. Book appointments, 
                manage schedules, and take control of your healthcare journey with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 h-12 font-medium shadow-lg shadow-primary/25" data-testid="button-hero-cta">
                    Book Your First Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-12 font-medium border-2" data-testid="button-doctor-join">
                    <Stethoscope className="mr-2 h-5 w-5" />
                    Join as a Doctor
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/50">
                <div className="flex -space-x-3">
                  {[
                    "from-teal-400 to-teal-600",
                    "from-emerald-400 to-emerald-600", 
                    "from-cyan-400 to-cyan-600",
                    "from-primary to-teal-500"
                  ].map((gradient, i) => (
                    <div key={i} className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-background flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">1,000+</span>
                  <span className="text-muted-foreground"> patients trust us</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-medium ml-1">4.9</span>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-primary/15 to-teal-400/15 rounded-full blur-3xl" />
              
              <Card className="relative border border-border/50 shadow-2xl shadow-primary/10 overflow-hidden bg-card">
                <CardContent className="p-0">
                  <div className="gradient-hero p-8 text-white">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Stethoscope className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">Dr. Sarah Johnson</div>
                        <div className="text-sm text-white/80">Cardiologist</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-white/20 hover:bg-white/25 border-0 text-white">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Available Today
                      </Badge>
                      <Badge className="bg-white/20 hover:bg-white/25 border-0 text-white">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        4.9 Rating
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
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
                          className={`text-xs font-medium ${i === 2 ? 'shadow-md' : ''}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full h-11 font-medium shadow-md shadow-primary/20">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              <Zap className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Everything You Need for
              <br />
              <span className="text-primary">Healthcare Management</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform connects patients with doctors effortlessly, with features designed for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Easy Scheduling",
                description: "Book appointments with just a few clicks. View doctor availability in real-time.",
                color: "from-primary to-teal-500"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your health data is protected with enterprise-grade security and encryption.",
                color: "from-emerald-500 to-green-500"
              },
              {
                icon: Clock,
                title: "No Double Bookings",
                description: "Smart scheduling prevents conflicts and ensures your time is respected.",
                color: "from-violet-500 to-purple-500"
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Patients, doctors, and admins each get tailored dashboards and features.",
                color: "from-orange-500 to-amber-500"
              },
              {
                icon: Heart,
                title: "Patient-Centered",
                description: "Search doctors by specialty, view profiles, and choose what works for you.",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Star,
                title: "Quality Care",
                description: "Connect with verified healthcare professionals in your area.",
                color: "from-amber-500 to-yellow-500"
              }
            ].map((feature, i) => (
              <Card key={i} className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Get Started in <span className="text-primary">Three Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up as a patient or doctor in less than a minute. It's free to get started."
              },
              {
                step: "02",
                title: "Find a Doctor",
                description: "Browse specialists, check availability, and read profiles to find your match."
              },
              {
                step: "03",
                title: "Book & Visit",
                description: "Select a time slot, confirm your booking, and attend your appointment."
              }
            ].map((item, i) => (
              <div key={i} className="relative text-center lg:text-left">
                <div className="inline-flex items-center justify-center lg:justify-start mb-6">
                  <span className="text-6xl lg:text-7xl font-bold bg-gradient-to-br from-primary/20 to-teal-400/20 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                {i < 2 && (
                  <ChevronRight className="hidden lg:block absolute top-12 -right-6 h-8 w-8 text-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Doctors CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-600 to-emerald-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white/15 backdrop-blur-sm mb-8 shadow-2xl ring-1 ring-white/20">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Are You a Healthcare Provider?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our platform to manage your practice efficiently. Set your availability, 
            accept appointments, and grow your patient base.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base px-10 h-12 font-semibold shadow-xl" data-testid="button-doctor-cta">
                Register as a Doctor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-accent/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Trusted by <span className="text-primary">Patients & Doctors</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Finally, a system that makes booking doctor appointments as easy as ordering food online!",
                name: "John D.",
                role: "Patient"
              },
              {
                quote: "Managing my practice has never been easier. The scheduling features save me hours every week.",
                name: "Dr. Emily R.",
                role: "Pediatrician"
              },
              {
                quote: "I love how I can see all available slots and choose what works best for my schedule.",
                name: "Maria S.",
                role: "Patient"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="border border-border/50 bg-card shadow-lg shadow-black/5">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-5 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-teal-400/20 flex items-center justify-center font-bold text-primary">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">Healthcare Experience?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of patients and doctors using SAMS today.
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-base px-10 h-12 font-semibold shadow-xl shadow-primary/30" data-testid="button-final-cta">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center shadow-md">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">SAMS</span>
            </div>
            <p className="text-slate-400 text-sm">
              Smart Appointment Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


