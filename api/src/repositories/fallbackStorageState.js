export function markSqlAvailable(storageState, repositoryKey) {
  storageState.mode = "sql-local";
  storageState[repositoryKey] = "sql-local";
  storageState.sqlAvailable = true;
  delete storageState.sqlLastError;
}

export function markSqlFallback(storageState, repositoryKey, error) {
  storageState.mode = "fake-fallback";
  storageState[repositoryKey] = "fake";
  storageState.sqlAvailable = false;
  storageState.sqlLastError = sanitizeSqlError(error);
}

function sanitizeSqlError(error) {
  const message = String(error?.message || error || "SQL repository failed.")
    .replace(/Password=[^;\r\n]+/gi, "Password=<redacted>")
    .replace(/Password\":\"[^\"]+/gi, 'Password":"<redacted>')
    .replace(/Server=tcp:[^;\r\n]+/gi, "Server=tcp:<redacted>")
    .slice(0, 220);

  return {
    name: String(error?.name || "Error").slice(0, 80),
    code: error?.code ? String(error.code).slice(0, 80) : null,
    message
  };
}
