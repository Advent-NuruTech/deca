import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAuth } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { notifyAdmins, notifySafely, notifyUser } from "@/lib/notifications";

function requiredText(value: unknown, label: string, maximum: number) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maximum) {
    throw new HttpError(400, `${label} is required and must be no more than ${maximum} characters.`);
  }
  return value.trim();
}

function optionalText(value: unknown, label: string, maximum: number) {
  if (value === undefined) return "";
  if (typeof value !== "string" || value.trim().length > maximum) {
    throw new HttpError(400, `${label} must be no more than ${maximum} characters.`);
  }
  return value.trim();
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "Enter the invitation details to continue.");
    const values = body as Record<string, unknown>;
    if (typeof values.website === "string" && values.website.trim()) {
      return NextResponse.json({ message: "Your invitation has been received." }, { status: 201 });
    }

    const contactName = requiredText(values.contactName, "Full name", 120);
    const organisation = requiredText(values.organisation, "Organisation", 160);
    const email = requiredText(values.email, "Email address", 254).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, "Enter a valid email address.");
    const phone = requiredText(values.phone, "Phone number", 40);
    if ((phone.match(/\d/g) ?? []).length < 7) throw new HttpError(400, "Enter a valid phone number.");
    const eventName = requiredText(values.eventName, "Event name", 180);
    const eventDate = requiredText(values.eventDate, "Preferred date", 10);
    if (!validDate(eventDate)) throw new HttpError(400, "Enter a valid preferred date.");
    const expectedAttendanceRaw = values.expectedAttendance;
    const expectedAttendance = typeof expectedAttendanceRaw === "string" && /^\d+$/.test(expectedAttendanceRaw) ? Number(expectedAttendanceRaw) : NaN;
    if (!Number.isSafeInteger(expectedAttendance) || expectedAttendance < 1 || expectedAttendance > 1_000_000) throw new HttpError(400, "Expected attendance must be between 1 and 1,000,000.");
    if (values.consent !== true) throw new HttpError(400, "Please confirm that GILEAD may contact you about this invitation.");

    const identity = request.headers.get("authorization") ? await requireAuth(request) : null;
    const result = await firestore().collection("programmeInvitations").add({
      ...(identity ? { userId: identity.uid } : {}),
      contactName, organisation, email, phone, eventName, eventDate,
      preferredTime: requiredText(values.preferredTime, "Preferred session time", 100),
      duration: requiredText(values.duration, "Time available", 100),
      venue: requiredText(values.venue, "Venue", 250),
      townCounty: requiredText(values.townCounty, "Town or county", 160),
      expectedAttendance,
      audience: requiredText(values.audience, "Audience details", 1000),
      requestedTopics: requiredText(values.requestedTopics, "Requested topics", 1000),
      facilitatorPreference: optionalText(values.facilitatorPreference, "Facilitator preference", 160),
      logistics: optionalText(values.logistics, "Practical arrangements", 2000),
      message: optionalText(values.message, "Additional notes", 2000),
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    notifySafely(Promise.all([
      notifyAdmins({ kind: "invitation", title: "New programme invitation", body: `${contactName} invited GILEAD to ${eventName} for ${organisation}.` }),
      ...(identity ? [notifyUser(identity.uid, { kind: "invitation", title: "Invitation received", body: "Your programme invitation has been received by GILEAD.", href: "/invite-gilead" })] : []),
    ]), `programme invitation ${result.id}`);
    return NextResponse.json({ id: result.id, message: "Your invitation has been received." }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
