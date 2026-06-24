const fakeUsers = {
  cashier: {
    companyId: 1,
    userId: 10,
    displayName: "Cajero Demo",
    roles: ["cashier"],
    permissions: [
      "catalog.read",
      "recipes.read",
      "open_accounts.manage",
      "sales.checkout",
      "tickets.read",
      "cash.read",
      "cash.open",
      "cash.close_own",
      "inventory.read"
    ]
  },
  admin: {
    companyId: 1,
    userId: 1,
    displayName: "Admin Demo",
    roles: ["admin"],
    permissions: [
      "users.manage",
      "catalog.read",
      "catalog.write",
      "recipes.read",
      "recipes.write",
      "open_accounts.manage",
      "sales.checkout",
      "sales.override_price",
      "sales.discount",
      "sales.void",
      "tickets.read",
      "cash.read",
      "cash.open",
      "cash.move",
      "cash.close_own",
      "cash.close_any",
      "purchases.read",
      "purchases.write",
      "purchases.void",
      "inventory.read",
      "inventory.adjust",
      "reports.read",
      "system.configure"
    ]
  },
  auditor: {
    companyId: 1,
    userId: 30,
    displayName: "Auditor Demo",
    roles: ["auditor"],
    permissions: ["catalog.read", "recipes.read", "tickets.read", "cash.read", "purchases.read", "inventory.read", "reports.read"]
  }
};

export function createFakeAuth({ defaultUserKey = "cashier" } = {}) {
  return {
    resolve(request) {
      const userKey = request.headers.get("x-pv-fake-user") || defaultUserKey;
      if (userKey === "none") return null;

      const user = fakeUsers[userKey];
      if (!user) return null;

      return structuredClone(user);
    }
  };
}

export function requireAuth(auth) {
  if (!auth) {
    throw httpError("UNAUTHORIZED", "Authentication is required.", 401);
  }
  return auth;
}

export function requirePermission(auth, permission) {
  requireAuth(auth);
  if (!auth.permissions.includes(permission)) {
    throw httpError("FORBIDDEN", "User does not have permission for this action.", 403, [
      { field: "permission", message: permission }
    ]);
  }
  return auth;
}

export function httpError(code, publicMessage, status, details = []) {
  const error = new Error(publicMessage);
  error.code = code;
  error.publicMessage = publicMessage;
  error.status = status;
  error.details = details;
  return error;
}
