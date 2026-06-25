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

const pilotWebOrigin = "https://gray-beach-00a0f870f.7.azurestaticapps.net";

function restoreAllowedOrigins(previousAllowedOrigins) {
  if (previousAllowedOrigins === undefined) {
    delete process.env.ALLOWED_ORIGINS;
    return;
  }

  process.env.ALLOWED_ORIGINS = previousAllowedOrigins;
}

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
  const previousAllowedOrigins = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = pilotWebOrigin;

  const response = corsPreflightAzureResponse(pilotWebOrigin);

  assert.equal(response.status, 204);
  assert.equal(response.headers["access-control-allow-origin"], pilotWebOrigin);
  assert.equal(response.headers["access-control-allow-methods"], "GET,POST,PATCH,DELETE,OPTIONS");

  restoreAllowedOrigins(previousAllowedOrigins);
});

test("Azure Functions adapter omits allowed origin header for unapproved origins", async () => {
  const previousAllowedOrigins = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = pilotWebOrigin;

  const app = createApp({
    repositories: createFakePuntoVentaRepositories(),
    clock: () => new Date("2026-06-24T12:00:00Z"),
  });
  const response = await app.handle(new Request("https://func-puntoventa-pilot.example/api/health"));
  const azureResponse = await toAzureFunctionResponse(response, "https://example.invalid");

  assert.equal(azureResponse.status, 200);
  assert.equal(azureResponse.headers["access-control-allow-origin"], undefined);

  restoreAllowedOrigins(previousAllowedOrigins);
});

test("Azure Functions handler exposes current app routes", async () => {
  const previousAllowedOrigins = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = pilotWebOrigin;
  const context = {};

  await apiFunction(context, {
    method: "GET",
    url: "https://func-puntoventa-pilot.example/api/me",
    headers: {
      origin: pilotWebOrigin,
      "x-pv-fake-user": "admin",
    },
  });

  const body = JSON.parse(context.res.body);

  assert.equal(context.res.status, 200);
  assert.equal(body.data.userId, 1);
  assert.equal(body.data.displayName, "Admin Demo");
  assert.equal(context.res.headers["access-control-allow-origin"], pilotWebOrigin);

  restoreAllowedOrigins(previousAllowedOrigins);
});
