# PuntoVenta App

App estatica local para el flujo MVP de caja.

## Ejecutar con API local

Levantar API desde `api/`:

```powershell
node src/server.js
```

Levantar app desde `app/`:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:5173/
```

Por defecto la app consume:

```text
http://127.0.0.1:7071
```

En el host pilot publicado:

```text
https://gray-beach-00a0f870f.7.azurestaticapps.net
```

la app usa por defecto:

```text
https://func-puntoventa-pilot-eastus2.azurewebsites.net
```

Para apuntar a otra API local:

```js
localStorage.setItem("pvApiBaseUrl", "http://127.0.0.1:7071")
```

Para validar la API base URL activa desde el navegador:

```js
localStorage.removeItem("pvApiBaseUrl")
import("./src/apiClient.js").then(({ createApiClient }) => console.log(createApiClient().apiBaseUrl))
```

El orden de resolucion es:

1. `localStorage.pvApiBaseUrl`.
2. `window.PUNTO_VENTA_CONFIG.apiBaseUrl`.
3. API pilot publicada si el host es `gray-beach-00a0f870f.7.azurestaticapps.net`.
4. API local `http://127.0.0.1:7071`.

No se usan secrets ni connection strings para esta configuracion.

## Estados de API y SQL local

La app usa `GET /api/health` para mostrar si esta operando con API local, SQL local o fallback fake por area funcional. Los badges de caja diaria y reportes reflejan el modo reportado por `storageDetails.cashShifts` y `storageDetails.reports`.

## Fallback local

Si la API local no responde, la app conserva el flujo con datos en memoria del frontend. Si la API responde con errores esperados, como caja no abierta o inventario insuficiente, la app muestra mensajes operativos claros.

## Flujo integrado

- Catalogo: `GET /api/categories` y `GET /api/items`.
- Cuentas abiertas: `GET/POST/PATCH/DELETE /api/open-accounts`.
- Checkout: `POST /api/sales/checkout`.
- Ticket: `GET /api/sales/{saleId}/ticket`.
- Caja diaria: `GET/POST /api/cash-shifts/*` para estado, apertura, movimientos y cierre.
- Reportes: `GET /api/reports/sales-summary`, `sales-by-item`, `top-items`, `low-stock` y `cash-shift/{shiftId}`.

No usa Azure SQL ni secretos.
