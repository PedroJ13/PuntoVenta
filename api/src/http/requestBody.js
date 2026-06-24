import { httpError } from "../auth/fakeAuth.js";

export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw httpError("VALIDATION_ERROR", "Request body must be valid JSON.", 400, [
      { field: "body", message: "Invalid JSON." }
    ]);
  }
}
