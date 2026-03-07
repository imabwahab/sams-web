"use client";

import { Activity } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function MobileHeader() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-teal-500 to-emerald-500 shadow-lg shadow-primary/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">SAMS</h1>
            <p className="text-xs text-muted-foreground">Healthcare Portal</p>
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-500/20 text-sm font-bold text-primary">
          {user.fullName.charAt(0)}
        </div>
      </div>
    </header>
  );
}
