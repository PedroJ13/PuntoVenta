# Paquete tecnico para QA SQL local

## Proposito

Consolidar el contexto tecnico para que QA valide la integracion SQL local del MVP sin reconstruir informacion desde multiples handoffs.

Este paquete cubre la integracion local de:

- Catalogo.
- Cuentas abiertas.
- Caja diaria.
- Ventas, checkout y ticket.
- Reportes MVP.
- App Web local consumiendo API con SQL local opcional.

## Estado tecnico entregado

| Area | Estado | Handoff |
| --- | --- | --- |
| Catalogo SQL local | Conectado con fallback fake | `tasks/TASK-035-HANDOFF.md` |
| Cuentas abiertas SQL local | Conectado con fallback fake | `tasks/TASK-036-HANDOFF.md` |
| Caja diaria SQL local | Conectado con fallback fake | `tasks/TASK-037-HANDOFF.md` |
| Ventas/checkout/ticket SQL local | Conectado con fallback fake | `tasks/TASK-038-HANDOFF.md` |
| Reportes MVP SQL local | Conectado con fallback fake | `tasks/TASK-039-HANDOFF.md` |
| App Web estados SQL/fallback | Ajustada | `tasks/TASK-040-HANDOFF.md` |
| Smoke tecnico reproducible | Documentado | `tasks/TASK-041-HANDOFF.md` |

Smoke principal:

```text
docs/SMOKE_LOCAL_APP_API_SQL.md
```

Smoke automatizado recomendado para QA:

```powershell
$env:PV_SMOKE_API_PORT="7074"
$env:PV_SQLSERVER_QUERY_TIMEOUT_MS="45000"
node api/scripts/smoke-sql-local.js
```

El smoke automatizado usa puerto configurable, deja evidencia JSON por fase y permite saltar la validacion Web con `PV_SMOKE_SKIP_WEB=true` si se necesita aislar API/SQL. Para la corrida completa, usar un timeout externo de al menos 240 segundos.

## Setup local para QA

No guardar secretos en el repo.

Configurar variables en la sesion local:

```powershell
$env:PV_SQLSERVER_ENABLED="true"
$env:PV_SQLSERVER_HOST="localhost\SQLEXPRESS"
$env:PV_SQLSERVER_DATABASE="PuntoVentaLocal_Smoke"
$env:PV_SQLSERVER_AUTH_MODE="windows"
$env:PV_SQLSERVER_ENCRYPT="false"
$env:PV_SQLSERVER_TRUST_CERT="true"
$env:PV_SQLSERVER_COMPANY_TAX_ID="PV-DEMO-LOCAL"
```

Aplicar migraciones y seeds locales sobre una base aislada:

- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`
- `database/seeds/local/20260622_001_demo_seed.sql`

Referencia de convenciones:

- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `database/seeds/local/README.md`

## Datos demo esperados

Los seeds locales ficticios incluyen:

- Empresa demo con `tax_id = PV-DEMO-LOCAL`.
- Terminal demo para caja.
- Usuarios demo:
  - `admin.demo@puntoventa.local`
  - `cajero.demo@puntoventa.local`
- Categorias demo.
- Articulos de venta y materia prima.
- Receta activa para producto preparado.

Los IDs exactos pueden variar si QA usa una base reutilizada. Para pruebas repetibles, usar una base nueva por corrida.

## Endpoints principales para QA

### Health y auth

| Metodo | Ruta | Esperado |
| --- | --- | --- |
| GET | `/api/health` | `200`, storage details sin secretos |
| GET | `/api/me` | usuario fake local |

### Catalogo

| Metodo | Ruta | Esperado |
| --- | --- | --- |
| GET | `/api/categories?active=true` | categorias demo SQL |
| GET | `/api/items?active=true` | articulos demo SQL |

### Caja diaria

| Metodo | Ruta | Esperado |
| --- | --- | --- |
| GET | `/api/cash-shifts/current?terminalId=1` | turno abierto o `null` |
| POST | `/api/cash-shifts/open` | abre caja si no hay turno abierto |
| GET | `/api/cash-shifts/{shiftId}` | detalle y resumen de caja |
| POST | `/api/cash-shifts/{shiftId}/movements` | registra ingreso/egreso/ajuste |
| POST | `/api/cash-shifts/{shiftId}/close` | cierra caja si no hay cuentas abiertas |

### Cuentas abiertas

| Metodo | Ruta | Esperado |
| --- | --- | --- |
| GET | `/api/open-accounts` | lista cuentas SQL |
| POST | `/api/open-accounts` | crea cuenta asociada a caja |
| GET | `/api/open-accounts/{accountId}` | detalle con lineas |
| PATCH | `/api/open-accounts/{accountId}` | renombra o cancela |
| POST | `/api/open-accounts/{accountId}/lines` | agrega linea |
| PATCH | `/api/open-accounts/{accountId}/lines/{lineId}` | cambia cantidad/precio/descuento |
| DELETE | `/api/open-accounts/{accountId}/lines/{lineId}` | elimina linea |

### Ventas, checkout y ticket

| Metodo | Ruta | Esperado |
| --- | --- | --- |
| POST | `/api/sales/checkout` | cobra venta rapida o cuenta abierta |
| GET | `/api/sales/{saleId}/ticket` | ticket interno imprimible |

Errores esperados:

- Sin caja abierta: `409 SHIFT_REQUIRED`.
- Stock insuficiente: `409 INSUFFICIENT_STOCK`.
- Pagos no calzan: `400 VALIDATION_ERROR`.
- Cuenta inexistente/cerrada: `404 NOT_FOUND` o `409 INVALID_STATE`.

### Reportes MVP

| Metodo | Ruta | Esperado |
| --- | --- | --- |
| GET | `/api/reports/sales-summary` | conteo y totales |
| GET | `/api/reports/sales-by-item` | ventas por articulo |
| GET | `/api/reports/top-items?limit=5` | ranking de articulos |
| GET | `/api/reports/low-stock` | articulos bajo minimo |
| GET | `/api/reports/cash-shift/{shiftId}` | resumen de caja |

## Flujos sugeridos para QA

1. Health y storage:
   - Confirmar `sqlConfigured=true`.
   - Usar catalogo/caja/cuentas/ventas/reportes.
   - Confirmar que `storageDetails` termina con areas en `sql-local`.

2. Caja diaria:
   - Consultar caja actual.
   - Abrir caja si no hay caja abierta.
   - Registrar movimiento manual.
   - Confirmar efectivo esperado.

3. Cuenta abierta:
   - Crear cuenta.
   - Agregar producto.
   - Cambiar cantidad.
   - Cobrar cuenta.
   - Confirmar que la cuenta queda pagada/cerrada.

4. Venta rapida:
   - Cobrar con `lines` directas en `/api/sales/checkout`.
   - Confirmar ticket.

5. Reportes:
   - Validar que resumen y ventas por articulo reflejen ventas creadas.
   - Validar reporte de caja del turno usado.

6. Web:
   - Levantar `app/`.
   - Confirmar badge `API SQL local` o areas `SQL local`.
   - Crear/cobrar cuenta desde UI.
   - Actualizar reportes.

## Evidencia tecnica disponible

Smoke local ejecutado durante el lote TASK-038 a TASK-041:

```text
connected=true cash=open cashStorage=SQL local reportsStorage=SQL local
ticket=PV-0000004 total=1800 accounts=0
reportsMode=sql-local sales=4 total=7200
healthCash=sql-local healthSales=sql-local healthReports=sql-local
```

Tests automatizados API:

```text
node --test
43 tests pasan
```

## Limitaciones conocidas

- No hay validacion QA formal en este paquete.
- No cubre deploy ni ambiente publicado.
- No cubre Azure SQL.
- No cubre CORS productivo.
- No cubre autenticacion real; se usa auth fake local.
- La base temporal puede acumular ventas de prueba si se reutiliza.
- La app estatica depende de que QA levante API y configure `pvApiBaseUrl` si usa un puerto distinto.
- Si SQL falla tecnicamente, la API vuelve a fallback fake por diseno; QA debe observar `storageDetails` para distinguir modo.

## Seguridad

- Uso Azure SQL: No.
- Recursos Azure creados: No.
- Secretos en repo: No.
- Connection strings reales en repo: No.
- Datos reales de clientes: No.

## Siguiente accion

Proyecto puede crear/liberar una tarea de QA para validar este paquete contra SQL Server Express local.
