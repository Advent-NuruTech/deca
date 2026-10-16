import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAuth } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { serializeOrder } from "@/lib/orders";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    const user = await requireAuth(request);
    const { identifier } = await params;
    const snapshot = await firestore().collection("orders").where("orderNumber", "==", identifier).limit(1).get();
    const document = snapshot.docs[0];
    if (!document) throw new HttpError(404, "Order not found");
    if (user.role !== "admin" && document.data().userId !== user.uid) {
      throw new HttpError(404, "Order not found");
    }
    return NextResponse.json(serializeOrder(document));
  } catch (error) {
    return errorResponse(error);
  }
}
