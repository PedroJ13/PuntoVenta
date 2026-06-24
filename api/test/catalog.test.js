import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createFallbackCatalogRepository } from "../src/repositories/fallbackCatalogRepository.js";
import { createFakeCatalogRepository } from "../src/repositories/fakeCatalogRepository.js";

function createTestApp() {
  return createApp({
    repositories: {
      catalog: createFakeCatalogRepository()
    }
  });
}

test("GET /api/categories filters active categories with fake repository", async () => {
  const response = await createTestApp().handle(new Request("http://local.test/api/categories?active=true"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.pagination.total, 3);
  assert.ok(body.data.every((category) => category.isActive));
});

test("GET /api/items filters by type and search", async () => {
  const response = await createTestApp().handle(
    new Request("http://local.test/api/items?type=prepared_product&search=cap")
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.pagination.total, 1);
  assert.equal(body.data[0].sku, "CAF-003");
  assert.equal(body.data[0].itemType, "prepared_product");
});

test("GET /api/categories can use primary SQL-style repository", async () => {
  const storageState = { mode: "fake", catalog: "fake", sqlConfigured: true, sqlAvailable: false };
  const app = createApp({
    repositories: {
      catalog: createFallbackCatalogRepository({
        storageState,
        primary: {
          async listCategories() {
            return [{ id: 100, companyId: 1, name: "SQL Demo", sortOrder: 1, isActive: true }];
          },
          async listItems() {
            return [];
          }
        },
        fallback: createFakeCatalogRepository()
      })
    }
  });

  const response = await app.handle(new Request("http://local.test/api/categories?active=true"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.pagination.total, 1);
  assert.equal(body.data[0].name, "SQL Demo");
  assert.equal(storageState.catalog, "sql-local");
  assert.equal(storageState.sqlAvailable, true);
});

test("GET /api/items falls back to fake repository when primary fails", async () => {
  const storageState = { mode: "fake", catalog: "fake", sqlConfigured: true, sqlAvailable: false };
  const app = createApp({
    repositories: {
      catalog: createFallbackCatalogRepository({
        storageState,
        primary: {
          async listCategories() {
            return [];
          },
          async listItems() {
            throw new Error("local SQL unavailable");
          }
        },
        fallback: createFakeCatalogRepository()
      })
    }
  });

  const response = await app.handle(new Request("http://local.test/api/items?search=cap"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.pagination.total, 1);
  assert.equal(body.data[0].sku, "CAF-003");
  assert.equal(storageState.mode, "fake-fallback");
  assert.equal(storageState.catalog, "fake");
  assert.equal(storageState.sqlAvailable, false);
});
