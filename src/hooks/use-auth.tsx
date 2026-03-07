"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { registerWithBackend } from "@/services/auth-backend";
import { logoutFromBackend } from "@/services/auth-backend";
import type { LoginRequest, RegisterRequest } from "@/types/api";
import type { UserResponse } from "@/types/domain";

type AuthContextType = {
  user: UserResponse | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error(result?.error || "Login failed");
      }
    },
    onSuccess: () => {
      toast({ title: "Welcome back!" });
    },
    onError: (error: Error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });
}

function useRegisterMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      await registerWithBackend(payload);

      const result = await signIn("credentials", {
        username: payload.username,
        password: payload.password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error(result?.error || "Registration succeeded but automatic login failed");
      }
    },
    onSuccess: () => {
      toast({ title: "Registration successful", description: "Welcome to SAMS!" });
    },
    onError: (error: Error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    },
  });
}

function useLogoutMutation(accessToken?: string) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await logoutFromBackend(accessToken);
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      toast({ title: "Logged out", description: "See you soon!" });
    },
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user ?? null;
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation(session?.accessToken);
  const registerMutation = useRegisterMutation();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === "loading",
        error: null,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

