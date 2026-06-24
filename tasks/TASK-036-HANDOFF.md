# TASK-036 - Handoff

Nombre del equipo/chat: Ejecucion Tecnica
Modo: Backend/API
Nombre de la tarea: Conectar API a SQL local para cuentas abiertas
Archivo de tarea: `tasks/TASK-036.md`

## Nombre de tarea culminada

TASK-036 - Conectar API a SQL local para cuentas abiertas

## Status

exitosa

## Handoff

`tasks/TASK-036-HANDOFF.md`

## Resumen

Se conectaron los endpoints locales de `/api/open-accounts` a SQL Server Express local de forma opcional. El modo fake sigue siendo el default y se mantiene fallback fake cuando SQL no esta configurado o falla.

El repositorio SQL implementa:

- Listado de cuentas abiertas por empresa resuelta server-side con `PV_SQLSERVER_COMPANY_TAX_ID`.
- Detalle de cuenta con lineas.
- Crear cuenta abierta.
- Renombrar y cancelar cuenta.
- Agregar, actualizar y eliminar lineas.
- Actualizacion de totales de cuenta despues de cambios de lineas.
- `markPaid` soportado a nivel repositorio para compatibilidad interna, sin conectar checkout/ventas SQL en esta tarea.

Notas de alcance:

- No se conecto checkout/ventas a SQL.
- No se conecto caja diaria a SQL.
- No se conectaron reportes a SQL.
- `cashShiftId` se persiste en SQL solo si existe un turno SQL abierto compatible; si no, queda `null` para no acoplar esta tarea con caja diaria SQL.
- El usuario operativo SQL se resuelve con los usuarios demo del seed local (`admin.demo@puntoventa.local` o `cajero.demo@puntoventa.local`), no desde IDs fake enviados por cliente.

## Verificacion ejecutada

- `node --check api/src/sql/sqlServerPowerShellClient.js`: OK.
- `node --check api/src/routes/openAccountRoutes.js`: OK.
- `node --check api/src/repositories/sqlOpenAccountRepository.js`: OK.
- `node --check api/src/repositories/fallbackOpenAccountRepository.js`: OK.
- `node --test` desde `api/`: 36 tests, 36 pass.
- Smoke real contra SQL Server Express local con base temporal `PuntoVentaLocal_Task036_OpenAccountsSql_20260622_132022`.
- Migraciones ejecutadas en la base temporal:
  - `database/migrations/20260620_001_initial_mvp_schema.sql`
  - `database/migrations/20260622_002_daily_cash_flow.sql`
- Seed ejecutado:
  - `database/seeds/local/20260622_001_demo_seed.sql`
- Busqueda de secretos en archivos cambiados.
- Confirmacion de no uso de Azure SQL ni recursos Azure.

## Evidencia de tests

```text
tests 36
pass 36
fail 0
```

## Evidencia SQL local

```text
database=PuntoVentaLocal_Task036_OpenAccountsSql_20260622_132022
sql_ok=database/migrations/20260620_001_initial_mvp_schema.sql batches=1
sql_ok=database/migrations/20260622_002_daily_cash_flow.sql batches=3
sql_ok=database/seeds/local/20260622_001_demo_seed.sql batches=1
/api/items?search=latte status=200 sku=LATTE id=2
/api/open-accounts before status=200 total=0
created status=201 id=1 cashShiftId=null
added status=201 lineId=1 total=3600
detail status=200 lines=1
renamed status=200 name=SQL Mostrador Renombrado
updatedLine status=200 quantity=1
removedLine status=200 lines=0
cancelled status=200 accountStatus=cancelled
health status=200 storage=sql-local details={"catalog":"sql-local","openAccounts":"sql-local","sqlConfigured":true,"sqlAvailable":true}
```

## Archivos principales cambiados

- `api/src/sql/sqlServerPowerShellClient.js`
- `api/src/repositories/configuredPuntoVentaRepositories.js`
- `api/src/repositories/fallbackOpenAccountRepository.js`
- `api/src/repositories/sqlOpenAccountRepository.js`
- `api/src/routes/healthRoutes.js`
- `api/src/routes/openAccountRoutes.js`
- `api/test/health.test.js`
- `api/test/openAccounts.test.js`
- `api/README.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-036.md`
- `tasks/TASK-036-HANDOFF.md`

## Resultado por criterio

| Criterio | Resultado |
| --- | --- |
| API puede listar cuentas abiertas desde SQL local cuando esta configurado | Cumple |
| API puede crear/renombrar/cancelar cuentas abiertas en SQL local | Cumple |
| API puede administrar lineas de cuenta abierta en SQL local | Cumple |
| API mantiene fallback fake sin SQL configurado o si SQL falla | Cumple |
| No se guardan connection strings ni secretos reales | Cumple |
| No se conecta Azure SQL | Cumple |
| El handoff indica `Uso Azure SQL: No` | Cumple |

## Uso DB/cloud

- Uso SQL Server Express local: Si, motivo: validacion controlada de CRUD SQL local para cuentas abiertas.
- Base local temporal usada: `PuntoVentaLocal_Task036_OpenAccountsSql_20260622_132022`.
- Uso DB cloud: No.
- Uso Azure SQL: No.
- Recursos Azure creados: No.
- Secretos creados o expuestos en archivos: No.
- Connection strings reales guardadas: No.

## Pendientes o riesgos

- Las bases temporales de smoke quedaron creadas como evidencia local. No se borraron para evitar eliminar artefactos locales sin instruccion explicita.
- El cliente SQL sigue usando PowerShell/.NET para evitar agregar dependencias Node. Si Proyecto autoriza un driver SQL dedicado en el futuro, puede reemplazarse.
- Checkout/ventas SQL queda pendiente para una tarea posterior porque requiere transaccion completa de venta, pagos, cuenta abierta e inventario.
- Caja diaria SQL queda pendiente para una tarea separada.

## Siguiente accion recomendada

Proyecto procesa este handoff y decide la siguiente tarea Backend/API separada para checkout/ventas SQL o caja diaria SQL, manteniendo Azure SQL fuera hasta una autorizacion explicita.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
