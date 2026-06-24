export async function toWebRequest(nodeRequest) {
  const origin = `http://${nodeRequest.headers.host || "127.0.0.1"}`;
  const url = new URL(nodeRequest.url || "/", origin);
  const chunks = [];

  for await (const chunk of nodeRequest) {
    chunks.push(chunk);
  }

  const body = chunks.length ? Buffer.concat(chunks) : undefined;

  return new Request(url, {
    method: nodeRequest.method,
    headers: nodeRequest.headers,
    body
  });
}

export async function sendNodeResponse(nodeResponse, response) {
  nodeResponse.statusCode = response.status;
  response.headers.forEach((value, key) => nodeResponse.setHeader(key, value));
  nodeResponse.setHeader("access-control-allow-origin", "*");
  nodeResponse.setHeader("access-control-allow-methods", "GET,POST,PATCH,DELETE,OPTIONS");
  nodeResponse.setHeader("access-control-allow-headers", "content-type,x-pv-fake-user");
  nodeResponse.end(Buffer.from(await response.arrayBuffer()));
}
