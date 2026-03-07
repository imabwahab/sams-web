import "next-auth";
import "next-auth/jwt";
import type { UserResponse } from "@/types/domain";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: UserResponse;
  }

  interface User {
    id: string;
    appUser: UserResponse;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: UserResponse;
  }
}
