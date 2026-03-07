"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Calendar, CalendarDays, LayoutDashboard, LogOut, Menu, Search, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const { user, logoutMutation } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = user.role === "patient"
    ? [
        { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
        { href: "/find-doctors", icon: Search, label: "Doctors" },
        { href: "/my-appointments", icon: CalendarDays, label: "Appointments" },
        { href: "/profile", icon: User, label: "Profile" },
      ]
    : user.role === "doctor"
      ? [
          { href: "/doctor", icon: LayoutDashboard, label: "Home" },
          { href: "/doctor/schedule", icon: Calendar, label: "Schedule" },
          { href: "/doctor/appointments", icon: CalendarDays, label: "Appointments" },
          { href: "/doctor/profile", icon: User, label: "Profile" },
        ]
      : [
          { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/admin/users", icon: Users, label: "Users" },
          { href: "/admin/stats", icon: BarChart3, label: "Stats" },
        ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.slice(0, 4).map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className={cn("flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all", pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}>
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-muted-foreground transition-all hover:text-foreground">
              <Menu className="h-5 w-5" />
              <span className="text-xs font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader className="pb-4">
              <SheetTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-500 font-bold text-white">{user.fullName.charAt(0)}</div>
                <div className="text-left">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm capitalize text-muted-foreground">{user.role}</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-2 py-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className={cn("flex items-center gap-3 rounded-xl p-3 transition-all", pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <Button variant="ghost" className="mt-4 w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => logoutMutation.mutate()}>
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
