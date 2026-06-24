import { dataResponse } from "../http/responses.js";
import { requireAuth, requirePermission } from "../auth/fakeAuth.js";

export function createMeRoutes() {
  return [
    {
      method: "GET",
      path: "/api/me",
      handler: async ({ auth }) => {
        const currentUser = requireAuth(auth);
        return dataResponse({
          companyId: currentUser.companyId,
          userId: currentUser.userId,
          displayName: currentUser.displayName,
          roles: currentUser.roles,
          permissions: currentUser.permissions
        });
      }
    },
    {
      method: "GET",
      path: "/api/me/admin-check",
      handler: async ({ auth }) => {
        requirePermission(auth, "system.configure");
        return dataResponse({ status: "allowed" });
      }
    }
  ];
}
