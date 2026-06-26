# TASK-075 - Handoff

Equipo:
Ejecucion Tecnica

Modo de ejecucion:
Backend/API

Tarea completada:
TASK-075 - Conectar API pilot a Azure SQL con smoke controlado

Archivos cambiados:
- `api/README.md`
- `api/package.json`
- `api/package-lock.json`
- `api/src/config/sqlServerConfig.js`
- `api/src/repositories/configuredPuntoVentaRepositories.js`
- `api/src/repositories/fallbackStorageState.js`
- `api/src/repositories/fallbackCatalogRepository.js`
- `api/src/repositories/fallbackCashShiftRepository.js`
- `api/src/repositories/fallbackOpenAccountRepository.js`
- `api/src/repositories/fallbackReportRepository.js`
- `api/src/repositories/fallbackSalesRepository.js`
- `api/src/routes/healthRoutes.js`
- `api/src/sql/sqlServerNodeClient.js`
- `api/src/sql/sqlServerPowerShellClient.js`
- `api/test/sqlServerConfig.test.js`
- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`
- `database/seeds/local/20260622_001_demo_seed.sql`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-075.md`
- `tasks/TASK-075-HANDOFF.md`

Verificacion ejecutada:
- `npm run check` en `api/` antes de deploy.
- `sqlcmd` contra Azure SQL para aplicar migraciones, seed y validar conteos.
- `az functionapp config appsettings set/list` con salida filtrada sin secretos.
- `az sql server firewall-rule list/create/delete` para acceso controlado.
- `az lock delete/create/list` para retirar temporalmente el lock solo al limpiar reglas temporales y restaurarlo.
- `git push origin main` para disparar GitHub Actions.
- GitHub Actions `PuntoVenta API Pilot`:
  - Run `28208741129`: success, commit `f03d1668f6765f35f8784c3779267826c35f62be`.
  - Run `28209778492`: success, commit `733cde3b38ffc7941e44f30bb2b54ce9bac2a17e`.
- Smoke HTTP publicado contra `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api`.

Resultado:
API pilot quedo conectada a Azure SQL con persistencia real habilitada y smoke tecnico publicado aprobado.

Recursos usados:
- Resource group: `rg-puntoventa-pilot-eastus2`
- Function App: `func-puntoventa-pilot-eastus2`
- API base URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api`
- SQL Server: `sqlserver-puntoventa-pilot-brazilsouth`
- SQL Database: `sqldb-puntoventa-pilot`
- Region SQL: `brazilsouth`

Cambios tecnicos relevantes:
- Se agrego cliente SQL Node (`mssql`) para runtime cloud/Azure Functions.
- Se conserva cliente PowerShell para SQL local con Windows Integrated Auth.
- La API selecciona cliente Node cuando usa `SQL_CONNECTION_STRING` o `PV_SQLSERVER_AUTH_MODE=sql`.
- `GET /api/health` puede exponer `storageDetails.sqlLastError` sanitizado solo cuando hay fallback SQL; no incluye passwords ni connection strings.
- Migraciones/seed agregaron `SET ANSI_NULLS ON` y `SET QUOTED_IDENTIFIER ON` para compatibilidad Azure SQL con indices filtrados.

Migraciones y seed ejecutados:
- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`
- `database/seeds/local/20260622_001_demo_seed.sql`

Conteos post-seed:
- Empresas: 1
- Terminales: 1
- Usuarios: 2
- Categorias: 4
- Items: 7
- Recetas: 2

App settings:
- `PV_SQLSERVER_ENABLED=true`.
- `SQL_CONNECTION_STRING` existe en Function App, sin exponer valor.
- Variables `PV_SQLSERVER_*` configuradas en runtime sin exponer password.

Firewall y locks:
- Se creo una regla temporal local para migracion/smoke tecnico y se retiro.
- Se expandieron reglas permanentes a las 32 `possibleOutboundIpAddresses` de la Function App, porque Azure uso una IP posible no incluida inicialmente.
- Verificacion final: `missingCount=0`, `tempRules=[]`.
- Locks restaurados/confirmados:
  - `lock-puntoventa-sqlserver-pilot-cannotdelete`
  - `lock-puntoventa-sqldb-pilot-cannotdelete`

Smoke publicado aprobado:
- Health final:
  - `storage=sql-local`
  - `sqlConfigured=true`
  - `sqlAvailable=true`
  - `catalog=sql-local`
  - `cashShifts=sql-local`
  - `sales=sql-local`
  - `reports=sql-local`
  - `sqlLastError` ausente
- Catalogo:
  - Categorias: 4
  - Items: 7
- Caja/venta/ticket/reportes:
  - `cashShiftId=1`
  - Item usado: `LATTE`
  - `saleId=1`
  - `ticketNumber=PV-0000001`
  - `saleTotal=1800`
  - `salesSummaryTotal=1800`
  - `salesByItemCount=1`
  - `topItemsCount=1`
  - `cashReportExpected=31800`

Uso DB cloud:
Si.
Motivo: conexion real de API pilot a Azure SQL autorizada por `TASK-075`.
Alcance: migraciones aprobadas, seed ficticio, usuario runtime, app settings, firewall controlado y smoke publicado. No se usaron datos reales.

Rollback:
- Para volver a storage fake/fallback sin borrar datos:
  - `az functionapp config appsettings set --resource-group rg-puntoventa-pilot-eastus2 --name func-puntoventa-pilot-eastus2 --settings PV_SQLSERVER_ENABLED=false`
- Mantener `SQL_CONNECTION_STRING` y variables `PV_SQLSERVER_*` sin exponer valores para reactivar luego.
- No borrar Azure SQL ni tablas sin tarea explicita, respaldo y decision documentada.

Riesgos o pendientes:
- La DB pilot contiene datos ficticios y ventas de smoke; no usar para datos reales sin QA/PO.
- Firewall depende de `possibleOutboundIpAddresses`; si cambia el plan/app o Azure rota IPs fuera de esa lista, revisar reglas.
- `sqlLastError` en health es diagnostico sanitizado; puede conservarse para pilot o retirarse en hardening futuro.
- `TASK-076` puede pasar a QA si Proyecto acepta este handoff.

Siguiente recomendado:
Proyecto procesa este handoff. Si se acepta, mover `TASK-075` a Done y liberar `TASK-076` para QA publicado Web/API con persistencia Azure SQL.
