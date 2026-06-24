# TASK-044 - Handoff

Equipo:
Ejecucion Tecnica

Modo de ejecucion:
Backend/API

Tarea completada:
TASK-044 - Diagnosticar timeout de smoke SQL local QA

Archivo de tarea:
`tasks/TASK-044.md`

Status:
exitosa

Handoff:
`tasks/TASK-044-HANDOFF.md`

## Resumen

Se diagnostico el bloqueo de `TASK-043` y se dejo un smoke SQL local reproducible con puerto configurable, logs por fase y timeout explicito para queries SQL locales.

Causa probable:

- `7071` ya estaba ocupado durante QA, por lo que el primer smoke no pudo iniciar en el puerto por defecto.
- El smoke anterior era monolitico y el cliente SQL local arranca `powershell.exe` por query; en este ambiente una query minima tarda aprox. `2737ms`.
- La corrida completa con API, reportes y modulos Web tarda mas de `120s`; el nuevo smoke completo tardo aprox. `156s`, por eso el timeout externo de QA corto la ejecucion antes de recibir evidencia final.

## Archivos cambiados

- `api/src/sql/sqlServerPowerShellClient.js`
- `api/scripts/smoke-sql-local.js`
- `api/package.json`
- `docs/SMOKE_LOCAL_APP_API_SQL.md`
- `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-044.md`
- `tasks/TASK-044-HANDOFF.md`

## Cambios realizados

- Se agrego timeout configurable al proceso PowerShell del cliente SQL local:
  - Variable: `PV_SQLSERVER_QUERY_TIMEOUT_MS`
  - Default: `30000`
  - Error nuevo: `SQL local query timed out after <ms>ms.`
- Se agrego script `api/scripts/smoke-sql-local.js`.
- Se agrego script npm `smoke:sql-local`.
- El smoke nuevo:
  - usa puerto configurable con `PV_SMOKE_API_PORT`
  - falla claro si el puerto esta ocupado
  - escribe una linea JSON por fase
  - valida health, catalogo, caja, venta rapida, cuenta abierta, ticket, reportes, modulos Web y health final
  - confirma que `health` no exponga host, base ni password
  - permite aislar API/SQL con `PV_SMOKE_SKIP_WEB=true`
- Se documento el comando en `docs/SMOKE_LOCAL_APP_API_SQL.md` y `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`.

## Verificacion ejecutada

- `node --check api/src/sql/sqlServerPowerShellClient.js`
- `node --check api/scripts/smoke-sql-local.js`
- `node --test` en `api/`: 43 tests pasan.
- Query minima con cliente SQL local contra `PuntoVentaLocal_QA043_20260622_162803`:
  - `SELECT TOP (1) name FROM sys.tables ORDER BY name`
  - Resultado: `ms=2737`, tabla `cash_movements`
- Smoke SQL local corregido:

```powershell
$env:PV_SQLSERVER_ENABLED='true'
$env:PV_SQLSERVER_HOST='localhost\SQLEXPRESS'
$env:PV_SQLSERVER_DATABASE='PuntoVentaLocal_QA043_20260622_162803'
$env:PV_SQLSERVER_AUTH_MODE='windows'
$env:PV_SQLSERVER_ENCRYPT='false'
$env:PV_SQLSERVER_TRUST_CERT='true'
$env:PV_SQLSERVER_COMPANY_TAX_ID='PV-DEMO-LOCAL'
$env:PV_SMOKE_API_PORT='7074'
$env:PV_SQLSERVER_QUERY_TIMEOUT_MS='45000'
node api/scripts/smoke-sql-local.js
```

Resultado observado:

```text
server ok: http://127.0.0.1:7074/api/health
health-initial ok: sqlConfigured=true
catalog ok: categories=4 items=7 saleItem=Queque chocolate
cash-shift ok: cashShiftId=1 expectedCashAmount=35400
quick-sale-ticket ok: saleId=4 ticket=PV-0000004 total=1500
open-account-sale-ticket ok: accountId=2 saleId=5 ticket=PV-0000005 total=1500
reports ok: salesCount=5 totalAmount=8400 cashExpected=38400
web-modules ok: cashStatus="SQL local - Abierta" reportStatus="SQL local"
health-final ok: catalog/openAccounts/cashShifts/sales/reports = sql-local
```

- Verificacion de puerto temporal:
  - `7074` quedo libre al finalizar.
- Busqueda local de secretos en archivos cambiados:
  - Sin passwords, tokens, AccountKey ni connection strings reales.
  - Solo menciones documentales y codigo de saneado/redaccion.

## Resultado por criterio

| Criterio | Resultado |
| --- | --- |
| Causa probable del timeout identificada | Cumple |
| Comando reproducible en puerto configurable | Cumple |
| Evidencia por fase del smoke | Cumple |
| `storageDetails=sql-local` confirmado para catalogo, cuentas, caja, ventas y reportes | Cumple |
| Fallback fake y contrato API existentes preservados | Cumple |
| Sin secretos reales guardados | Cumple |
| Sin Azure SQL | Cumple |

## Uso DB cloud

No.

## Uso Azure SQL

No.

## Recursos Azure creados

No.

## Riesgos o pendientes

- El smoke completo puede tardar mas de `120s` en este ambiente por el costo de levantar PowerShell/.NET por cada query SQL local. Para QA usar timeout externo de al menos `240s`.
- Para diagnostico rapido, QA puede ejecutar con `PV_SMOKE_SKIP_WEB=true` para aislar solo API/SQL.
- La base temporal `PuntoVentaLocal_QA043_20260622_162803` acumulo ventas de prueba; para corrida limpia usar una base nueva con migraciones/seeds.

## Siguiente recomendado

Proyecto puede procesar este handoff y liberar reintento de `TASK-043` usando:

```powershell
$env:PV_SMOKE_API_PORT="7074"
$env:PV_SQLSERVER_QUERY_TIMEOUT_MS="45000"
node api/scripts/smoke-sql-local.js
```

## Movimiento de tablero

- De: In Progress
- A: Needs Review
