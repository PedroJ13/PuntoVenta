import test from "node:test";
import assert from "node:assert/strict";
import { getSqlServerConfig } from "../src/config/sqlServerConfig.js";

test("SQL Server config stays disabled when the feature flag is off", () => {
  const config = getSqlServerConfig({
    SQL_CONNECTION_STRING: "Server=tcp:example.database.windows.net,1433;Initial Catalog=PuntoVenta;User ID=user;Password=secret"
  });

  assert.deepEqual(config, {
    enabled: false,
    reason: "disabled"
  });
});

test("SQL Server config accepts Azure runtime connection string without exposing it", () => {
  const config = getSqlServerConfig({
    PV_SQLSERVER_ENABLED: "true",
    SQL_CONNECTION_STRING: "Server=tcp:example.database.windows.net,1433;Initial Catalog=PuntoVenta;User ID=user;Password=secret"
  });

  assert.equal(config.enabled, true);
  assert.equal(config.hasConnectionString, true);
  assert.equal(JSON.stringify(config).includes("secret"), false);
  assert.equal(JSON.stringify(config).includes("example.database.windows.net"), false);
});

test("SQL Server config keeps local granular environment support", () => {
  const config = getSqlServerConfig({
    PV_SQLSERVER_ENABLED: "true",
    PV_SQLSERVER_HOST: "localhost\\SQLEXPRESS",
    PV_SQLSERVER_DATABASE: "PuntoVentaLocal",
    PV_SQLSERVER_AUTH_MODE: "windows"
  });

  assert.equal(config.enabled, true);
  assert.equal(config.hasConnectionString, false);
  assert.equal(config.host, "localhost\\SQLEXPRESS");
  assert.equal(config.database, "PuntoVentaLocal");
});
