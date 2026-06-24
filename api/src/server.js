import { createServer } from "node:http";
import { createApp } from "./app.js";
import { createConfiguredPuntoVentaRepositories } from "./repositories/configuredPuntoVentaRepositories.js";
import { sendNodeResponse, toWebRequest } from "./http/nodeAdapter.js";

const port = Number.parseInt(process.env.PORT || "7071", 10);
const host = process.env.HOST || "127.0.0.1";

const app = createApp({
  ...createConfiguredPuntoVentaRepositories()
});

const server = createServer(async (nodeRequest, nodeResponse) => {
  if (nodeRequest.method === "OPTIONS") {
    sendCorsPreflight(nodeResponse);
    return;
  }

  const response = await app.handle(await toWebRequest(nodeRequest));
  await sendNodeResponse(nodeResponse, response);
});

server.listen(port, host, () => {
  console.log(`PuntoVenta API listening on http://${host}:${port}/api/health`);
});

function sendCorsPreflight(nodeResponse) {
  nodeResponse.statusCode = 204;
  nodeResponse.setHeader("access-control-allow-origin", "*");
  nodeResponse.setHeader("access-control-allow-methods", "GET,POST,PATCH,DELETE,OPTIONS");
  nodeResponse.setHeader("access-control-allow-headers", "content-type,x-pv-fake-user");
  nodeResponse.setHeader("access-control-max-age", "600");
  nodeResponse.end();
}
