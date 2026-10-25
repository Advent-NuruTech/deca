import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";

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
    if (!(await reference.get()).exists) throw new HttpError(404, "Interest record not found.");
    await reference.update({ status, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ message: "Status updated." });
  } catch (error) {
    return errorResponse(error);
  }
}
