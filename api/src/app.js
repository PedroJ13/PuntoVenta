import { createCatalogRoutes } from "./routes/catalogRoutes.js";
import { createCashShiftRoutes } from "./routes/cashShiftRoutes.js";
import { createHealthRoutes } from "./routes/healthRoutes.js";
import { createMeRoutes } from "./routes/meRoutes.js";
import { createOpenAccountRoutes } from "./routes/openAccountRoutes.js";
import { createReportRoutes } from "./routes/reportRoutes.js";
import { createSalesRoutes } from "./routes/salesRoutes.js";
import { createFakeAuth } from "./auth/fakeAuth.js";
import { jsonResponse, notFoundResponse } from "./http/responses.js";

export function createApp({
  repositories,
  clock = () => new Date(),
  authProvider = createFakeAuth(),
  storageStatus = () => ({ mode: "fake" })
} = {}) {
  if (!repositories?.catalog) {
    throw new Error("createApp requires repositories.catalog");
  }

  const routes = [
    ...createHealthRoutes({ clock, storageStatus }),
    ...createMeRoutes(),
    ...createCatalogRoutes({ catalogRepository: repositories.catalog }),
    ...createCashShiftRoutes({ cashShiftRepository: repositories.cashShifts }),
    ...createOpenAccountRoutes({ openAccountRepository: repositories.openAccounts }),
    ...createSalesRoutes({ salesRepository: repositories.sales }),
    ...createReportRoutes({ reportRepository: repositories.reports })
  ];

  return {
    async handle(request) {
      const url = new URL(request.url);
      const match = findRoute(routes, request.method, url.pathname);

      if (!match) {
        return notFoundResponse("Route not found.");
      }

      try {
        const auth = authProvider.resolve(request);
        return await match.route.handler({ request, url, auth, params: match.params });
      } catch (error) {
        return jsonResponse(
          {
            error: {
              code: error.code || "INTERNAL_ERROR",
              message: error.publicMessage || "Unexpected API error.",
              details: error.details || []
            }
          },
          { status: error.status || 500 }
        );
      }
    }
  };
}

function findRoute(routes, method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const params = matchPath(route.path, pathname);
    if (params) return { route, params };
  }
  return null;
}

function matchPath(pattern, pathname) {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];

    if (patternPart.startsWith("{") && patternPart.endsWith("}")) {
      params[patternPart.slice(1, -1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) return null;
  }

  return params;
}
