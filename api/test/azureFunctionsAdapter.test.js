import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import {
  corsPreflightAzureResponse,
  toAzureFunctionResponse,
  toWebRequestFromAzureFunction,
} from "../src/http/azureFunctionsAdapter.js";
import { createFakePuntoVentaRepositories } from "../src/repositories/fakePuntoVentaRepositories.js";
import apiFunction from "../httpApi/index.cjs";

test("Azure Functions adapter preserves API contract for GET /api/health", async () => {
  const app = createApp({
    repositories: createFakePuntoVentaRepositories(),
    clock: () => new Date("2026-06-24T12:00:00Z"),
  });

  const request = toWebRequestFromAzureFunction({
    method: "GET",
    url: "https://func-puntoventa-pilot.example/api/health",
    headers: {},
  });

  const response = await app.handle(request);
  const azureResponse = await toAzureFunctionResponse(response);
  const body = JSON.parse(azureResponse.body);

  assert.equal(azureResponse.status, 200);
  assert.equal(azureResponse.headers["access-control-allow-origin"], "*");
  assert.equal(body.data.status, "ok");
  assert.equal(body.data.storage, "fake");
});

test("Azure Functions adapter serializes object bodies as JSON", async () => {
  const request = toWebRequestFromAzureFunction({
    method: "POST",
    url: "https://func-puntoventa-pilot.example/api/open-accounts",
    headers: {
      "x-pv-fake-user": "cashier",
    },
    body: {
      terminalId: 1,
      name: "Mostrador Azure Functions",
    },
  });

  assert.equal(request.headers.get("content-type"), "application/json");
  assert.deepEqual(await request.json(), {
    terminalId: 1,
    name: "Mostrador Azure Functions",
  });
});

test("Azure Functions adapter returns CORS preflight response", () => {
  const response = corsPreflightAzureResponse();

  assert.equal(response.status, 204);
  assert.equal(response.headers["access-control-allow-methods"], "GET,POST,PATCH,DELETE,OPTIONS");
});

test("Azure Functions handler exposes current app routes", async () => {
  const context = {};

  await apiFunction(context, {
    method: "GET",
    url: "https://func-puntoventa-pilot.example/api/me",
    headers: {
      "x-pv-fake-user": "admin",
    },
  });

  const body = JSON.parse(context.res.body);

  assert.equal(context.res.status, 200);
  assert.equal(body.data.userId, 1);
  assert.equal(body.data.displayName, "Admin Demo");
  assert.equal(context.res.headers["access-control-allow-origin"], "*");
});
