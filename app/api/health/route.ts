import { NextResponse } from "next/server";
import { d1Configured } from "@/lib/d1";
import { firestoreConfigured } from "@/lib/firestore";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { firebaseAdminConfigured } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "OK",
    message: "RemSam Homestead API is running (Next.js Route Handlers)",
    services: {
      r2: Boolean(
        process.env.R2_ACCESS_KEY_ID &&
          process.env.R2_SECRET_ACCESS_KEY &&
          process.env.R2_BUCKET_NAME,
      ),
      firestore: firestoreConfigured(),
      cloudinary: cloudinaryConfigured(),
      d1ArticleContent: d1Configured(),
      firebaseClient: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      firebaseAdmin: firebaseAdminConfigured(),
    },
  });
}
