# Smoke tecnico local app/API/SQL

## Proposito

Validar de forma reproducible el recorrido tecnico principal del MVP usando:

- SQL Server Express local.
- API local `api/`.
- App estatica local `app/`.
- Datos ficticios de seeds locales.

Este smoke no usa Azure SQL, no crea recursos Azure y no guarda secretos en archivos.

## Precondiciones

- SQL Server Express o Developer local disponible.
- Migraciones MVP aplicadas sobre una base local aislada:
  - `database/migrations/20260620_001_initial_mvp_schema.sql`
  - `database/migrations/20260622_002_daily_cash_flow.sql`
- Seeds locales ficticios aplicados:
  - `database/seeds/local/20260622_001_demo_seed.sql`
- Empresa demo disponible con `tax_id = PV-DEMO-LOCAL`.

Base sugerida para smoke:

```text
PuntoVentaLocal_Smoke
```

Tambien se puede usar una base temporal por corrida, por ejemplo:

```text
PuntoVentaLocal_Smoke_YYYYMMDD_HHMMSS
```

## Variables de entorno locales

Configurar en la sesion local, no en archivos versionados:

```powershell
$env:PV_SQLSERVER_ENABLED="true"
$env:PV_SQLSERVER_HOST="localhost\SQLEXPRESS"
$env:PV_SQLSERVER_DATABASE="PuntoVentaLocal_Smoke"
$env:PV_SQLSERVER_AUTH_MODE="windows"
$env:PV_SQLSERVER_ENCRYPT="false"
$env:PV_SQLSERVER_TRUST_CERT="true"
$env:PV_SQLSERVER_COMPANY_TAX_ID="PV-DEMO-LOCAL"
```

Si se usa autenticacion SQL local, definir usuario/password solo en la sesion o secret manager local. No guardar `PV_SQLSERVER_USER`, `PV_SQLSERVER_PASSWORD` ni connection strings reales en el repo.

## Levantar API local

Desde `api/`:

```powershell
node src/server.js
```

Verificar:

```powershell
curl.exe http://127.0.0.1:7071/api/health
```

Resultado esperado:

- HTTP `200`.
- `storageDetails.sqlConfigured = true`.
- Los modulos van cambiando a `sql-local` despues de usarse.
- No se exponen host, base, usuario ni password.

## Smoke automatizado por fases

Para evitar dependencias rigidas del puerto `7071` y diagnosticar mejor cualquier timeout, tambien se puede ejecutar el smoke automatizado:

```powershell
$env:PV_SQLSERVER_ENABLED="true"
$env:PV_SQLSERVER_HOST="localhost\SQLEXPRESS"
$env:PV_SQLSERVER_DATABASE="PuntoVentaLocal_Smoke"
$env:PV_SQLSERVER_AUTH_MODE="windows"
$env:PV_SQLSERVER_ENCRYPT="false"
$env:PV_SQLSERVER_TRUST_CERT="true"
$env:PV_SQLSERVER_COMPANY_TAX_ID="PV-DEMO-LOCAL"
$env:PV_SMOKE_API_PORT="7074"
$env:PV_SQLSERVER_QUERY_TIMEOUT_MS="45000"

node api/scripts/smoke-sql-local.js
```

El script inicia una API temporal en `PV_SMOKE_API_PORT`, ejecuta fases separadas y escribe una linea JSON por fase:

- `health-initial`
- `catalog`
- `cash-shift`
- `quick-sale-ticket`
- `open-account-sale-ticket`
- `reports`
- `web-modules`
- `health-final`

Si `7071` esta ocupado, usar `PV_SMOKE_API_PORT` con un puerto libre. En este entorno el smoke completo puede tardar mas de 120 segundos porque el cliente SQL local usa PowerShell/.NET por consulta; usar un timeout externo de al menos 240 segundos para la corrida completa.

Para aislar API/SQL sin validar modulos Web:

```powershell
$env:PV_SMOKE_SKIP_WEB="true"
node api/scripts/smoke-sql-local.js
```

## Levantar app local

Desde `app/`:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:5173/
```

Si la API usa otro puerto:

```js
localStorage.setItem("pvApiBaseUrl", "http://127.0.0.1:7071")
```

## Flujo HTTP minimo

Usar usuario admin fake para operaciones administrativas:

```powershell
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/categories
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/items
curl.exe -H "x-pv-fake-user: admin" "http://127.0.0.1:7071/api/cash-shifts/current?terminalId=1"
```

Si no hay caja abierta, abrirla:

```powershell
curl.exe -X POST http://127.0.0.1:7071/api/cash-shifts/open `
  -H "content-type: application/json" `
  -H "x-pv-fake-user: admin" `
  -d "{\"terminalId\":1,\"openingCashAmount\":30000,\"note\":\"Smoke local\"}"
```

Crear cuenta abierta:

```powershell
curl.exe -X POST http://127.0.0.1:7071/api/open-accounts `
  -H "content-type: application/json" `
  -H "x-pv-fake-user: admin" `
  -d "{\"terminalId\":1,\"cashShiftId\":1,\"customerId\":null,\"name\":\"Smoke cuenta\"}"
```

Agregar linea a la cuenta creada, reemplazando `{accountId}` por el id devuelto:

```powershell
curl.exe -X POST http://127.0.0.1:7071/api/open-accounts/{accountId}/lines `
  -H "content-type: application/json" `
  -H "x-pv-fake-user: admin" `
  -d "{\"itemId\":2,\"quantity\":1,\"unitPrice\":1800,\"discountAmount\":0,\"notes\":\"\"}"
```

Cobrar la cuenta, reemplazando `{accountId}` y `{cashShiftId}`:

```powershell
curl.exe -X POST http://127.0.0.1:7071/api/sales/checkout `
  -H "content-type: application/json" `
  -H "x-pv-fake-user: admin" `
  -d "{\"terminalId\":1,\"cashShiftId\":{cashShiftId},\"openAccountId\":{accountId},\"payments\":[{\"paymentMethod\":\"cash\",\"amount\":1800}]}"
```

Validar ticket y reportes:

```powershell
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/sales/{saleId}/ticket
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/reports/sales-summary
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/reports/sales-by-item
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/reports/top-items?limit=5
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/reports/low-stock
curl.exe -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/reports/cash-shift/{cashShiftId}
```

## Flujo Web minimo

En la app:

1. Confirmar badge `API SQL local` o area `SQL local`.
2. Ir a `Caja diaria` y confirmar estado abierto o abrir caja.
3. Ir a `Ventas`.
4. Crear cuenta si no hay cuenta activa.
5. Agregar un producto.
6. Cobrar e imprimir ticket.
7. Ir a `Reportes` y presionar `Actualizar`.
8. Confirmar ventas, productos y resumen de caja.

## Resultado esperado

- Catalogo responde desde SQL local.
- Caja diaria puede abrirse o consultarse desde SQL local.
- Cuenta abierta puede crearse y cobrarse.
- Checkout genera venta pagada y ticket.
- Reportes muestran ventas y caja desde SQL local.
- `GET /api/health` termina mostrando al menos:

```json
{
  "storageDetails": {
    "catalog": "sql-local",
    "openAccounts": "sql-local",
    "cashShifts": "sql-local",
    "sales": "sql-local",
    "reports": "sql-local",
    "sqlConfigured": true,
    "sqlAvailable": true
  }
}
```

## Evidencia local de referencia

Smoke ejecutado durante `TASK-041` contra base temporal local:

```text
PuntoVentaLocal_Task038_SalesSql_20260622_145230
```

Evidencia observada:

```text
connected=true cash=open cashStorage=SQL local reportsStorage=SQL local
ticket=PV-0000004 total=1800 accounts=0
reportsMode=sql-local sales=4 total=7200
healthCash=sql-local healthSales=sql-local healthReports=sql-local
```

## Limitaciones

- Este smoke no es validacion QA formal.
- La base temporal puede acumular ventas de prueba entre corridas.
- Si se necesita una corrida limpia, usar una base nueva y aplicar migraciones/seeds de nuevo.
- No cubrir deploy, CORS productivo, Azure Static Web Apps ni Azure SQL.
- No guardar secretos ni connection strings reales en archivos.
