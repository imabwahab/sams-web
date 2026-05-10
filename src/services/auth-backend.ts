import type { ApiEnvelope, LoginRequest, RegisterRequest } from "@/types/api";
import type { UserResponse } from "@/types/domain";
import { endpoints } from "@/services/endpoints";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function toUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type TokenPayload = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  jwtToken?: string;
  user?: UserResponse;
};

function unwrapPayload<T>(payload: ApiEnvelope<T> | T): T {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

async function backendFetch<T>(path: string, init?: RequestInit, bearerToken?: string): Promise<T> {
  const response = await fetch(toUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const rawText = await response.text();
  let parsed: unknown = null;
  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as unknown;
    } catch {
      parsed = rawText;
    }
  }

  if (!response.ok) {
    const message =
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof (parsed as { message?: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : response.statusText;
    throw new Error(message);
  }

  return unwrapPayload(parsed as ApiEnvelope<T> | T);
}

function extractToken(payload: unknown) {
  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload === "object" && payload !== null) {
    const tokenPayload = payload as TokenPayload;
    return (
      tokenPayload.token ??
      tokenPayload.accessToken ??
      tokenPayload.access_token ??
      tokenPayload.jwt ??
      tokenPayload.jwtToken ??
      null
    );
  }

  return null;
}

function extractUser(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  if ("user" in payload && typeof payload.user === "object" && payload.user !== null) {
    return payload.user as UserResponse;
  }

  if (
    "id" in payload &&
    "username" in payload &&
    "role" in payload &&
    "fullName" in payload &&
    "email" in payload
  ) {
    return payload as UserResponse;
  }

  return null;
}

export async function loginWithBackend(payload: LoginRequest) {
  const loginResponse = await backendFetch<unknown>(endpoints.auth.login, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const token = extractToken(loginResponse);

  if (!token) {
    throw new Error("Login response did not include a JWT token");
  }

  const user = extractUser(loginResponse) ?? (await getCurrentUserFromToken(token));

  return { token, user };
}

export async function registerWithBackend(payload: RegisterRequest) {
  await backendFetch<unknown>(endpoints.auth.register, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUserFromToken(token: string) {
  try {
    return await backendFetch<UserResponse>(endpoints.auth.me, { method: "GET" }, token);
  } catch {
    return backendFetch<UserResponse>(endpoints.auth.userAlias, { method: "GET" }, token);
  }
}

export async function logoutFromBackend(token?: string) {
  if (!token) {
    return;
  }

  try {
    await backendFetch<void>(endpoints.auth.logout, { method: "POST" }, token);
  } catch {
    // Logout should still clear the frontend session if backend logout fails.
  }
}
