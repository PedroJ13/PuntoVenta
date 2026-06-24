import { createApp } from "../src/app.js";
import { createFakePuntoVentaRepositories } from "../src/repositories/fakePuntoVentaRepositories.js";

export function createTestApp() {
  return createApp({
    repositories: createFakePuntoVentaRepositories()
  });
}

export async function jsonRequest(app, path, { method = "GET", body, user = "cashier" } = {}) {
  const response = await app.handle(
    new Request(`http://local.test${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        "x-pv-fake-user": user
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    })
  );
  return { response, body: await response.json() };
}
