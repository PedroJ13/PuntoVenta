# TASK-029 - Preparar modelo SQL de caja diaria

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: SQL DEV/Data
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-026` definio el flujo funcional de caja diaria y `TASK-027` preparo las convenciones para SQL Server Express local. Falta preparar el modelo SQL revisable para turnos de caja, movimientos, arqueo y cierres, sin ejecutar aun contra una base real.

## Objetivo

Preparar el modelo de datos y una migracion SQL revisable para gestion de caja diaria, compatible con SQL Server Express local y Azure SQL futuro.

## Alcance

- Revisar `docs/DATA_MODEL.md` y agregar el modelo de caja diaria si corresponde.
- Preparar una migracion SQL nueva en `database/migrations/` para tablas de caja diaria.
- Incluir tablas o campos para turno/caja, movimientos manuales, cierre/arqueo y diferencias.
- Mantener `company_id` en tablas operativas.
- Incluir constraints e indices basicos por empresa, estado y fechas.
- Documentar que la migracion queda preparada/revisada, no ejecutada contra SQL real salvo autorizacion explicita.

## Fuera de alcance

- No conectarse a SQL Server local.
- No crear base real.
- No ejecutar migraciones.
- No modificar API.
- No modificar Web.
- No crear seeds.
- No crear recursos Azure.
- No conectar Azure SQL.
- No guardar connection strings.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/DATA_MODEL.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `tasks/TASK-026-HANDOFF.md`
- `tasks/TASK-027-HANDOFF.md`
- `database/migrations/20260620_001_initial_mvp_schema.sql`

## Dependencia

- Liberada por `TASK-026` y `TASK-027`.

## Criterios de aceptacion

- [x] `docs/DATA_MODEL.md` contempla caja diaria o referencia el modelo preparado.
- [x] Existe migracion SQL revisable para caja diaria.
- [x] El modelo incluye separacion por `company_id`.
- [x] El modelo contempla apertura, movimientos, cierre, arqueo y diferencia.
- [x] Hay constraints/indices basicos razonables.
- [x] El handoff aclara que no se ejecuto SQL real salvo autorizacion explicita.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revisar sintaxis SQL de forma estatica o equivalente disponible.
- Buscar secretos y connection strings reales en archivos cambiados.
- Confirmar que no se conecto SQL Server local.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-029-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
