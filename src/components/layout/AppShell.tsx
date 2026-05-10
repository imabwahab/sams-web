"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import MobileHeader from "@/components/layout/MobileHeader";
import { useAuth } from "@/hooks/use-auth";

export default function AppShell({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-secondary/30">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-20 sm:px-6 md:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl duration-500 animate-in fade-in slide-in-from-bottom-4">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
