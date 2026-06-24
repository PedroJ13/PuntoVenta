# TASK-015 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea completada: Endpoints locales de cuentas abiertas.

Archivos cambiados:

- `api/src/app.js`
- `api/src/http/requestBody.js`
- `api/src/repositories/fakePuntoVentaRepositories.js`
- `api/src/repositories/fakeOpenAccountRepository.js`
- `api/src/routes/openAccountRoutes.js`
- `api/src/testDoubles/fakeCatalogData.js`
- `api/test/testApp.js`
- `api/test/openAccounts.test.js`
- `api/README.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-015.md`
- `tasks/TASK-015-HANDOFF.md`

Verificacion ejecutada:

- `node --test` desde `api/`: 19 tests pasan.
- Busqueda con `rg` de `SQL_CONNECTION_STRING`, `connection string`, `password`, `token`, `secret`, `AccountKey`, `Server=` en `api/`.
- No se creo `local.settings.json`.
- No se conecto Azure SQL.
- No se crearon recursos Azure.

Resultado:

- `GET /api/open-accounts` lista cuentas abiertas por `auth.companyId`.
- `POST /api/open-accounts` crea cuentas usando `terminalId`, `cashShiftId` y usuario fake autenticado.
- `GET /api/open-accounts/{accountId}` devuelve detalle con lineas y totales.
- `PATCH /api/open-accounts/{accountId}` renombra o cancela cuenta; cancelar requiere motivo.
- `POST/PATCH/DELETE /api/open-accounts/{accountId}/lines` agrega, modifica y elimina lineas.
- Cambios de precio y descuentos quedan protegidos por permisos server-side.
- Las cuentas abiertas no descuentan inventario.

Uso DB cloud: No
Uso Azure SQL: No
Motivo: endpoints locales con repositorios fake en memoria.
Alcance: codigo local, tests unitarios y dobles de repositorio.
Recursos Azure creados: No
Secretos creados o expuestos: No

Riesgos o pendientes:

- Los datos son memoria local y se reinician con el proceso.
- Falta persistencia real y transacciones SQL en tarea futura.
- Falta integracion Web/API local en `TASK-018`.

Siguiente recomendado:

- Proyecto procesa este handoff.
- Mantener `TASK-018` bloqueada hasta procesar tambien `TASK-016` y `TASK-017`.

Movimiento de tablero:

- De: Ready
- A: Needs Review
