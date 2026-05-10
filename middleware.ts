import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  DEFAULT_ROLE_HOME,
  PROTECTED_ROUTE_PREFIXES,
  PUBLIC_AUTH_ROUTE_PREFIXES,
  ROLE_ROUTE_PREFIXES,
} from "@/config/backend";
import type { UserRole } from "@/types/domain";

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getRequiredRole(pathname: string): UserRole | null {
  if (matchesPrefix(pathname, ROLE_ROUTE_PREFIXES.admin)) {
    return "admin";
  }

  if (matchesPrefix(pathname, ROLE_ROUTE_PREFIXES.doctor)) {
    return "doctor";
  }

  if (matchesPrefix(pathname, ROLE_ROUTE_PREFIXES.patient)) {
    return "patient";
  }

  return null;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = matchesPrefix(pathname, PROTECTED_ROUTE_PREFIXES);
  const isPublicAuthRoute = matchesPrefix(pathname, PUBLIC_AUTH_ROUTE_PREFIXES);

  if (!isProtectedRoute && !isPublicAuthRoute) {
    return NextResponse.next();
  }

  const role =
    req.auth?.user?.role === "patient" ||
    req.auth?.user?.role === "doctor" ||
    req.auth?.user?.role === "admin"
      ? req.auth.user.role
      : null;
  const isAuthenticated = Boolean(req.auth?.user);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicAuthRoute && isAuthenticated && role) {
    return NextResponse.redirect(new URL(DEFAULT_ROLE_HOME[role], req.url));
  }

  const requiredRole = getRequiredRole(pathname);
  if (requiredRole && role && requiredRole !== role) {
    return NextResponse.redirect(new URL(DEFAULT_ROLE_HOME[role], req.url));
  }

  if (requiredRole && !role) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|.*\\..*).*)"],
};
