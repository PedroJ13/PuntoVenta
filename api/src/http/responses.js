export function jsonResponse(payload, { status = 200 } = {}) {
  return Response.json(payload, {
    status,
    headers: {
      "cache-control": "no-store"
    }
  });
}

export function dataResponse(data, options) {
  return jsonResponse({ data }, options);
}

export function listResponse(data, { limit, offset, total } = {}) {
  return jsonResponse({
    data,
    pagination: {
      limit,
      offset,
      total
    }
  });
}

export function notFoundResponse(message = "Resource not found.") {
  return jsonResponse(
    {
      error: {
        code: "NOT_FOUND",
        message,
        details: []
      }
    },
    { status: 404 }
  );
}
