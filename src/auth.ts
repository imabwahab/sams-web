import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginWithBackend } from "@/services/auth-backend";
import type { LoginRequest } from "@/types/api";

export const { handlers, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "SAMS Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const payload: LoginRequest = {
          username: String(credentials?.username ?? ""),
          password: String(credentials?.password ?? ""),
        };

        const session = await loginWithBackend(payload);

        return {
          id: String(session.user.id),
          appUser: session.user,
          accessToken: session.token,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.appUser;
      }

      if (trigger === "update" && session?.user) {
        token.user = session.user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.user = token.user as typeof session.user;
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
});
