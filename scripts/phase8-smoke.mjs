const input = process.argv[2] ?? process.env.PHASE8_BASE_URL;

if (!input) {
  console.error(
    "Usage: npm run phase8:smoke -- https://your-production-domain.example",
  );
  process.exit(1);
}

let baseUrl;
try {
  baseUrl = new URL(input);
} catch {
  console.error(`Invalid base URL: ${input}`);
  process.exit(1);
}

if (!new Set(["http:", "https:"]).has(baseUrl.protocol)) {
  console.error("The smoke-test URL must use HTTP or HTTPS.");
  process.exit(1);
}

const pageRoutes = [
  "/",
  "/about",
  "/products",
  "/products/phase-8-smoke-missing",
  "/articles",
  "/articles/phase-8-smoke-missing",
  "/cart",
  "/checkout",
  "/contact",
  "/donate",
  "/faith",
  "/recipes",
  "/agriculture",
  "/homeschooling",
  "/study-materials",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/terms-of-service",
  "/shop/seeds",
  "/shop/produce",
  "/admin/login",
  "/admin/signup",
  "/admin/dashboard",
  "/admin/products",
  "/admin/orders",
  "/order-confirmation/PHASE8-SMOKE",
];

const failures = [];

function routeUrl(route) {
  return new URL(route, baseUrl).toString();
}

async function checkPage(route) {
  try {
    const response = await fetch(routeUrl(route), { redirect: "follow" });
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.includes("text/html")) {
      failures.push(
        `${route}: expected HTML 2xx, received ${response.status} ${contentType}`,
      );
      return;
    }

    console.log(`PASS ${response.status} ${route}`);
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
  }
}

for (const route of pageRoutes) {
  await checkPage(route);
}

try {
  const response = await fetch(routeUrl("/api/health"));
  const health = await response.json();
  const unavailable = Object.entries(health.services ?? {})
    .filter(([, configured]) => !configured)
    .map(([service]) => service);

  if (!response.ok || health.status !== "OK") {
    failures.push(`/api/health: received ${response.status}`);
  } else if (unavailable.length > 0) {
    failures.push(`/api/health: unavailable services: ${unavailable.join(", ")}`);
  } else {
    console.log("PASS 200 /api/health (all services configured)");
  }
} catch (error) {
  failures.push(`/api/health: ${error.message}`);
}

for (const route of ["/api/products", "/api/articles"]) {
  try {
    const response = await fetch(routeUrl(route));
    if (!response.ok) {
      failures.push(`${route}: expected 2xx, received ${response.status}`);
    } else {
      console.log(`PASS ${response.status} ${route}`);
    }
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
  }
}

for (const route of ["/api/auth/me", "/api/orders"]) {
  try {
    const response = await fetch(routeUrl(route));
    if (response.status !== 401) {
      failures.push(`${route}: expected unauthenticated 401, received ${response.status}`);
    } else {
      console.log(`PASS 401 ${route}`);
    }
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error("\nPhase 8 smoke test failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nPhase 8 smoke test passed for ${baseUrl.origin}.`);
