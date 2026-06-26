import sql from "mssql";

export function createSqlServerNodeClient({ config, env = process.env } = {}) {
  return {
    async query(query, params = []) {
      const pool = new sql.ConnectionPool(createConnectionConfig({ config, env }));
      await pool.connect();
      try {
        const request = pool.request();
        request.timeout = normalizeTimeout(env.PV_SQLSERVER_QUERY_TIMEOUT_MS);

        for (const parameter of params) {
          request.input(parameter.name, parameter.value ?? null);
        }

        const result = await request.query(query);
        return result.recordset ?? [];
      } finally {
        await pool.close();
      }
    }
  };
}

function createConnectionConfig({ config, env }) {
  const connectionString = trimToNull(env.SQL_CONNECTION_STRING);
  if (connectionString) {
    return connectionString;
  }

  const { server, port } = parseSqlServerHost(config.host);
  return {
    server,
    port,
    database: config.database,
    user: trimToNull(env.PV_SQLSERVER_USER),
    password: trimToNull(env.PV_SQLSERVER_PASSWORD),
    options: {
      encrypt: Boolean(config.encrypt),
      trustServerCertificate: Boolean(config.trustCert)
    },
    connectionTimeout: normalizeTimeout(env.PV_SQLSERVER_QUERY_TIMEOUT_MS),
    requestTimeout: normalizeTimeout(env.PV_SQLSERVER_QUERY_TIMEOUT_MS)
  };
}

function parseSqlServerHost(host) {
  const normalized = host.replace(/^tcp:/i, "");
  const match = normalized.match(/^(.*),(\d+)$/);
  if (!match) {
    return { server: normalized };
  }

  return {
    server: match[1],
    port: Number.parseInt(match[2], 10)
  };
}

function normalizeTimeout(value) {
  const parsed = Number.parseInt(value || "30000", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30000;
}

function trimToNull(value) {
  return value && value.trim() ? value.trim() : null;
}
