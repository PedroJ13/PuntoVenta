import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createFakeAuth } from "../src/auth/fakeAuth.js";
import { createFakeCatalogRepository } from "../src/repositories/fakeCatalogRepository.js";

function createTestApp() {
  return createApp({
    authProvider: createFakeAuth(),
    repositories: {
      catalog: createFakeCatalogRepository()
    }
  });
}

test("GET /api/me returns fake cashier auth context by default", async () => {
  const response = await createTestApp().handle(new Request("http://local.test/api/me"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.companyId, 1);
  assert.equal(body.data.userId, 10);
  assert.deepEqual(body.data.roles, ["cashier"]);
  assert.ok(body.data.permissions.includes("sales.checkout"));
});

test("GET /api/me can return admin fake user from header", async () => {
  const response = await createTestApp().handle(
    new Request("http://local.test/api/me", {
      headers: { "x-pv-fake-user": "admin" }
    })
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.userId, 1);
  assert.ok(body.data.permissions.includes("system.configure"));
});

test("GET /api/me returns UNAUTHORIZED when fake user is none", async () => {
  const response = await createTestApp().handle(
    new Request("http://local.test/api/me", {
      headers: { "x-pv-fake-user": "none" }
    })
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error.code, "UNAUTHORIZED");
});

test("permission guard returns FORBIDDEN for cashier without system permission", async () => {
  const response = await createTestApp().handle(new Request("http://local.test/api/me/admin-check"));
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.error.code, "FORBIDDEN");
});
