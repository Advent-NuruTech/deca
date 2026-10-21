import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { errorResponse, requireAdmin } from "@/lib/auth";
import { PUBLIC_ARTICLES_TAG, PUBLIC_PRODUCTS_TAG } from "@/lib/cache-tags";
import {
  beginD1ReadModelUpdate,
  publicArticleFromDocument,
  replaceD1Articles,
  replaceD1Products,
} from "@/lib/d1-public-store";
import { firestore } from "@/lib/firestore";
import { serializeProduct } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const requestedArea = request.nextUrl.searchParams.get("area");
    const areas = requestedArea === "articles" || requestedArea === "products"
      ? [requestedArea]
      : ["articles", "products"] as const;
    const result: Record<string, number> = {};

    if (areas.includes("articles")) {
      if (!(await beginD1ReadModelUpdate("articles"))) throw new Error("D1 article schema is not installed");
      const snapshot = await firestore().collection("articles").where("published", "==", true).get();
      await replaceD1Articles(snapshot.docs.map(publicArticleFromDocument));
      result.articles = snapshot.size;
      revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    }
    if (areas.includes("products")) {
      if (!(await beginD1ReadModelUpdate("products"))) throw new Error("D1 product schema is not installed");
      const snapshot = await firestore().collection("products").where("status", "==", "active").get();
      await replaceD1Products(snapshot.docs.map(serializeProduct));
      result.products = snapshot.size;
      revalidateTag(PUBLIC_PRODUCTS_TAG, { expire: 0 });
    }

    return NextResponse.json({ synchronized: result });
  } catch (error) {
    return errorResponse(error);
  }
}
