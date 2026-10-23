import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin, requireAuth } from "@/lib/auth";
import { firestore } from "@/lib/firestore";

const defaults = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const doc = await firestore().collection("settings").doc("orderStatuses").get();
    return NextResponse.json({ statuses: doc.data()?.statuses ?? defaults }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    if (!Array.isArray(body.statuses) || !body.statuses.length || body.statuses.some((s: unknown) => typeof s !== "string" || !s.trim() || s.length > 100)) throw new HttpError(400, "Enter valid status names");
    const statuses = body.statuses.map((s: string) => s.trim().toLowerCase());
    if (new Set(statuses).size !== statuses.length || !statuses.includes("pending")) throw new HttpError(400, "Statuses must be unique and include pending");
    const database = firestore();
    await database.runTransaction(async (transaction) => {
      const config = database.collection("settings").doc("orderStatuses");
      await transaction.get(config);
      const orders = await transaction.get(database.collection("orders"));
      const used = new Set(orders.docs.map ( (doc) => doc.data().orderStatus));
      if ([...used].some((status) => !statuses.includes(status))) throw new HttpError(400, "A status used by an existing order cannot be removed. Move those orders first.");
      transaction.set(config, { statuses });
    });
    return NextResponse.json({ statuses });
  } catch (error) { return errorResponse(error); }
}
