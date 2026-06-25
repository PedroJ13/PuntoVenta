const baseCorsHeaders = {
  "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "access-control-allow-headers": "content-type,x-pv-fake-user",
  vary: "Origin",
};

export function toWebRequestFromAzureFunction(req) {
  const method = req.method || "GET";
  const headers = new Headers(req.headers || {});
  const body =
    method === "GET" || method === "HEAD" ? undefined : getAzureRequestBody(req, headers);

  return new Request(req.url || "http://localhost/api/health", {
    method,
    headers,
    body,
  });
}

export async function toAzureFunctionResponse(response, requestOrigin = "") {
  const headers = Object.fromEntries(response.headers.entries());

  return {
    status: response.status,
    headers: {
      ...headers,
      ...getCorsHeaders(requestOrigin),
    },
    body: await response.text(),
  };
}

export function corsPreflightAzureResponse(requestOrigin = "") {
  return {
    status: 204,
    headers: {
      ...getCorsHeaders(requestOrigin),
      "access-control-max-age": "600",
    },
    body: "",
  };
}

function getCorsHeaders(requestOrigin) {
  const allowedOrigin = getAllowedOrigin(requestOrigin);
  const headers = { ...baseCorsHeaders };

  if (allowedOrigin) {
    headers["access-control-allow-origin"] = allowedOrigin;
  }

  return headers;
}

function getAllowedOrigin(requestOrigin) {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins.length === 0) {
    return "*";
  }

  if (!requestOrigin) {
    return configuredOrigins[0];
  }

  return configuredOrigins.includes(requestOrigin) ? requestOrigin : "";
}

function getAzureRequestBody(req, headers) {
  if (req.rawBody !== undefined && req.rawBody !== null) {
    return req.rawBody;
  }

  if (req.body === undefined || req.body === null) {
    return undefined;
  }

  if (typeof req.body === "string" || req.body instanceof Uint8Array) {
    return req.body;
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return JSON.stringify(req.body);
}
