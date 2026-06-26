# PuntoVenta API

Scaffold local de API para el MVP.

## Alcance actual

- Runtime Node.js ESM sin dependencias externas.
- Servidor HTTP local para desarrollo.
- Router minimo bajo `/api`.
- Endpoint `GET /api/health`.
- Endpoint `GET /api/me` con autenticacion fake local.
- Endpoints de lectura fake para `GET /api/categories` y `GET /api/items`.
- Lectura opcional de catalogo desde SQL Server Express local para `GET /api/categories` y `GET /api/items`, con fallback fake.
- Persistencia opcional de cuentas abiertas en SQL Server Express local, con fallback fake:
  - `GET /api/open-accounts`
  - `POST /api/open-accounts`
  - `GET /api/open-accounts/{accountId}`
  - `PATCH /api/open-accounts/{accountId}`
  - `POST /api/open-accounts/{accountId}/lines`
  - `PATCH /api/open-accounts/{accountId}/lines/{lineId}`
  - `DELETE /api/open-accounts/{accountId}/lines/{lineId}`
- Persistencia opcional de ventas/checkout en SQL Server Express local, con fallback fake:
  - `POST /api/sales/checkout`
  - `GET /api/sales/{saleId}/ticket`
- Persistencia opcional de caja diaria en SQL Server Express local, con fallback fake:
  - `GET /api/cash-shifts/current?terminalId=1`
  - `GET /api/cash-shifts/{shiftId}`
  - `POST /api/cash-shifts/open`
  - `POST /api/cash-shifts/{shiftId}/movements`
  - `POST /api/cash-shifts/{shiftId}/close`
- Reportes MVP con lectura opcional desde SQL Server Express local y fallback fake:
  - `GET /api/reports/sales-summary`
  - `GET /api/reports/sales-by-item`
  - `GET /api/reports/top-items`
  - `GET /api/reports/low-stock`
  - `GET /api/reports/cash-shift/{shiftId}`
- Repositorios fake en memoria para no depender de Azure SQL.
- Tests con `node:test`.
- Estructura compatible con Azure Functions para exponer las mismas rutas bajo `/api` sin Azure SQL.

## Comandos

Desde `api/`:

```powershell
npm test
npm run lint
npm run check
npm run format:check
npm run functions:start
npm start
```

Si `npm` no esta disponible en la sesion, usar Node directo:

```powershell
node --test
node src/server.js
```

`npm run check` ejecuta lint y tests locales sin tocar archivos. `npm run format:check`
queda disponible para adopcion gradual de Prettier; al crear este tooling, el codigo
existente reporta diferencias de formato y no se aplico `prettier --write` para evitar
un reformat masivo.

Servidor local:

```text
http://127.0.0.1:7071/api/health
http://127.0.0.1:7071/api/me
http://127.0.0.1:7071/api/open-accounts
http://127.0.0.1:7071/api/cash-shifts/current?terminalId=1
http://127.0.0.1:7071/api/reports/sales-summary
```

## Azure Functions local

La API mantiene `src/server.js` para desarrollo local con Node y tambien incluye una
funcion catch-all para Azure Functions:

```text
host.json
httpApi/function.json
httpApi/index.cjs
```

Para probar con Azure Functions Core Tools desde `api/`:

```powershell
npm run functions:start
```

La Function usa `routePrefix: "api"` y enruta `GET`, `POST`, `PATCH`, `DELETE` y
`OPTIONS` hacia el mismo `createApp()` usado por el servidor local. Por defecto usa
repositorios fake/fallback y no requiere Azure SQL.

## Auth fake local

Por defecto la API usa un usuario cajero fake:

```text
x-pv-fake-user: cashier
```

Usuarios fake disponibles:

- `cashier`
- `admin`
- `auditor`
- `none` para simular request sin sesion

Ejemplo:

```powershell
curl -H "x-pv-fake-user: admin" http://127.0.0.1:7071/api/me
```

Esta capa es solo local y debe reemplazarse por autenticacion real antes de publicar piloto.

## Datos fake locales

- `createFakePuntoVentaRepositories()` crea catalogo, cuentas abiertas, ventas e inventario simulado sobre memoria local compartida.
- Las cuentas abiertas no descuentan inventario.
- `POST /api/sales/checkout` descuenta inventario fake al cobrar.
- `POST /api/sales/checkout` requiere caja abierta fake.
- La caja diaria fake calcula efectivo esperado con monto inicial, pagos en efectivo y movimientos manuales.
- Los articulos preparados consumen ingredientes fake segun receta local.
- Los reportes fake se calculan desde ventas, pagos, caja e inventario en memoria.
- Reiniciar el proceso borra los cambios en memoria.

## SQL local opcional

Por defecto la API usa repositorios fake. Para leer catalogo y persistir cuentas abiertas/caja diaria/ventas desde SQL Server Express local, configurar variables de entorno fuera de git:

```powershell
$env:PV_SQLSERVER_ENABLED="true"
$env:PV_SQLSERVER_HOST="localhost\SQLEXPRESS"
$env:PV_SQLSERVER_DATABASE="PuntoVentaLocal"
$env:PV_SQLSERVER_AUTH_MODE="windows"
$env:PV_SQLSERVER_ENCRYPT="false"
$env:PV_SQLSERVER_TRUST_CERT="true"
$env:PV_SQLSERVER_COMPANY_TAX_ID="PV-DEMO-LOCAL"
```

Precondicion: ejecutar migraciones y seeds locales de `database/seeds/local/README.md`.

La API no guarda connection strings. Si SQL no esta configurado o no responde, `GET /api/categories`, `GET /api/items`, los endpoints de `/api/open-accounts`, `/api/cash-shifts`, `/api/sales` y `/api/reports` regresan al repositorio fake. `GET /api/health` prueba disponibilidad SQL cuando SQL esta configurado y reporta `storage`, `storageDetails.catalog`, `storageDetails.openAccounts`, `storageDetails.cashShifts`, `storageDetails.sales`, `storageDetails.reports`, `storageDetails.sqlConfigured` y `storageDetails.sqlAvailable` sin exponer host, base, usuario ni password.

Notas de alcance:

- En Azure Functions, usar `PV_SQLSERVER_AUTH_MODE=sql` o `SQL_CONNECTION_STRING` para activar el cliente SQL Node.
- Cuentas abiertas en SQL usan `PV_SQLSERVER_COMPANY_TAX_ID` para resolver empresa server-side.
- El usuario SQL operativo se resuelve desde los usuarios demo del seed local (`admin.demo@puntoventa.local` o `cajero.demo@puntoventa.local`).
- Caja diaria SQL permite consultar turno actual, abrir turno, registrar movimientos manuales y cerrar con arqueo/diferencia.
- El `cashShiftId` de cuentas abiertas se persiste solo si existe un turno SQL abierto compatible.
- Checkout/ventas SQL persiste ventas, lineas, pagos, movimientos de inventario y cierre de cuenta abierta.
- Reportes SQL leen ventas, lineas, pagos, caja diaria e inventario bajo minimo para los endpoints MVP existentes.

## Montos CRC

- Los montos de caja, cuentas, checkout, pagos y ticket se normalizan como enteros CRC.
- La regla fake local redondea al colon mas cercano con `Math.round`.
- Ejemplo: impuesto `1850 * 0.13 = 240.5` se devuelve como `241`, total `2091`.

## Reglas

- No usar Azure SQL en este scaffold.
- No guardar connection strings ni secretos.
- `local.settings.json` queda ignorado por git.
- Implementaciones futuras deben empezar con tests y dobles de repositorio.
