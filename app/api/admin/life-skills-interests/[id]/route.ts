import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { notifySafely, notifyUser } from "@/lib/notifications";

const statuses = ["new", "contacted", "in progress", "closed"] as const;

export async function PATCH(request: NextRequest, { params }: RouteContext<"/api/admin/life-skills-interests/[id]">) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) throw new HttpError(400, "Invalid interest record.");
    const body: unknown = await request.json().catch(() => null);
    const status = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>).status : undefined;
    if (typeof status !== "string" || !statuses.includes(status as (typeof statuses)[number])) throw new HttpError(400, "Choose a valid status.");
    const reference = firestore().collection("lifeSkillsInterests").doc(id);
    const existing = await reference.get();
    if (!existing.exists) throw new HttpError(404, "Interest record not found.");
    await reference.update({ status, updatedAt: FieldValue.serverTimestamp() });
    const userId = existing.data()?.userId;
    if (typeof userId === "string" && existing.data()?.status !== status) {
      notifySafely(notifyUser(userId, {
        kind: "interest",
        title: "Enquiry updated",
        body: `Your Life Skills enquiry is now ${status}.`,
        href: "/practical-christianity",
      }), `life skills status ${id}`);
    }
    return NextResponse.json({ message: "Status updated." });
  } catch (error) {
    return errorResponse(error);
  }
}
