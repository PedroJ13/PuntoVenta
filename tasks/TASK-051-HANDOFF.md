# TASK-051 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Backend/API

Nombre de la tarea:
TASK-051 - Adaptar API local a Azure Functions sin Azure SQL

Archivo de tarea:
`tasks/TASK-051.md`

## Nombre de tarea culminada

TASK-051 - Adaptar API local a Azure Functions sin Azure SQL

## Status

entregada a revision

## Handoff

`tasks/TASK-051-HANDOFF.md`

## Resumen

Se agrego una estructura minima compatible con Azure Functions para exponer el API existente bajo `/api`, reutilizando el mismo `createApp()` y los repositorios configurados. Se mantuvo `api/src/server.js` para desarrollo local con Node y no se cambio la funcionalidad del POS.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Backend/API
- Recursos Azure creados o modificados: No
- Deploy ejecutado: No
- Uso DB cloud: No
- Uso Azure SQL: No
- Secretos guardados en repo: No

## Cambios realizados

- `api/host.json`: configura `routePrefix` en `api`.
- `api/httpApi/function.json`: define HTTP trigger catch-all para `GET`, `POST`, `PATCH`, `DELETE` y `OPTIONS`.
- `api/httpApi/index.cjs`: handler de Azure Functions que enruta al `createApp()` existente.
- `api/src/http/azureFunctionsAdapter.js`: convierte request/response entre Azure Functions y Web `Request`/`Response`.
- `api/test/azureFunctionsAdapter.test.js`: pruebas de adaptador y handler Functions.
- `api/package.json`: agrega script `functions:start`.
- `api/eslint.config.js`: incluye `functions/**/*.js` y globals Web usados por Node 22.
- `api/README.md`: documenta ejecucion local con Azure Functions Core Tools.
- `tasks/TASK-051.md` y `docs/TASK_BOARD.md`: tarea marcada para revision.

## Verificacion ejecutada

```text
npm run check
Resultado: pasa
tests 47
pass 47
fail 0
```

```text
npx prettier --check host.json httpApi/function.json httpApi/index.cjs src/http/azureFunctionsAdapter.js test/azureFunctionsAdapter.test.js package.json eslint.config.js README.md
Resultado: pasa para archivos nuevos/tocados de TASK-051.
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| API puede ejecutarse o exponerse en estructura compatible con Azure Functions | Cumple | `host.json`, `httpApi/function.json` y handler `httpApi/index.cjs`. |
| Contratos existentes se mantienen | Cumple | Reusa `createApp()` y `npm run check` pasa con 47 tests. |
| `npm run check` en `api/` pasa | Cumple | 47 pass, 0 fail. |
| No se crean recursos Azure | Cumple | Solo cambios locales. |
| No se conecta Azure SQL | Cumple | No se ejecuto conexion SQL. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en este handoff. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P3: La funcion usa `authLevel: anonymous` para mantener el comportamiento MVP con auth fake local. Antes de piloto real debe revisarse autenticacion real.
- P3: CORS sigue amplio (`*`) como estaba en el servidor local. Para piloto publicado debe acotarse al host de Static Web Apps.

## Pendientes o riesgos

- Ejecutar `npm run functions:start` cuando Infra tenga recursos/config listos o para smoke manual local con Core Tools.
- Mantener Azure SQL fuera del primer deploy segun decision A+B.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
