# TASK-035 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea completada: Conectar API a SQL local para catalogo
Archivo de tarea: `tasks/TASK-035.md`
Estado entregado: Needs Review

## Resultado

Status: exitosa

Se conecto de forma opcional la API local a SQL Server Express para lectura de catalogo (`GET /api/categories` y `GET /api/items`). El modo fake sigue siendo el default y se mantiene fallback fake si SQL no esta configurado o no esta disponible. No se conectaron ventas, caja diaria ni cuentas abiertas a SQL.

## Archivos cambiados

- `api/src/app.js`
- `api/src/server.js`
- `api/src/routes/healthRoutes.js`
- `api/src/config/sqlServerConfig.js`
- `api/src/sql/sqlServerPowerShellClient.js`
- `api/src/repositories/configuredPuntoVentaRepositories.js`
- `api/src/repositories/fallbackCatalogRepository.js`
- `api/src/repositories/sqlCatalogRepository.js`
- `api/test/catalog.test.js`
- `api/test/health.test.js`
- `api/README.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-035.md`
- `tasks/TASK-035-HANDOFF.md`

## Implementacion

- Se agrego configuracion local por variables de entorno:
  - `PV_SQLSERVER_ENABLED`
  - `PV_SQLSERVER_HOST`
  - `PV_SQLSERVER_DATABASE`
  - `PV_SQLSERVER_AUTH_MODE`
  - `PV_SQLSERVER_ENCRYPT`
  - `PV_SQLSERVER_TRUST_CERT`
  - `PV_SQLSERVER_COMPANY_TAX_ID`
- Se agrego cliente SQL local opcional usando PowerShell/.NET (`System.Data.SqlClient`) para conservar el runtime Node sin dependencias externas.
- Se agrego repositorio SQL de catalogo solo lectura.
- Se agrego fallback de catalogo: intenta SQL si esta configurado; si falla, responde con fake.
- Se actualizo `GET /api/health` para reportar:
  - `storage`
  - `storageDetails.catalog`
  - `storageDetails.sqlConfigured`
  - `storageDetails.sqlAvailable`
- `GET /api/health` no expone host, base, usuario, password ni connection string.

## Verificacion ejecutada

- Lectura de `AGENTS.md`.
- Lectura de `chat-start/EJECUCION_TECNICA.md`.
- Lectura de `docs/README.md`.
- Lectura de `docs/MVP_RELEASE_STATUS.md`.
- Lectura de `docs/TASK_BOARD.md`.
- Lectura de `docs/API_CONTRACTS.md`.
- Lectura de `docs/SQL_SERVER_EXPRESS_LOCAL.md`.
- Lectura de `tasks/TASK-033-HANDOFF.md`.
- Lectura de `tasks/TASK-034-HANDOFF.md`.
- Lectura de `database/seeds/local/README.md`.
- Lectura de `api/README.md`.
- `node --check` en archivos JS nuevos/modificados.
- `node --test` en `api/`: 34 tests, 34 pass.
- Prueba real contra SQL Server Express local en base temporal.
- Busqueda de secretos y connection strings reales en archivos cambiados.

## Evidencia de tests

```text
tests 34
pass 34
fail 0
```

## Evidencia SQL local

Base temporal usada:

```text
PuntoVentaLocal_Task035_ApiSql_20260622_123940
```

Preparacion:

```text
sql_ok=database/migrations/20260620_001_initial_mvp_schema.sql batches=1
sql_ok=database/migrations/20260622_002_daily_cash_flow.sql batches=3
sql_ok=database/seeds/local/20260622_001_demo_seed.sql batches=1
```

Lectura API contra SQL:

```text
/api/categories status=200 total=4
categoryNames=Bebidas calientes|Bebidas frias|Reposteria|Insumos
/api/items?type=prepared_product&search=latte status=200 total=1
itemSkus=LATTE
/api/health status=200 storage=sql-local
healthDetails={"catalog":"sql-local","sqlConfigured":true,"sqlAvailable":true}
```

## Resultado por criterio

| Criterio | Resultado |
| --- | --- |
| API puede leer categorias desde SQL local cuando esta configurado | Cumple |
| API puede leer articulos desde SQL local cuando esta configurado | Cumple |
| API mantiene fallback fake sin SQL configurado | Cumple |
| `GET /api/health` indica modo sin exponer secretos | Cumple |
| No se guardan connection strings ni secretos reales | Cumple |
| No se conecta Azure SQL | Cumple |
| El handoff indica `Uso Azure SQL: No` | Cumple |

## Uso DB/cloud

- Uso SQL Server Express local: Si, motivo: validacion controlada de lectura de catalogo SQL.
- Base local temporal usada: `PuntoVentaLocal_Task035_ApiSql_20260622_123940`.
- Uso DB cloud: No.
- Uso Azure SQL: No.
- Recursos Azure creados: No.
- Secretos creados o expuestos en archivos: No.
- Connection strings reales guardadas: No.

## Riesgos o pendientes

- El cliente SQL usa PowerShell/.NET para evitar instalar dependencias Node. Si Proyecto decide agregar driver `mssql` en una tarea futura, este adaptador puede reemplazarse.
- La base temporal de validacion quedo creada como evidencia; no se borro para evitar eliminar artefactos locales sin instruccion explicita.
- Solo catalogo esta conectado a SQL. Ventas, caja diaria, cuentas abiertas, reportes e inventario operativo siguen en fake local.

## Siguiente recomendado

Proyecto puede procesar este handoff. El siguiente paso tecnico puede ser conectar cuentas abiertas o caja diaria a SQL local en una tarea separada, manteniendo ventas/checkout atomico para una tarea posterior mas controlada.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
