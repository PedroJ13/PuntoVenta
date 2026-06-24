# TASK-018 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Tarea completada: Conectar app base a API local fake.

Archivos cambiados:

- `app/src/apiClient.js`
- `app/src/state.js`
- `app/src/main.js`
- `app/src/ui.js`
- `app/src/data.js`
- `app/index.html`
- `app/styles.css`
- `app/README.md`
- `api/src/server.js`
- `api/src/http/nodeAdapter.js`
- `docs/TASK_BOARD.md`
- `tasks/TASK-018.md`
- `tasks/TASK-018-HANDOFF.md`

Verificacion ejecutada:

- `node --check app/src/apiClient.js`
- `node --check app/src/state.js`
- `node --check app/src/ui.js`
- `node --check app/src/main.js`
- `node --check api/src/server.js`
- `node --test` desde `api/`: 19 tests pasan.
- HTTP local app: `http://127.0.0.1:5173/`, `src/main.js` y `src/apiClient.js` responden `200`.
- HTTP local API: CORS preflight `204`, catalogo, cuentas abiertas, checkout y ticket verificados contra `http://127.0.0.1:7071`.
- Busqueda con `rg` de `SQL_CONNECTION_STRING`, `connection string`, `password`, `token`, `secret`, `AccountKey`, `Server=` en `app/` y `api/`.
- No se conecto Azure SQL.
- No se crearon recursos Azure.

Resultado:

- Se agrego `app/src/apiClient.js` para consumir API local fake con `fetch`.
- La app carga catalogo y cuentas abiertas desde API local cuando esta disponible.
- Alta, renombrado y cambios de lineas de cuentas abiertas usan endpoints locales fake.
- Checkout usa `POST /api/sales/checkout`.
- El dialog de ticket usa `GET /api/sales/{saleId}/ticket`.
- Si API local no responde, la app conserva fallback con datos locales en memoria.
- `app/README.md` documenta como levantar API y app juntas.
- Se agrego CORS local en el servidor fake para permitir app `5173` contra API `7071`.

Uso DB cloud: No
Uso Azure SQL: No
Motivo: integracion local Web/API con datos fake en memoria.
Alcance: app estatica, API local fake y verificacion HTTP local.
Recursos Azure creados: No
Secretos creados o expuestos: No

Riesgos o pendientes:

- `TASK-015`, `TASK-016` y `TASK-017` siguen en `Needs Review`; esta integracion se hizo usando sus handoffs como base operativa.
- CORS con `*` queda solo para desarrollo local del API fake; antes de piloto publicado debe acotarse por ambiente.
- No se hizo verificacion visual automatizada de navegador; se verifico por sintaxis, HTTP y flujo API local.
- Desde este shell el API respondio durante el smoke, pero no quedo residente de forma estable despues del comando; para QA manual levantar `node src/server.js` en una terminal dedicada.
- Los datos de la API fake se reinician al reiniciar el proceso.

Siguiente recomendado:

- Proyecto procesa este handoff.
- Liberar `TASK-019` para QA de integracion app/API local.

Movimiento de tablero:

- De: Blocked
- A: Needs Review
