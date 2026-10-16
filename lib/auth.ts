import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { firestore } from "@/lib/firestore";
import type { AppUser } from "@/lib/types";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function extractBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice(7).trim() || null;
}

export async function requireAuth(req: NextRequest): Promise<AppUser> {
  const token = extractBearerToken(req);
  if (!token) {
    throw new HttpError(401, "Not authorized, no token");
  }

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(token);
  } catch {
    throw new HttpError(401, "Not authorized, token failed");
  }

  const snapshot = await firestore().collection("users").doc(decoded.uid).get();
  const profile = snapshot.exists
    ? ({ uid: decoded.uid, ...snapshot.data() } as AppUser)
    : null;

  if (!profile) {
    throw new HttpError(401, "User profile not found");
  }

  return profile;
}

export async function requireAdmin(req: NextRequest): Promise<AppUser> {
  const user = await requireAuth(req);
  if (user.role !== "admin") {
    throw new HttpError(403, "Not authorized as admin");
  }
  return user;
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "Server error";
  return NextResponse.json({ message }, { status: 500 });
}
