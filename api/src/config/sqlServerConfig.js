export function getSqlServerConfig(env = process.env) {
  const enabled = parseBoolean(env.PV_SQLSERVER_ENABLED);
  const database = trimToNull(env.PV_SQLSERVER_DATABASE);
  const connectionString = trimToNull(env.SQL_CONNECTION_STRING);

  if (!enabled || (!database && !connectionString)) {
    return {
      enabled: false,
      reason: enabled ? "missing_database_or_connection_string" : "disabled"
    };
  }

  return {
    enabled: true,
    hasConnectionString: Boolean(connectionString),
    host: trimToNull(env.PV_SQLSERVER_HOST) || "localhost\\SQLEXPRESS",
    database,
    authMode: trimToNull(env.PV_SQLSERVER_AUTH_MODE) || "windows",
    encrypt: parseBoolean(env.PV_SQLSERVER_ENCRYPT),
    trustCert: env.PV_SQLSERVER_TRUST_CERT === undefined ? true : parseBoolean(env.PV_SQLSERVER_TRUST_CERT),
    companyTaxId: trimToNull(env.PV_SQLSERVER_COMPANY_TAX_ID) || "PV-DEMO-LOCAL"
  };
}

function trimToNull(value) {
  return value && value.trim() ? value.trim() : null;
}

function parseBoolean(value) {
  return value === "true" || value === "1" || value === "yes";
}
