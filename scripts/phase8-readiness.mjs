const groups = [
  {
    name: "Firebase client",
    variables: [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ],
  },
  {
    name: "Cloudflare R2",
    variables: [
      "R2_ENDPOINT",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_NAME",
    ],
  },
  {
    name: "Cloudflare D1",
    variables: ["CF_ACCOUNT_ID", "CF_API_TOKEN", "D1_DATABASE_ID"],
  },
];

function isConfigured(name) {
  const value = process.env[name]?.trim();
  return Boolean(
    value &&
      !value.startsWith("<") &&
      !value.toLowerCase().includes("replace-me"),
  );
}

const missing = [];

console.log("Phase 8 environment readiness (secret values are never printed)\n");

if (!isConfigured("SIGN_UP_CODE")) {
  missing.push("SIGN_UP_CODE");
  console.log("BLOCKED Admin signup: SIGN_UP_CODE is not configured");
} else {
  console.log("PASS    Admin signup: SIGN_UP_CODE is configured");
}

for (const group of groups) {
  const absent = group.variables.filter((name) => !isConfigured(name));
  const configured = group.variables.length - absent.length;
  const marker = absent.length === 0 ? "PASS" : "BLOCKED";

  console.log(
    `${marker.padEnd(7)} ${group.name}: ${configured}/${group.variables.length}`,
  );
  missing.push(...absent);
}

const splitFirebaseVariables = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];
const hasFirebaseJson = isConfigured("FIREBASE_SERVICE_ACCOUNT_KEY");
const hasSplitFirebase = splitFirebaseVariables.every(isConfigured);
const firebaseMarker = hasFirebaseJson
  ? "FOUND"
  : hasSplitFirebase
    ? "PASS"
    : "BLOCKED";
console.log(
  `${firebaseMarker.padEnd(7)} Firebase Admin: ${hasFirebaseJson ? "JSON credential (validating)" : hasSplitFirebase ? "split credential" : "not configured"}`,
);

if (!hasFirebaseJson && !hasSplitFirebase) {
  missing.push(
    "FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY",
  );
}

const cloudinaryCloudName =
  isConfigured("CLOUDINARY_CLOUD_NAME") ||
  isConfigured("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
const cloudinaryApiKey = isConfigured("CLOUDINARY_API_KEY");
const cloudinaryApiSecret = isConfigured("CLOUDINARY_API_SECRET");
const cloudinaryCount =
  Number(cloudinaryCloudName) +
  Number(cloudinaryApiKey) +
  Number(cloudinaryApiSecret);
console.log(
  `${cloudinaryCount === 3 ? "PASS" : "BLOCKED"}   Cloudinary: ${cloudinaryCount}/3`,
);

if (!cloudinaryCloudName) {
  missing.push(
    "CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  );
}
if (!cloudinaryApiKey) missing.push("CLOUDINARY_API_KEY");
if (!cloudinaryApiSecret) missing.push("CLOUDINARY_API_SECRET");

if (hasFirebaseJson) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    const requiredFields = ["project_id", "client_email", "private_key"];
    const absentFields = requiredFields.filter(
      (field) => !serviceAccount[field]?.trim(),
    );

    if (absentFields.length > 0) {
      missing.push(
        ...absentFields.map(
          (field) => `FIREBASE_SERVICE_ACCOUNT_KEY.${field}`,
        ),
      );
    }

    if (
      serviceAccount.project_id &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      serviceAccount.project_id !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ) {
      missing.push("Firebase client/Admin project IDs do not match");
    }
  } catch {
    missing.push("FIREBASE_SERVICE_ACCOUNT_KEY is not valid single-line JSON");
  }
}

if (hasSplitFirebase) {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (
    projectId &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    projectId !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    missing.push("Firebase client/Admin project IDs do not match");
  }

  if (!process.env.FIREBASE_PRIVATE_KEY.includes("BEGIN PRIVATE KEY")) {
    missing.push("FIREBASE_PRIVATE_KEY does not look like a PEM private key");
  }
}

if (isConfigured("R2_ENDPOINT")) {
  try {
    const url = new URL(process.env.R2_ENDPOINT);
    if (url.protocol !== "https:") {
      missing.push("R2_ENDPOINT must use HTTPS");
    }
  } catch {
    missing.push("R2_ENDPOINT is not a valid URL");
  }
}

if (missing.length > 0) {
  console.error("\nPhase 8 is blocked by:");
  for (const item of [...new Set(missing)]) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log("\nAll required Phase 8 environment variables are configured.");
