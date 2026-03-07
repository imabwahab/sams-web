"use client";

import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Calendar, CalendarDays, LayoutDashboard, LogOut, Search, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: ElementType; children: ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200", isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
        <Icon className="h-5 w-5" />
        {children}
      </Link>
    );
  };

  return (
    <div className="hidden lg:flex h-screen w-72 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm px-6 py-8">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-teal-500 to-emerald-500 shadow-lg shadow-primary/25">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none tracking-tight text-foreground">SAMS</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Healthcare Portal</p>
        </div>
      </div>

      <div className="flex-1 space-y-1.5">
        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Navigation</div>
        {user.role === "patient" && (
          <>
            <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink href="/find-doctors" icon={Search}>Find Doctors</NavLink>
            <NavLink href="/my-appointments" icon={CalendarDays}>My Appointments</NavLink>
            <div className="pt-4">
              <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Account</div>
              <NavLink href="/profile" icon={User}>My Profile</NavLink>
            </div>
          </>
        )}
        {user.role === "doctor" && (
          <>
            <NavLink href="/doctor" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink href="/doctor/schedule" icon={Calendar}>Manage Schedule</NavLink>
            <NavLink href="/doctor/appointments" icon={CalendarDays}>Appointments</NavLink>
            <div className="pt-4">
              <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Account</div>
              <NavLink href="/doctor/profile" icon={User}>My Profile</NavLink>
            </div>
          </>
        )}
        {user.role === "admin" && (
          <>
            <NavLink href="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink href="/admin/users" icon={Users}>User Management</NavLink>
            <NavLink href="/admin/stats" icon={BarChart3}>System Stats</NavLink>
          </>
        )}
      </div>

      <div className="border-t border-border/50 pt-6">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-teal-500/20 text-lg font-bold text-primary">{user.fullName.charAt(0)}</div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-foreground">{user.fullName}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => logoutMutation.mutate()}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
