# TASK-037 - Handoff

Nombre del equipo/chat: Ejecucion Tecnica
Modo: Backend/API
Nombre de la tarea: Conectar API a SQL local para caja diaria
Archivo de tarea: `tasks/TASK-037.md`

## Nombre de tarea culminada

TASK-037 - Conectar API a SQL local para caja diaria

## Status

exitosa

## Handoff

`tasks/TASK-037-HANDOFF.md`

## Resumen

Se conectaron los endpoints locales de `/api/cash-shifts` a SQL Server Express local de forma opcional. El modo fake sigue siendo el default y se mantiene fallback fake cuando SQL no esta configurado o falla.

El repositorio SQL implementa:

- Consulta de turno actual por empresa/terminal.
- Detalle/resumen de turno.
- Apertura de caja diaria.
- Movimientos manuales `cash_in`, `cash_out` y `cash_adjustment`.
- Cierre de caja con efectivo esperado, contado, diferencia y nota requerida cuando hay diferencia.
- Bloqueo de cierre cuando existen cuentas abiertas SQL asociadas al turno.
- Resumen por metodo de pago leyendo ventas/pagos SQL si existen, sin conectar checkout/ventas SQL en esta tarea.

Notas de alcance:

- No se conecto checkout/ventas a SQL.
- No se conectaron reportes a SQL.
- No se modifico UI Web.
- La empresa se resuelve server-side con `PV_SQLSERVER_COMPANY_TAX_ID`.
- El usuario operativo SQL se resuelve con usuarios demo del seed local (`admin.demo@puntoventa.local` o `cajero.demo@puntoventa.local`), no desde IDs fake enviados por cliente.
- `GET /api/health` ahora reporta `storageDetails.cashShifts` sin exponer host, base, usuario, password ni connection string.

## Verificacion ejecutada

- `node --check api/src/repositories/sqlCashShiftRepository.js`: OK.
- `node --check api/src/repositories/fallbackCashShiftRepository.js`: OK.
- `node --check api/src/repositories/configuredPuntoVentaRepositories.js`: OK.
- `node --test` desde `api/`: 39 tests, 39 pass.
- Smoke real contra SQL Server Express local con base temporal `PuntoVentaLocal_Task037_CashShiftSql_20260622_135359`.
- Migraciones ejecutadas en la base temporal:
  - `database/migrations/20260620_001_initial_mvp_schema.sql`
  - `database/migrations/20260622_002_daily_cash_flow.sql`
- Seed ejecutado:
  - `database/seeds/local/20260622_001_demo_seed.sql`
- Busqueda de secretos en archivos cambiados.
- Confirmacion de no uso de Azure SQL ni recursos Azure.

## Evidencia de tests

```text
tests 39
pass 39
fail 0
```

## Evidencia SQL local

```text
database=PuntoVentaLocal_Task037_CashShiftSql_20260622_135359
sql_ok=database/migrations/20260620_001_initial_mvp_schema.sql batches=1
sql_ok=database/migrations/20260622_002_daily_cash_flow.sql batches=3
sql_ok=database/seeds/local/20260622_001_demo_seed.sql batches=1
current-before status=200 data=null
opened status=201 shiftId=1 expected=20000
current status=200 shiftId=1
account status=201 id=1 cashShiftId=1
blockedClose status=409 code=INVALID_STATE
cancelAccount status=200 accountStatus=cancelled
movement status=201 signed=-1500
afterMovement status=200 expected=18500 movements=1
missingNote status=400 code=VALIDATION_ERROR
closed status=200 shiftStatus=closed expected=18500 counted=18500 diff=0
health status=200 storage=sql-local details={"catalog":"fake","openAccounts":"sql-local","cashShifts":"sql-local","sqlConfigured":true,"sqlAvailable":true}
```

## Archivos principales cambiados

- `api/src/repositories/configuredPuntoVentaRepositories.js`
- `api/src/repositories/fallbackCashShiftRepository.js`
- `api/src/repositories/sqlCashShiftRepository.js`
- `api/src/routes/healthRoutes.js`
- `api/test/cashShifts.test.js`
- `api/test/health.test.js`
- `api/README.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-037.md`
- `tasks/TASK-037-HANDOFF.md`

## Resultado por criterio

| Criterio | Resultado |
| --- | --- |
| API puede consultar caja diaria desde SQL local cuando esta configurado | Cumple |
| API puede abrir caja diaria en SQL local | Cumple |
| API puede registrar movimientos manuales en SQL local | Cumple |
| API puede cerrar caja diaria en SQL local con arqueo/diferencia | Cumple |
| API mantiene fallback fake sin SQL configurado o si SQL falla | Cumple |
| No se guardan connection strings ni secretos reales | Cumple |
| No se conecta Azure SQL | Cumple |
| El handoff indica `Uso Azure SQL: No` | Cumple |

## Uso DB/cloud

- Uso SQL Server Express local: Si, motivo: validacion controlada de caja diaria SQL local.
- Base local temporal usada: `PuntoVentaLocal_Task037_CashShiftSql_20260622_135359`.
- Uso DB cloud: No.
- Uso Azure SQL: No.
- Recursos Azure creados: No.
- Secretos creados o expuestos en archivos: No.
- Connection strings reales guardadas: No.

## Pendientes o riesgos

- Las bases temporales de smoke quedaron creadas como evidencia local. No se borraron para evitar eliminar artefactos locales sin instruccion explicita.
- Checkout/ventas SQL queda pendiente para una tarea posterior porque requiere transaccion completa de venta, pagos, cuenta abierta, caja e inventario.
- Reportes SQL siguen fuera de alcance y pendientes de tarea separada.
- El cliente SQL sigue usando PowerShell/.NET para evitar agregar dependencias Node. Si Proyecto autoriza un driver SQL dedicado en el futuro, puede reemplazarse.

## Siguiente accion recomendada

Proyecto procesa este handoff y decide la siguiente tarea Backend/API separada para checkout/ventas SQL. Mantener Azure SQL fuera hasta una autorizacion explicita.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
