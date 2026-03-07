"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { roleHomePath } from "@/lib/role-home";
import type { UserRole } from "@/types/domain";

export function RoleGuard({ allowedRoles, children }: { allowedRoles?: UserRole[]; children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(roleHomePath(user.role));
    }
  }, [allowedRoles, isLoading, router, user]);

  if (isLoading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return <>{children}</>;
}
