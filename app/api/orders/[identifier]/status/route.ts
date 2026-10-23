import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { serializeOrder, validateStatusBody } from "@/lib/orders";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    await requireAdmin(request);
    const { identifier } = await params;
    const reference = firestore().collection("orders").doc(identifier);
    const body: unknown = await request.json().catch(() => null);
    const statuses = validateStatusBody(body);
    await firestore().runTransaction(async (transaction) => {
      const document = await transaction.get(reference);
      if (!document.exists) throw new HttpError(404, "Order not found");
      if (statuses.orderStatus) {
        const config = await transaction.get(firestore().collection("settings").doc("orderStatuses"));
        const options = config.data()?.statuses ?? ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
        if (!options.includes(statuses.orderStatus)) throw new HttpError(400, "Unknown order status");
      }
      transaction.update(reference, {
        ...(statuses.orderStatus ? { orderStatus: statuses.orderStatus } : {}),
        ...(statuses.paymentStatus ? { paymentStatus: statuses.paymentStatus } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    return NextResponse.json(serializeOrder(await reference.get()));
  } catch (error) {
    return errorResponse(error);
  }
}
