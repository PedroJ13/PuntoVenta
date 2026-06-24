# TASK-033 - Validar migraciones en SQL Server Express local

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: SQL DEV/Data
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-027` preparo convenciones para SQL Server Express local y `TASK-029` preparo el modelo SQL de caja diaria. Antes de conectar API a SQL real, se debe validar controladamente que las migraciones actuales puedan ejecutarse en SQL Server Express local.

## Objetivo

Validar en SQL Server Express local las migraciones MVP existentes, sin Azure y sin guardar secretos.

## Alcance

- Confirmar con el usuario o el entorno la instancia local disponible de SQL Server Express.
- Validar o crear base local de desarrollo solo si hay autorizacion explicita dentro de esta tarea.
- Ejecutar en ambiente local las migraciones:
  - `database/migrations/20260620_001_initial_mvp_schema.sql`
  - `database/migrations/20260622_002_daily_cash_flow.sql`
- Registrar errores de sintaxis, compatibilidad o integridad si aparecen.
- Proponer ajustes SQL pequeños si son necesarios para que las migraciones sean ejecutables.
- Confirmar que no se usaron secretos reales en archivos versionados.
- Confirmar que no se conecto Azure SQL.

## Fuera de alcance

- No conectar la API a SQL Server local.
- No crear repositorios SQL en API.
- No modificar UI Web.
- No crear seeds salvo datos minimos indispensables para validar constraints y documentados.
- No crear recursos Azure.
- No conectar Azure SQL.
- No guardar connection strings, passwords ni secretos.
- No borrar datos reales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-027-HANDOFF.md`
- `tasks/TASK-029-HANDOFF.md`
- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`

## Dependencia

- Liberada por `TASK-027` y `TASK-029`.

## Criterios de aceptacion

- [x] Se confirma si SQL Server Express local esta disponible o queda documentado el bloqueo exacto.
- [x] Las migraciones se ejecutan localmente o quedan errores concretos documentados.
- [x] Si se ajustan scripts SQL, el cambio queda acotado y explicado.
- [x] No se guardan connection strings ni secretos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia textual de comando/herramienta usada para validar SQL local.
- Resultado de ejecucion de migraciones o bloqueo concreto.
- Busqueda de secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-033-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
