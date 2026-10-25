import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAuth } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { serializeValue } from "@/lib/products";
import { notifyAdmins, notifySafely, notifyUser } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new HttpError(400, "A JSON donation body is required");
    }
    const input = body as Record<string, unknown>;
    const amount = input.amount;
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 1 || amount > 1_000_000) {
      throw new HttpError(400, "Donation amount must be between 1 and 1,000,000");
    }

    let identity: Awaited<ReturnType<typeof requireAuth>> | null = null;
    if (request.headers.get("authorization")) identity = await requireAuth(request);
    const reference = await firestore().collection("donations").add({
      ...(identity
        ? { userId: identity.uid, name: identity.name, email: identity.email }
        : {}),
      amount: Math.round(amount * 100) / 100,
      currency: "USD",
      paymentMethod: "manual",
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const snapshot = await reference.get();
    const donation = serializeValue({ _id: snapshot.id, id: snapshot.id, ...snapshot.data() });
    notifySafely(Promise.all([
      notifyAdmins({
        kind: "donation",
        title: "New donation recorded",
        body: `${identity?.name ?? "A visitor"} recorded a USD ${Math.round(amount * 100) / 100} donation.`,
        href: "/admin/dashboard",
      }),
      ...(identity ? [notifyUser(identity.uid, {
        kind: "donation" as const,
        title: "Donation received",
        body: "Thank you. Your donation has been recorded and is pending review.",
        href: "/donate",
      })] : []),
    ]), `donation ${reference.id}`);
    return NextResponse.json({ success: true, donation }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
