import { NextRequest, NextResponse } from "next/server";
import { errorResponse, requireAuth } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { serializeOrder, timestamp } from "@/lib/orders";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const snapshot = await firestore().collection("orders").where("userId", "==", user.uid).get();
    const orders = snapshot.docs.sort((a, b) => timestamp(b.data().createdAt) - timestamp(a.data().createdAt)).map(serializeOrder);
    return NextResponse.json({ orders }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}
